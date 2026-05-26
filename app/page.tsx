import Link from "next/link";

const sw = "1.8";
const ic = "h-6 w-6";

const STEPS = [
  {
    tag: "Builder",
    title: "Describe your page",
    body: "Fill in one short prompt — audience, product, tone, sections. The AI returns a structured page in seconds.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={ic}>
        <path d="M5 19 19 5M14 5h.01M19 10h.01M9 4h.01M4 9h.01" strokeLinecap="round" />
        <path d="m13 7 4 4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    tag: "CMS",
    title: "Edit in Storyblok",
    body: "Your page lands as a structured story. Your team changes text, images, FAQ and CTAs visually — no code.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={ic}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M9 9h5M9 13h6M9 9v8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    tag: "Live",
    title: "Publish anywhere",
    body: "One click publishes the story and updates your Next.js site instantly — slug, SEO and OG image included.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={ic}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main
      id="main"
      className="relative min-h-screen overflow-hidden bg-[#0a0a0f] text-white"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_40%_at_50%_-5%,rgba(99,102,241,0.18),transparent_70%),radial-gradient(40%_30%_at_85%_10%,rgba(217,70,239,0.12),transparent_70%)]"
      />

      {/* Nav */}
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5 font-bold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm text-white shadow-glow">
            AI
          </span>
          Landing Studio
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/builder"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link
            href="/builder/new"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white/90"
          >
            New page
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-6 pb-20 pt-16 text-center md:pb-28 md:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          Powered by Claude · Storyblok CMS
        </div>
        <h1 className="text-balance font-display text-5xl font-bold tracking-tight md:text-7xl">
          Describe a landing page.
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            We build it.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-white/60">
          Generate production-ready landing pages with AI, then edit them
          visually in Storyblok — no code, no rebuilds, no developer needed.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/builder/new"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-ink shadow-glow transition hover:-translate-y-0.5"
          >
            Create your first page
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <a
            href="#how"
            className="rounded-full border border-white/15 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
          >
            How it works
          </a>
        </div>
      </section>

      {/* Steps */}
      <section id="how" className="relative mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-balance text-center font-display text-3xl font-bold md:text-4xl">
          From idea to published in 3 steps
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/55">
          AI generates the first draft. Storyblok becomes your editing
          environment. Your Next.js site serves the result.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10">
                  {s.icon}
                </span>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/50 ring-1 ring-white/10">
                  {s.tag}
                </span>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <span className="font-display text-sm font-bold text-white/30">
                  0{i + 1}
                </span>
                <h3 className="text-lg font-semibold">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Storyblok explainer */}
      <section className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:grid-cols-2 md:items-center md:p-12">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/70">
              What is Storyblok?
            </span>
            <h3 className="mt-4 font-display text-3xl font-bold">
              Your CMS, where your team lives
            </h3>
            <p className="mt-4 text-white/60">
              Storyblok is a headless CMS — a database for content with a visual
              editor on top. After AI generates a page, it&apos;s saved as a{" "}
              <strong className="text-white">story</strong> in Storyblok.
              Anyone on your team can open it, click any block, and edit the
              text or images in place. No code, no AI prompt, no rebuild.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-white/70">
              {[
                "Edit content without touching the AI",
                "See changes live before publishing",
                "Built-in draft / publish workflow",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="text-indigo-400">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-white/40">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              <span className="ml-2">Storyblok visual editor</span>
            </div>
            <div className="mt-4 space-y-3 rounded-xl bg-white/[0.04] p-4 text-sm">
              <Row label="Headline" value="Spring launch is here" />
              <Row label="Subtitle" value="Try the new pricing tiers" />
              <Row label="CTA text" value="Get started free" />
              <Row label="Image" value="hero-spring.jpg" />
            </div>
            <p className="mt-4 text-xs text-white/40">
              Editors change values directly. The Next.js site re-renders on
              publish.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative mx-auto max-w-5xl px-6 pb-28 pt-10 text-center">
        <h3 className="font-display text-3xl font-bold md:text-4xl">
          Ready to build?
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-white/60">
          Sign in with your builder password and create your first AI-generated
          landing page in under a minute.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/builder"
            className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3.5 text-base font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
          >
            Open Builder
          </Link>
          <a
            href="https://app.storyblok.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
          >
            Open Storyblok ↗
          </a>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-8 text-center text-sm text-white/40">
        Built with Next.js · Storyblok · Claude
      </footer>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wide text-white/40">
        {label}
      </span>
      <span className="rounded bg-white/5 px-2 py-1 font-mono text-xs text-white/80">
        {value}
      </span>
    </div>
  );
}
