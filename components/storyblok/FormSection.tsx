import { editable } from "./editable";
import type { StoryblokBlok } from "@/types/storyblok";

type Blok = StoryblokBlok<"form_section"> & {
  title?: string;
  description?: string;
  form_type?: "contact" | "newsletter" | "demo" | "waitlist";
  success_message?: string;
};

// Minimal non-functional form. Wire to your provider (Resend, HubSpot, etc.)
export default function FormSection({ blok }: { blok: Blok }) {
  const type = blok.form_type ?? "contact";
  return (
    <section {...editable(blok)} className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-xl rounded-3xl bg-gray-50/80 p-8 ring-1 ring-black/[0.04] md:p-10">
        {blok.title && (
          <h2 className="text-balance font-display text-heading font-bold">
            {blok.title}
          </h2>
        )}
        {blok.description && (
          <p className="mt-3 text-lg text-ink-muted">{blok.description}</p>
        )}
        <form
          className="mt-8 space-y-4"
          action={`/api/forms/${type}`}
          method="POST"
        >
          {type === "contact" && (
            <input
              name="name"
              placeholder="Your name"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
          {type === "contact" && (
            <textarea
              name="message"
              placeholder="Message"
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-6 py-3.5 font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
