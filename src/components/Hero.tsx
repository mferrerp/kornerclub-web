"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .hero-content { padding: 0 16px !important; }
        }
      `}</style>
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div className="hero-content" style={styles.heroContent}>
          <h1 style={styles.h1}>
            {t.hero.h1Before}{" "}
            <em style={{ fontStyle: "normal", color: "var(--gold-light)" }}>Madrid</em>{" "}
            {t.hero.h1After}
          </h1>

          <div style={styles.searchBox}>
            <div style={styles.searchTabs}>
              {t.hero.tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  style={{
                    ...styles.searchTab,
                    ...(i === activeTab ? styles.searchTabActive : {}),
                  }}
                >
                  {tab}
                  {i === activeTab && <span style={styles.tabIndicator} />}
                </button>
              ))}
            </div>
            <div style={styles.inputRow}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder={t.hero.placeholders[activeTab]}
                style={styles.input}
              />
              <button style={styles.searchBtn}>{t.hero.searchBtn}</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  hero: {
    position: "relative",
    height: 520,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: "max(24px, calc((100% - var(--max-width)) / 2 + 24px))",
  },
  heroBg: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(170deg, rgba(26,26,26,0.55) 0%, rgba(26,26,26,0.25) 60%, rgba(201,162,39,0.15) 100%), url('https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1600&q=80') center/cover no-repeat",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "left",
    maxWidth: 720,
    padding: "0 24px",
  },
  h1: {
    fontFamily: "var(--font-libre-franklin), var(--font-playfair), serif",
    fontSize: 48,
    fontWeight: 700,
    color: "white",
    lineHeight: 1.15,
    marginBottom: 28,
    textShadow: "0 2px 20px rgba(0,0,0,0.2)",
  },
  searchBox: {
    background: "white",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    overflow: "hidden",
    maxWidth: 640,
    margin: 0,
  },
  searchTabs: {
    display: "flex",
    borderBottom: "1px solid var(--border)",
  },
  searchTab: {
    flex: 1,
    padding: "14px 0",
    background: "none",
    border: "none",
    fontSize: 14,
    fontWeight: 500,
    color: "var(--text-light)",
    cursor: "pointer",
    fontFamily: "inherit",
    position: "relative",
  },
  searchTabActive: {
    color: "var(--black)",
    fontWeight: 600,
  },
  tabIndicator: {
    position: "absolute",
    bottom: -1,
    left: "20%",
    right: "20%",
    height: 2,
    background: "var(--gold)",
    borderRadius: 2,
    display: "block",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    padding: "8px 8px 8px 20px",
    gap: 8,
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 15,
    fontFamily: "inherit",
    color: "var(--text)",
    background: "transparent",
  },
  searchBtn: {
    background: "var(--gold)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "12px 28px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
};
