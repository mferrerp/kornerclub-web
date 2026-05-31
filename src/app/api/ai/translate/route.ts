import { NextRequest, NextResponse } from "next/server";
import { buildTranslationPrompt, AI_CONFIG } from "@/lib/ai-prompts";

export async function POST(request: NextRequest) {
  // ── Validate input ──────────────────────────────────────────────────────────
  const body = await request.json().catch(() => null);
  const { text, sourceLang, targetLangs } = body ?? {};

  if (!text?.trim() || !sourceLang || !Array.isArray(targetLangs) || !targetLangs.length) {
    return NextResponse.json(
      { error: "Se requieren text, sourceLang y targetLangs." },
      { status: 400 }
    );
  }

  // ── Check API key ───────────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY no está configurada en las variables de entorno del servidor." },
      { status: 500 }
    );
  }

  // ── Build prompt & call Anthropic ───────────────────────────────────────────
  const prompt = buildTranslationPrompt(text, sourceLang, targetLangs);

  let anthropicRes: Response;
  try {
    anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        max_tokens: AI_CONFIG.maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch (networkErr) {
    return NextResponse.json(
      { error: "No se pudo conectar con la API de Anthropic." },
      { status: 502 }
    );
  }

  if (!anthropicRes.ok) {
    const errText = await anthropicRes.text().catch(() => "");
    return NextResponse.json(
      { error: `Anthropic devolvió un error ${anthropicRes.status}: ${errText}` },
      { status: anthropicRes.status }
    );
  }

  // ── Parse response ──────────────────────────────────────────────────────────
  const data = await anthropicRes.json();
  const rawContent: string = data.content?.[0]?.text ?? "";

  // Detect truncation before trying to parse
  if (data.stop_reason === "max_tokens") {
    return NextResponse.json(
      { error: "La respuesta fue cortada por ser demasiado larga. Reduce el texto de origen o divide la traducción en partes más cortas." },
      { status: 500 }
    );
  }

  // Extract the JSON object — find from the first { to the last }
  // This is robust regardless of markdown fences or preamble text Claude adds.
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

  let translations: Record<string, string>;
  try {
    if (!jsonMatch) throw new Error("No JSON object found in response");
    translations = JSON.parse(jsonMatch[0]);
  } catch {
    console.error("[ai/translate] Failed to parse Claude response:\n", rawContent);
    return NextResponse.json(
      { error: `No se pudo interpretar la respuesta de Claude. Respuesta cruda: ${rawContent.slice(0, 300)}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ translations });
}
