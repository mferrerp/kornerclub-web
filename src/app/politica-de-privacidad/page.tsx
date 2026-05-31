import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PrivacyContent } from "@/components/PrivacyContent";

export default function PoliticaDePrivacidadPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--off-white)", minHeight: "80vh", padding: "56px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 700,
              color: "var(--black)",
              marginBottom: 8,
            }}
          >
            Política de Privacidad
          </h1>
          <p style={{ fontSize: 13, color: "var(--mid-gray)", marginBottom: 40 }}>
            Última actualización: mayo de 2026
          </p>
          <PrivacyContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
