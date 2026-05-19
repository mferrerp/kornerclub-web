"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COUNTRY_CODES = [
  { code: "+34", label: "España" },
  { code: "+1",  label: "EE.UU." },
  { code: "+44", label: "Reino Unido" },
  { code: "+49", label: "Alemania" },
  { code: "+33", label: "Francia" },
  { code: "+39", label: "Italia" },
  { code: "+351", label: "Portugal" },
  { code: "+31", label: "Países Bajos" },
  { code: "+32", label: "Bélgica" },
  { code: "+41", label: "Suiza" },
  { code: "+54", label: "Argentina" },
  { code: "+52", label: "México" },
  { code: "+57", label: "Colombia" },
  { code: "+56", label: "Chile" },
  { code: "+51", label: "Perú" },
  { code: "+55", label: "Brasil" },
  { code: "+971", label: "Emiratos" },
];

function CountryCodePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRY_CODES.find((c) => c.code === value) ?? COUNTRY_CODES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={styles.pickerBtn}
      >
        <span style={{ fontSize: 13 }}>{selected.label}</span>
        <span style={{ fontSize: 13 }}>{selected.code}</span>
        <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>
      </button>
      {open && (
        <div style={styles.pickerDropdown}>
          {COUNTRY_CODES.map(({ code, label }) => (
            <div
              key={code}
              style={{
                ...styles.pickerOption,
                background: code === value ? "var(--border)" : "white",
              }}
              onMouseDown={() => { onChange(code); setOpen(false); }}
            >
              <span style={{ fontSize: 13, flex: 1 }}>{label}</span>
              <span style={{ fontSize: 13, color: "var(--text-light)" }}>{code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AgentCTA() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+34");
  const [phone, setPhone] = useState("");
  const [purposeIdx, setPurposeIdx] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [requestNumber, setRequestNumber] = useState("");

  const isValid = name.trim().length > 0 && EMAIL_RE.test(email.trim());

  async function handleSubmit() {
    if (!isValid) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone ? `${countryCode} ${phone}` : "", purpose: t.agent.purposes[purposeIdx] }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRequestNumber(data.requestNumber);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contacto" style={styles.section} className="agent-section">
      <div>
        <h2 style={styles.h2}>{t.agent.h2}</h2>
        <p style={styles.desc}>{t.agent.desc}</p>

        {status === "success" ? (
          <div style={styles.successBox}>
            <p style={styles.successTitle}>{t.agent.successTitle}</p>
            <p style={styles.successSub}>
              {t.agent.successSub}<br />
              {t.agent.successRef} <strong>Solicitud {requestNumber}</strong>
            </p>
          </div>
        ) : (
          <div style={styles.form}>
            <input
              type="text"
              placeholder={t.agent.namePlaceholder}
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder={t.agent.emailPlaceholder}
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div style={styles.phoneRow}>
              <CountryCodePicker value={countryCode} onChange={setCountryCode} />
              <input
                type="tel"
                placeholder={t.agent.phonePlaceholder}
                style={{ ...styles.input, flex: 1 }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <select
              style={styles.input}
              value={purposeIdx}
              onChange={(e) => setPurposeIdx(Number(e.target.value))}
            >
              {t.agent.purposes.map((p, i) => (
                <option key={i} value={i}>{p}</option>
              ))}
            </select>

            {status === "error" && (
              <p style={styles.errorMsg}>{t.agent.errorMsg}</p>
            )}

            <button
              style={{
                ...styles.btn,
                opacity: isValid && status !== "loading" ? 1 : 0.45,
                cursor: isValid && status !== "loading" ? "pointer" : "not-allowed",
              }}
              disabled={!isValid || status === "loading"}
              onClick={handleSubmit}
            >
              {status === "loading" ? t.agent.sending : t.agent.btn}
            </button>
          </div>
        )}
      </div>
      <div style={styles.imageWrap} className="agent-image">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
          alt="Agente Korner Club"
          style={styles.img}
        />
      </div>
    </section>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    maxWidth: "var(--max-width)",
    margin: "0 auto",
    padding: "64px 24px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 48,
    alignItems: "center",
  },
  h2: { fontFamily: "var(--font-playfair), serif", fontSize: 28, marginBottom: 14 },
  desc: { color: "var(--text-light)", lineHeight: 1.6, marginBottom: 24 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  phoneRow: { display: "flex", gap: 8 },
  pickerBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "12px 10px",
    fontSize: 14,
    fontFamily: "inherit",
    background: "white",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  pickerDropdown: {
    position: "absolute" as const,
    top: "calc(100% + 4px)",
    left: 0,
    zIndex: 100,
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    maxHeight: 240,
    overflowY: "auto" as const,
    minWidth: 200,
  },
  pickerOption: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    cursor: "pointer",
  },
  input: {
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "12px 16px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  },
  btn: {
    background: "var(--gold)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "12px 28px",
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "inherit",
    width: "100%",
    transition: "opacity 0.15s",
  },
  errorMsg: { color: "#c0392b", fontSize: 13, margin: 0 },
  successBox: {
    background: "#f0faf4",
    border: "1px solid #a8d5b5",
    borderRadius: "var(--radius)",
    padding: "24px 20px",
  },
  successTitle: { fontWeight: 700, fontSize: 17, margin: "0 0 8px" },
  successSub: { color: "var(--text-light)", lineHeight: 1.6, margin: 0 },
};
