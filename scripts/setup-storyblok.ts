/**
 * One-shot script: creates all required Storyblok component definitions
 * (content type + nestable blocks) in your space.
 *
 * Idempotent: if a component already exists with the same name, it's updated.
 *
 * Usage:
 *   cp .env.example .env.local && fill values
 *   npm run setup:storyblok
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

const BASE = "https://mapi.storyblok.com/v1";
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN;

if (!SPACE_ID || !TOKEN) {
  console.error("Set STORYBLOK_SPACE_ID and STORYBLOK_MANAGEMENT_TOKEN");
  process.exit(1);
}

async function mapi<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}/spaces/${SPACE_ID}${path}`, {
    ...init,
    headers: {
      Authorization: TOKEN!,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`MAPI ${res.status} ${path}: ${await res.text()}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

type SchemaField = Record<string, unknown>;
type ComponentDef = {
  name: string;
  display_name?: string;
  is_root?: boolean;
  is_nestable?: boolean;
  schema: Record<string, SchemaField>;
};

const text = (pos: number, opts: SchemaField = {}): SchemaField => ({
  type: "text",
  pos,
  ...opts,
});
const textarea = (pos: number, opts: SchemaField = {}): SchemaField => ({
  type: "textarea",
  pos,
  ...opts,
});
const asset = (pos: number): SchemaField => ({
  type: "asset",
  filetypes: ["images"],
  pos,
});
const boolean = (pos: number): SchemaField => ({ type: "boolean", pos });
const opt = (pos: number, values: string[]): SchemaField => ({
  type: "option",
  pos,
  options: values.map((v) => ({ name: v, value: v })),
});
const bloks = (
  pos: number,
  restrict: string[],
  opts: SchemaField = {},
): SchemaField => ({
  type: "bloks",
  pos,
  restrict_components: true,
  component_whitelist: restrict,
  ...opts,
});

const components: ComponentDef[] = [
  // ── Root content type ──────────────────────────────────────────
  {
    name: "landing_page",
    display_name: "Landing Page",
    is_root: true,
    is_nestable: false,
    schema: {
      template: opt(0, [
        "modern",
        "editorial",
        "vibrant",
        "fresh",
        "sunset",
        "minimal",
      ]),
      seo: bloks(1, ["seo"], { maximum: 1 }),
      sections: bloks(2, [
        "hero",
        "text_section",
        "image_text",
        "benefits",
        "features",
        "testimonials",
        "faq",
        "cta",
        "form_section",
        "pricing",
      ]),
      generated_by_ai: boolean(3),
      ai_brief: textarea(4),
      created_by: text(5),
    },
  },
  // ── SEO ────────────────────────────────────────────────────────
  {
    name: "seo",
    display_name: "SEO",
    is_nestable: true,
    schema: {
      meta_title: text(0, { max_length: 60, required: true }),
      meta_description: textarea(1, { max_length: 160, required: true }),
      og_image: asset(2),
      canonical_url: text(3),
      no_index: boolean(4),
    },
  },
  // ── Hero ───────────────────────────────────────────────────────
  {
    name: "hero",
    display_name: "Hero",
    is_nestable: true,
    schema: {
      variant: opt(0, ["centered", "split", "image-bg"]),
      headline: text(1, { required: true, max_length: 80 }),
      subtitle: textarea(2, { max_length: 200 }),
      image: asset(3),
      cta_text: text(4),
      cta_url: text(5),
      background: opt(6, ["light", "dark", "gradient"]),
    },
  },
  // ── Text Section ───────────────────────────────────────────────
  {
    name: "text_section",
    display_name: "Text Section",
    is_nestable: true,
    schema: {
      title: text(0),
      body: textarea(1, { required: true }),
      alignment: opt(2, ["left", "center", "right"]),
      max_width: opt(3, ["narrow", "medium", "wide"]),
    },
  },
  // ── Image + Text ───────────────────────────────────────────────
  {
    name: "image_text",
    display_name: "Image + Text",
    is_nestable: true,
    schema: {
      title: text(0, { required: true }),
      body: textarea(1, { required: true }),
      image: asset(2),
      image_position: opt(3, ["left", "right"]),
      cta_text: text(4),
      cta_url: text(5),
    },
  },
  // ── Benefits ───────────────────────────────────────────────────
  {
    name: "benefit_item",
    display_name: "Benefit Item",
    is_nestable: true,
    schema: {
      icon: text(0),
      title: text(1, { required: true, max_length: 80 }),
      description: textarea(2, { max_length: 280 }),
    },
  },
  {
    name: "benefits",
    display_name: "Benefits",
    is_nestable: true,
    schema: {
      title: text(0),
      items: bloks(1, ["benefit_item"], { minimum: 2, maximum: 8 }),
    },
  },
  // ── Features ───────────────────────────────────────────────────
  {
    name: "feature_card",
    display_name: "Feature Card",
    is_nestable: true,
    schema: {
      title: text(0, { required: true }),
      description: textarea(1),
      image: asset(2),
    },
  },
  {
    name: "features",
    display_name: "Features",
    is_nestable: true,
    schema: {
      title: text(0),
      features: bloks(1, ["feature_card"], { minimum: 2, maximum: 8 }),
    },
  },
  // ── Testimonials ───────────────────────────────────────────────
  {
    name: "testimonial_item",
    display_name: "Testimonial",
    is_nestable: true,
    schema: {
      quote: textarea(0, { required: true, max_length: 400 }),
      author_name: text(1, { required: true }),
      author_role: text(2),
    },
  },
  {
    name: "testimonials",
    display_name: "Testimonials",
    is_nestable: true,
    schema: {
      title: text(0),
      testimonials: bloks(1, ["testimonial_item"], { minimum: 1, maximum: 8 }),
    },
  },
  // ── FAQ ────────────────────────────────────────────────────────
  {
    name: "faq_item",
    display_name: "FAQ Item",
    is_nestable: true,
    schema: {
      question: text(0, { required: true }),
      answer: textarea(1, { required: true }),
    },
  },
  {
    name: "faq",
    display_name: "FAQ",
    is_nestable: true,
    schema: {
      title: text(0),
      questions: bloks(1, ["faq_item"], { minimum: 1, maximum: 20 }),
    },
  },
  // ── CTA ────────────────────────────────────────────────────────
  {
    name: "cta",
    display_name: "CTA",
    is_nestable: true,
    schema: {
      headline: text(0, { required: true, max_length: 80 }),
      subtitle: textarea(1, { max_length: 200 }),
      button_text: text(2, { required: true }),
      button_url: text(3, { required: true }),
    },
  },
  // ── Form ───────────────────────────────────────────────────────
  {
    name: "form_section",
    display_name: "Form Section",
    is_nestable: true,
    schema: {
      title: text(0, { required: true }),
      description: textarea(1),
      form_type: opt(2, ["contact", "newsletter", "demo", "waitlist"]),
      success_message: text(3),
    },
  },
  // ── Pricing ────────────────────────────────────────────────────
  {
    name: "pricing_feature",
    display_name: "Pricing Feature",
    is_nestable: true,
    schema: {
      label: text(0, { required: true }),
    },
  },
  {
    name: "pricing_plan",
    display_name: "Pricing Plan",
    is_nestable: true,
    schema: {
      name: text(0, { required: true }),
      price: text(1, { required: true }),
      period: text(2),
      description: textarea(3),
      features: bloks(4, ["pricing_feature"]),
      cta_text: text(5),
      cta_url: text(6),
      highlighted: boolean(7),
    },
  },
  {
    name: "pricing",
    display_name: "Pricing",
    is_nestable: true,
    schema: {
      title: text(0),
      plans: bloks(1, ["pricing_plan"], { minimum: 1, maximum: 4 }),
    },
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let cachedComponents: Array<{ id: number; name: string }> | null = null;
async function listComponents(force = false) {
  if (cachedComponents && !force) return cachedComponents;
  const res = await mapi<{ components: Array<{ id: number; name: string }> }>(
    "/components",
  );
  cachedComponents = res.components ?? [];
  return cachedComponents;
}

async function upsertComponent(def: ComponentDef) {
  const existing = (await listComponents()).find((c) => c.name === def.name);
  if (existing) {
    await mapi(`/components/${existing.id}`, {
      method: "PUT",
      body: JSON.stringify({ component: def }),
    });
    console.log(`updated  ${def.name}`);
  } else {
    await mapi("/components", {
      method: "POST",
      body: JSON.stringify({ component: def }),
    });
    console.log(`created  ${def.name}`);
  }
}

async function ensureLandingFolder() {
  const res = await mapi<{ stories: Array<{ id: number; slug: string }> }>(
    "/stories?with_slug=landing",
  );
  if (res.stories?.[0]) return res.stories[0].id;
  const created = await mapi<{ story: { id: number } }>("/stories", {
    method: "POST",
    body: JSON.stringify({
      story: { name: "Landing", slug: "landing", is_folder: true },
    }),
  });
  console.log("created  /landing folder");
  return created.story.id;
}

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  for (let i = 0; i < 5; i++) {
    try {
      return await fn();
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes("429")) {
        await sleep(1500 * (i + 1));
        continue;
      }
      throw err;
    }
  }
  throw new Error(`exhausted retries: ${label}`);
}

async function main() {
  console.log("Setting up Storyblok components in space", SPACE_ID);
  // Prime the cache once so we don't list per component.
  await listComponents();
  for (const def of components) {
    try {
      await withRetry(() => upsertComponent(def), def.name);
    } catch (err) {
      console.error(`failed   ${def.name}:`, (err as Error).message);
    }
    await sleep(350); // stay under 6 req/sec
  }
  await withRetry(ensureLandingFolder, "landing folder");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
