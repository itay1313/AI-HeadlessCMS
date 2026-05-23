import Image from "next/image";
import { editable } from "./editable";
import ShaderBackground from "./ShaderBackground";
import SplineScene from "./SplineScene";
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

export default function Hero({
  blok,
  primary = false,
}: {
  blok: HeroBlok;
  // Only the primary (first) hero on a page gets the heavy 3D + shader.
  primary?: boolean;
}) {
  const variant = blok.variant ?? "centered";
  const tone = blok.background ?? "light";
  const onDark = tone !== "light";

  return (
    <section
      {...editable(blok)}
      className={`relative overflow-hidden ${surfaces[tone]} px-6 py-28 md:py-40`}
      aria-label="Hero"
    >
      {/* Heavy WebGL + 3D backdrop: ONLY on the first hero. */}
      {onDark && primary && (
        <>
          <ShaderBackground />
          {/* 3D scene drifts to the right, behind the copy */}
          <SplineScene className="left-auto right-[-12%] top-0 hidden w-[70%] opacity-80 md:block" />
          {/* Contrast scrim: keeps headline/subtitle AAA-readable over the art.
              pointer-events-none so the cursor reaches the 3D scene behind it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_120%,transparent_30%,rgba(10,10,15,0.65)_100%)]"
          />
        </>
      )}

      {/* Secondary dark heroes: cheap static gradient, no WebGL. */}
      {onDark && !primary && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_70%_20%,rgba(99,102,241,0.22),transparent_60%),radial-gradient(60%_80%_at_20%_90%,rgba(168,85,247,0.18),transparent_60%)]"
        />
      )}

      {tone === "light" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,15,0.05)_1px,transparent_0)] [background-size:32px_32px]"
        />
      )}

      <div
        className={`container-x relative z-10 ${
          variant === "split"
            ? "grid items-center gap-12 md:grid-cols-2"
            : "text-center"
        }`}
      >
        <div className={variant === "centered" ? "mx-auto max-w-4xl" : ""}>
          {blok.headline && (
            <h1 className="animate-fade-up text-balance font-display text-display-lg font-bold drop-shadow-sm">
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
