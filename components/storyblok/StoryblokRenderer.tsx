import Hero from "./Hero";
import TextSection from "./TextSection";
import ImageTextSection from "./ImageTextSection";
import Benefits from "./Benefits";
import Features from "./Features";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import CTA from "./CTA";
import FormSection from "./FormSection";
import Pricing from "./Pricing";
import UnknownBlock from "./UnknownBlock";
import type { StoryblokBlok } from "@/types/storyblok";

const componentMap: Record<string, React.ComponentType<{ blok: never }>> = {
  hero: Hero as never,
  text_section: TextSection as never,
  image_text: ImageTextSection as never,
  benefits: Benefits as never,
  features: Features as never,
  testimonials: Testimonials as never,
  faq: FAQ as never,
  cta: CTA as never,
  form_section: FormSection as never,
  pricing: Pricing as never,
};

export function renderBlok(blok: StoryblokBlok) {
  const Component = componentMap[blok.component] ?? UnknownBlock;
  return <Component key={blok._uid} blok={blok as never} />;
}

export default function StoryblokRenderer({
  sections,
}: {
  sections: StoryblokBlok[];
}) {
  return <>{sections.map(renderBlok)}</>;
}
