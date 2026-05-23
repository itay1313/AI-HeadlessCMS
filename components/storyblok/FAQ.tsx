import { editable } from "./editable";
import type { StoryblokBlok } from "@/types/storyblok";

type Q = { _uid: string; question?: string; answer?: string };
type Blok = StoryblokBlok<"faq"> & { title?: string; questions?: Q[] };

export default function FAQ({ blok }: { blok: Blok }) {
  const items = blok.questions ?? [];
  return (
    <section {...editable(blok)} className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        {blok.title && (
          <h2 className="text-balance mb-14 text-center font-display text-heading font-bold">
            {blok.title}
          </h2>
        )}
        <div className="space-y-4">
          {items.map((q) => (
            <details
              key={q._uid}
              className="group rounded-2xl bg-gray-50/80 px-6 py-5 ring-1 ring-black/[0.04] transition hover:bg-gray-50 open:bg-white open:shadow-soft open:ring-black/[0.06]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold tracking-tight">
                {q.question}
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-muted">
                {q.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
