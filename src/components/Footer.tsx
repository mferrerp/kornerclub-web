"use client";

import { useLanguage } from "@/contexts/LanguageContext";

// href arrays per column — language-independent, matches the order of links in i18n.ts
const COLUMN_HREFS: string[][] = [
  // Comprar
  ["/comprar?type=apartment", "/comprar?type=house", "/comprar?type=penthouse", "/comprar?condition=new", "#"],
  // Alquilar
  ["/alquiler?type=apartment", "/alquiler?type=studio", "/alquiler?rentType=rent_temporary", "#"],
  // Propietario
  ["#", "#", "#"],
  // Empresa
  ["#", "#", "#"],
];

export default function Footer() {
  const { t } = useLanguage();

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
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
          .footer-brand-col { grid-column: 1 / -1; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 10px; }
        }
      `}</style>
      <footer style={styles.footer}>
        <div style={styles.inner}>
          <div className="footer-grid">
            <div className="footer-brand-col">
              <div style={styles.brand}>
                KORNER{" "}
                <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>CLUB</span>
              </div>
              <p style={styles.brandDesc}>{t.footer.brandDesc}</p>
            </div>
            {t.footer.columns.map((col, colIdx) => (
              <div key={col.title}>
                <h4 style={styles.colTitle}>{col.title}</h4>
                {col.links.map((link, linkIdx) => (
                  <a
                    key={link}
                    href={COLUMN_HREFS[colIdx]?.[linkIdx] ?? "#"}
                    style={styles.colLink}
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span>{t.footer.copyright}</span>
            <div style={{ display: "flex", gap: 16 }}>
              {t.footer.legal.map((item, i) => (
                <a
                  key={item}
                  href={i === 1 ? "/politica-de-privacidad" : "#"}
                  style={styles.bottomLink}
                >
                  {item}
                </a>
              ))}
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
  brand: { fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: 20, color: "white", marginBottom: 10 },
  brandDesc: { fontSize: 12, lineHeight: 1.6, maxWidth: 280 },
  colTitle: { color: "white", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  colLink: { display: "block", color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: 12, padding: "2px 0" },
  bottomLink: { color: "rgba(255,255,255,0.4)", textDecoration: "none" },
};
