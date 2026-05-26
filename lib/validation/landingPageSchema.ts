import { z } from "zod";
import {
  HERO_VARIANTS,
  BACKGROUND_STYLES,
  ALIGNMENTS,
  IMAGE_POSITIONS,
  FORM_TYPES,
} from "@/lib/ai/registry";
import { TEMPLATE_NAMES } from "@/lib/theme";

const slug = z
  .string()
  .min(3)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be kebab-case");

export const seoSchema = z.object({
  metaTitle: z.string().min(1).max(60),
  metaDescription: z.string().min(1).max(160),
  ogImage: z.string().url().optional(),
  canonicalUrl: z.string().url().optional(),
  noIndex: z.boolean().optional(),
});

const ctaFields = z.object({
  ctaText: z.string().max(40).optional(),
  ctaUrl: z.string().max(500).optional(),
});

export const heroSchema = z
  .object({
    component: z.literal("hero"),
    variant: z.enum(HERO_VARIANTS).default("centered"),
    headline: z.string().min(1).max(80),
    subtitle: z.string().max(200).optional(),
    imagePrompt: z.string().max(300).optional(),
    background: z.enum(BACKGROUND_STYLES).optional(),
  })
  .merge(ctaFields);

export const textSectionSchema = z.object({
  component: z.literal("text_section"),
  title: z.string().max(120).optional(),
  body: z.string().min(1).max(2000),
  alignment: z.enum(ALIGNMENTS).default("left"),
  maxWidth: z.enum(["narrow", "medium", "wide"]).default("medium"),
});

export const imageTextSchema = z
  .object({
    component: z.literal("image_text"),
    title: z.string().max(120),
    body: z.string().min(1).max(1500),
    imagePrompt: z.string().max(300).optional(),
    imagePosition: z.enum(IMAGE_POSITIONS).default("left"),
  })
  .merge(ctaFields);

export const benefitsSchema = z.object({
  component: z.literal("benefits"),
  title: z.string().max(120).optional(),
  items: z
    .array(
      z.object({
        icon: z.string().max(40).optional(),
        title: z.string().min(1).max(80),
        description: z.string().max(280),
      }),
    )
    .min(2)
    .max(8),
});

export const featuresSchema = z.object({
  component: z.literal("features"),
  title: z.string().max(120).optional(),
  features: z
    .array(
      z.object({
        title: z.string().min(1).max(80),
        description: z.string().max(280),
        imagePrompt: z.string().max(300).optional(),
      }),
    )
    .min(2)
    .max(8),
});

export const testimonialsSchema = z.object({
  component: z.literal("testimonials"),
  title: z.string().max(120).optional(),
  testimonials: z
    .array(
      z.object({
        quote: z.string().min(1).max(400),
        authorName: z.string().min(1).max(80),
        authorRole: z.string().max(80).optional(),
      }),
    )
    .min(1)
    .max(8),
});

export const faqSchema = z.object({
  component: z.literal("faq"),
  title: z.string().max(120).optional(),
  questions: z
    .array(
      z.object({
        question: z.string().min(1).max(200),
        answer: z.string().min(1).max(800),
      }),
    )
    .min(1)
    .max(20),
});

export const ctaSchema = z.object({
  component: z.literal("cta"),
  headline: z.string().min(1).max(80),
  subtitle: z.string().max(200).optional(),
  buttonText: z.string().min(1).max(40),
  buttonUrl: z.string().min(1).max(500),
});

export const formSchema = z.object({
  component: z.literal("form_section"),
  title: z.string().max(120),
  description: z.string().max(400).optional(),
  formType: z.enum(FORM_TYPES),
  successMessage: z.string().max(200).optional(),
});

export const pricingSchema = z.object({
  component: z.literal("pricing"),
  title: z.string().max(120).optional(),
  plans: z
    .array(
      z.object({
        name: z.string().min(1).max(40),
        price: z.string().min(1).max(40),
        period: z.string().max(20).optional(),
        description: z.string().max(200).optional(),
        features: z.array(z.string().max(120)).min(1).max(12),
        ctaText: z.string().max(40).optional(),
        ctaUrl: z.string().max(500).optional(),
        highlighted: z.boolean().optional(),
      }),
    )
    .min(1)
    .max(4),
});

export const sectionSchema = z.discriminatedUnion("component", [
  heroSchema,
  textSectionSchema,
  imageTextSchema,
  benefitsSchema,
  featuresSchema,
  testimonialsSchema,
  faqSchema,
  ctaSchema,
  formSchema,
  pricingSchema,
]);

export const landingPageDraftSchema = z.object({
  pageName: z.string().min(3).max(80),
  slug,
  // AI-chosen design template (accent + font + style). Same content, different look.
  template: z.enum(TEMPLATE_NAMES).default("modern"),
  seo: seoSchema,
  sections: z.array(sectionSchema).min(1).max(20),
  meta: z
    .object({
      generatedByAI: z.literal(true).default(true),
      model: z.string().optional(),
      brief: z.unknown().optional(),
    })
    .default({ generatedByAI: true }),
});

export type LandingPageDraft = z.infer<typeof landingPageDraftSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type SeoFields = z.infer<typeof seoSchema>;

export const briefSchema = z.object({
  prompt: z.string().min(10).max(2000),
});

export type Brief = z.infer<typeof briefSchema>;
