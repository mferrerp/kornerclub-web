/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AI Prompts & Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the single file to edit when you want to change how Claude behaves
 * inside the Korner Club admin panel.
 *
 * MODEL OPTIONS (Anthropic) — modelos disponibles en tu cuenta Tier 1:
 *   Fast / cheap  →  "claude-haiku-4-5"
 *   Balanced      →  "claude-sonnet-4-5"
 *   Best quality  →  "claude-opus-4-5"
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const AI_CONFIG = {
  /** Default model used for all AI operations */
  model: "claude-haiku-4-5",
  /** Hard cap on output tokens. 4096 handles descriptions up to ~1000 words × 3 languages. */
  maxTokens: 4096,
};

// ─── Language helpers ─────────────────────────────────────────────────────────

const LANG_NAMES: Record<string, string> = {
  es: "Spanish",
  en: "English",
  fr: "French",
  de: "German",
};

// ─── Prompt: AI photo ordering ────────────────────────────────────────────────
//
// Receives an array of Cloudinary photo URLs and returns them sorted by room
// type following Spanish portal best practices (Idealista/Fotocasa data):
// 1. Salón/comedor  2. Cocina  3. Dormitorio principal  4. Baño principal
// 5. Dormitorios adicionales  6. Terraza/balcón/jardín  7. Baños adicionales
// 8. Vestíbulo/entrada  9. Trastero/garaje  10. Fachada/zonas comunes  11. Otros
//
// Uses Claude's vision API — each URL is passed as an image_url source.

export type PhotoOrderResult = {
  index: number;      // original array index
  url: string;
  room: string;       // label in Spanish
  order: number;      // 1-based position in final gallery
};

export function buildPhotoOrderPrompt(urls: string[]): object[] {
  // Build the messages content array: text instruction + one image per photo
  const content: object[] = [
    {
      type: "text",
      text: `\
You are a professional real estate photographer and listing optimizer for the \
Spanish property market (Idealista, Fotocasa, Habitaclia).

Analyze each of the ${urls.length} property photos below and:
1. Identify the room/space shown (in Spanish).
2. Assign it a sort order following these Spanish portal best-practice priorities \
(lower number = earlier in the gallery to maximise CTR and engagement):
   1  → Salón / salón-comedor (ALWAYS first — highest CTR driver)
   2  → Cocina (second most decisive for buyers/renters)
   3  → Dormitorio principal
   4  → Baño principal (reformado o cuidado)
   5  → Dormitorios adicionales (order: 5, 6, 7…)
   6  → Terraza / balcón / jardín (move to position 2-3 if it is a standout feature)
   7  → Baños adicionales / aseo
   8  → Vestíbulo / entrada / pasillo
   9  → Trastero / lavadero / zona de servicio
   10 → Garaje / parking
   11 → Fachada del edificio / portal / zonas comunes
   12 → Vistas desde la propiedad
   99 → Otros / sin identificar

If multiple photos show the same room, keep them together and maintain their \
relative order (e.g. two shots of the salón stay consecutive, first salón shot \
gets order 1.0, second gets 1.1 — encode as decimals internally then convert \
to sequential integers in your output).

Respond ONLY with a valid JSON array — one object per photo, in the FINAL \
sorted order. No markdown, no commentary:
[
  { "originalIndex": 0, "url": "...", "room": "Salón", "sortedPosition": 1 },
  ...
]`,
    },
  ];

  urls.forEach((url, i) => {
    content.push({
      type: "text",
      text: `Photo ${i} (originalIndex: ${i}):`,
    });
    content.push({
      type: "image",
      source: { type: "url", url },
    });
  });

  return content;
}

// ─── Prompt: Natural-language property search ─────────────────────────────────
//
// Called when the user types a free-text query on /comprar or /alquiler.
// Claude interprets the intent and returns structured filter fields.
// context "sale"  → prices in € total; context "rent" → prices in €/month.

export function buildSearchPrompt(query: string, context: "sale" | "rent"): string {
  const ctxLabel = context === "sale" ? "purchase (sale)" : "rental";
  return `\
You are a smart real estate search assistant for Korner Club, a digital real estate \
agency in Madrid, Spain. Interpret the user's natural-language query and extract \
structured search filters from it.

Operation context: ${ctxLabel}

Extract only the fields you can confidently infer. Leave out anything uncertain.

Available fields:
- "type": "apartment" | "house" | "studio" | "penthouse" | "duplex" | "commercial" | "office" | "land" | "garage" | "storage"
- "minPrice": integer (euros${context === "rent" ? "/month" : " total"})
- "maxPrice": integer (euros${context === "rent" ? "/month" : " total"})
- "minRooms": integer (number of bedrooms)
- "condition": "new" | "good" | "renovation"
${context === "rent" ? '- "rentType": "rent_permanent" | "rent_temporary" | "rent_room" | "rent_seasonal"\n' : ""}\
Spanish vocabulary hints: piso/apartamento→apartment, casa/chalet→house, estudio/loft→studio, \
ático→penthouse, dúplex→duplex, obra nueva/nuevo→condition:new, a reformar→condition:renovation, \
temporal/corta estancia→rentType:rent_temporary, vacacional→rentType:rent_seasonal, \
habitación (rental)→rentType:rent_room, barato/económico→low maxPrice, lujo/exclusivo→high minPrice.

User query: "${query}"

Respond ONLY with a valid JSON object. If nothing can be extracted, return {}.
No markdown, no commentary.`;
}

// ─── Prompt: Property description translation ─────────────────────────────────
//
// Called when the agent clicks "Traducir con IA" in the Description tab.
// It receives the source text, the source language code, and an array of
// target language codes, and must return a JSON object keyed by language code.
//
// Feel free to tune the tone, add domain-specific rules, or change the
// output format — just make sure the response is still a valid JSON object
// whose keys match the targetLangs array.

export function buildTranslationPrompt(
  text: string,
  sourceLang: string,
  targetLangs: string[]
): string {
  const sourceName = LANG_NAMES[sourceLang] ?? sourceLang;
  const targetList = targetLangs
    .map((l) => `${LANG_NAMES[l] ?? l} (key: "${l}")`)
    .join(", ");

  return `\
You are an expert real estate copywriter and professional translator \
specialising in the Madrid residential property market.

Your task is to translate the property description below from ${sourceName} \
into the following languages: ${targetList}.

Rules:
- Write naturally and professionally in each target language.
- Use real estate terminology appropriate for each market (e.g. "piso" in \
Spanish, "appartement" in French, "Wohnung" in German, "flat/apartment" in \
British English).
- Preserve the original tone, length, and level of detail exactly — do not \
add, remove or embellish any information.
- Do not translate proper nouns (street names, neighbourhood names, brand names).
- If the original contains formatting (line breaks, bullet points) replicate it.

Source text (${sourceName}):
"""
${text}
"""

Respond ONLY with a valid JSON object — no markdown fences, no commentary, \
no trailing commas. Use this exact structure:
{
${targetLangs.map((l) => `  "${l}": "<translation in ${LANG_NAMES[l] ?? l}>"`).join(",\n")}
}`;
}
