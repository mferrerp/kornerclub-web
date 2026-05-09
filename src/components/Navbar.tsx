"use client";

import { useState } from "react";

const languages = [
  { code: "ES", flagCode: "es", label: "Español" },
  { code: "EN", flagCode: "gb", label: "English" },
  { code: "FR", flagCode: "fr", label: "Français" },
  { code: "DE", flagCode: "de", label: "Deutsch" },
];

const navItems = ["Comprar", "Alquilar", "Vender", "Vivir en Madrid", "Servicio de Concierge"];

export default function Navbar() {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={styles.navbar}>
      <div className="nav-inner" style={styles.inner}>
        {/* Left group: hamburger (mobile only) + logo */}
        <div style={styles.leftGroup}>
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <span />
            <span />
            <span />
          </button>
          <a href="/" style={styles.logo}>
            <div className="nav-logo-mark" style={styles.logoMark}>K</div>
            <div className="nav-logo-text" style={styles.logoText}>
              KORNER <span style={styles.logoTextSpan}>CLUB</span>
            </div>
          </a>
        </div>

        {/* Nav links — hidden on mobile */}
        <ul className="nav-nav-links" style={styles.navLinks}>
          {navItems.map((item, i) => (
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
        <div style={styles.actions}>
          <div style={{ position: "relative" }}>
            <button
              className="nav-lang-btn"
              style={styles.langBtn}
              onClick={() => setLangOpen(!langOpen)}
            >
              <img
                src={`https://flagcdn.com/24x18/${currentLang.flagCode}.png`}
                alt={currentLang.label}
                width={24}
                height={18}
                style={{ display: "block", borderRadius: 2 }}
              />
              <span className="nav-lang-code">{currentLang.code}</span>
              <span className="nav-lang-arrow" style={{ fontSize: 10, color: "var(--mid-gray)" }}>▾</span>
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
                      src={`https://flagcdn.com/24x18/${lang.flagCode}.png`}
                      alt={lang.label}
                      width={24}
                      height={18}
                      style={{ display: "block", borderRadius: 2 }}
                    />
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="nav-btn-iniciar" style={styles.btnOutline}>Iniciar sesión</button>
          <button className="nav-btn-contactar" style={styles.btnPrimary}>Contactar</button>
        </div>
      </div>

      {/* Mobile dropdown menu — rendered only when open; CSS hides it on desktop */}
      {mobileOpen && (
        <div className="nav-mobile-menu">
          {navItems.map((item, i) => (
            <a
              key={item}
              href="#"
              style={{
                ...styles.mobileNavLink,
                ...(i === 0 ? { color: "var(--gold-dark)", fontWeight: 600 } : {}),
              }}
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "white",
    borderBottom: "1px solid var(--border)",
    height: "var(--nav-height)",
    display: "flex",
    alignItems: "center",
  },
  inner: {
    maxWidth: "var(--max-width)",
    width: "100%",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
  leftGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "var(--black)",
  },
  logoMark: {
    width: 36,
    height: 36,
    background: "var(--black)",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--gold)",
    fontFamily: "var(--font-playfair), serif",
    fontWeight: 700,
    fontSize: 20,
  },
  logoText: {
    fontFamily: "var(--font-playfair), serif",
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: 0.5,
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
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
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
    fontSize: 13,
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
    padding: "7px 14px",
    border: "1.5px solid var(--border)",
    borderRadius: 6,
    background: "none",
    fontSize: 14,
    fontWeight: 500,
    color: "var(--text)",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  btnPrimary: {
    padding: "7px 14px",
    border: "1.5px solid var(--gold)",
    borderRadius: 6,
    background: "var(--gold)",
    color: "white",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  mobileNavLink: {
    display: "block",
    textDecoration: "none",
    color: "var(--text)",
    fontSize: 15,
    fontWeight: 500,
    padding: "14px 24px",
    borderBottom: "1px solid var(--border)",
  },
};
