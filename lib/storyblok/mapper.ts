import { nanoid } from "nanoid";
import type { LandingPageDraft, Section } from "@/lib/validation/landingPageSchema";

// Pure mapping: AI draft -> Storyblok story content payload.
// The mapper is the only place that knows the Storyblok blok shape.

const uid = () => nanoid(10);

// Placeholder used when AI emits an imagePrompt but no real asset exists yet.
// Editors swap this in Storyblok. We keep the prompt in `title` for context.
const placeholderAsset = (prompt?: string) =>
  prompt
    ? { filename: "", alt: "", title: `AI prompt: ${prompt}` }
    : { filename: "", alt: "" };

function mapSection(s: Section): Record<string, unknown> {
  const base = { _uid: uid(), component: s.component };
  switch (s.component) {
    case "hero":
      return {
        ...base,
        variant: s.variant,
        headline: s.headline,
        subtitle: s.subtitle ?? "",
        image: placeholderAsset(s.imagePrompt),
        cta_text: s.ctaText ?? "",
        cta_url: s.ctaUrl ?? "",
        background: s.background ?? "light",
      };
    case "text_section":
      return {
        ...base,
        title: s.title ?? "",
        body: s.body,
        alignment: s.alignment,
        max_width: s.maxWidth,
      };
    case "image_text":
      return {
        ...base,
        title: s.title,
        body: s.body,
        image: placeholderAsset(s.imagePrompt),
        image_position: s.imagePosition,
        cta_text: s.ctaText ?? "",
        cta_url: s.ctaUrl ?? "",
      };
    case "benefits":
      return {
        ...base,
        title: s.title ?? "",
        items: s.items.map((i) => ({
          _uid: uid(),
          component: "benefit_item",
          icon: i.icon ?? "",
          title: i.title,
          description: i.description,
        })),
      };
    case "features":
      return {
        ...base,
        title: s.title ?? "",
        features: s.features.map((f) => ({
          _uid: uid(),
          component: "feature_card",
          title: f.title,
          description: f.description,
          image: placeholderAsset(f.imagePrompt),
        })),
      };
    case "testimonials":
      return {
        ...base,
        title: s.title ?? "",
        testimonials: s.testimonials.map((t) => ({
          _uid: uid(),
          component: "testimonial_item",
          quote: t.quote,
          author_name: t.authorName,
          author_role: t.authorRole ?? "",
        })),
      };
    case "faq":
      return {
        ...base,
        title: s.title ?? "",
        questions: s.questions.map((q) => ({
          _uid: uid(),
          component: "faq_item",
          question: q.question,
          answer: q.answer,
        })),
      };
    case "cta":
      return {
        ...base,
        headline: s.headline,
        subtitle: s.subtitle ?? "",
        button_text: s.buttonText,
        button_url: s.buttonUrl,
      };
    case "form_section":
      return {
        ...base,
        title: s.title,
        description: s.description ?? "",
        form_type: s.formType,
        success_message: s.successMessage ?? "Thanks — we'll be in touch.",
      };
    case "pricing":
      return {
        ...base,
        title: s.title ?? "",
        plans: s.plans.map((p) => ({
          _uid: uid(),
          component: "pricing_plan",
          name: p.name,
          price: p.price,
          period: p.period ?? "",
          description: p.description ?? "",
          features: p.features.map((f) => ({
            _uid: uid(),
            component: "pricing_feature",
            label: f,
          })),
          cta_text: p.ctaText ?? "",
          cta_url: p.ctaUrl ?? "",
          highlighted: p.highlighted ?? false,
        })),
      };
  }
}

export function mapDraftToStoryContent(
  draft: LandingPageDraft,
  opts: { createdBy?: string } = {},
): Record<string, unknown> {
  return {
    _uid: uid(),
    component: "landing_page",
    seo: [
      {
        _uid: uid(),
        component: "seo",
        meta_title: draft.seo.metaTitle,
        meta_description: draft.seo.metaDescription,
        og_image: draft.seo.ogImage
          ? { filename: draft.seo.ogImage, alt: "" }
          : { filename: "", alt: "" },
        canonical_url: draft.seo.canonicalUrl ?? "",
        no_index: draft.seo.noIndex ?? false,
      },
    ],
    sections: draft.sections.map(mapSection),
    generated_by_ai: true,
    ai_brief: JSON.stringify(draft.meta.brief ?? {}, null, 2),
    created_by: opts.createdBy ?? "",
  };
}
