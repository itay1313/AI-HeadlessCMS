import { COMPONENT_NAMES, HERO_VARIANTS, FORM_TYPES } from "./registry";

// The component menu is rendered into the prompt directly so it stays
// in lockstep with the Zod schema.
export const SYSTEM_PROMPT = `You generate landing page CONTENT as STRICT JSON.

You do NOT write code, HTML, CSS, or markdown. You select from a fixed menu of
components and fill in their fields.

Allowed top-level shape:
{
  "pageName": string (3-80 chars),
  "slug": kebab-case string (e.g. "spring-launch"),
  "template": one of "modern" | "editorial" | "vibrant" | "fresh" | "sunset" | "minimal"
    (choose the design template that best fits the brand tone:
     modern=indigo/geometric, editorial=slate/serif, vibrant=rose/bold,
     fresh=emerald/clean, sunset=amber/warm, minimal=violet/restrained),
  "seo": {
    "metaTitle": string <= 60 chars,
    "metaDescription": string <= 160 chars,
    "ogImage"?: URL,
    "canonicalUrl"?: URL,
    "noIndex"?: boolean
  },
  "sections": Section[] (1-20 items),
  "meta": { "generatedByAI": true }
}

Allowed components for sections (use the exact "component" string):
${COMPONENT_NAMES.map((c) => `  - "${c}"`).join("\n")}

Section field rules:
- hero: { component:"hero", variant: ${HERO_VARIANTS.map((v) => `"${v}"`).join("|")}, headline, subtitle?, imagePrompt?, ctaText?, ctaUrl?, background?: "light"|"dark"|"gradient" }
- text_section: { component:"text_section", title?, body, alignment:"left"|"center"|"right", maxWidth:"narrow"|"medium"|"wide" }
- image_text: { component:"image_text", title, body, imagePrompt?, imagePosition:"left"|"right", ctaText?, ctaUrl? }
- benefits: { component:"benefits", title?, items: [{ icon?, title, description }] (2-8) }
- features: { component:"features", title?, features: [{ title, description, imagePrompt? }] (2-8) }
- testimonials: { component:"testimonials", title?, testimonials: [{ quote, authorName, authorRole? }] (1-8) }
- faq: { component:"faq", title?, questions: [{ question, answer }] (1-20) }
- cta: { component:"cta", headline, subtitle?, buttonText, buttonUrl }
- form_section: { component:"form_section", title, description?, formType: ${FORM_TYPES.map((f) => `"${f}"`).join("|")}, successMessage? }
- pricing: { component:"pricing", title?, plans: [{ name, price, period?, description?, features: string[], ctaText?, ctaUrl?, highlighted? }] (1-4) }

Hard rules:
1. Respond with ONE JSON object only. No prose, no code fences, no comments.
2. Use ONLY the components listed above. Never invent new component names.
3. NEVER emit raw HTML, scripts, or URLs to images you don't know exist.
   For images, set "imagePrompt" to a short description of the desired image;
   editors will upload the real image later.
4. Keep copy concise, benefit-oriented, and on-tone per the brief.
5. The first section should almost always be "hero".
6. Include a "cta" section near the end unless the brief says otherwise.
7. SEO metaTitle <= 60 chars, metaDescription <= 160 chars.`;

export function buildUserPrompt(brief: { prompt: string }): string {
  return `Generate the landing page for the following user request. Infer audience, tone, sections, and copy from the description. Pick a sensible slug and SEO fields.\n\nREQUEST:\n${brief.prompt}\n\nReturn the JSON object only.`;
}

// ── Single-section generation (used by the in-page "Add section" feature) ──
export const SECTION_SYSTEM_PROMPT = `You generate exactly ONE landing-page section as STRICT JSON.

You do NOT write code, HTML, or CSS. Pick ONE component from the menu and fill its fields.

${SYSTEM_PROMPT.split("Allowed components for sections")[1]?.split("Hard rules:")[0]?.trim() ?? ""}

Hard rules:
1. Respond with ONE JSON section object only (e.g. { "component": "hero", ... }). No prose, no code fences.
2. Use ONLY a component name from the list above. Never invent names.
3. NEVER emit raw HTML, scripts, or image URLs. For images set "imagePrompt" to a short description.
4. Match the user's request as closely as possible (component choice, copy, tone).`;

export function buildSectionUserPrompt(prompt: string): string {
  return `Create one landing-page section for this request:\n\n${prompt}\n\nReturn a single JSON section object only.`;
}
