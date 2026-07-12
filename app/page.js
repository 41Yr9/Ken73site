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
    name: "Heya",
    sub: "友達の今を、そっと感じるSNS",
    desc: "近況を短い『状態』で共有し、気分に合う部屋で友達とゆるくつながれるiOSアプリ。ルーム、DM、プロフィール、AIアバター生成まで一貫して設計しています。",
    tags: ["Swift", "SwiftUI", "iOS"],
    meta: ["プライベートSNS", "開発中"],
    link: null,
    repo: null,
    img: "/images/heya-home.jpeg",
  },
  {
    num: "02",
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
    num: "03",
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
    num: "04",
    name: "Vibeplus",
    sub: "Codex向け開発ワークフロープラグイン",
    desc: "要件整理、リスク分類、Planレビュー、実装、コードレビュー、Pull Request、知識保存までを一つの流れとして扱うCodexプラグイン。変更の危険度に応じて工程を調整します。",
    tags: ["Codex", "Python", "GitHub Actions"],
    meta: ["OSS", "Codex Plugin"],
    link: "https://github.com/41Yr9/vibeplus",
    repo: "vibeplus",
    img: null,
  },
  {
    num: "05",
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
    title: "ブランド運営からプロダクト開発へ",
    badge: "企画から公開・運用まで",
    desc: "アパレルブランド「TIER」の企画・EC運営を経験。その後はモバイルアプリを軸に、DiGer、FormLab、Heyaを開発し、CodexプラグインVibeplusも公開。",
    tech: "Swift / React Native / Next.js / Python / Supabase",
    active: true,
    img: "/images/tier.jpg",
  },
];

const LINKS = {
  github: "https://github.com/41Yr9",
  x: "https://x.com/41yr9",
  qiita: "https://qiita.com/41Yr9", // ユーザー名が違う場合は書き換えてください
  email: "mailto:kkappcreator@gmail.com",
  behance: "https://www.behance.net/NaiwaD",
  appstore: "https://apps.apple.com/jp/app/diger/id6756227679",
};

const SOCIAL_LINKS = [
  { label: "GitHub", href: LINKS.github },
  { label: "X", href: LINKS.x },
  { label: "Qiita", href: LINKS.qiita },
  { label: "Behance", href: LINKS.behance },
  { label: "App Store", href: LINKS.appstore },
];

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

      gsap.fromTo(".hero-links",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.9 }
      );

      gsap.fromTo(".hero-link",
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
        
        <div className="hero-links" aria-label="ソーシャルリンク">
          {SOCIAL_LINKS.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="hero-link">
              {link.label}<span aria-hidden="true">↗</span>
            </a>
          ))}
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
              モバイルアプリ開発を軸に、<strong>企画 → 設計 → 実装 → リリース → 収益化</strong>までを一貫して行う学生エンジニアです。
            </p>
            <div className="about-stats">
              <div className="stat"><p className="stat-num">10年+</p><p className="stat-label">PC歴</p></div>
              <div className="stat"><p className="stat-num">5</p><p className="stat-label">制作物</p></div>
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
        <p className="section-desc">開発・公開・運用しているプロダクトと、その背景にある課題や設計意図を紹介します。</p>

        <div className="project-list">
          {PROJECTS.map((p) => {
            const repo = repoData[p.repo];
            const href = p.link || (p.repo ? `https://github.com/${GITHUB_USERNAME}/${p.repo}` : null);
            const ProjectElement = href ? "a" : "article";
            return (
              <ProjectElement
                key={p.num}
                className={`project-item ${href ? "" : "project-item-static"}`}
                {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {p.img
                  ? <img src={p.img} alt={p.name} className="project-img" />
                  : <div className="project-mark" aria-hidden="true">{p.name.slice(0, 1)}</div>}
                <span className="project-num">{p.num}</span>
                <div className="project-info">
                  <h3 className="project-title">{p.name}</h3>
                  <p className="project-sub">{p.sub}</p>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-tags">
                    {p.tags.map((t) => <span key={t} className="project-tag">{t}</span>)}
                  </div>
                </div>
                <div className="project-right">
                  {p.meta.map((m) => <span key={m} className="project-meta">✦ {m}</span>)}
                  {repo?.updated && <span className="project-meta">更新 {fmtDate(repo.updated)}</span>}
                  {href
                    ? <span className="project-arrow">↗</span>
                    : <span className="project-status">In development</span>}
                </div>
              </ProjectElement>
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
            {SOCIAL_LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="footer-link">{link.label}</a>
            ))}
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
