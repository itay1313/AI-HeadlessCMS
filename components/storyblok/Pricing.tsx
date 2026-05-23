import { editable } from "./editable";
import type { StoryblokBlok } from "@/types/storyblok";

type Feature = { _uid: string; label?: string };
type Plan = {
  _uid: string;
  name?: string;
  price?: string;
  period?: string;
  description?: string;
  features?: Feature[];
  cta_text?: string;
  cta_url?: string;
  highlighted?: boolean;
};
type Blok = StoryblokBlok<"pricing"> & { title?: string; plans?: Plan[] };

export default function Pricing({ blok }: { blok: Blok }) {
  const plans = blok.plans ?? [];
  return (
    <section {...editable(blok)} className="px-6 py-24 md:py-32">
      <div className="container-x">
        {blok.title && (
          <h2 className="text-balance mx-auto mb-16 max-w-2xl text-center font-display text-heading font-bold">
            {blok.title}
          </h2>
        )}
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p._uid}
              className={`relative flex flex-col rounded-3xl p-8 transition hover:-translate-y-1 ${
                p.highlighted
                  ? "bg-ink text-white shadow-glow ring-1 ring-ink"
                  : "bg-white text-ink shadow-soft ring-1 ring-black/[0.05]"
              }`}
            >
              {p.highlighted && (
                <span className="absolute right-6 top-6 rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-bold tracking-tight">
                  {p.price}
                </span>
                {p.period && (
                  <span className={p.highlighted ? "text-white/60" : "text-ink-muted"}>
                    /{p.period}
                  </span>
                )}
              </div>
              {p.description && (
                <p
                  className={`mt-3 text-sm ${p.highlighted ? "text-white/70" : "text-ink-muted"}`}
                >
                  {p.description}
                </p>
              )}
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {(p.features ?? []).map((f) => (
                  <li key={f._uid} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                        p.highlighted ? "bg-brand text-white" : "bg-brand/10 text-brand"
                      }`}
                    >
                      ✓
                    </span>
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
              {p.cta_text && p.cta_url && (
                <a
                  href={p.cta_url}
                  className={`mt-8 inline-block rounded-full px-6 py-3.5 text-center font-semibold transition ${
                    p.highlighted
                      ? "bg-white text-ink hover:bg-gray-100"
                      : "bg-brand text-white hover:bg-brand-dark"
                  }`}
                >
                  {p.cta_text}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
