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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  text_section: TextSection,
  image_text: ImageTextSection,
  benefits: Benefits,
  features: Features,
  testimonials: Testimonials,
  faq: FAQ,
  cta: CTA,
  form_section: FormSection,
  pricing: Pricing,
};

export function renderBlok(blok: StoryblokBlok, primary = false) {
  const Component = componentMap[blok.component] ?? UnknownBlock;
  return <Component key={blok._uid} blok={blok} primary={primary} />;
}

export default function StoryblokRenderer({
  sections,
}: {
  sections: StoryblokBlok[];
}) {
  // Only the FIRST hero gets the heavy 3D scene + shader. Any other hero
  // uses a lightweight static background — keeps the page fast and avoids
  // multiple robots / WebGL contexts.
  const firstHeroUid = sections.find((s) => s.component === "hero")?._uid;
  return (
    <>
      {sections.map((blok) =>
        renderBlok(blok, blok.component === "hero" && blok._uid === firstHeroUid),
      )}
    </>
  );
}
