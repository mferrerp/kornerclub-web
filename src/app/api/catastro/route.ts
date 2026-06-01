import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy to the Sede Electrónica del Catastro free public web service.
 * GET /api/catastro?rc={referencia_catastral}
 */

function xmlText(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? m[1].trim() || null : null;
}

// Try multiple URL strategies in order
function buildUrls(refCat: string): string[] {
  const base = "http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/Consulta_DNPRC";
  return [
    // Strategy 1: RefCat only (no empty params)
    `${base}?RefCat=${encodeURIComponent(refCat)}`,
    // Strategy 2: empty Provincia + Municipio
    `${base}?Provincia=&Municipio=&RefCat=${encodeURIComponent(refCat)}`,
    // Strategy 3: HTTPS variant with empty params
    `${base.replace("http://", "https://")}?Provincia=&Municipio=&RefCat=${encodeURIComponent(refCat)}`,
  ];
}

export async function GET(request: NextRequest) {
  const rc = request.nextUrl.searchParams.get("rc")?.trim();

  if (!rc) {
    return NextResponse.json({ error: "Parámetro rc requerido." }, { status: 400 });
  }

  const refCat = rc.replace(/[\s\-]/g, "").toUpperCase();

  if (refCat.length < 14) {
    return NextResponse.json(
      { error: "La referencia catastral debe tener al menos 14 caracteres." },
      { status: 400 }
    );
  }

  const urls = buildUrls(refCat);
  let lastStatus = 0;
  let lastBody = "";

  for (const url of urls) {
    let res: Response;
    try {
      res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; KornerClub/1.0)",
          "Accept": "text/xml, application/xml, */*",
        },
        signal: AbortSignal.timeout(12_000),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "timeout";
      lastBody = `fetch error: ${message}`;
      continue; // try next URL
    }

    const body = await res.text();
    lastStatus = res.status;
    lastBody = body;

    if (!res.ok) continue; // try next URL

    // ── Successful response — parse XML ──────────────────────────────────────

    // Application-level error codes embedded in XML
    const cod = xmlText(body, "cod");
    if (cod && cod !== "0") {
      const msg =
        xmlText(body, "des") ??
        xmlText(body, "err") ??
        "Referencia catastral no encontrada.";
      return NextResponse.json({ error: msg }, { status: 404 });
    }

    const sfc  = xmlText(body, "sfc");
    const ant  = xmlText(body, "ant");
    const luso = xmlText(body, "luso");
    const ldt  = xmlText(body, "ldt");
    const dp   = xmlText(body, "dp");
    const dm   = xmlText(body, "dm");

    if (!sfc && !ant) {
      return NextResponse.json(
        {
          error:
            "El Catastro no devolvió datos para esta referencia. " +
            "Verifica que sea correcta y que la propiedad esté en territorio " +
            "de régimen común (no cubre País Vasco ni Navarra).",
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

  // All strategies failed — return diagnostic info
  const bodySnippet = lastBody.slice(0, 400).replace(/\s+/g, " ");
  return NextResponse.json(
    {
      error:
        `El Catastro devolvió HTTP ${lastStatus} en todos los intentos. ` +
        `Respuesta: ${bodySnippet || "(vacía)"}`,
    },
    { status: 502 }
  );
}
