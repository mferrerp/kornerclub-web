const columns = [
  {
    title: "Comprar",
    links: ["Pisos en venta", "Casas en venta", "Áticos", "Obra nueva", "Guía del comprador"],
  },
  {
    title: "Alquilar",
    links: ["Pisos en alquiler", "Estudios", "Alquiler temporal", "Guía del inquilino"],
  },
  {
    title: "Vender",
    links: ["Por qué Korner Club", "Home staging", "Guía del vendedor"],
  },
  {
    title: "Empresa",
    links: ["Sobre nosotros", "Nuestro equipo", "Contacto"],
  },
];

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.grid}>
          <div>
            <div style={styles.brand}>
              KORNER{" "}
              <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>
                CLUB
              </span>
            </div>
            <p style={styles.brandDesc}>
              Inmobiliaria digital en Madrid. Especialistas en acompañar a recién
              llegados en su proceso de instalación y búsqueda de vivienda. Tu
              barrio, tu Korner.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 style={styles.colTitle}>{col.title}</h4>
              {col.links.map((link) => (
                <a key={link} href="#" style={styles.colLink}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={styles.bottom}>
          <span>© 2026 Korner Ventures, S.L. Todos los derechos reservados.</span>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" style={styles.bottomLink}>Aviso legal</a>
            <a href="#" style={styles.bottomLink}>Privacidad</a>
            <a href="#" style={styles.bottomLink}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: { background: "var(--black)", color: "rgba(255,255,255,0.7)", padding: "56px 24px 32px" },
  inner: { maxWidth: "var(--max-width)", margin: "0 auto" },
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
    gap: 40,
    marginBottom: 40,
  },
  brand: {
    fontFamily: "var(--font-playfair), serif",
    fontWeight: 700,
    fontSize: 20,
    color: "white",
    marginBottom: 12,
  },
  brandDesc: { fontSize: 13, lineHeight: 1.6, maxWidth: 280 },
  colTitle: {
    color: "white",
    fontSize: 13,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  colLink: {
    display: "block",
    color: "rgba(255,255,255,0.55)",
    textDecoration: "none",
    fontSize: 13,
    padding: "4px 0",
  },
  bottom: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 12,
  },
  bottomLink: { color: "rgba(255,255,255,0.4)", textDecoration: "none" },
};
