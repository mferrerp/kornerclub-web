import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy to the Sede Electrónica del Catastro free public web service.
 * Calls Consulta_DNPRC with the given referencia catastral and returns
 * a clean JSON subset of non-protected data.
 *
 * Catastro rate limit: 3 600 req / hour / IP.
 * No API key required. Service excludes País Vasco and Navarre.
 *
 * Fields returned:
 *   sfc  → superficie construida (m²)
 *   ant  → año de construcción
 *   luso → tipo de uso (e.g. "Residencial")
 *   ldt  → dirección literal completa
 *   dp   → código postal
 *   dm   → municipio
 */

const CATASTRO_URL =
  "https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/Consulta_DNPRC";

/** Extract a single XML element's text content, case-insensitive tag. */
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
  const refCat = rc.replace(/[\s-]/g, "").toUpperCase();

  if (refCat.length < 14) {
    return NextResponse.json(
      { error: "La referencia catastral debe tener al menos 14 caracteres." },
      { status: 400 }
    );
  }

  let catastroRes: Response;
  try {
    const url = `${CATASTRO_URL}?Provincia=&Municipio=&RefCat=${encodeURIComponent(refCat)}`;
    catastroRes = await fetch(url, {
      headers: { Accept: "text/xml,application/xml" },
      // 10 second timeout — catastro can be slow
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "timeout";
    return NextResponse.json(
      { error: `No se pudo conectar con el Catastro: ${message}` },
      { status: 502 }
    );
  }

  if (!catastroRes.ok) {
    return NextResponse.json(
      { error: `El Catastro devolvió un error HTTP ${catastroRes.status}.` },
      { status: 502 }
    );
  }

  const xml = await catastroRes.text();

  // Check for Catastro-level errors embedded in the XML
  const lerr = xmlText(xml, "lerr");
  const cod  = xmlText(xml, "cod");
  if (lerr || (cod && cod !== "0")) {
    const msg = xmlText(xml, "des") ?? xmlText(xml, "err") ?? "Referencia catastral no encontrada.";
    return NextResponse.json({ error: msg }, { status: 404 });
  }

  // Extract fields we care about
  const sfc  = xmlText(xml, "sfc");   // superficie construida
  const ant  = xmlText(xml, "ant");   // año construcción
  const luso = xmlText(xml, "luso");  // tipo de uso
  const ldt  = xmlText(xml, "ldt");   // dirección literal
  const dp   = xmlText(xml, "dp");    // código postal
  const dm   = xmlText(xml, "dm");    // municipio

  // Validate we got at least something meaningful
  if (!sfc && !ant) {
    return NextResponse.json(
      { error: "El Catastro no devolvió datos para esta referencia. Comprueba que sea correcta y que la propiedad esté en territorio de régimen común (no País Vasco ni Navarra)." },
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
