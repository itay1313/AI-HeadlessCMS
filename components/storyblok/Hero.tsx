import Image from "next/image";
import { editable } from "./editable";
import type { StoryblokBlok, StoryblokAsset } from "@/types/storyblok";

type HeroBlok = StoryblokBlok<"hero"> & {
  variant?: "centered" | "split" | "image-bg";
  headline?: string;
  subtitle?: string;
  image?: StoryblokAsset | null;
  cta_text?: string;
  cta_url?: string;
  background?: "light" | "dark" | "gradient";
};

const surfaces = {
  light: "bg-white text-ink",
  dark: "bg-ink text-white",
  gradient: "bg-ink text-white",
};

export default function Hero({ blok }: { blok: HeroBlok }) {
  const variant = blok.variant ?? "centered";
  const tone = blok.background ?? "light";
  const onDark = tone !== "light";

  return (
    <section
      {...editable(blok)}
      className={`relative overflow-hidden ${surfaces[tone]} px-6 py-28 md:py-40`}
      aria-label="Hero"
    >
      {/* Ambient background flourishes (decorative) */}
      {tone === "gradient" && (
        <div aria-hidden="true">
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/40 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/30 blur-[140px]" />
        </div>
      )}
      {tone === "light" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,15,0.05)_1px,transparent_0)] [background-size:32px_32px]"
        />
      )}

      <div
        className={`container-x relative ${
          variant === "split"
            ? "grid items-center gap-12 md:grid-cols-2"
            : "text-center"
        }`}
      >
        <div className={variant === "centered" ? "mx-auto max-w-4xl" : ""}>
          {blok.headline && (
            <h1 className="animate-fade-up text-balance font-display text-display-lg font-bold">
              {blok.headline}
            </h1>
          )}
          {blok.subtitle && (
            <p
              className={`animate-fade-up text-balance mt-6 text-lg md:text-xl ${
                onDark ? "text-white/90" : "text-ink-muted"
              } ${variant === "centered" ? "mx-auto max-w-2xl" : "max-w-xl"}`}
              style={{ animationDelay: "80ms" }}
            >
              {blok.subtitle}
            </p>
          )}
          {blok.cta_text && blok.cta_url && (
            <div
              className={`animate-fade-up mt-10 flex flex-wrap gap-4 ${
                variant === "centered" ? "justify-center" : ""
              }`}
              style={{ animationDelay: "160ms" }}
            >
              <a
                href={blok.cta_url}
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                {blok.cta_text}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          )}
        </div>

        {variant === "split" && blok.image?.filename && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lift ring-1 ring-black/5">
            <Image
              src={blok.image.filename}
              alt={blok.image.alt ?? ""}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
