import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy to the Sede Electrónica del Catastro free public web service.
 * Uses the SOAP interface which is more reliable than the HTTP GET variant.
 *
 * Catastro rate limit: 3 600 req / hour / IP.
 * No API key required. Excludes País Vasco and Navarre.
 *
 * Fields returned:
 *   sfc  → superficie construida (m²)
 *   ant  → año de construcción
 *   luso → tipo de uso (e.g. "Residencial")
 *   ldt  → dirección literal completa
 *   dp   → código postal
 *   dm   → municipio
 */

// The Catastro service runs on HTTP only — HTTPS causes 500s (legacy infra)
const CATASTRO_BASE =
  "http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx";

/** Extract a single XML element's text content (case-insensitive tag). */
function xmlText(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? m[1].trim() || null : null;
}

export async function GET(request: NextRequest) {
  const rc = request.nextUrl.searchParams.get("rc")?.trim();

  if (!rc) {
    return NextResponse.json({ error: "Parámetro rc requerido." }, { status: 400 });
  }

  // Clean the reference — remove spaces and hyphens
  const refCat = rc.replace(/[\s\-]/g, "").toUpperCase();

  if (refCat.length < 14) {
    return NextResponse.json(
      { error: "La referencia catastral debe tener al menos 14 caracteres." },
      { status: 400 }
    );
  }

  const url =
    `${CATASTRO_BASE}/Consulta_DNPRC` +
    `?Provincia=&Municipio=&RefCat=${encodeURIComponent(refCat)}`;

  let catastroRes: Response;
  try {
    catastroRes = await fetch(url, {
      method: "GET",
      headers: {
        // Mimic a browser — some servers block requests without a User-Agent
        "User-Agent": "Mozilla/5.0 (compatible; KornerClub/1.0)",
        "Accept": "text/xml, application/xml",
      },
      signal: AbortSignal.timeout(12_000),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "timeout";
    return NextResponse.json(
      { error: `No se pudo conectar con el Catastro: ${message}` },
      { status: 502 }
    );
  }

  if (!catastroRes.ok) {
    const body = await catastroRes.text().catch(() => "");
    const detail = xmlText(body, "faultstring") ?? xmlText(body, "Message") ?? "";
    return NextResponse.json(
      { error: `El Catastro devolvió HTTP ${catastroRes.status}${detail ? `: ${detail}` : ""}.` },
      { status: 502 }
    );
  }

  const xml = await catastroRes.text();

  // Check for application-level errors embedded in the XML response
  const cod = xmlText(xml, "cod");
  if (cod && cod !== "0") {
    const msg =
      xmlText(xml, "des") ??
      xmlText(xml, "err") ??
      "Referencia catastral no encontrada o no disponible.";
    return NextResponse.json({ error: msg }, { status: 404 });
  }

  // Extract the fields we care about
  const sfc  = xmlText(xml, "sfc");   // superficie construida (m²)
  const ant  = xmlText(xml, "ant");   // año construcción
  const luso = xmlText(xml, "luso");  // tipo de uso
  const ldt  = xmlText(xml, "ldt");   // dirección literal
  const dp   = xmlText(xml, "dp");    // código postal
  const dm   = xmlText(xml, "dm");    // municipio

  if (!sfc && !ant) {
    return NextResponse.json(
      {
        error:
          "El Catastro no devolvió datos para esta referencia. " +
          "Verifica que sea correcta y que la propiedad esté en territorio de régimen común " +
          "(el servicio no cubre País Vasco ni Navarra).",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    refCat,
    sizem2:           sfc ? parseFloat(sfc) : null,
    constructionYear: ant ? parseInt(ant)   : null,
    use:              luso ?? null,
    address:          ldt  ?? null,
    postalCode:       dp   ?? null,
    city:             dm   ?? null,
  });
}
