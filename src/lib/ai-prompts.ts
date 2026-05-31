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
