"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

// Tab 0 = Comprar (sale), Tab 1 = Alquilar (rent), Tab 2 = Vender (no search)
const TAB_CONTEXT = ["sale", "rent", null] as const;
const TAB_BASE    = ["/comprar", "/alquiler", "/proximamente"] as const;

export default function Hero() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  async function handleSearch() {
    const context = TAB_CONTEXT[activeTab];
    const base    = TAB_BASE[activeTab];

    // "Vender" tab — no AI search, just navigate
    if (!context) { router.push(base); return; }

    // Empty query — navigate to the listing page without filters
    if (!query.trim()) { router.push(base); return; }

    setSearching(true);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, context }),
      });
      const { filters = {} } = await res.json();

      const params = new URLSearchParams();
      if (filters.type)     params.set("type",     filters.type);
      if (filters.condition) params.set("condition", filters.condition);
      if (filters.rentType) params.set("rentType",  filters.rentType);
      if (filters.minPrice) params.set("minPrice",  String(filters.minPrice));
      if (filters.maxPrice) params.set("maxPrice",  String(filters.maxPrice));
      if (filters.minRooms) params.set("minRooms",  String(filters.minRooms));

      const qs = params.toString();
      router.push(qs ? `${base}?${qs}` : base);
    } catch {
      router.push(base);
    } finally {
      setSearching(false);
    }
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .hero-section  { justify-content: center !important; padding-left: 0 !important; }
          .hero-content  { padding: 0 20px !important; max-width: 100% !important; }
          .hero-h1       { font-size: 34px !important; }
          .hero-searchbox{ max-width: 100% !important; margin: 0 auto !important; }
        }
      `}</style>
      <section className="hero-section" style={styles.hero}>
        <div style={styles.heroBg} />
        <div className="hero-content" style={styles.heroContent}>
          <h1 className="hero-h1" style={styles.h1}>
            {t.hero.h1Before}{" "}
            <em style={{ fontStyle: "normal", color: "var(--gold-light)" }}>Madrid</em>{" "}
            {t.hero.h1After}
          </h1>

          <div className="hero-searchbox" style={styles.searchBox}>
            <div style={styles.searchTabs}>
              {t.hero.tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(i); setQuery(""); }}
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                style={{ ...styles.searchBtn, opacity: searching ? 0.7 : 1 }}
                onClick={handleSearch}
                disabled={searching}
              >
                {searching ? "…" : t.hero.searchBtn}
              </button>
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
    transition: "opacity 0.15s",
  },
};
