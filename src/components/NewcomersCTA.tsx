"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function NewcomersCTA() {
  const { t } = useLanguage();

  return (
    <section style={styles.section}>
      <div style={styles.card} className="newcomers-card">
        <div style={styles.text} className="newcomers-text">
          <div style={styles.badge}>{t.newcomers.badge}</div>
          <h2 style={styles.h2}>{t.newcomers.h2}</h2>
          <p style={styles.desc}>{t.newcomers.desc}</p>
          <button style={styles.btn}>{t.newcomers.btn}</button>
        </div>
        <div style={styles.image} className="newcomers-image" />
      </div>
    </section>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  section: { maxWidth: "var(--max-width)", margin: "0 auto", padding: "64px 24px" },
  card: {
    background: "var(--black)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    minHeight: 320,
  },
  text: { padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(201,162,39,0.15)",
    color: "var(--gold-light)",
    fontSize: 12,
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: 20,
    width: "fit-content",
    marginBottom: 20,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  h2: { fontFamily: "var(--font-playfair), serif", fontSize: 32, color: "white", marginBottom: 14, lineHeight: 1.2 },
  desc: { color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.6, marginBottom: 28, maxWidth: 400 },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "var(--gold)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "14px 28px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    width: "fit-content",
  },
  image: {
    background: "linear-gradient(135deg, rgba(201,162,39,0.2), transparent), url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80') center/cover no-repeat",
  },
};
