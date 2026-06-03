"use client";

import { useLanguage } from "@/contexts/LanguageContext";

// ─── Simple brand icons (original circle style, brand colors only) ────────────

const ICONS = [
  // 1. Comprar — house
  <svg key="buy" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" fill="#c9a227" fillOpacity="0.15"/>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9" stroke="#1a1a1a" strokeWidth="1.8"/>
  </svg>,
  // 2. Alquilar — key
  <svg key="rent" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5" stroke="#c9a227"/>
    <circle cx="7.5" cy="15.5" r="2.5" fill="#c9a227" fillOpacity="0.3"/>
    <path d="M11.5 11.5L21 3" stroke="#1a1a1a"/>
    <path d="M18 5l2 2" stroke="#1a1a1a"/>
    <path d="M21 8l-1.5-1.5" stroke="#1a1a1a"/>
  </svg>,
  // 3. Propietario — rising chart
  <svg key="owner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,17 8,12 13,14 21,6" stroke="#c9a227"/>
    <polyline points="17,6 21,6 21,10" stroke="#c9a227"/>
    <line x1="3" y1="21" x2="21" y2="21" stroke="#1a1a1a" strokeWidth="1.5"/>
    <rect x="4" y="16" width="3" height="5" fill="#c9a227" fillOpacity="0.25" stroke="none"/>
    <rect x="9" y="13" width="3" height="8" fill="#c9a227" fillOpacity="0.4" stroke="none"/>
    <rect x="14" y="15" width="3" height="6" fill="#c9a227" fillOpacity="0.3" stroke="none"/>
  </svg>,
  // 4. Servicios al Inquilino — star / concierge
  <svg key="tenant" width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#c9a227" fillOpacity="0.2" stroke="#c9a227" strokeWidth="1.8"/>
    <polygon points="12,5.5 14.2,10 19,10.7 15.5,14.1 16.4,19 12,16.7 7.6,19 8.5,14.1 5,10.7 9.8,10" fill="#c9a227" fillOpacity="0.5" stroke="none"/>
  </svg>,
];

const CARD_HREFS = ["/comprar", "/alquiler", "/proximamente", "/proximamente"];

export default function Services() {
  const { t } = useLanguage();

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
        .service-card:hover { box-shadow: 0 8px 32px rgba(201,162,39,0.12), 0 2px 8px rgba(0,0,0,0.06) !important; transform: translateY(-2px); }
        .service-card { transition: all 0.25s ease; }
      `}</style>
      <section style={styles.section}>
        <div style={styles.heading}>
          <h2 style={styles.h2}>{t.services.heading}</h2>
          <p style={styles.subtitle}>{t.services.subtitle}</p>
        </div>
        <div style={styles.grid} className="services-grid">
          {t.services.cards.map((s, i) => (
            <a key={s.title} href={CARD_HREFS[i]} style={styles.card} className="service-card">
              <div style={styles.iconWrap}>
                {ICONS[i]}
              </div>
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
  heading: { textAlign: "center", marginBottom: 48 },
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
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "rgba(201,162,39,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
  },
  cardTitle: { fontSize: 17, fontWeight: 600, marginBottom: 10, color: "var(--black)" },
  cardDesc: { fontSize: 13, color: "var(--text-light)", lineHeight: 1.6, marginBottom: 16, flex: 1 },
  cardLink: { fontSize: 13, fontWeight: 600, color: "var(--gold-dark)" },
};
