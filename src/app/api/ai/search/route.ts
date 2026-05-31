import { NextRequest, NextResponse } from "next/server";
import { buildSearchPrompt, AI_CONFIG } from "@/lib/ai-prompts";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { query, context } = body ?? {};

  if (!query?.trim() || !["sale", "rent"].includes(context)) {
    return NextResponse.json(
      { error: "Se requieren query y context (sale | rent)." },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY no está configurada." },
      { status: 500 }
    );
  }

  const prompt = buildSearchPrompt(query, context as "sale" | "rent");

  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        max_tokens: 256,
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con la API de Anthropic." },
      { status: 502 }
    );
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return NextResponse.json(
      { error: `Anthropic error ${res.status}: ${errText}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  const raw: string = data.content?.[0]?.text ?? "";

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  let filters: Record<string, unknown>;
  try {
    if (!jsonMatch) throw new Error("No JSON found");
    filters = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json({ filters: {} });
  }

  return NextResponse.json({ filters });
}
