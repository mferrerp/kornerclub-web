"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NewcomersCTA() {
  const { t } = useLanguage();
  const [vivirOpen, setVivirOpen] = useState(false);

  // Body scroll lock + Escape key
  useEffect(() => {
    if (!vivirOpen) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeVivir();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [vivirOpen]);

  function closeVivir() {
    setVivirOpen(false);
    document.body.style.overflow = "";
  }

  function handleConsultaClick() {
    closeVivir();
    // Small delay so the vivir modal closes before the contact modal opens
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-contact-modal"));
    }, 80);
  }

  return (
    <>
      {/* ── Vivir en Madrid modal ─────────────────────────────── */}
      {vivirOpen && (
        <div
          style={modalStyles.overlay}
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeVivir(); }}
        >
          <div style={modalStyles.modal}>
            {/* Image header */}
            <div style={modalStyles.imgHeader}>
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80"
                alt="Madrid"
                style={modalStyles.headerImg}
              />
              {/* Gradient overlay so the badge + close btn are readable */}
              <div style={modalStyles.imgOverlay} />
              <div style={modalStyles.headerTop}>
                <div style={modalStyles.badge}>{t.newcomers.badge}</div>
                <button
                  style={modalStyles.closeBtn}
                  onClick={closeVivir}
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={modalStyles.body}>
              <h2 style={modalStyles.h2}>{t.newcomers.h2}</h2>
              <p style={modalStyles.desc}>{t.newcomers.desc}</p>
              <button onClick={handleConsultaClick} style={modalStyles.btn}>
                {t.newcomers.btn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── On-page dark card (unchanged look) ───────────────── */}
      <section style={styles.section}>
        <div style={styles.card} className="newcomers-card">
          <div style={styles.text} className="newcomers-text">
            <div style={styles.badge}>{t.newcomers.badge}</div>
            <h2 style={styles.h2}>{t.newcomers.h2}</h2>
            <p style={styles.desc}>{t.newcomers.desc}</p>
            <button style={styles.btn} onClick={() => setVivirOpen(true)}>
              {t.newcomers.btn}
            </button>
          </div>
          <div style={styles.image} className="newcomers-image" />
        </div>
      </section>
    </>
  );
}

/* ── On-page card styles (unchanged from original) ───────────────────── */
const styles: { [key: string]: React.CSSProperties } = {
  section: { maxWidth: "var(--max-width)", margin: "0 auto", padding: "64px 24px" },
  card: {
    background: "var(--black)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    minHeight: 320,
  },
  text: { padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(201,162,39,0.15)",
    color: "var(--gold-light)",
    fontSize: 12,
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: 20,
    width: "fit-content",
    marginBottom: 20,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  h2: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: 32,
    color: "white",
    marginBottom: 14,
    lineHeight: 1.2,
  },
  desc: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 15,
    lineHeight: 1.6,
    marginBottom: 28,
    maxWidth: 400,
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "var(--gold)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "14px 28px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    width: "fit-content",
  },
  image: {
    background:
      "linear-gradient(135deg, rgba(201,162,39,0.2), transparent), url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80') center/cover no-repeat",
  },
};

/* ── Modal styles ────────────────────────────────────────────────────── */
const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    background: "white",
    borderRadius: 16,
    boxShadow: "0 12px 48px rgba(0,0,0,0.22)",
    width: "100%",
    maxWidth: 540,
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  /* Image header */
  imgHeader: {
    position: "relative",
    height: 200,
    flexShrink: 0,
    overflow: "hidden",
  },
  headerImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  imgOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 100%)",
  },
  headerTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "16px 18px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(201,162,39,0.85)",
    color: "white",
    fontSize: 12,
    fontWeight: 700,
    padding: "5px 12px",
    borderRadius: 20,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    backdropFilter: "blur(4px)",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: "50%",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    cursor: "pointer",
    color: "white",
    lineHeight: 1,
    backdropFilter: "blur(4px)",
    flexShrink: 0,
  },
  /* Body */
  body: {
    padding: "28px 28px 32px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  h2: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: 26,
    color: "var(--black)",
    margin: 0,
    lineHeight: 1.25,
  },
  desc: {
    color: "var(--text-light)",
    lineHeight: 1.7,
    fontSize: 15,
    margin: 0,
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "var(--gold)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "13px 24px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    alignSelf: "flex-start",
    marginTop: 4,
  },
};
