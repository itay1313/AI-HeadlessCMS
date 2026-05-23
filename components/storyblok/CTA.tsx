import { editable } from "./editable";
import type { StoryblokBlok } from "@/types/storyblok";

type Blok = StoryblokBlok<"cta"> & {
  headline?: string;
  subtitle?: string;
  button_text?: string;
  button_url?: string;
};

export default function CTA({ blok }: { blok: Blok }) {
  return (
    <section {...editable(blok)} className="px-6 py-24 md:py-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-20 text-center text-white md:px-16 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand/40 blur-[110px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-[120px]" />
          <div className="relative mx-auto max-w-2xl">
            {blok.headline && (
              <h2 className="text-balance font-display text-heading font-bold">
                {blok.headline}
              </h2>
            )}
            {blok.subtitle && (
              <p className="text-balance mx-auto mt-5 max-w-xl text-lg text-white/70">
                {blok.subtitle}
              </p>
            )}
            {blok.button_text && blok.button_url && (
              <a
                href={blok.button_url}
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-ink shadow-glow transition hover:-translate-y-0.5"
              >
                {blok.button_text}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
