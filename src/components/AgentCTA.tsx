export default function AgentCTA() {
  return (
    <section style={styles.section} className="agent-section">
      <div>
        <h2 style={styles.h2}>Habla con un agente de Korner Club</h2>
        <p style={styles.desc}>
          Te conectamos con un experto local sin compromiso. Conoce el mercado,
          resuelve tus dudas y da el primer paso hacia tu nuevo hogar.
        </p>
        <div style={styles.form}>
          <input type="text" placeholder="Tu nombre" style={styles.input} />
          <input type="email" placeholder="Email" style={styles.input} />
          <input type="tel" placeholder="Teléfono (opcional)" style={styles.input} />
          <select style={styles.input}>
            <option>Quiero comprar</option>
            <option>Quiero alquilar</option>
            <option>Quiero vender</option>
            <option>Acabo de llegar a Madrid</option>
          </select>
          <button style={styles.btn}>Contactar agente</button>
        </div>
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
    cursor: "pointer",
    fontFamily: "inherit",
    width: "100%",
  },
  imageWrap: { borderRadius: "var(--radius-lg)", overflow: "hidden", height: 360 },
  img: { width: "100%", height: "100%", objectFit: "cover" },
};
