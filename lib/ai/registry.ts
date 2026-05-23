// Single source of truth for the components the AI is allowed to emit.
// Both the Zod schema and the system prompt are derived from this list,
// so they can never drift apart.

export const COMPONENT_NAMES = [
  "hero",
  "text_section",
  "image_text",
  "benefits",
  "features",
  "testimonials",
  "faq",
  "cta",
  "form_section",
  "pricing",
] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];

export const HERO_VARIANTS = ["centered", "split", "image-bg"] as const;
export const BACKGROUND_STYLES = ["light", "dark", "gradient"] as const;
export const ALIGNMENTS = ["left", "center", "right"] as const;
export const IMAGE_POSITIONS = ["left", "right"] as const;
export const FORM_TYPES = ["contact", "newsletter", "demo", "waitlist"] as const;
