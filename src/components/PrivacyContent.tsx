"use client";

/** Shared privacy policy body — used in both the standalone page and the modal. */
export function PrivacyContent() {
  return (
    <div style={s.body}>
      <Section title="1. Responsable del tratamiento">
        <p>
          <strong>Korner Ventures, S.L.</strong><br />
          Actividad: Agencia inmobiliaria digital<br />
          Domicilio: Madrid, España<br />
          Correo electrónico de contacto:{" "}
          <a href="mailto:privacidad@kornerclub.es" style={s.link}>
            privacidad@kornerclub.es
          </a>
        </p>
      </Section>

      <Section title="2. Datos personales que recogemos">
        <p>Recogemos únicamente los datos que usted nos facilita voluntariamente a través del formulario de contacto:</p>
        <ul>
          <li><strong>Nombre completo</strong></li>
          <li><strong>Dirección de correo electrónico</strong></li>
          <li><strong>Número de teléfono</strong> (opcional)</li>
          <li><strong>Motivo de la consulta</strong> (compra, alquiler, venta, etc.)</li>
        </ul>
        <p>
          No recogemos datos especialmente protegidos (salud, origen étnico, creencias, etc.)
          ni datos de menores de 14 años.
        </p>
      </Section>

      <Section title="3. Finalidades y base jurídica">
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Finalidad</th>
              <th style={s.th}>Base jurídica</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={s.td}>Atender su solicitud de información o asesoramiento inmobiliario</td>
              <td style={s.td}>Ejecución de medidas precontractuales a petición del interesado (art. 6.1.b RGPD)</td>
            </tr>
            <tr>
              <td style={s.td}>Envío de comunicaciones comerciales sobre propiedades o servicios similares</td>
              <td style={s.td}>Interés legítimo (art. 6.1.f RGPD) y art. 21.2 LSSI para clientes existentes</td>
            </tr>
            <tr>
              <td style={s.td}>Cumplimiento de obligaciones legales (fiscales, contables)</td>
              <td style={s.td}>Obligación legal (art. 6.1.c RGPD)</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="4. Plazo de conservación">
        <p>
          Sus datos se conservarán durante el tiempo necesario para atender su consulta y,
          una vez finalizada la relación, durante los plazos legalmente exigidos:
        </p>
        <ul>
          <li>Datos de contacto: <strong>3 años</strong> desde el último contacto, salvo oposición.</li>
          <li>Datos con relevancia fiscal o contractual: <strong>5 años</strong> (Ley General Tributaria).</li>
        </ul>
      </Section>

      <Section title="5. Destinatarios">
        <p>
          Sus datos no se ceden a terceros salvo obligación legal. Utilizamos los siguientes
          encargados de tratamiento, con los que hemos suscrito los correspondientes contratos
          de encargo (art. 28 RGPD):
        </p>
        <ul>
          <li><strong>Supabase Inc.</strong> — alojamiento de base de datos (EE.UU.; transferencia amparada en Cláusulas Contractuales Tipo)</li>
          <li><strong>Resend Inc.</strong> — envío de correos electrónicos transaccionales</li>
          <li><strong>Cloudinary Inc.</strong> — almacenamiento y servicio de imágenes</li>
          <li><strong>Vercel Inc.</strong> — alojamiento de la aplicación web</li>
        </ul>
      </Section>

      <Section title="6. Transferencias internacionales">
        <p>
          Algunos de nuestros proveedores están ubicados fuera del Espacio Económico Europeo (EEE).
          Dichas transferencias se realizan con las salvaguardas apropiadas: Cláusulas Contractuales
          Tipo adoptadas por la Comisión Europea o decisión de adecuación, conforme al art. 46 RGPD.
        </p>
      </Section>

      <Section title="7. Sus derechos">
        <p>
          En cualquier momento puede ejercer los siguientes derechos enviando un correo a{" "}
          <a href="mailto:privacidad@kornerclub.es" style={s.link}>privacidad@kornerclub.es</a>{" "}
          con copia de su documento de identidad:
        </p>
        <ul>
          <li><strong>Acceso:</strong> conocer qué datos tratamos sobre usted.</li>
          <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
          <li><strong>Supresión:</strong> solicitar que eliminemos sus datos ("derecho al olvido").</li>
          <li><strong>Oposición:</strong> oponerse al tratamiento basado en interés legítimo.</li>
          <li><strong>Limitación:</strong> solicitar que restrinjamos el tratamiento en determinadas circunstancias.</li>
          <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado y legible por máquina.</li>
          <li><strong>Retirada del consentimiento:</strong> cuando el tratamiento esté basado en su consentimiento, puede retirarlo en cualquier momento sin que ello afecte a la licitud del tratamiento previo.</li>
        </ul>
        <p>
          Si considera que el tratamiento no se ajusta a la normativa, puede presentar
          una reclamación ante la{" "}
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style={s.link}>
            Agencia Española de Protección de Datos (AEPD)
          </a>.
        </p>
      </Section>

      <Section title="8. Cookies">
        <p>
          Este sitio web utiliza cookies técnicas estrictamente necesarias para su funcionamiento.
          No utilizamos cookies de seguimiento publicitario ni compartimos datos de navegación
          con terceros con fines publicitarios. Para más información consulte nuestra{" "}
          <a href="/cookies" style={s.link}>Política de Cookies</a>.
        </p>
      </Section>

      <Section title="9. Seguridad">
        <p>
          Aplicamos medidas técnicas y organizativas adecuadas para proteger sus datos personales
          frente a accesos no autorizados, pérdida, alteración o divulgación, de conformidad con
          el art. 32 RGPD. Toda la comunicación con nuestra plataforma se realiza mediante
          cifrado TLS/HTTPS.
        </p>
      </Section>

      <Section title="10. Modificaciones">
        <p>
          Podemos actualizar esta política para adaptarla a cambios legales o de nuestros servicios.
          Le notificaremos los cambios relevantes. La fecha de última actualización figura al inicio
          de este documento.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={s.section}>
      <h2 style={s.h2}>{title}</h2>
      {children}
    </section>
  );
}

const s: { [k: string]: React.CSSProperties } = {
  body: {
    fontSize: 14,
    lineHeight: 1.75,
    color: "var(--text)",
  },
  section: {
    marginBottom: 36,
  },
  h2: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "var(--font-playfair), serif",
    color: "var(--black)",
    margin: "0 0 10px",
    paddingBottom: 8,
    borderBottom: "1px solid var(--border)",
  },
  link: {
    color: "var(--gold-dark)",
    textDecoration: "underline",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 13,
  },
  th: {
    background: "var(--off-white)",
    padding: "8px 12px",
    textAlign: "left" as const,
    fontWeight: 600,
    border: "1px solid var(--border)",
    color: "var(--black)",
  },
  td: {
    padding: "8px 12px",
    border: "1px solid var(--border)",
    verticalAlign: "top" as const,
  },
};
