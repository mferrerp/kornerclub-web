"use client";

import { useLanguage } from "@/contexts/LanguageContext";

// ─── Brand SVG illustrations ──────────────────────────────────────────────────
// Palette: #1a1a1a (black/dark) · #c9a227 (gold) · #fdf8ec (light gold tint)

function IllustrationComprar() {
  return (
    <svg width="88" height="88" viewBox="0 0 80 80" fill="none">
      {/* Gold roof fill */}
      <path d="M10 40L40 10L70 40Z" fill="#c9a227" opacity="0.18"/>
      {/* Roof outline */}
      <polyline points="10,40 40,10 70,40" stroke="#c9a227" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
      {/* Chimney */}
      <rect x="51" y="21" width="8" height="10" rx="1" fill="#1a1a1a" opacity="0.12"/>
      <rect x="50" y="19" width="10" height="3" rx="1" fill="#1a1a1a" opacity="0.2"/>
      {/* House walls */}
      <rect x="16" y="39" width="48" height="30" rx="2" stroke="#1a1a1a" strokeWidth="2" fill="white"/>
      {/* Left window */}
      <rect x="21" y="47" width="13" height="11" rx="1" stroke="#1a1a1a" strokeWidth="1.5" fill="#fdf8ec"/>
      <line x1="27.5" y1="47" x2="27.5" y2="58" stroke="#1a1a1a" strokeWidth="1" opacity="0.4"/>
      <line x1="21" y1="52.5" x2="34" y2="52.5" stroke="#1a1a1a" strokeWidth="1" opacity="0.4"/>
      {/* Right window */}
      <rect x="46" y="47" width="13" height="11" rx="1" stroke="#1a1a1a" strokeWidth="1.5" fill="#fdf8ec"/>
      <line x1="52.5" y1="47" x2="52.5" y2="58" stroke="#1a1a1a" strokeWidth="1" opacity="0.4"/>
      <line x1="46" y1="52.5" x2="59" y2="52.5" stroke="#1a1a1a" strokeWidth="1" opacity="0.4"/>
      {/* Door arch */}
      <path d="M34 69 L34 59 Q34 55 40 55 Q46 55 46 59 L46 69" stroke="#1a1a1a" strokeWidth="1.5" fill="#f5f0e8"/>
      {/* Gold door knob */}
      <circle cx="43.5" cy="63" r="1.8" fill="#c9a227"/>
      {/* Gold price badge */}
      <circle cx="63" cy="18" r="9" fill="#c9a227"/>
      <path d="M60.5 17.5 Q63 14.5 65.5 17.5 M61 20 Q63 22 65 20" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function IllustrationAlquilar() {
  return (
    <svg width="88" height="88" viewBox="0 0 80 80" fill="none">
      {/* ── Door ────────────────────────────────────────────── */}
      {/* Door body */}
      <rect x="12" y="20" width="38" height="52" rx="3" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      {/* Arched top fill */}
      <path d="M14 35 Q14 22 31 22 Q48 22 48 35" fill="#fdf8ec"/>
      {/* Arch outline */}
      <path d="M14 35 Q14 22 31 22 Q48 22 48 35" fill="none" stroke="#1a1a1a" strokeWidth="2"/>
      {/* Upper left panel */}
      <rect x="17" y="37" width="12" height="10" rx="1.5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" opacity="0.6"/>
      {/* Upper right panel */}
      <rect x="33" y="37" width="12" height="10" rx="1.5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" opacity="0.6"/>
      {/* Lower left panel */}
      <rect x="17" y="52" width="12" height="12" rx="1.5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" opacity="0.6"/>
      {/* Lower right panel */}
      <rect x="33" y="52" width="12" height="12" rx="1.5" fill="none" stroke="#1a1a1a" strokeWidth="1.2" opacity="0.6"/>
      {/* Gold door knob */}
      <circle cx="44" cy="47" r="3.5" fill="#c9a227"/>
      <circle cx="44" cy="47" r="1.5" fill="#a68318"/>
      {/* Doorstep */}
      <rect x="8"  y="72" width="46" height="3" rx="1.5" fill="#1a1a1a" opacity="0.1"/>
      <rect x="10" y="70" width="42" height="3" rx="1" fill="#1a1a1a" opacity="0.08"/>

      {/* ── Key (diagonal, prominent) ────────────────────────── */}
      {/* Key bow — large gold ring */}
      <circle cx="65" cy="22" r="12" fill="#fdf8ec" stroke="#c9a227" strokeWidth="3"/>
      <circle cx="65" cy="22" r="5.5" fill="white" stroke="#c9a227" strokeWidth="2"/>
      <circle cx="65" cy="22" r="2"   fill="#c9a227"/>
      {/* Key shaft — diagonal */}
      <line x1="57" y1="31" x2="38" y2="63" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round"/>
      {/* Key teeth */}
      <line x1="47" y1="48" x2="42" y2="52" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
      <line x1="43" y1="55" x2="38" y2="59" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function IllustrationPropietario() {
  return (
    <svg width="88" height="88" viewBox="0 0 80 80" fill="none">
      {/* House silhouette */}
      <path d="M10 46L36 20L62 46" fill="#c9a227" opacity="0.12" stroke="#1a1a1a" strokeWidth="1.8" strokeLinejoin="round"/>
      <rect x="15" y="45" width="42" height="24" rx="2" stroke="#1a1a1a" strokeWidth="1.8" fill="white"/>
      {/* Door */}
      <rect x="28" y="57" width="16" height="12" rx="1.5" stroke="#1a1a1a" strokeWidth="1.5" fill="#f5f0e8"/>
      <circle cx="41" cy="63" r="1.5" fill="#c9a227"/>
      {/* Left window */}
      <rect x="19" y="51" width="10" height="8" rx="1" stroke="#1a1a1a" strokeWidth="1.2" fill="#fdf8ec" opacity="0.8"/>
      {/* Rising bar chart (value/growth) */}
      <rect x="58" y="59" width="5" height="10" rx="1" fill="#c9a227" opacity="0.45"/>
      <rect x="65" y="50" width="5" height="19" rx="1" fill="#c9a227" opacity="0.7"/>
      <rect x="72" y="41" width="5" height="28" rx="1" fill="#c9a227"/>
      {/* Trend arrow */}
      <polyline points="56,61 63,52 70,43 77,35" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M73,33 L79,35 L77,41" stroke="#c9a227" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function IllustrationConcierge() {
  return (
    <svg width="88" height="88" viewBox="0 0 80 80" fill="none">
      {/* Magnifying glass circle */}
      <circle cx="35" cy="36" r="21" stroke="#1a1a1a" strokeWidth="2.5" fill="white"/>
      {/* Gold lens tint */}
      <circle cx="35" cy="36" r="21" fill="#c9a227" opacity="0.05"/>
      {/* Handle */}
      <line x1="50" y1="51" x2="66" y2="67" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round"/>
      {/* Mini house inside lens */}
      <polyline points="26,39 35,28 44,39" stroke="#c9a227" strokeWidth="2" strokeLinejoin="round" fill="none"/>
      <rect x="28" y="38" width="14" height="10" rx="1" stroke="#c9a227" strokeWidth="1.5" fill="#fdf8ec"/>
      <rect x="32" y="42" width="5" height="6" rx="0.5" fill="#c9a227" opacity="0.5"/>
      {/* Stars / sparkles */}
      <circle cx="64" cy="22" r="4" fill="#c9a227"/>
      <circle cx="70" cy="33" r="2.5" fill="#c9a227" opacity="0.65"/>
      <circle cx="58" cy="14" r="2" fill="#c9a227" opacity="0.45"/>
      <line x1="64" y1="14" x2="64" y2="18" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <line x1="62" y1="16" x2="66" y2="16" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

const ILLUSTRATIONS = [
  IllustrationComprar,
  IllustrationAlquilar,
  IllustrationPropietario,
  IllustrationConcierge,
];

const CARD_HREFS = ["/comprar", "/alquiler", "/proximamente", "/proximamente"];

export default function Services() {
  const { t } = useLanguage();

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr 1fr !important; }
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
          {t.services.cards.map((s, i) => {
            const Illustration = ILLUSTRATIONS[i];
            return (
              <a key={s.title} href={CARD_HREFS[i]} style={styles.card} className="service-card">
                <div style={styles.iconWrap}>
                  <Illustration />
                </div>
                <h3 style={styles.cardTitle}>{s.title}</h3>
                <p style={styles.cardDesc}>{s.desc}</p>
                <span style={styles.cardLink}>{s.link} →</span>
              </a>
            );
          })}
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
    padding: "32px 24px 28px",
    textAlign: "center",
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 16,
    background: "rgba(201,162,39,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 17, fontWeight: 600, marginBottom: 10, color: "var(--black)" },
  cardDesc: { fontSize: 13, color: "var(--text-light)", lineHeight: 1.6, marginBottom: 16, flex: 1 },
  cardLink: { fontSize: 13, fontWeight: 600, color: "var(--gold-dark)" },
};
