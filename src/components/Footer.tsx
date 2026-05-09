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
    <>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 28px;
          margin-bottom: 32px;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .footer-brand-col {
            grid-column: 1 / -1;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
      <footer style={styles.footer}>
        <div style={styles.inner}>
          <div className="footer-grid">
            <div className="footer-brand-col">
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
          <div className="footer-bottom" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span>© 2026 Korner Ventures, S.L. Todos los derechos reservados.</span>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="#" style={styles.bottomLink}>Aviso legal</a>
              <a href="#" style={styles.bottomLink}>Privacidad</a>
              <a href="#" style={styles.bottomLink}>Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: { background: "var(--black)", color: "rgba(255,255,255,0.7)", padding: "44px 24px 28px" },
  inner: { maxWidth: "var(--max-width)", margin: "0 auto" },
  brand: {
    fontFamily: "var(--font-playfair), serif",
    fontWeight: 700,
    fontSize: 20,
    color: "white",
    marginBottom: 10,
  },
  brandDesc: { fontSize: 12, lineHeight: 1.6, maxWidth: 280 },
  colTitle: {
    color: "white",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  colLink: {
    display: "block",
    color: "rgba(255,255,255,0.55)",
    textDecoration: "none",
    fontSize: 12,
    padding: "2px 0",
  },
  bottomLink: { color: "rgba(255,255,255,0.4)", textDecoration: "none" },
};
