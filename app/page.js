"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CursorParticles = dynamic(() => import("./CursorParticles"), { ssr: false });

/* ============================================
   Data
   ============================================ */

const GITHUB_USERNAME = "41Yr9";

const SKILL_ICONS = {
  "Swift": "🍎",
  "React Native": "⚛️",
  "TypeScript": "🔷",
  "Next.js": "▲",
  "Python": "🐍",
  "Quart": "⚡",
  "Discord.py": "🤖",
  "PostgreSQL": "🐘",
  "Claude Code": "🧠",
  "Gemini AI": "✨",
  "Supabase": "⚡",
  "Cloudflare": "☁️",
  "Docker": "🐳",
  "Shopify": "🛒",
  "RevenueCat": "💰",
  "AdMob": "📊",
};

const SKILLS = {
  "モバイル & フロントエンド": [
    "Swift", "React Native", "TypeScript", "Next.js",
  ],
  "バックエンド & データベース": [
    "Python", "Quart", "Discord.py", "PostgreSQL",
  ],
  "AI & クラウドサービス": [
    "Claude Code", "Gemini AI", "Supabase", "Cloudflare", "Docker", "Shopify", "RevenueCat", "AdMob",
  ],
};

const ALL_SKILLS = [
  "Swift", "React Native", "TypeScript", "Next.js",
  "Python", "Quart", "Discord.py", "PostgreSQL",
  "Claude Code", "Gemini AI", "Supabase", "Cloudflare",
  "Docker", "Shopify", "RevenueCat", "AdMob",
];

const PROJECTS = [
  {
    num: "01",
    name: "DiGer",
    sub: "古着タグAI鑑定アプリ",
    desc: "タグを撮影するだけで、AIがブランド・製造年代・市場価格を瞬時に判定するiOS/Androidアプリ。",
    tags: ["React Native", "TypeScript", "Gemini AI", "Supabase"],
    meta: ["App Store公開済み", "サブスク3プラン"],
    link: "https://diger-link-gate.vercel.app/",
    repo: "diger-website",
    img: "/images/diger.png",
  },
  {
    num: "02",
    name: "FormLab",
    sub: "AI筋トレフォーム解析",
    desc: "トレーニング動画をAIが解析し、姿勢・動作のスムーズさ・安全性を100点満点でスコアリング。",
    tags: ["Swift", "SwiftUI", "Gemini AI", "Cloudflare R2"],
    meta: ["クラウド履歴保存", "サブスク課金"],
    link: "https://41Yr9.github.io/formlab-page/",
    repo: "formlab-page",
    img: "/images/formlab.png",
  },
  {
    num: "03",
    name: "Discord Bot 開発",
    sub: "趣味プロジェクト",
    desc: "技術習得とコミュニティ運営を目的に個人開発したDiscord Bot。非同期処理やWebダッシュボード構築を通じてバックエンド技術を実践的に学習。",
    tags: ["Python", "discord.py", "asyncio", "Quart", "Supabase", "Docker", "Cloudflare Tunnel"],
    meta: ["個人開発", "技術習得・コミュニティ運営"],
    link: null,
    repo: null,
    img: "/images/discord.svg",
  },
];

const TIMELINE = [
  {
    era: "小学生時代",
    title: "Minecraftサーバー運営",
    badge: "同時接続25名を達成",
    desc: "家のノートPCでサーバーを立て約2年間Owner運営。MySQLで経済システム構築。英語のRedditを読みながらエラー解決。",
    tech: "Java / Spigot / MySQL",
    active: false,
    img: "/images/minecraft2.png",
  },
  {
    era: "中学生時代",
    title: "RoboCup Junior",
    badge: "2019 Japan Open 優勝",
    desc: "Arduino搭載の瓦割りロボットを製作。地域予選から全国大会まで勝ち進み優勝。",
    tech: "Arduino / Python",
    active: false,
    img: "/images/robocup.jpg",
  },
  {
    era: "高校生時代",
    title: "Esportsデザイナー",
    badge: "制作実績50件以上",
    desc: "Fortnite/Apex Esportsシーンでセミプロ兼デザイナーとして活動。超有名チーム所属プロのヘッダーも担当。",
    tech: "Adobe Photoshop",
    active: false,
    img: "/images/esports.png",
  },
  {
    era: "大学生時代（現在）",
    title: "アプリ開発者 & 起業家",
    badge: "App Store公開済み",
    desc: "アパレルブランド「TIER」運営を経て、エンジニアとしてユーザー課題を解決するモバイルアプリ開発に注力。DiGer, FormLabをリリース。",
    tech: "Swift / React Native / Python / Supabase",
    active: true,
    img: "/images/tier.jpg",
  },
];

const LINKS = {
  github: "https://github.com/41Yr9",
  x: "https://x.com/41yr12",
  qiita: "https://qiita.com/41Yr9", // ユーザー名が違う場合は書き換えてください
  email: "mailto:kkappcreator@gmail.com",
  behance: "https://www.behance.net/NaiwaD",
  appstore: "https://apps.apple.com/jp/app/diger/id6756227679",
};

/* ============================================
   Component
   ============================================ */

export default function Home() {
  const [typingText, setTypingText] = useState("");
  const [repoData, setRepoData] = useState({});
  const [zoomedImg, setZoomedImg] = useState(null);
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const mainRef = useRef(null);

  // ---------- Custom cursor ----------
  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const move = (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      document.documentElement.style.setProperty("--mx", e.clientX + "px");
      document.documentElement.style.setProperty("--my", e.clientY + "px");
    };
    const addHover = () => cursor.classList.add("hover");
    const removeHover = () => cursor.classList.remove("hover");

    window.addEventListener("mousemove", move);
    const interactives = document.querySelectorAll("a, button, .project-item, .skill-group-item, .cta-btn");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });
    return () => {
      window.removeEventListener("mousemove", move);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  // ---------- Typing ----------
  useEffect(() => {
    const titles = [
      "Student Engineer / App Developer",
      "企画 → 設計 → 実装 → リリース → 収益化",
      "Building apps that bridge the Real World and AI",
    ];
    let ti = 0, ci = 0, del = false, to;
    const type = () => {
      const s = titles[ti];
      if (!del) {
        setTypingText(s.slice(0, ci + 1));
        ci++;
        if (ci === s.length) { to = setTimeout(() => { del = true; type(); }, 2500); return; }
        to = setTimeout(type, 50);
      } else {
        setTypingText(s.slice(0, ci - 1));
        ci--;
        if (ci === 0) { del = false; ti = (ti + 1) % titles.length; to = setTimeout(type, 400); return; }
        to = setTimeout(type, 25);
      }
    };
    to = setTimeout(type, 1500);
    return () => clearTimeout(to);
  }, []);

  // ---------- GitHub data ----------
  useEffect(() => {
    PROJECTS.forEach((p) => {
      if (p.repo) {
        fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${p.repo}`)
          .then((r) => r.json())
          .then((d) => setRepoData((prev) => ({ ...prev, [p.repo]: { lang: d.language, updated: d.updated_at } })))
          .catch(() => { });
      }
    });
  }, []);

  // ---------- GSAP Animations ----------
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const ctx = gsap.context(() => {

      // === Hero: character-by-character reveal (fromTo for reliable end state) ===
      gsap.fromTo(".hero-char",
        { y: isMobile ? 40 : 80, opacity: 0, ...(isMobile ? {} : { rotateX: -90 }) },
        { y: 0, opacity: 1, ...(isMobile ? {} : { rotateX: 0 }), stagger: isMobile ? 0.04 : 0.06, duration: isMobile ? 0.6 : 1, ease: "power3.out", delay: 0.3 }
      );

      gsap.fromTo(".hero-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.6 }
      );

      gsap.fromTo(".hero-typing-wrap",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.8 }
      );

      gsap.fromTo(".hero-socials",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.9 }
      );

      gsap.fromTo(".cta-btn",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power3.out", delay: 1.0 }
      );

      gsap.fromTo(".hero-scroll-line",
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.8, ease: "power3.out", delay: 1.3, transformOrigin: "top" }
      );

      // === Shared fade-in helper ===
      const fadeIn = (targets, vars) =>
        gsap.fromTo(targets, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", ...vars });

      // === Section reveals — batched into one ScrollTrigger per section ===
      ScrollTrigger.batch(".gsap-section", {
        start: "top 80%",
        once: true,
        onEnter: (batch) => batch.forEach((section) => {
          const label = section.querySelector(".section-label");
          const title = section.querySelector(".section-title");
          const desc = section.querySelector(".section-desc");
          const tl = gsap.timeline();
          if (label) tl.fromTo(label, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
          if (title) tl.fromTo(title, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3");
          if (desc) tl.fromTo(desc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.3");
        }),
      });

      // === About: stats count up ===
      ScrollTrigger.batch(".stat-num", {
        start: "top 85%",
        once: true,
        onEnter: (batch) => batch.forEach((el) => {
          const text = el.textContent;
          const match = text.match(/(\d+)/);
          if (!match) return;
          const target = parseInt(match[0]);
          const suffix = text.replace(match[0], "");
          fadeIn(el);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
          });
        }),
      });

      // === About: detail items + stat labels (single trigger) ===
      ScrollTrigger.create({
        trigger: ".about-detail-list",
        start: "top 80%",
        once: true,
        onEnter: () => {
          fadeIn(".about-detail-item", { stagger: 0.08 });
          fadeIn(".stat-label", { stagger: 0.06, delay: 0.2 });
        },
      });

      // === Skills: grid stagger ===
      ScrollTrigger.create({
        trigger: ".skills-grid",
        start: "top 80%",
        once: true,
        onEnter: () => fadeIn(".skill-group", { stagger: 0.15, duration: 0.6 }),
      });

      // === Projects: row slide in ===
      ScrollTrigger.create({
        trigger: ".project-list",
        start: "top 85%",
        once: true,
        onEnter: () => fadeIn(".project-item", { stagger: 0.12 }),
      });

      // === Timeline: line draw + batched items ===
      const timelineLine = document.querySelector(".timeline");
      if (timelineLine) {
        ScrollTrigger.create({
          trigger: timelineLine,
          start: "top 80%",
          once: true,
          onEnter: () => timelineLine.classList.add("tl-animate"),
        });
      }

      ScrollTrigger.batch(".tl-item", {
        start: "top 82%",
        once: true,
        onEnter: (batch) => batch.forEach((item) => {
          const dot = item.querySelector(".tl-dot");
          const era = item.querySelector(".tl-era");
          const title = item.querySelector(".tl-title");
          const badge = item.querySelector(".tl-badge");
          const desc = item.querySelector(".tl-desc");
          const tech = item.querySelector(".tl-tech");

          const tl = gsap.timeline();
          if (dot) tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
          if (era) tl.fromTo(era, { x: -15, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, "-=0.1");
          if (title) tl.fromTo(title, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, "-=0.2");
          if (badge) tl.fromTo(badge, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" }, "-=0.2");
          if (desc) tl.fromTo(desc, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, "-=0.15");
          if (tech) tl.fromTo(tech, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" }, "-=0.15");
        }),
      });

      // === Footer ===
      ScrollTrigger.create({
        trigger: ".footer",
        start: "top 90%",
        once: true,
        onEnter: () => {
          fadeIn(".footer-title", { duration: 0.6 });
          fadeIn(".footer-email", { delay: 0.15 });
          fadeIn(".footer-link", { stagger: 0.08, delay: 0.25 });
        },
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  const fmtDate = (s) => { if (!s) return ""; const d = new Date(s); return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`; };

  // Split hero name into characters
  const heroChars = "Ken73".split("").map((ch, i) => (
    <span key={i} className="hero-char" style={{ display: "inline-block" }}>
      {ch}
    </span>
  ));

  return (
    <div ref={mainRef}>
      {/* Cursor */}
      <div ref={cursorRef} className="cursor" />
      <div ref={dotRef} className="cursor-dot" />
      <CursorParticles />

      {/* Floating Orbs */}
      <div className="orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Nav */}
      <nav className="nav">
        <a href="#" className="nav-logo">Ken73</a>
        <ul className="nav-links">
          <li><a href="#about">概要</a></li>
          <li><a href="#skills">技術</a></li>
          <li><a href="#projects">制作物</a></li>
          <li><a href="#experience">経歴</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <h1 className="hero-name">{heroChars}</h1>
        <p className="hero-sub">Kenjiro Kawai</p>
        <div className="hero-typing-wrap">
          <span className="hero-typing">{typingText}<span className="typing-cursor" /></span>
        </div>
        
        <div className="hero-socials">
          <a href={LINKS.x} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X (Twitter)">
            <svg width="24" height="24" viewBox="0 0 1200 1227" fill="currentColor">
              <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
            </svg>
          </a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <a href={LINKS.qiita} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Qiita">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.3726 0 0 5.3726 0 12s5.3726 12 12 12c3.3984 0 6.4665-1.413 8.6498-3.6832-.383-.0574-.7746-.2062-1.1466-.4542-.7145-.4763-1.3486-.9263-1.6817-1.674-1.2945 1.3807-3.0532 1.835-5.1822 2.0503-4.311.4359-8.0456-1.4893-8.4979-6.2996-.1922-2.045.2628-3.989 1.1804-5.582l-.5342-2.1009c-.0862-.3652.2498-.7126.6057-.6262l1.8456.448c1.0974-.9012 2.4249-1.49 3.8892-1.638 1.2526-.1267 2.467.0834 3.571.5624l1.7348-1.0494c.3265-.1974.7399.0257.7711.4164l.1 2.4747v.0002c1.334 1.4084 2.2424 3.3319 2.4478 5.516.116 1.2339-.012 2.1776-.339 3.078-.1531.4215-.1992.7778.0776 1.1305.2674.3408.6915 1.0026 1.1644.8917.7107-.1666 1.4718-.1223 1.9422.1715C23.4925 15.9525 24 14.0358 24 12c0-6.6274-5.3726-12-12-12Zm-.0727 5.727a5.2731 5.2731 0 0 0-.6146.0273c-2.2084.2233-3.9572 1.8135-4.4937 3.8484l-1.3176-.1996-.014.2589 1.2972.1407c-.0352.1497-.0643.2384-.086.3923l-1.1319.0902.0103.2025 1.1032-.088c-.0194.1713-.031.2814-.0332.4565l-1.0078.412.0495.2499.9598-.4492c.002.1339.008.2053.0207.3407.2667 2.8371 2.6364 3.3981 5.4677 3.1118 2.8312-.2863 5.0517-1.3114 4.785-4.1486-.013-.1361-.0324-.2068-.0553-.3392l1.0397.2257.0242-.229-1.0906-.207c-.0342-.1687-.0765-.271-.1264-.4327l1.1208-.1374-.0158-.2019-1.1499.1409a5.1093 5.1093 0 0 0-.1665-.4259l1.2665-.4042-.0397-.2536-1.3471.4667c-.819-1.7168-2.5002-2.8224-4.4546-2.8482Z" />
            </svg>
          </a>
        </div>

        <div className="hero-cta">
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="cta-btn">GitHub</a>
          <a href={LINKS.behance} target="_blank" rel="noopener noreferrer" className="cta-btn">Behance</a>
          <a href={LINKS.appstore} target="_blank" rel="noopener noreferrer" className="cta-btn">App Store</a>
        </div>
        <div className="hero-scroll-line" />
      </section>

      <div className="divider" />

      {/* About */}
      <section className="gsap-section section" id="about">
        <p className="section-label">概要</p>
        <h2 className="section-title">自己紹介</h2>
        <div className="about-grid">
          <div>
            <p className="about-text">
              エンジニア歴5ヶ月で、モバイルアプリ開発を軸に<strong>企画 → 設計 → 実装 → リリース → 収益化</strong>までを一貫して行う学生エンジニアです。
            </p>
            <div className="about-stats">
              <div className="stat"><p className="stat-num">10年+</p><p className="stat-label">PC歴</p></div>
              <div className="stat"><p className="stat-num">5ヶ月</p><p className="stat-label">本格開発歴</p></div>
              <div className="stat"><p className="stat-num">3</p><p className="stat-label">プロダクト</p></div>
              <div className="stat"><p className="stat-num">1</p><p className="stat-label">App Store公開</p></div>
            </div>
          </div>
          <div className="about-detail-list">
            <p className="about-detail-item"><strong>🎓 大学生</strong>（現在）</p>
            <p className="about-detail-item"><strong>📱 React Native / Expo</strong> でのiOS/Androidアプリ開発・App Store公開経験あり</p>
            <p className="about-detail-item"><strong>🤖 Python + API</strong>による業務自動化・Bot開発</p>
            <p className="about-detail-item"><strong>🏆 RoboCup Junior 2019</strong> Japan Open OnStage 優勝</p>
            <p className="about-detail-item"><strong>🎨 Esports チーム</strong>のグラフィックデザイナー経験</p>
            <p className="about-detail-item"><strong>🛍️ Shopify</strong>を活用したアパレルEC運営経験</p>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Skills */}
      <section className="gsap-section section" id="skills">
        <p className="section-label">技術スタック</p>
        <h2 className="section-title">使用技術</h2>
        <p className="section-desc">フロントエンドからバックエンド、AI連携まで幅広い技術を活用しています。</p>

        <div className="marquee-wrap">
          <div className="marquee">
            {[...ALL_SKILLS, ...ALL_SKILLS].map((s, i) => (
              <span key={i} className="marquee-item">
                {i > 0 && <span className="marquee-sep">●</span>}
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="skills-grid">
          {Object.entries(SKILLS).map(([cat, list]) => (
            <div key={cat} className="skill-group">
              <h3 className="skill-group-title">{cat}</h3>
              <div className="skill-group-list">
                {list.map((s) => <span key={s} className="skill-group-item">{SKILL_ICONS[s] || "•"} {s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Projects */}
      <section className="gsap-section section" id="projects">
        <p className="section-label">制作物</p>
        <h2 className="section-title">プロジェクト</h2>
        <p className="section-desc">実際にリリース・運用しているプロダクトです。</p>

        <div className="project-list">
          {PROJECTS.map((p) => {
            const repo = repoData[p.repo];
            return (
              <a
                key={p.num}
                className="project-item"
                href={p.link || (p.repo ? `https://github.com/${GITHUB_USERNAME}/${p.repo}` : "#")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.img && <img src={p.img} alt={p.name} className="project-img" />}
                <span className="project-num">{p.num}</span>
                <div className="project-info">
                  <h3 className="project-title">{p.name}</h3>
                  <p className="project-sub">{p.sub}</p>
                  <div className="project-tags">
                    {p.tags.map((t) => <span key={t} className="project-tag">{t}</span>)}
                  </div>
                </div>
                <div className="project-right">
                  {p.meta.map((m) => <span key={m} className="project-meta">✦ {m}</span>)}
                  {repo?.updated && <span className="project-meta">更新 {fmtDate(repo.updated)}</span>}
                  <span className="project-arrow">→</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* Experience */}
      <section className="gsap-section section" id="experience">
        <p className="section-label">経歴</p>
        <h2 className="section-title">Background & History</h2>
        <p className="section-desc">PC歴10年。小学生時代からテクノロジーに触れ、様々なフィールドで経験を積んできました。</p>

        <div className="timeline">
          {TIMELINE.map((t, i) => (
            <div key={i} className="tl-item">
              <div className={`tl-dot ${t.active ? "active" : ""}`} />
              <p className="tl-era">{t.era}</p>
              
              <div className="tl-content-wrapper">
                <div className="tl-info">
                  <h3 className="tl-title">{t.title}</h3>
                  <span className="tl-badge">{t.badge}</span>
                  <p className="tl-desc">{t.desc}</p>
                  <p className="tl-tech">{t.tech}</p>
                </div>
                
                {t.img && (
                  <div className="tl-img-wrapper" onClick={() => setZoomedImg(t.img)}>
                    <img src={t.img} alt={t.title} className="tl-img-static" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">
            <a href={LINKS.email} className="footer-email">kkappcreator@gmail.com</a>
          </div>
          <div className="footer-right">
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            <a href={LINKS.behance} target="_blank" rel="noopener noreferrer" className="footer-link">Behance</a>
            <a href={LINKS.appstore} target="_blank" rel="noopener noreferrer" className="footer-link">App Store</a>
          </div>
        </div>
        
        <div className="footer-huge-text">Ken73</div>

        <p className="footer-copy">© 2026 Ken73. All rights reserved.</p>
      </footer>

      {/* Lightbox / Zoom Overlay */}
      {zoomedImg && (
        <div className="lightbox interactable" onClick={() => setZoomedImg(null)}>
          <div className="lightbox-content">
            <img src={zoomedImg} alt="Zoomed View" />
          </div>
        </div>
      )}
    </div>
  );
}
