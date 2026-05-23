import type { LandingPageDraft, Brief } from "@/lib/validation/landingPageSchema";

// Used when AI_MOCK=true or there's no Anthropic key. Lets you exercise the
// full Storyblok save/publish/render flow without spending credits.
export function mockDraft(brief: Brief): LandingPageDraft {
  const text = brief.prompt;
  const firstWord =
    text.match(/[a-zA-Z][a-zA-Z0-9]+/g)?.[0]?.toLowerCase() ?? "demo";
  const slug = `${firstWord}-${Date.now().toString(36).slice(-4)}`;
  const headline = capitalize(text.split(/[.!?\n]/)[0]?.slice(0, 60) ?? "Welcome");

  return {
    pageName: `Demo · ${capitalize(firstWord)}`,
    slug,
    seo: {
      metaTitle: `${capitalize(firstWord)} — built with AI`,
      metaDescription:
        "Sample landing page generated in demo mode. Replace with real AI output by adding Anthropic credits.",
    },
    sections: [
      {
        component: "hero",
        variant: "centered",
        headline,
        subtitle: "This is a mock page generated without AI. Save it to Storyblok and edit any field there.",
        ctaText: "Get started",
        ctaUrl: "#",
        background: "gradient",
      },
      {
        component: "benefits",
        title: "Why people choose us",
        items: [
          { icon: "⚡", title: "Fast", description: "Pages generated in seconds, not weeks." },
          { icon: "🎨", title: "Editable", description: "Every block lives in Storyblok — anyone can edit." },
          { icon: "📈", title: "SEO-ready", description: "Meta tags, OG images, canonical URLs included." },
        ],
      },
      {
        component: "features",
        title: "Built for teams",
        features: [
          { title: "AI drafts", description: "Describe the page; AI handles structure and copy." },
          { title: "Visual editing", description: "Storyblok's visual editor for non-developers." },
          { title: "Instant publish", description: "Click publish, Next.js revalidates the route." },
        ],
      },
      {
        component: "testimonials",
        title: "Loved by builders",
        testimonials: [
          {
            quote: "We shipped four campaign pages in one afternoon. Marketing handles the edits now.",
            authorName: "Alex Rivera",
            authorRole: "Head of Growth, Acme",
          },
          {
            quote: "The AI gets us to a working draft. Our writers just polish the words.",
            authorName: "Sam Patel",
            authorRole: "Founder, Loop",
          },
        ],
      },
      {
        component: "faq",
        title: "Frequently asked",
        questions: [
          { question: "Is this real AI output?", answer: "No — this is the mock generator used for testing." },
          { question: "How do I get real AI output?", answer: "Add Anthropic credits, then unset AI_MOCK in .env.local." },
          { question: "Can I edit this page?", answer: "Yes — open it in Storyblok after saving and edit any field." },
        ],
      },
      {
        component: "cta",
        headline: "Ready to try it for real?",
        subtitle: "Add a few credits to your Anthropic account and generate properly.",
        buttonText: "Get started",
        buttonUrl: "#",
      },
    ],
    meta: { generatedByAI: true, model: "mock", brief },
  };
}

function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
