import type { CSSProperties } from "react";

// AI-selectable design templates. The AI never writes CSS/code — it only
// picks ONE template name. Each template maps to themeable CSS variables
// (accent color + display font) that the existing components read, so the
// same content + Storyblok sync produces visually distinct pages.

export const TEMPLATE_NAMES = [
  "modern",
  "editorial",
  "vibrant",
  "fresh",
  "sunset",
  "minimal",
] as const;

export type TemplateName = (typeof TEMPLATE_NAMES)[number];

// RGB triplets (space-separated) so Tailwind's `rgb(var(--x) / <alpha>)`
// alpha syntax works (e.g. bg-brand/40).
const ACCENTS = {
  indigo: { base: "99 102 241", dark: "67 56 202", light: "165 180 252" },
  slate: { base: "51 65 85", dark: "15 23 42", light: "148 163 184" },
  rose: { base: "244 63 94", dark: "190 18 60", light: "253 164 175" },
  emerald: { base: "16 185 129", dark: "4 120 87", light: "110 231 183" },
  amber: { base: "217 119 6", dark: "146 64 14", light: "252 211 77" },
  violet: { base: "139 92 246", dark: "109 40 217", light: "196 181 253" },
} as const;

const FONTS = {
  grotesk: "var(--font-grotesk)",
  serif: "var(--font-serif)",
  sora: "var(--font-sora)",
  sans: "var(--font-sans)",
} as const;

export const TEMPLATES: Record<
  TemplateName,
  { accent: keyof typeof ACCENTS; font: keyof typeof FONTS; label: string; blurb: string }
> = {
  modern: { accent: "indigo", font: "grotesk", label: "Modern", blurb: "Indigo · geometric" },
  editorial: { accent: "slate", font: "serif", label: "Editorial", blurb: "Slate · serif" },
  vibrant: { accent: "rose", font: "sora", label: "Vibrant", blurb: "Rose · bold" },
  fresh: { accent: "emerald", font: "sora", label: "Fresh", blurb: "Emerald · clean" },
  sunset: { accent: "amber", font: "grotesk", label: "Sunset", blurb: "Amber · warm" },
  minimal: { accent: "violet", font: "sans", label: "Minimal", blurb: "Violet · restrained" },
};

export function resolveTemplate(name?: string | null): TemplateName {
  return (TEMPLATE_NAMES as readonly string[]).includes(name ?? "")
    ? (name as TemplateName)
    : "modern";
}

// Inline CSS variables to spread on a page wrapper. Overrides the global
// brand color + display font for everything inside.
export function templateStyle(name?: string | null): CSSProperties {
  const t = TEMPLATES[resolveTemplate(name)];
  const a = ACCENTS[t.accent];
  return {
    "--brand-rgb": a.base,
    "--brand-dark-rgb": a.dark,
    "--brand-light-rgb": a.light,
    "--font-display": FONTS[t.font],
  } as CSSProperties;
}

// Deterministic pick from a string (used by the mock generator so different
// prompts yield different templates without AI credits).
export function templateFromString(s: string): TemplateName {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return TEMPLATE_NAMES[Math.abs(h) % TEMPLATE_NAMES.length];
}
