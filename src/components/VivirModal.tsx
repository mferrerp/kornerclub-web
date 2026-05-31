"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface VivirModalProps {
  onClose: () => void;
  onOpenContact: () => void;
}

export default function VivirModal({ onClose, onOpenContact }: VivirModalProps) {
  const { t } = useLanguage();

  // Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleConsultaClick() {
    onClose();
    // Small delay so the Vivir modal finishes closing before Contact opens
    setTimeout(onOpenContact, 80);
  }

  return (
    <div
      style={s.overlay}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={s.modal}>
        {/* Image header */}
        <div style={s.imgHeader}>
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80"
            alt="Madrid"
            style={s.headerImg}
          />
          <div style={s.imgOverlay} />
          <div style={s.headerTop}>
            <div style={s.badge}>{t.newcomers.badge}</div>
            <button style={s.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={s.body}>
          <h2 style={s.h2}>{t.newcomers.h2}</h2>
          <p style={s.desc}>{t.newcomers.desc}</p>
          <button onClick={handleConsultaClick} style={s.btn}>
            {t.newcomers.btn}
          </button>
        </div>
      </div>
    </div>
  );
}

const s: { [key: string]: React.CSSProperties } = {
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
