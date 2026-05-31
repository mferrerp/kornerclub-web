"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const ICONS = ["🏠", "🔑", "📈", "✦"];
const CARD_HREFS = ["/comprar", "/alquiler", "/proximamente", "/proximamente"];
const ICON_BG = ["#e8f5e9", "#e3f2fd", "#fff3e0", "linear-gradient(135deg, #f9f3e3, #f0e6c8)"];

export default function Services() {
  const { t } = useLanguage();

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <section style={styles.section}>
        <div style={styles.heading}>
          <h2 style={styles.h2}>{t.services.heading}</h2>
          <p style={styles.subtitle}>{t.services.subtitle}</p>
        </div>
        <div style={styles.grid} className="services-grid">
          {t.services.cards.map((s, i) => (
            <a key={s.title} href={CARD_HREFS[i]} style={styles.card}>
              <div style={{ ...styles.icon, background: ICON_BG[i] }}>{ICONS[i]}</div>
              <h3 style={styles.cardTitle}>{s.title}</h3>
              <p style={styles.cardDesc}>{s.desc}</p>
              <span style={styles.cardLink}>{s.link} →</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  section: { maxWidth: "var(--max-width)", margin: "0 auto", padding: "64px 24px" },
  heading: { textAlign: "center", marginBottom: 40 },
  h2: { fontFamily: "var(--font-playfair), serif", fontSize: 32, fontWeight: 700, marginBottom: 8 },
  subtitle: { color: "var(--text-light)", fontSize: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 },
  card: {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "28px 24px",
    textAlign: "center",
    textDecoration: "none",
    color: "inherit",
    display: "block",
    transition: "all 0.3s ease",
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    fontSize: 24,
  },
  cardTitle: { fontSize: 17, fontWeight: 600, marginBottom: 8 },
  cardDesc: { fontSize: 13, color: "var(--text-light)", lineHeight: 1.5, marginBottom: 14 },
  cardLink: { fontSize: 13, fontWeight: 600, color: "var(--gold-dark)" },
};
