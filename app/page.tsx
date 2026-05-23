import Link from "next/link";

export default function HomePage() {
  return (
    <main id="main" className="min-h-screen bg-gradient-to-b from-white via-indigo-50/40 to-white">
      {/* Top nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-lg font-bold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            AI
          </span>
          Landing Studio
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/builder"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Sign in
          </Link>
          <Link
            href="/builder/new"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            New page
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-12 text-center md:pb-24 md:pt-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-700 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          Powered by Claude · Storyblok CMS
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
          Describe a landing page.
          <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            We build it.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Generate production-ready landing pages with AI, then edit them visually
          in Storyblok — no code, no rebuilds, no developer needed.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/builder/new"
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:bg-gray-800"
          >
            Create your first page
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#how"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          From idea to published in 3 steps
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          AI generates the first draft. Storyblok becomes your editing
          environment. Your Next.js site serves the result.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Step
            n="1"
            title="Describe your page"
            body="Fill in a short brief: audience, product, tone, sections you want. Click Generate."
            tag="Builder"
          />
          <Step
            n="2"
            title="Edit in Storyblok"
            body="Your page lands in Storyblok as a structured story. Change copy, swap images, tweak the FAQ — all through a visual editor."
            tag="CMS"
          />
          <Step
            n="3"
            title="Publish anywhere"
            body="One click publishes the story. Your live Next.js site updates instantly. Slug, SEO, OG image — all included."
            tag="Live"
          />
        </div>
      </section>

      {/* Storyblok explainer */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                What is Storyblok?
              </span>
              <h3 className="mt-4 text-3xl font-bold">
                Your CMS, where your team lives
              </h3>
              <p className="mt-4 text-gray-600">
                Storyblok is a headless CMS — a database for content with a
                visual editor on top. After AI generates a page, it's saved as
                a <strong>story</strong> in Storyblok. Anyone on your team can
                open it, click any block, and edit the text or images in
                place. No code, no AI prompt, no rebuild.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-indigo-600">✓</span> Edit content
                  without touching the AI
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600">✓</span> See changes live
                  before publishing
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600">✓</span> Built-in
                  draft/publish workflow
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 ring-1 ring-indigo-100">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2">Storyblok visual editor</span>
              </div>
              <div className="mt-4 space-y-3 rounded-lg bg-white p-4 text-sm shadow">
                <Row label="Headline" value="Spring launch is here" />
                <Row label="Subtitle" value="Try the new pricing tiers" />
                <Row label="CTA text" value="Get started free" />
                <Row label="Image" value="hero-spring.jpg" />
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Editors change values directly. The Next.js site re-renders on
                publish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-8 text-center">
        <h3 className="text-3xl font-bold">Ready to build?</h3>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Sign in with your builder password and create your first AI-generated
          landing page in under a minute.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/builder"
            className="rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700"
          >
            Open Builder
          </Link>
          <a
            href="https://app.storyblok.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-semibold hover:bg-gray-50"
          >
            Open Storyblok ↗
          </a>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        Built with Next.js · Storyblok · Claude
      </footer>
    </main>
  );
}

function Step({
  n,
  title,
  body,
  tag,
}: {
  n: string;
  title: string;
  body: string;
  tag: string;
}) {
  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
          {n}
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
          {tag}
        </span>
      </div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-800">
        {value}
      </span>
    </div>
  );
}
