import { NextRequest, NextResponse } from "next/server";
import { buildPhotoOrderPrompt, AI_CONFIG } from "@/lib/ai-prompts";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { urls } = body ?? {};

  if (!Array.isArray(urls) || urls.length < 2) {
    return NextResponse.json(
      { error: "Se requiere un array de al menos 2 URLs de fotos." },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY no configurada." }, { status: 500 });
  }

  const content = buildPhotoOrderPrompt(urls);

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
        model: "claude-sonnet-4-5",   // vision requires at least Sonnet
        max_tokens: 2048,
        messages: [{ role: "user", content }],
      }),
    });
  } catch {
    return NextResponse.json({ error: "No se pudo conectar con Anthropic." }, { status: 502 });
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return NextResponse.json({ error: `Anthropic error ${res.status}: ${errText}` }, { status: res.status });
  }

  const data = await res.json();
  const raw: string = data.content?.[0]?.text ?? "";

  // Extract JSON array from response
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  let ordered: { originalIndex: number; url: string; room: string; sortedPosition: number }[];
  try {
    if (!jsonMatch) throw new Error("No JSON array found");
    ordered = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json(
      { error: `No se pudo interpretar la respuesta de Claude: ${raw.slice(0, 200)}` },
      { status: 500 }
    );
  }

  // Sort by sortedPosition and return the ordered URL array + room labels
  ordered.sort((a, b) => a.sortedPosition - b.sortedPosition);
  const orderedUrls = ordered.map((o) => o.url);
  const rooms = ordered.map((o) => o.room);

  return NextResponse.json({ orderedUrls, rooms });
}
