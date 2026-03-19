"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

/* ---------- Constants ---------- */
const COUNT = 150;
const INFLUENCE = 3.5;
const STRENGTH = 0.12;
const DAMPING = 0.92;
const RESTORE = 0.02;
const COLORS = ["#ffffff", "#222222", "#888888", "#6b2fa0", "#8b5cf6", "#1a1a1a"];
const SPREAD = 3.5;

/* ---------- Single Cube ---------- */
function Cube({ position, color, scale }) {
    const ref = useRef();
    const vel = useRef(new THREE.Vector3());
    const origin = useRef(new THREE.Vector3(...position));

    useFrame(() => {
        if (!ref.current) return;
        const pos = ref.current.position;

        // Spring back to origin
        const dx = origin.current.x - pos.x;
        const dy = origin.current.y - pos.y;
        const dz = origin.current.z - pos.z;

        vel.current.x += dx * RESTORE;
        vel.current.y += dy * RESTORE;
        vel.current.z += dz * RESTORE;

        // Damping
        vel.current.multiplyScalar(DAMPING);

        pos.x += vel.current.x;
        pos.y += vel.current.y;
        pos.z += vel.current.z;

        // Slight rotation based on velocity
        ref.current.rotation.x += vel.current.y * 0.05;
        ref.current.rotation.y += vel.current.x * 0.05;
    });

    return (
        <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
            <roundedBoxGeometry args={[0.6, 0.6, 0.6, 4, 0.06]} />
            <meshStandardMaterial
                color={color}
                roughness={0.25}
                metalness={0.1}
            />
        </mesh>
    );
}

/* ---------- Mouse Interaction ---------- */
function MouseRepel({ cubesRef }) {
    const { camera, raycaster, pointer } = useThree();
    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
    const intersection = useMemo(() => new THREE.Vector3(), []);

    useFrame(() => {
        raycaster.setFromCamera(pointer, camera);
        raycaster.ray.intersectPlane(plane, intersection);

        if (!cubesRef.current) return;

        cubesRef.current.forEach((cube) => {
            if (!cube) return;
            const pos = cube.position;
            const dx = pos.x - intersection.x;
            const dy = pos.y - intersection.y;
            const dz = pos.z - intersection.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < INFLUENCE && dist > 0.01) {
                const force = (1 - dist / INFLUENCE) * STRENGTH;
                const nx = dx / dist;
                const ny = dy / dist;
                const nz = dz / dist;

                // Find the Cube component's velocity ref - we need to use the mesh's userData
                if (cube.userData.vel) {
                    cube.userData.vel.x += nx * force;
                    cube.userData.vel.y += ny * force;
                    cube.userData.vel.z += nz * force;
                }
            }
        });
    });

    return null;
}

/* ---------- Cube with userData velocity ---------- */
function InteractiveCube({ position, color, scale }) {
    const ref = useRef();
    const vel = useRef(new THREE.Vector3());
    const origin = useMemo(() => new THREE.Vector3(...position), [position]);

    useEffect(() => {
        if (ref.current) {
            ref.current.userData.vel = vel.current;
        }
    }, []);

    useFrame(() => {
        if (!ref.current) return;
        const pos = ref.current.position;

        // Spring back to origin
        vel.current.x += (origin.x - pos.x) * RESTORE;
        vel.current.y += (origin.y - pos.y) * RESTORE;
        vel.current.z += (origin.z - pos.z) * RESTORE;

        vel.current.multiplyScalar(DAMPING);

        pos.x += vel.current.x;
        pos.y += vel.current.y;
        pos.z += vel.current.z;

        // Rotate based on movement
        ref.current.rotation.x += vel.current.y * 0.08;
        ref.current.rotation.y += vel.current.x * 0.08;
    });

    return (
        <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial
                color={color}
                roughness={0.2}
                metalness={0.15}
            />
        </mesh>
    );
}

/* ---------- Scene ---------- */
function Scene() {
    const cubesRef = useRef([]);
    const cubes = useMemo(() => {
        const arr = [];
        for (let i = 0; i < COUNT; i++) {
            arr.push({
                position: [
                    (Math.random() - 0.5) * SPREAD * 2,
                    (Math.random() - 0.5) * SPREAD,
                    (Math.random() - 0.5) * SPREAD * 0.8,
                ],
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                scale: 0.6 + Math.random() * 0.8,
                rotation: [
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                ],
            });
        }
        return arr;
    }, []);

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-3, -2, 4]} intensity={0.4} color="#d4b5ff" />

            {cubes.map((c, i) => (
                <InteractiveCube
                    key={i}
                    position={c.position}
                    color={c.color}
                    scale={c.scale}
                    ref={(el) => { cubesRef.current[i] = el; }}
                />
            ))}

            <MouseRepel cubesRef={cubesRef} />
        </>
    );
}

/* ---------- Wrap InteractiveCube with forwardRef ---------- */
// We need to collect refs differently. Let's use a context approach.

function SceneWithRefs() {
    const meshRefs = useRef([]);

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <directionalLight position={[-3, -2, 4]} intensity={0.4} color="#d4b5ff" />
            <CubeField meshRefs={meshRefs} />
            <Repeller meshRefs={meshRefs} />
        </>
    );
}

function CubeField({ meshRefs }) {
    const cubes = useMemo(() => {
        const arr = [];
        for (let i = 0; i < COUNT; i++) {
            arr.push({
                id: i,
                position: [
                    (Math.random() - 0.5) * SPREAD * 2,
                    (Math.random() - 0.5) * SPREAD,
                    (Math.random() - 0.5) * SPREAD * 0.6,
                ],
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                scale: 0.5 + Math.random() * 0.7,
            });
        }
        return arr;
    }, []);

    return (
        <>
            {cubes.map((c) => (
                <CubeItem
                    key={c.id}
                    data={c}
                    setRef={(mesh) => { meshRefs.current[c.id] = mesh; }}
                />
            ))}
        </>
    );
}

function CubeItem({ data, setRef }) {
    const ref = useRef();
    const vel = useRef(new THREE.Vector3());
    const origin = useMemo(
        () => new THREE.Vector3(...data.position),
        [data.position]
    );

    useEffect(() => {
        if (ref.current) {
            ref.current.userData.vel = vel.current;
            setRef(ref.current);
        }
    }, [setRef]);

    // Random initial rotation
    const initRot = useMemo(
        () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        []
    );

    useFrame(() => {
        if (!ref.current) return;
        const pos = ref.current.position;

        vel.current.x += (origin.x - pos.x) * RESTORE;
        vel.current.y += (origin.y - pos.y) * RESTORE;
        vel.current.z += (origin.z - pos.z) * RESTORE;
        vel.current.multiplyScalar(DAMPING);

        pos.x += vel.current.x;
        pos.y += vel.current.y;
        pos.z += vel.current.z;

        ref.current.rotation.x += vel.current.y * 0.06;
        ref.current.rotation.y += vel.current.x * 0.06;
    });

    return (
        <mesh
            ref={ref}
            position={data.position}
            scale={data.scale}
            rotation={initRot}
        >
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial
                color={data.color}
                roughness={0.2}
                metalness={0.15}
            />
        </mesh>
    );
}

function Repeller({ meshRefs }) {
    const { camera, raycaster, pointer } = useThree();
    const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
    const intersection = useMemo(() => new THREE.Vector3(), []);

    useFrame(() => {
        raycaster.setFromCamera(pointer, camera);
        raycaster.ray.intersectPlane(plane, intersection);

        meshRefs.current.forEach((mesh) => {
            if (!mesh || !mesh.userData.vel) return;
            const pos = mesh.position;
            const dx = pos.x - intersection.x;
            const dy = pos.y - intersection.y;
            const dz = pos.z - intersection.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < INFLUENCE && dist > 0.01) {
                const force = (1 - dist / INFLUENCE) * STRENGTH;
                mesh.userData.vel.x += (dx / dist) * force;
                mesh.userData.vel.y += (dy / dist) * force;
                mesh.userData.vel.z += (dz / dist) * force;
            }
        });
    });

    return null;
}

/* ---------- Export ---------- */
export default function InteractiveScene() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <div style={{ width: "100%", height: "100%", background: "#fafafa" }} />;

    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            style={{ width: "100%", height: "100%", background: "#fafafa" }}
            dpr={[1, 2]}
        >
            <SceneWithRefs />
        </Canvas>
    );
}
