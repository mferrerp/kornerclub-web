"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const barrios = [
  { name: "Salamanca", amount: "€3.200/m²", luxury: true, img: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80", featured: true },
  { name: "Chamberí",  amount: "€2.800/m²", img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80" },
  { name: "Malasaña",  amount: "€2.400/m²", img: "https://images.unsplash.com/8IK6h5Wsg6k?w=400&q=80" },
  { name: "La Latina", amount: "€2.200/m²", img: "https://images.unsplash.com/photo-1509027572446-af8401acfdc3?w=400&q=80" },
  { name: "Retiro",    amount: "€2.600/m²", img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80" },
  { name: "Chueca",    amount: "€2.500/m²", img: "https://images.unsplash.com/photo-1585202900695-f08e8e2a9cc6?w=400&q=80" },
];

export default function Barrios() {
  const { t } = useLanguage();

  return (
    <section style={styles.section}>
      <div style={styles.inner}>
        <h2 style={styles.h2}>{t.barrios.heading}</h2>
        <p style={styles.subtitle}>{t.barrios.subtitle}</p>
        <div style={styles.grid} className="barrios-grid">
          {barrios.map((b) => (
            <a
              key={b.name}
              href="#"
              className={b.featured ? "barrios-featured" : ""}
              style={{ ...styles.card, ...(b.featured ? styles.featured : {}) }}
            >
              <img src={b.img} alt={b.name} style={styles.img} />
              <div style={styles.overlay}>
                <h3 style={styles.cardName}>{b.name}</h3>
                <span style={styles.cardPrice}>
                  {t.barrios.from} {b.amount}
                  {b.luxury ? ` — ${t.barrios.luxury}` : ""}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  section: { background: "var(--warm-gray)", padding: "64px 24px" },
  inner: { maxWidth: "var(--max-width)", margin: "0 auto" },
  h2: { fontFamily: "var(--font-playfair), serif", fontSize: 28, fontWeight: 700, marginBottom: 8 },
  subtitle: { color: "var(--text-light)", marginBottom: 32 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gridTemplateRows: "repeat(2, 200px)",
    gap: 12,
  },
  card: { position: "relative", borderRadius: "var(--radius)", overflow: "hidden", cursor: "pointer", textDecoration: "none" },
  featured: { gridColumn: "span 2", gridRow: "span 2" },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(0deg, rgba(26,26,26,0.7) 0%, transparent 60%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 16,
  },
  cardName: { color: "white", fontSize: 16, fontWeight: 600 },
  cardPrice: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
};
