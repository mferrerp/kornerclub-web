const services = [
  {
    icon: "🏠",
    iconBg: "#e8f5e9",
    title: "Comprar",
    desc: "Accede a propiedades exclusivas antes de que salgan al mercado. Nuestros agentes negocian las mejores condiciones para ti.",
    link: "Ver propiedades",
  },
  {
    icon: "🔑",
    iconBg: "#e3f2fd",
    title: "Alquilar",
    desc: "Pisos verificados, contratos transparentes y acompañamiento completo. Encuentra tu hogar en Madrid sin estrés.",
    link: "Explorar alquileres",
  },
  {
    icon: "📈",
    iconBg: "#fff3e0",
    title: "Vender",
    desc: "Valoración gratuita, fotografía profesional y marketing digital. Vendemos tu propiedad al mejor precio del mercado.",
    link: "Solicitar valoración",
  },
  {
    icon: "✦",
    iconBg: "linear-gradient(135deg, #f9f3e3, #f0e6c8)",
    title: "Servicio de Concierge",
    desc: "Asistencia personalizada de alto nivel, diseñada para gestionar tareas logísticas, operativas y de estilo de vida.",
    link: "Descubre más",
  },
];

export default function Services() {
  return (
    <section style={styles.section}>
      <div style={styles.heading}>
        <h2 style={styles.h2}>¿Qué necesitas?</h2>
        <p style={styles.subtitle}>
          Te acompañamos en cada paso, desde la búsqueda hasta la firma
        </p>
      </div>
      <div style={styles.grid} className="services-grid">
        {services.map((s) => (
          <a key={s.title} href="#" style={styles.card}>
            <div
              style={{
                ...styles.icon,
                background: s.iconBg,
              }}
            >
              {s.icon}
            </div>
            <h3 style={styles.cardTitle}>{s.title}</h3>
            <p style={styles.cardDesc}>{s.desc}</p>
            <span style={styles.cardLink}>{s.link} →</span>
          </a>
        ))}
      </div>
    </section>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    maxWidth: "var(--max-width)",
    margin: "0 auto",
    padding: "64px 24px",
  },
  heading: { textAlign: "center", marginBottom: 40 },
  h2: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 8,
  },
  subtitle: { color: "var(--text-light)", fontSize: 16 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20,
  },
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
  cardDesc: {
    fontSize: 13,
    color: "var(--text-light)",
    lineHeight: 1.5,
    marginBottom: 14,
  },
  cardLink: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--gold-dark)",
  },
};
