import type { Section } from "@/lib/validation/landingPageSchema";

// Heuristic single-section generator used when AI_MOCK=true or no Anthropic
// key. Interprets keywords in the prompt so the "Add section" flow is testable
// without spending credits.
export function mockSection(prompt: string): Section {
  const p = prompt.toLowerCase();
  const title =
    (prompt.match(/[A-Z][^.!?\n]{4,58}/)?.[0] ?? "A bold new section").trim();

  if (/faq|question|q&a/.test(p)) {
    return {
      component: "faq",
      title: "Frequently asked questions",
      questions: [
        { question: "What is this?", answer: "An AI-generated section you can edit in Storyblok." },
        { question: "Can I change it?", answer: "Yes — open the story in Storyblok and edit any field." },
        { question: "Is it published?", answer: "Yes, it was published automatically when added." },
      ],
    };
  }
  if (/pricing|plan|tier|price/.test(p)) {
    return {
      component: "pricing",
      title: "Simple pricing",
      plans: [
        { name: "Starter", price: "$0", period: "mo", features: ["1 project", "Community support"], ctaText: "Start free", ctaUrl: "#" },
        { name: "Pro", price: "$29", period: "mo", description: "For growing teams", features: ["Unlimited projects", "Priority support", "Analytics"], ctaText: "Go Pro", ctaUrl: "#", highlighted: true },
        { name: "Scale", price: "$99", period: "mo", features: ["SSO", "SLA", "Dedicated manager"], ctaText: "Contact us", ctaUrl: "#" },
      ],
    };
  }
  if (/testimonial|review|quote|customer/.test(p)) {
    return {
      component: "testimonials",
      title: "What people say",
      testimonials: [
        { quote: "This changed how our team ships pages.", authorName: "Alex Rivera", authorRole: "Head of Growth" },
        { quote: "Fast, flexible, and our writers love it.", authorName: "Sam Patel", authorRole: "Founder" },
      ],
    };
  }
  if (/feature/.test(p)) {
    return {
      component: "features",
      title: "Key features",
      features: [
        { title: "Fast", description: "Built for speed from the ground up." },
        { title: "Flexible", description: "Adapts to your workflow, not the other way around." },
        { title: "Reliable", description: "Production-ready and battle-tested." },
      ],
    };
  }
  if (/benefit|why/.test(p)) {
    return {
      component: "benefits",
      title: "Why choose us",
      items: [
        { icon: "⚡", title: "Fast", description: "Save hours every week." },
        { icon: "🎯", title: "Focused", description: "Everything you need, nothing you don't." },
        { icon: "🔒", title: "Secure", description: "Your data stays yours." },
      ],
    };
  }
  if (/cta|call to action|sign ?up|get started/.test(p)) {
    return {
      component: "cta",
      headline: title,
      subtitle: "Join thousands already getting started.",
      buttonText: "Get started",
      buttonUrl: "#",
    };
  }
  if (/form|contact|newsletter|waitlist/.test(p)) {
    return {
      component: "form_section",
      title: title,
      description: "Drop your email and we'll be in touch.",
      formType: /newsletter/.test(p) ? "newsletter" : /waitlist/.test(p) ? "waitlist" : "contact",
    };
  }
  // "big image and title" → a hero split (large image beside a headline)
  if (/image|photo|picture|visual|hero/.test(p) && /title|headline|heading/.test(p)) {
    return {
      component: "hero",
      variant: "split",
      headline: title,
      subtitle: "An AI-generated section. Edit the copy and swap the image in Storyblok.",
      imagePrompt: prompt,
      ctaText: "Learn more",
      ctaUrl: "#",
      background: "gradient",
    };
  }
  if (/image|photo|picture|visual/.test(p)) {
    return {
      component: "image_text",
      title: title,
      body: "An AI-generated section. Replace this copy and the image in Storyblok.",
      imagePrompt: prompt,
      imagePosition: "left",
      ctaText: "Learn more",
      ctaUrl: "#",
    };
  }
  // default: a text block
  return {
    component: "text_section",
    title: title,
    body: "An AI-generated section. Edit this text in Storyblok, or add another section.",
    alignment: "center",
    maxWidth: "medium",
  };
}
