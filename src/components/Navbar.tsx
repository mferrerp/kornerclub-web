"use client";

import { useState } from "react";

const languages = [
  { code: "ES", flagCode: "es", label: "Español" },
  { code: "EN", flagCode: "gb", label: "English" },
  { code: "FR", flagCode: "fr", label: "Français" },
  { code: "DE", flagCode: "de", label: "Deutsch" },
];

const NAV_ITEMS = ["Comprar", "Alquilar", "Propietario", "Vivir en Madrid", "Servicio de Concierge"];
const MOBILE_NAV_ITEMS = [...NAV_ITEMS, "Contacto"];

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function Navbar() {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        .nb-nav-links { display: flex; align-items: center; gap: 4px; list-style: none; }
        .nb-hamburger { display: none; }
        .nb-lang-code { display: inline; }
        .nb-lang-chevron { display: inline; }
        .nb-btn-text { display: inline; margin-left: 6px; }
        .nb-mobile-menu { display: none; flex-direction: column; border-top: 1px solid var(--border); background: white; }
        .nb-mobile-menu.open { display: flex; }
        .nb-lang-desktop { display: flex; }
        .nb-lang-mobile { display: none; }

        @media (max-width: 768px) {
          .nb-nav-links { display: none !important; }
          .nb-hamburger { display: flex; align-items: center; justify-content: center; }
          .nb-lang-code { display: none; }
          .nb-lang-chevron { display: none; }
          .nb-btn-text { display: none; }
          .nb-lang-desktop { display: none; }
          .nb-lang-mobile { display: block; }

          .nb-logo { gap: 5px !important; }
          .nb-logo-text-wrap { font-size: 21px !important; letter-spacing: -0.3px !important; }
          .nb-logo-k { font-size: 26px !important; }
          .nb-actions { gap: 4px !important; }
        }
      `}</style>

      <nav style={styles.navbar}>
        <div style={styles.inner}>
          {/* Logo */}
          <a href="/" className="nb-logo" style={styles.logo}>
            <div style={styles.logoMark}>
              <span className="nb-logo-k" style={styles.logoK}>K</span>
              <div style={styles.logoCorner} />
            </div>
            <div className="nb-logo-text-wrap" style={styles.logoTextWrap}>
              KORNER<span style={styles.logoTextSpan}> CLUB</span>
            </div>
          </a>

          {/* Desktop nav links */}
          <ul className="nb-nav-links" style={styles.navLinks}>
            {NAV_ITEMS.map((item, i) => (
              <li key={item}>
                <a
                  href="#"
                  style={{
                    ...styles.navLink,
                    ...(i === 0 ? styles.navLinkActive : {}),
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nb-actions" style={styles.actions}>
            {/* Language selector — desktop only */}
            <div className="nb-lang-desktop" style={{ position: "relative" }}>
              <button
                style={styles.langBtn}
                onClick={() => setLangOpen((o) => !o)}
              >
                <img
                  src={`https://flagcdn.com/24x18/${currentLang.flagCode}.png`}
                  alt={currentLang.label}
                  width={24}
                  height={18}
                  style={{ display: "block", borderRadius: 2 }}
                />
                <span className="nb-lang-code">{currentLang.code}</span>
                <span className="nb-lang-chevron" style={{ fontSize: 10, color: "var(--mid-gray)" }}>▾</span>
              </button>
              {langOpen && (
                <div style={styles.langDropdown}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      style={{
                        ...styles.langOption,
                        ...(lang.code === currentLang.code
                          ? { color: "var(--gold-dark)", fontWeight: 600 }
                          : {}),
                      }}
                      onClick={() => {
                        setCurrentLang(lang);
                        setLangOpen(false);
                      }}
                    >
                      <img
                        src={`https://flagcdn.com/20x15/${lang.flagCode}.png`}
                        alt={lang.label}
                        width={20}
                        height={15}
                        style={{ display: "block", borderRadius: 2 }}
                      />
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Iniciar sesión */}
            <button style={styles.btnOutline}>
              <IconUser />
              <span className="nb-btn-text">Iniciar sesión</span>
            </button>

            {/* Hamburger — mobile only, top right */}
            <button
              className="nb-hamburger"
              style={styles.hamburger}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menú"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="17" y2="6" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="14" x2="17" y2="14" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div className={`nb-mobile-menu${menuOpen ? " open" : ""}`}>
          {MOBILE_NAV_ITEMS.map((item, i) => (
            <a
              key={item}
              href="#"
              style={{
                ...styles.mobileNavLink,
                ...(i === 0 ? styles.navLinkActive : {}),
              }}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}

          {/* Language selector — mobile, inside menu */}
          <div className="nb-lang-mobile" style={styles.mobileLangSection}>
            <span style={styles.mobileLangTitle}>Idioma</span>
            {languages.map((lang) => (
              <button
                key={lang.code}
                style={{
                  ...styles.mobileLangOption,
                  ...(lang.code === currentLang.code
                    ? { color: "var(--gold-dark)", fontWeight: 600 }
                    : {}),
                }}
                onClick={() => {
                  setCurrentLang(lang);
                  setMenuOpen(false);
                }}
              >
                <img
                  src={`https://flagcdn.com/20x15/${lang.flagCode}.png`}
                  alt={lang.label}
                  width={20}
                  height={15}
                  style={{ display: "block", borderRadius: 2 }}
                />
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "white",
    borderBottom: "1px solid var(--border)",
    minHeight: "var(--nav-height)",
    display: "flex",
    flexDirection: "column",
  },
  inner: {
    maxWidth: "var(--max-width)",
    width: "100%",
    margin: "0 auto",
    padding: "0 24px",
    height: "var(--nav-height)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "var(--black)",
    flexShrink: 0,
  },
  logoMark: {
    position: "relative",
    width: 36,
    height: 36,
    background: "var(--black)",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoK: {
    color: "var(--gold)",
    fontFamily: "var(--font-playfair), serif",
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 1,
    position: "relative",
    zIndex: 1,
  },
  logoCorner: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 8,
    height: 8,
    borderBottom: "2.5px solid var(--gold)",
    borderRight: "2.5px solid var(--gold)",
    borderRadius: "0 0 2px 0",
  },
  logoTextWrap: {
    fontFamily: "var(--font-playfair), serif",
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: 0.5,
    whiteSpace: "nowrap",
  },
  logoTextSpan: {
    fontWeight: 400,
    color: "var(--mid-gray)",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    textDecoration: "none",
    color: "var(--text)",
    fontSize: 14,
    fontWeight: 500,
    padding: "8px 14px",
    borderRadius: 6,
    whiteSpace: "nowrap",
  },
  navLinkActive: {
    color: "var(--gold-dark)",
    fontWeight: 600,
  },
  mobileNavLink: {
    textDecoration: "none",
    color: "var(--text)",
    fontSize: 15,
    fontWeight: 500,
    padding: "14px 24px",
    borderBottom: "1px solid var(--border)",
    display: "block",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  hamburger: {
    padding: "8px",
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "var(--text)",
    lineHeight: 0,
    flexShrink: 0,
  },
  langBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "7px 10px",
    border: "1.5px solid var(--border)",
    borderRadius: 6,
    background: "none",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  langDropdown: {
    position: "absolute",
    top: "calc(100% + 6px)",
    right: 0,
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow-md)",
    minWidth: 140,
    overflow: "hidden",
    zIndex: 200,
  },
  langOption: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    fontSize: 11,
    fontWeight: 500,
    color: "var(--text)",
    cursor: "pointer",
    border: "none",
    background: "none",
    width: "100%",
    fontFamily: "inherit",
    textAlign: "left" as const,
  },
  btnOutline: {
    display: "flex",
    alignItems: "center",
    padding: "7px 14px",
    border: "none",
    borderRadius: 6,
    background: "none",
    fontSize: 14,
    fontWeight: 500,
    color: "var(--text)",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  mobileLangSection: {
    borderTop: "1px solid var(--border)",
    padding: "12px 24px 16px",
  },
  mobileLangTitle: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    color: "var(--mid-gray)",
    marginBottom: 10,
  },
  mobileLangOption: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 0",
    fontSize: 14,
    fontWeight: 500,
    color: "var(--text)",
    cursor: "pointer",
    border: "none",
    background: "none",
    width: "100%",
    fontFamily: "inherit",
    textAlign: "left" as const,
  },
};
