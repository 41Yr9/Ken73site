"use client";

import { useEffect, useRef } from "react";

export default function InteractiveCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animId;
        let mouse = { x: -1000, y: -1000 };
        let points = [];
        const COLS = 35;
        const ROWS = 25;
        const INFLUENCE = 120;
        const STRENGTH = 25;
        const RESTORE = 0.06;
        const DAMPING = 0.85;

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            initPoints(rect.width, rect.height);
        };

        const initPoints = (w, h) => {
            points = [];
            const spacingX = w / (COLS + 1);
            const spacingY = h / (ROWS + 1);

            for (let row = 0; row <= ROWS; row++) {
                for (let col = 0; col <= COLS; col++) {
                    points.push({
                        x: spacingX * (col + 0.5),
                        y: spacingY * (row + 0.5),
                        originX: spacingX * (col + 0.5),
                        originY: spacingY * (row + 0.5),
                        vx: 0,
                        vy: 0,
                    });
                }
            }
        };

        const onMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const onMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        const draw = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            ctx.clearRect(0, 0, w, h);

            // Update positions
            for (const p of points) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < INFLUENCE) {
                    const force = (1 - dist / INFLUENCE) * STRENGTH;
                    const angle = Math.atan2(dy, dx);
                    p.vx -= Math.cos(angle) * force * 0.15;
                    p.vy -= Math.sin(angle) * force * 0.15;
                }

                // Spring back to origin
                p.vx += (p.originX - p.x) * RESTORE;
                p.vy += (p.originY - p.y) * RESTORE;

                // Damping
                p.vx *= DAMPING;
                p.vy *= DAMPING;

                p.x += p.vx;
                p.y += p.vy;
            }

            // Draw connections
            const spacingX = w / (COLS + 1);
            const spacingY = h / (ROWS + 1);
            const maxConnDist = Math.max(spacingX, spacingY) * 1.8;

            ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
            ctx.lineWidth = 0.5;

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                const col = i % (COLS + 1);
                const row = Math.floor(i / (COLS + 1));

                // Connect right
                if (col < COLS) {
                    const right = points[i + 1];
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(right.x, right.y);
                    ctx.stroke();
                }

                // Connect down
                if (row < ROWS) {
                    const below = points[i + COLS + 1];
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(below.x, below.y);
                    ctx.stroke();
                }
            }

            // Draw points
            for (const p of points) {
                const dx = p.x - p.originX;
                const dy = p.y - p.originY;
                const displacement = Math.sqrt(dx * dx + dy * dy);
                const alpha = Math.min(0.12 + displacement * 0.03, 0.7);
                const size = 1.5 + displacement * 0.08;

                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        };

        resize();
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseleave", onMouseLeave);
        window.addEventListener("resize", resize);
        animId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animId);
            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("mouseleave", onMouseLeave);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                cursor: "none",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    );
}
