import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProximamentePage() {
  return (
    <>
      <Navbar />
      <main style={s.main}>
        <div style={s.inner}>
          <div style={s.badge}>Próximamente</div>
          <h1 style={s.h1}>Estamos trabajando en ello</h1>
          <p style={s.sub}>
            Esta sección estará disponible muy pronto. Mientras tanto, puedes explorar
            nuestras propiedades o contactar directamente con un agente.
          </p>
          <div style={s.actions}>
            <a href="/comprar" style={s.btnPrimary}>Ver propiedades en venta</a>
            <a href="/alquiler" style={s.btnSecondary}>Ver propiedades en alquiler</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const s: { [k: string]: React.CSSProperties } = {
  main: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--off-white)",
    padding: "64px 24px",
  },
  inner: {
    textAlign: "center",
    maxWidth: 520,
  },
  badge: {
    display: "inline-block",
    background: "var(--gold)",
    color: "white",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "5px 14px",
    borderRadius: 20,
    marginBottom: 24,
  },
  h1: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 700,
    color: "var(--black)",
    margin: "0 0 16px",
    lineHeight: 1.2,
  },
  sub: {
    fontSize: 16,
    color: "var(--text-light)",
    lineHeight: 1.7,
    margin: "0 0 36px",
  },
  actions: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btnPrimary: {
    background: "var(--gold)",
    color: "white",
    padding: "12px 24px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
    fontFamily: "inherit",
  },
  btnSecondary: {
    background: "white",
    color: "var(--black)",
    padding: "12px 24px",
    borderRadius: 8,
    fontWeight: 500,
    fontSize: 14,
    textDecoration: "none",
    fontFamily: "inherit",
    border: "1.5px solid var(--border)",
  },
};
