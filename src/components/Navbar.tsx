"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lang } from "@/lib/i18n";
import AuthModal from "@/components/AuthModal";
import ContactModal from "@/components/ContactModal";
import VivirModal from "@/components/VivirModal";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const languages: { code: Lang; flagCode: string; label: string }[] = [
  { code: "es", flagCode: "es", label: "Español" },
  { code: "en", flagCode: "gb", label: "English" },
  { code: "fr", flagCode: "fr", label: "Français" },
  { code: "de", flagCode: "de", label: "Deutsch" },
];

// Indices 3 ("Vivir en Madrid") and 5 ("Contacto") open modals instead of navigating
const NAV_HREFS = ["/comprar", "/alquiler", "#", null, "#", null];
const MODAL_TRIGGER: Record<number, "vivir" | "contact"> = { 3: "vivir", 5: "contact" };

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [vivirOpen, setVivirOpen] = useState(false);
  // Use a ref so the value is set synchronously before the re-render triggered by setContactOpen
  const lockedPurposeRef = useRef<string | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  async function checkRole(userId: string) {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    setIsAdmin(!!data && ["admin", "agent"].includes(data.role));
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) checkRole(u.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkRole(u.id);
      else setIsAdmin(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Body scroll lock when any modal is open
  useEffect(() => {
    document.body.style.overflow = contactOpen || vivirOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [contactOpen, vivirOpen]);

  // External trigger (e.g. from detail page "Solicitar información" button)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ lockedPurpose?: string }>).detail;
      // Set synchronously via ref BEFORE the state update that triggers the render
      lockedPurposeRef.current = detail?.lockedPurpose;
      setContactOpen(true);
    };
    window.addEventListener("open-contact-modal", handler);
    return () => window.removeEventListener("open-contact-modal", handler);
  }, []);

  const firstName = user?.user_metadata?.full_name?.split(" ")[0]
    ?? user?.user_metadata?.name?.split(" ")[0]
    ?? user?.email?.split("@")[0]
    ?? null;

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
  }

  const currentLang = languages.find((l) => l.code === lang) ?? languages[0];

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {contactOpen && (
        <ContactModal
          onClose={() => { setContactOpen(false); lockedPurposeRef.current = undefined; }}
          lockedPurpose={lockedPurposeRef.current}
        />
      )}
      {vivirOpen && (
        <VivirModal
          onClose={() => setVivirOpen(false)}
          onOpenContact={() => { setVivirOpen(false); setContactOpen(true); }}
        />
      )}
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
            <img src="/brand/monograma-negro-transparente.svg" alt="Korner Club" style={styles.logoMark} />
            <div className="nb-logo-text-wrap" style={styles.logoTextWrap}>
              KORNER<span style={{ ...styles.logoTextSpan, marginLeft: 2 }}>CLUB</span>
            </div>
          </a>

          {/* Desktop nav links */}
          <ul className="nb-nav-links" style={styles.navLinks}>
            {t.nav.items.map((item, i) => (
              <li key={item}>
                {MODAL_TRIGGER[i] ? (
                  <button
                    style={styles.navLinkBtn}
                    onClick={() => MODAL_TRIGGER[i] === "vivir" ? setVivirOpen(true) : setContactOpen(true)}
                  >
                    {item}
                  </button>
                ) : (
                  <a href={NAV_HREFS[i] ?? "#"} style={styles.navLink}>{item}</a>
                )}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nb-actions" style={styles.actions}>
            {/* Language selector — desktop only */}
            <div className="nb-lang-desktop" style={{ position: "relative" }}>
              <button style={styles.langBtn} onClick={() => setLangOpen((o) => !o)}>
                <img
                  src={`https://flagcdn.com/24x18/${currentLang.flagCode}.png`}
                  alt={currentLang.label}
                  width={24}
                  height={18}
                  style={{ display: "block", borderRadius: 2 }}
                />
                <span className="nb-lang-code">{currentLang.code.toUpperCase()}</span>
                <span className="nb-lang-chevron" style={{ fontSize: 10, color: "var(--mid-gray)" }}>▾</span>
              </button>
              {langOpen && (
                <div style={styles.langDropdown}>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      style={{
                        ...styles.langOption,
                        ...(l.code === lang ? { color: "var(--gold-dark)", fontWeight: 600 } : {}),
                      }}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                    >
                      <img
                        src={`https://flagcdn.com/20x15/${l.flagCode}.png`}
                        alt={l.label}
                        width={20}
                        height={15}
                        style={{ display: "block", borderRadius: 2 }}
                      />
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Iniciar sesión / Usuario */}
            {user ? (
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <button style={styles.btnOutline} onClick={() => setUserMenuOpen((o) => !o)}>
                  <IconUser />
                  <span className="nb-btn-text" style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {firstName}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--mid-gray)" }}>▾</span>
                </button>
                {userMenuOpen && (
                  <div style={styles.userDropdown}>
                    <div style={styles.userDropdownEmail}>{user.email}</div>
                    {isAdmin && (
                      <a href="/admin/propiedades" style={styles.userDropdownItem}>
                        Panel de administración
                      </a>
                    )}
                    <button style={{ ...styles.userDropdownItem, borderTop: "1px solid var(--border)" }} onClick={handleSignOut}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button style={styles.btnOutline} onClick={() => setShowAuth(true)}>
                <IconUser />
                <span className="nb-btn-text">{t.nav.login}</span>
              </button>
            )}

            {/* Hamburger — mobile only */}
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
          {t.nav.items.map((item, i) => (
            MODAL_TRIGGER[i] ? (
              <button
                key={item}
                style={{ ...styles.mobileNavLink, background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}
                onClick={() => { setMenuOpen(false); MODAL_TRIGGER[i] === "vivir" ? setVivirOpen(true) : setContactOpen(true); }}
              >
                {item}
              </button>
            ) : (
              <a
                key={item}
                href={NAV_HREFS[i] ?? "#"}
                style={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            )
          ))}

          {/* Language selector — mobile */}
          <div className="nb-lang-mobile" style={styles.mobileLangSection}>
            <span style={styles.mobileLangTitle}>Idioma / Language</span>
            {languages.map((l) => (
              <button
                key={l.code}
                style={{
                  ...styles.mobileLangOption,
                  ...(l.code === lang ? { color: "var(--gold-dark)", fontWeight: 600 } : {}),
                }}
                onClick={() => { setLang(l.code); setMenuOpen(false); }}
              >
                <img
                  src={`https://flagcdn.com/20x15/${l.flagCode}.png`}
                  alt={l.label}
                  width={20}
                  height={15}
                  style={{ display: "block", borderRadius: 2 }}
                />
                {l.label}
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
    width: 36,
    height: 36,
    borderRadius: 6,
    flexShrink: 0,
    display: "block",
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
  navLinkBtn: {
    background: "none",
    border: "none",
    color: "var(--text)",
    fontSize: 14,
    fontWeight: 500,
    padding: "8px 14px",
    borderRadius: 6,
    whiteSpace: "nowrap",
    cursor: "pointer",
    fontFamily: "inherit",
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
  userDropdown: {
    position: "absolute" as const,
    top: "calc(100% + 6px)",
    right: 0,
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow-md)",
    minWidth: 200,
    overflow: "hidden",
    zIndex: 200,
  },
  userDropdownEmail: {
    padding: "10px 14px",
    fontSize: 12,
    color: "var(--mid-gray)",
    borderBottom: "1px solid var(--border)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  userDropdownItem: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text)",
    cursor: "pointer",
    border: "none",
    background: "none",
    fontFamily: "inherit",
    textAlign: "left" as const,
    textDecoration: "none",
    boxSizing: "border-box" as const,
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
