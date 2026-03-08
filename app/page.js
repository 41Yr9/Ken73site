"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ============================================
   Data
   ============================================ */

const GITHUB_USERNAME = "41Yr9";

const SKILLS = {
  "モバイル & フロントエンド": [
    "React Native",
    "Expo",
    "TypeScript",
    "Next.js",
    "React Navigation",
  ],
  "バックエンド & データベース": [
    "Python",
    "Flask",
    "Discord.py",
    "Playwright",
    "PostgreSQL",
    "MySQL",
    "SQLite",
  ],
  "AI & クラウドサービス": [
    "Google Gemini AI",
    "Supabase",
    "Render",
    "Docker",
    "Shopify",
    "RevenueCat",
    "AdMob",
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
    number: "01",
    name: "DiGer",
    subtitle: "古着タグAI鑑定アプリ",
    description:
      "古着のブランドタグを撮影するだけで、AIがブランド・製造年代・市場価格を瞬時に判定するiOS/Androidアプリ。Gemini 2.5 Flashを活用し、タグのデザイン・素材表記・アーカイブデータをAIが照合。",
    tags: ["React Native", "TypeScript", "Gemini AI", "PostgreSQL", "RevenueCat"],
    highlights: ["App Store公開済み", "サブスク3プラン設計"],
    link: "https://apps.apple.com/jp/app/diger/id6756227679",
    repo: "diger-website",
  },
  {
    number: "02",
    name: "FormLab",
    subtitle: "AI筋トレフォーム解析",
    description:
      "トレーニング動画をAIが解析し、姿勢・動作のスムーズさ・安全性を100点満点でスコアリング。最大50秒の動画をAIに送信する効率的なパイプラインを構築。",
    tags: ["React Native", "Expo", "TypeScript", "Gemini AI", "Supabase"],
    highlights: ["クラウド履歴保存", "サブスク課金実装"],
    link: null,
    repo: "formlab-page",
  },
  {
    number: "03",
    name: "EC Auto-Vending Bot",
    subtitle: "Discord自動販売システム",
    description:
      "仕入れ・在庫管理・決済確認・納品までを完全自動化したDiscord + Web上のEC自動販売システム。24時間365日の完全無人運用を実現。",
    tags: ["Python", "Discord.py", "Flask", "Docker", "Cloudflare Tunnel"],
    highlights: ["24/7完全無人運用", "2チャネル販売"],
    link: null,
    repo: null,
  },
];

const TIMELINE = [
  {
    era: "小学生時代",
    title: "Minecraftサーバー運営",
    highlight: "個人運営で同時接続25名を達成",
    desc: "家にあったノートPCでMinecraftサーバーを立ち上げ、約2年間Ownerとして運営。MySQLでゲーム内経済システムを構築。英語のReddit掲示板を読み解きながらエラーを解決し、情報収集力の原点に。",
    tech: "Java / Spigot / MySQL",
    current: false,
  },
  {
    era: "中学生時代",
    title: "RoboCup Junior",
    highlight: "2019 Japan Open OnStage 優勝",
    desc: "Arduinoを使用した瓦割りロボットを製作し、地域予選から全国大会まで勝ち進み優勝。チーム4人で何度も壁にぶつかりながら乗り越えた経験が、今の開発にも活きている。",
    tech: "Arduino / Python",
    current: false,
  },
  {
    era: "高校生時代",
    title: "Esportsデザイナー",
    highlight: "制作実績50件以上",
    desc: "Fortnite/ApexのEsportsシーンで活動。セミプロレベル（大会アジア50〜500位）の実力を持ちながら、チームの専属デザイナーとしてヘッダー画像や大会用クリエイティブを制作。",
    tech: "Adobe Photoshop",
    current: false,
  },
  {
    era: "大学生時代（現在）",
    title: "アプリ開発者 & 起業家",
    highlight: "App Store公開済み",
    desc: "アパレルブランド「TIER」を個人で立ち上げ・運営した後、エンジニアとしてユーザー課題を解決するモバイルアプリ開発に注力。DiGer, FormLabをリリース。",
    tech: "React Native / TypeScript / Python / Supabase",
    current: true,
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
  const [navScrolled, setNavScrolled] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [githubStats, setGithubStats] = useState(null);
  const [repoData, setRepoData] = useState({});

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Typing animation
  useEffect(() => {
    const titles = [
      "Student Engineer / App Developer",
      "モバイルアプリ開発を軸に、企画から収益化まで",
      "Building apps that bridge the Real World and AI",
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    const type = () => {
      const current = titles[titleIndex];
      if (!isDeleting) {
        setTypingText(current.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === current.length) {
          timeout = setTimeout(() => {
            isDeleting = true;
            type();
          }, 2000);
          return;
        }
        timeout = setTimeout(type, 60);
      } else {
        setTypingText(current.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          titleIndex = (titleIndex + 1) % titles.length;
          timeout = setTimeout(type, 500);
          return;
        }
        timeout = setTimeout(type, 30);
      }
    };

    timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Fetch GitHub stats
  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((r) => r.json())
      .then((data) =>
        setGithubStats({
          repos: data.public_repos,
          followers: data.followers,
          following: data.following,
        })
      )
      .catch(() => { });

    // Fetch repo data for projects
    PROJECTS.forEach((project) => {
      if (project.repo) {
        fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${project.repo}`)
          .then((r) => r.json())
          .then((data) =>
            setRepoData((prev) => ({
              ...prev,
              [project.repo]: {
                stars: data.stargazers_count,
                language: data.language,
                updated: data.updated_at,
              },
            }))
          )
          .catch(() => { });
      }
    });
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  return (
    <>
      {/* ---- Navigation ---- */}
      <nav className={`nav ${navScrolled ? "scrolled" : ""}`}>
        <a href="#" className="nav-logo">
          Ken73
        </a>
        <ul className="nav-links">
          <li><a href="#about">概要</a></li>
          <li><a href="#skills">技術</a></li>
          <li><a href="#projects">制作物</a></li>
          <li><a href="#experience">経歴</a></li>
        </ul>
      </nav>

      {/* ---- Hero Section ---- */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <Image
            src="/night-city-v2.png"
            alt="Night City"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-name">Ken73</h1>
          <p className="hero-subtitle">Kenjiro Kawai</p>
          <p className="hero-typing">
            {typingText}
            <span className="typing-cursor" />
          </p>
          <div className="hero-links">
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="hero-link">
              GitHub
            </a>
            <a href={LINKS.behance} target="_blank" rel="noopener noreferrer" className="hero-link">
              Behance
            </a>
            <a href={LINKS.appstore} target="_blank" rel="noopener noreferrer" className="hero-link">
              App Store
            </a>
          </div>
        </div>
        <div className="hero-scroll">
          <span />
          <small>Scroll</small>
        </div>
      </section>

      <div className="divider" />

      {/* ---- About Section ---- */}
      <section className="section reveal" id="about">
        <p className="section-label">01 — 概要</p>
        <h2 className="section-title">自己紹介</h2>
        <div className="about-grid">
          <div>
            <p className="section-desc">
              モバイルアプリ開発を軸に、<strong>企画 → 設計 → 実装 → リリース → 収益化</strong>
              までを一貫して行う学生エンジニアです。
            </p>
            <div className="about-stats">
              <div className="stat-item">
                <p className="stat-number">10年+</p>
                <p className="stat-label">PC歴</p>
              </div>
              <div className="stat-item">
                <p className="stat-number">4ヶ月</p>
                <p className="stat-label">本格開発歴</p>
              </div>
              <div className="stat-item">
                <p className="stat-number">3</p>
                <p className="stat-label">リリース済みプロダクト</p>
              </div>
              <div className="stat-item">
                <p className="stat-number">1</p>
                <p className="stat-label">App Store公開</p>
              </div>
            </div>
          </div>
          <div className="about-detail">
            <p>
              <strong>🎓 大学生</strong>（現在）
            </p>
            <p>
              <strong>📱 React Native / Expo</strong> でのiOS/Androidアプリ開発・App Store公開経験あり
            </p>
            <p>
              <strong>🤖 Python + API</strong>による業務自動化・Bot開発
            </p>
            <p>
              <strong>🏆 RoboCup Junior 2019</strong> Japan Open OnStage 優勝
            </p>
            <p>
              <strong>🎨 Esports チーム</strong>のグラフィックデザイナー経験
            </p>
            <p>
              <strong>🛍️ Shopify</strong>を活用したアパレルEC運営経験
            </p>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ---- Skills Section ---- */}
      <section className="section reveal" id="skills">
        <p className="section-label">02 — 技術スタック</p>
        <h2 className="section-title">使用技術</h2>
        <p className="section-desc">
          フロントエンドからバックエンド、AI連携まで幅広い技術を活用しています。
        </p>

        {/* Marquee */}
        <div className="skills-marquee-wrapper">
          <div className="skills-marquee">
            {[...ALL_SKILLS, ...ALL_SKILLS].map((skill, i) => (
              <div key={i} className="skill-chip">
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="skills-categories">
          {Object.entries(SKILLS).map(([category, skills]) => (
            <div key={category} className="skill-category reveal">
              <h3 className="skill-category-title">{category}</h3>
              <div className="skill-list">
                {skills.map((s) => (
                  <span key={s} className="skill-list-item">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ---- Projects Section ---- */}
      <section className="section reveal" id="projects">
        <p className="section-label">03 — 制作物</p>
        <h2 className="section-title">プロジェクト</h2>
        <p className="section-desc">
          実際にリリースし、運用しているプロダクトです。GitHubから最新情報を取得しています。
        </p>

        {/* GitHub Stats */}
        {githubStats && (
          <div className="github-stats reveal">
            <div className="github-stat">
              <p className="github-stat-number">{githubStats.repos}</p>
              <p className="github-stat-label">リポジトリ</p>
            </div>
            <div className="github-stat">
              <p className="github-stat-number">{githubStats.followers}</p>
              <p className="github-stat-label">フォロワー</p>
            </div>
            <div className="github-stat">
              <p className="github-stat-number">{githubStats.following}</p>
              <p className="github-stat-label">フォロー中</p>
            </div>
            <div className="github-stat">
              <p className="github-stat-number">
                {PROJECTS.filter((p) => p.highlights.some((h) => h.includes("App Store"))).length}
              </p>
              <p className="github-stat-label">App Store公開</p>
            </div>
          </div>
        )}

        {/* Project Cards */}
        <div className="projects-grid">
          {PROJECTS.map((project) => {
            const repo = repoData[project.repo];
            return (
              <a
                key={project.number}
                className="project-card reveal"
                href={project.link || (project.repo ? `https://github.com/${GITHUB_USERNAME}/${project.repo}` : "#")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div>
                  <p className="project-number">PROJECT {project.number}</p>
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((t) => (
                      <span key={t} className="project-tag">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="project-meta">
                  {project.highlights.map((h) => (
                    <p key={h} className="project-meta-item">✦ {h}</p>
                  ))}
                  {repo && (
                    <>
                      {repo.language && (
                        <p className="project-meta-item">{repo.language}</p>
                      )}
                      {repo.updated && (
                        <p className="project-meta-item">
                          更新: {formatDate(repo.updated)}
                        </p>
                      )}
                    </>
                  )}
                  <span className="project-arrow">→</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* ---- Experience Timeline ---- */}
      <section className="section reveal" id="experience">
        <p className="section-label">04 — 経歴</p>
        <h2 className="section-title">Background & History</h2>
        <p className="section-desc">
          PC歴10年。小学生時代からテクノロジーに触れ、様々なフィールドで経験を積んできました。
        </p>

        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className="timeline-item reveal">
              <div className={`timeline-dot ${item.current ? "current" : ""}`} />
              <p className="timeline-era">{item.era}</p>
              <h3 className="timeline-title">{item.title}</h3>
              <span className="timeline-highlight">{item.highlight}</span>
              <p className="timeline-desc">{item.desc}</p>
              <p className="timeline-tech">{item.tech}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ---- Footer ---- */}
      <footer className="footer">
        <div className="footer-links">
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="footer-link">
            GitHub
          </a>
          <a href={LINKS.behance} target="_blank" rel="noopener noreferrer" className="footer-link">
            Behance
          </a>
          <a href={LINKS.appstore} target="_blank" rel="noopener noreferrer" className="footer-link">
            App Store
          </a>
          <a href={LINKS.email} className="footer-link">
            Email
          </a>
        </div>
        <p className="footer-copy">© 2026 Ken73. All rights reserved.</p>
      </footer>
    </>
  );
}
