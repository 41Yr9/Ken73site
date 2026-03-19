"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const InteractiveScene = dynamic(() => import("./InteractiveScene"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "60vh", background: "#fafafa" }} />,
});

/* ============================================
   Data
   ============================================ */

const GITHUB_USERNAME = "41Yr9";

const SKILLS = {
  "モバイル & フロントエンド": [
    "React Native", "Expo", "TypeScript", "Next.js", "React Navigation",
  ],
  "バックエンド & データベース": [
    "Python", "Flask", "Discord.py", "Playwright", "PostgreSQL", "MySQL", "SQLite",
  ],
  "AI & クラウドサービス": [
    "Google Gemini AI", "Supabase", "Render", "Docker", "Shopify", "RevenueCat", "AdMob",
  ],
};

const ALL_SKILLS = [
  "React Native", "Expo", "TypeScript", "Next.js",
  "Python", "Flask", "Discord.py", "PostgreSQL",
  "MySQL", "Docker", "Supabase", "Gemini AI",
  "Playwright", "RevenueCat", "AdMob", "Shopify",
];

const PROJECTS = [
  {
    num: "01",
    name: "DiGer",
    sub: "古着タグAI鑑定アプリ",
    desc: "タグを撮影するだけでAIがブランド・年代・価格を瞬時に判定。Gemini 2.5 Flash搭載。",
    tags: ["React Native", "TypeScript", "Gemini AI", "PostgreSQL"],
    meta: ["App Store公開済み", "サブスク3プラン"],
    link: "https://apps.apple.com/jp/app/diger/id6756227679",
    repo: "diger-website",
  },
  {
    num: "02",
    name: "FormLab",
    sub: "AI筋トレフォーム解析",
    desc: "トレーニング動画をAIが解析し、姿勢・安全性を100点満点でスコアリング。",
    tags: ["React Native", "Expo", "Gemini AI", "Supabase"],
    meta: ["クラウド履歴保存", "サブスク課金"],
    link: null,
    repo: "formlab-page",
  },
  {
    num: "03",
    name: "EC Auto-Vending Bot",
    sub: "Discord自動販売システム",
    desc: "仕入れから納品まで完全自動化。Discord + Webの2チャネル販売を実現。",
    tags: ["Python", "Discord.py", "Flask", "Docker"],
    meta: ["24/7完全無人運用", "利益トラッキング"],
    link: null,
    repo: null,
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
  },
  {
    era: "中学生時代",
    title: "RoboCup Junior",
    badge: "2019 Japan Open 優勝",
    desc: "Arduino搭載の瓦割りロボットを製作。地域予選から全国大会まで勝ち進み優勝。",
    tech: "Arduino / Python",
    active: false,
  },
  {
    era: "高校生時代",
    title: "Esportsデザイナー",
    badge: "制作実績50件以上",
    desc: "Fortnite/Apex Esportsシーンでセミプロ兼デザイナーとして活動。超有名チーム所属プロのヘッダーも担当。",
    tech: "Adobe Photoshop",
    active: false,
  },
  {
    era: "大学生時代（現在）",
    title: "アプリ開発者 & 起業家",
    badge: "App Store公開済み",
    desc: "アパレルブランド「TIER」運営を経て、エンジニアとしてモバイルアプリ開発に注力。DiGer, FormLabをリリース。",
    tech: "React Native / TypeScript / Python / Supabase",
    active: true,
  },
];

const LINKS = {
  github: "https://github.com/41Yr9",
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
    const ctx = gsap.context(() => {

      // === Hero: character-by-character reveal ===
      gsap.from(".hero-char", {
        y: 80,
        opacity: 0,
        rotateX: -90,
        stagger: 0.06,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.from(".hero-sub", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.8,
      });

      gsap.from(".hero-typing-wrap", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 1.0,
      });

      gsap.from(".cta-btn", {
        y: 20,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        delay: 1.2,
      });

      gsap.from(".hero-scroll-line", {
        scaleY: 0,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1.6,
        transformOrigin: "top",
      });

      // === Section reveals with ScrollTrigger ===
      document.querySelectorAll(".gsap-section").forEach((section) => {
        const label = section.querySelector(".section-label");
        const title = section.querySelector(".section-title");
        const desc = section.querySelector(".section-desc");

        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            if (label) tl.fromTo(label, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
            if (title) tl.fromTo(title, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5");
            if (desc) tl.fromTo(desc, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.5");
          },
        });
      });

      // === About: stats count up ===
      document.querySelectorAll(".stat-num").forEach((el) => {
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        if (!match) return;
        const target = parseInt(match[0]);
        const suffix = text.replace(match[0], "");

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.fromTo(el, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
            });
          },
        });
      });

      // === About: detail items stagger ===
      ScrollTrigger.create({
        trigger: ".about-detail-list",
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(".about-detail-item",
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" }
          );
        },
      });

      // === About: stat labels ===
      ScrollTrigger.create({
        trigger: ".about-stats",
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(".stat-label",
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power3.out", delay: 0.3 }
          );
        },
      });

      // === Skills: grid stagger ===
      ScrollTrigger.create({
        trigger: ".skills-grid",
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(".skill-group",
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power3.out" }
          );
        },
      });

      // === Projects: row slide in ===
      ScrollTrigger.create({
        trigger: ".project-list",
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(".project-item",
            { y: 50, x: -30, opacity: 0 },
            { y: 0, x: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out" }
          );
        },
      });

      // === Timeline: line draw ===
      const timelineLine = document.querySelector(".timeline");
      if (timelineLine) {
        ScrollTrigger.create({
          trigger: timelineLine,
          start: "top 80%",
          once: true,
          onEnter: () => {
            timelineLine.classList.add("tl-animate");
          },
        });
      }

      // === Timeline items ===
      document.querySelectorAll(".tl-item").forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 82%",
          once: true,
          onEnter: () => {
            const dot = item.querySelector(".tl-dot");
            const era = item.querySelector(".tl-era");
            const title = item.querySelector(".tl-title");
            const badge = item.querySelector(".tl-badge");
            const desc = item.querySelector(".tl-desc");
            const tech = item.querySelector(".tl-tech");

            const tl = gsap.timeline();
            if (dot) tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
            if (era) tl.fromTo(era, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.2");
            if (title) tl.fromTo(title, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3");
            if (badge) tl.fromTo(badge, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }, "-=0.3");
            if (desc) tl.fromTo(desc, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.2");
            if (tech) tl.fromTo(tech, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, "-=0.2");
          },
        });
      });

      // === Footer ===
      ScrollTrigger.create({
        trigger: ".footer",
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.fromTo(".footer-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
          gsap.fromTo(".footer-email", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2 });
          gsap.fromTo(".footer-link", { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power3.out", delay: 0.3 });
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
        <div className="hero-cta">
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="cta-btn">GitHub</a>
          <a href={LINKS.behance} target="_blank" rel="noopener noreferrer" className="cta-btn">Behance</a>
          <a href={LINKS.appstore} target="_blank" rel="noopener noreferrer" className="cta-btn">App Store</a>
        </div>
        <div className="hero-scroll-line" />
      </section>

      {/* 3D Interactive Art */}
      <section className="canvas-section">
        <InteractiveScene />
      </section>

      <div className="divider" />

      {/* About */}
      <section className="gsap-section section" id="about">
        <p className="section-label">概要</p>
        <h2 className="section-title">自己紹介</h2>
        <div className="about-grid">
          <div>
            <p className="about-text">
              モバイルアプリ開発を軸に、<strong>企画 → 設計 → 実装 → リリース → 収益化</strong>までを一貫して行う学生エンジニアです。
            </p>
            <div className="about-stats">
              <div className="stat"><p className="stat-num">10年+</p><p className="stat-label">PC歴</p></div>
              <div className="stat"><p className="stat-num">4ヶ月</p><p className="stat-label">本格開発歴</p></div>
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
                {list.map((s) => <span key={s} className="skill-group-item">{s}</span>)}
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
              <h3 className="tl-title">{t.title}</h3>
              <span className="tl-badge">{t.badge}</span>
              <p className="tl-desc">{t.desc}</p>
              <p className="tl-tech">{t.tech}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">
            <p className="footer-title">Ken73</p>
            <a href={LINKS.email} className="footer-email">kkappcreator@gmail.com</a>
          </div>
          <div className="footer-right">
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            <a href={LINKS.behance} target="_blank" rel="noopener noreferrer" className="footer-link">Behance</a>
            <a href={LINKS.appstore} target="_blank" rel="noopener noreferrer" className="footer-link">App Store</a>
          </div>
        </div>
        <p className="footer-copy">© 2026 Ken73. All rights reserved.</p>
      </footer>
    </div>
  );
}
