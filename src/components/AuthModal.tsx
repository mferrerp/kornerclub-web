"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "signup" | "reset";

function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}


function Divider() {
  return (
    <div style={styles.divider}>
      <span style={styles.dividerLine} />
      <span style={styles.dividerText}>o continúa con email</span>
      <span style={styles.dividerLine} />
    </div>
  );
}

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isLogin = mode === "login";
  const isReset = mode === "reset";

  async function handleSubmit() {
    if (!email || (!isReset && !password)) return;
    if (!isLogin && !isReset && !name.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      if (isReset) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset`,
        });
        if (error) throw error;
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
        return;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (error) throw error;
      }
      setStatus("success");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Ha ocurrido un error.");
      setStatus("error");
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  const titles: Record<Mode, string> = {
    login: "Iniciar sesión",
    signup: "Crear cuenta",
    reset: "Recuperar contraseña",
  };

  return (
    <div
      style={styles.overlay}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLogo}>
            <img src="/brand/monograma-negro-transparente.svg" alt="Korner Club" style={{ width: 28, height: 28 }} />
          </div>
          <h2 style={styles.title}>{titles[mode]}</h2>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {status === "success" ? (
            <div style={styles.successBox}>
              {isReset ? (
                <>
                  <p style={styles.successTitle}>Revisa tu bandeja de entrada</p>
                  <p style={styles.successSub}>
                    Te hemos enviado un enlace a <strong>{email}</strong> para restablecer tu contraseña.
                  </p>
                </>
              ) : (
                <>
                  <p style={styles.successTitle}>¡Cuenta creada!</p>
                  <p style={styles.successSub}>Revisa tu email para confirmar tu cuenta.</p>
                </>
              )}
              <button style={{ ...styles.btnPrimary, marginTop: 16 }} onClick={onClose}>Cerrar</button>
            </div>
          ) : (
            <>
              {/* Social buttons — only for login/signup */}
              {!isReset && (
                <>
                  <div>
                    <button style={{ ...styles.socialBtn, width: "100%" }} onClick={() => handleOAuth("google")}>
                      <IconGoogle />
                      <span>Continuar con Google</span>
                    </button>
                  </div>
                  <Divider />
                </>
              )}

              {/* Nombre — solo en signup */}
              {!isLogin && !isReset && (
                <div style={styles.field}>
                  <label style={styles.label}>Nombre completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    style={styles.input}
                  />
                </div>
              )}

              {/* Email */}
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  style={styles.input}
                  onKeyDown={(e) => e.key === "Enter" && !isReset && password && handleSubmit()}
                />
              </div>

              {/* Password */}
              {!isReset && (
                <div style={styles.field}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <label style={styles.label}>Contraseña</label>
                    {isLogin && (
                      <button style={styles.linkBtn} onClick={() => { setMode("reset"); setStatus("idle"); setErrorMsg(""); setName(""); }}>
                        ¿Olvidaste tu contraseña?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isLogin ? "••••••••" : "Mínimo 8 caracteres"}
                    style={styles.input}
                    onKeyDown={(e) => e.key === "Enter" && email && handleSubmit()}
                  />
                </div>
              )}

              {errorMsg && <p style={styles.errorMsg}>{errorMsg}</p>}

              <button
                style={{
                  ...styles.btnPrimary,
                  opacity: status === "loading" ? 0.6 : 1,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                }}
                disabled={status === "loading"}
                onClick={handleSubmit}
              >
                {status === "loading" ? "Cargando…" : isReset ? "Enviar enlace" : isLogin ? "Entrar" : "Crear cuenta"}
              </button>

              {/* Toggle mode */}
              <p style={styles.toggleText}>
                {isReset ? (
                  <>
                    {"Volver a "}
                    <button style={styles.linkBtn} onClick={() => { setMode("login"); setStatus("idle"); setErrorMsg(""); setName(""); }}>
                      iniciar sesión
                    </button>
                  </>
                ) : isLogin ? (
                  <>
                    {"¿No tienes cuenta? "}
                    <button style={styles.linkBtn} onClick={() => { setMode("signup"); setStatus("idle"); setErrorMsg(""); setName(""); }}>
                      Crear cuenta
                    </button>
                  </>
                ) : (
                  <>
                    {"¿Ya tienes cuenta? "}
                    <button style={styles.linkBtn} onClick={() => { setMode("login"); setStatus("idle"); setErrorMsg(""); }}>
                      Iniciar sesión
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(26,26,26,0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backdropFilter: "blur(2px)",
  },
  modal: {
    background: "white",
    borderRadius: 16,
    boxShadow: "0 24px 64px rgba(26,26,26,0.18)",
    width: "100%",
    maxWidth: 420,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid var(--border)",
    gap: 12,
  },
  headerLogo: {
    flexShrink: 0,
  },
  title: {
    fontFamily: "var(--font-playfair), serif",
    fontSize: 20,
    fontWeight: 700,
    flex: 1,
    margin: 0,
    color: "var(--black)",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "var(--mid-gray)",
    lineHeight: 1,
    padding: 4,
    flexShrink: 0,
  },
  body: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  socialBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 16px",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius)",
    background: "white",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "inherit",
    color: "var(--text)",
    cursor: "pointer",
    transition: "background 0.15s",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "2px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "var(--border)",
    display: "block",
  },
  dividerText: {
    fontSize: 12,
    color: "var(--mid-gray)",
    whiteSpace: "nowrap",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text)",
  },
  input: {
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "11px 14px",
    fontSize: 14,
    fontFamily: "inherit",
    color: "var(--text)",
    outline: "none",
    background: "white",
    width: "100%",
  },
  btnPrimary: {
    background: "var(--gold)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "12px",
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "inherit",
    width: "100%",
    cursor: "pointer",
    marginTop: 2,
  },
  linkBtn: {
    background: "none",
    border: "none",
    padding: 0,
    fontSize: "inherit",
    color: "var(--gold-dark)",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "underline",
  },
  toggleText: {
    textAlign: "center",
    fontSize: 13,
    color: "var(--text-light)",
    margin: "4px 0 0",
  },
  errorMsg: {
    fontSize: 13,
    color: "#c0392b",
    margin: 0,
  },
  successBox: {
    background: "#f0faf4",
    border: "1px solid #a8d5b5",
    borderRadius: "var(--radius)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  successTitle: {
    fontWeight: 700,
    fontSize: 16,
    margin: 0,
    color: "var(--black)",
  },
  successSub: {
    fontSize: 14,
    color: "var(--text-light)",
    lineHeight: 1.6,
    margin: 0,
  },
};
