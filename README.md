# AI Landing Platform

Generate landing pages with Claude, store them in Storyblok, render them with Next.js.

The AI never writes code — it only emits a validated JSON shape that maps 1:1 to
Storyblok blocks. Editors take it from there in the Storyblok Visual Editor.

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind · Storyblok (Management + Delivery API) · Anthropic Claude · Zod

## Setup

1. **Install**

   ```bash
   npm install
   ```

2. **Create a Storyblok space** at https://app.storyblok.com. Grab:
   - Space ID (settings → general)
   - Personal Access Token (account settings → access tokens) → `STORYBLOK_MANAGEMENT_TOKEN`
   - Public delivery token (settings → access tokens) → `NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN`
   - Preview delivery token → `STORYBLOK_PREVIEW_TOKEN`

3. **Create env file**

   ```bash
   cp .env.example .env.local
   # fill in all values
   ```

4. **Run the Storyblok setup script** — creates the `landing_page` content type
   + 10 nestable blocks + the `/landing` folder:

   ```bash
   npm run setup:storyblok
   ```

   Re-runnable; updates existing components in place.

5. **Configure the Visual Editor** in Storyblok:
   - Settings → Visual Editor → Location: `http://localhost:3000/api/draft?secret=<STORYBLOK_PREVIEW_SECRET>&slug=`
   - Open any story under `/landing/` to edit visually.

6. **(Optional) Webhook for instant revalidation**:
   - Settings → Webhooks → Story published →
     `http://your-site.com/api/revalidate?secret=<STORYBLOK_WEBHOOK_SECRET>`

7. **Run**

   ```bash
   npm run dev
   ```

   - Public site: http://localhost:3000
   - Builder dashboard: http://localhost:3000/builder
     (login with `BUILDER_SHARED_SECRET`)

## How it works

```
Brief form ──► /api/ai-generate ──► Zod-validated LandingPageDraft
                                          │
                                          ▼  /api/storyblok/create-story
                                  Mapper (draft → SB content)
                                          │
                                          ▼
                                    Storyblok story
                                          │
                                          ▼  /api/storyblok/publish-story
                                       Published
                                          │
                                          ▼
                              /landing/<slug>  (Next.js, ISR)
```

### Safety
- AI output is constrained to the component union defined in [`lib/validation/landingPageSchema.ts`](lib/validation/landingPageSchema.ts).
- Unknown components → rejected before the mapper runs.
- The system prompt is generated from the same `COMPONENT_REGISTRY` ([`lib/ai/registry.ts`](lib/ai/registry.ts)), so schema and prompt can't drift apart.
- The mapper never emits raw HTML or external image URLs — AI image suggestions become `imagePrompt` placeholders that editors fill in.
- All write APIs require the `BUILDER_SHARED_SECRET`.

## Adding a new block

1. Add the name to `COMPONENT_NAMES` in [`lib/ai/registry.ts`](lib/ai/registry.ts).
2. Add a Zod schema + add it to the `sectionSchema` discriminated union in [`lib/validation/landingPageSchema.ts`](lib/validation/landingPageSchema.ts).
3. Add a `case` in [`lib/storyblok/mapper.ts`](lib/storyblok/mapper.ts).
4. Add the component definition in [`scripts/setup-storyblok.ts`](scripts/setup-storyblok.ts) and re-run `npm run setup:storyblok`.
5. Create a React component in [`components/storyblok/`](components/storyblok/) and register it in [`components/storyblok/StoryblokRenderer.tsx`](components/storyblok/StoryblokRenderer.tsx).
6. Document the new block in the system prompt — already auto-rendered from `registry.ts`, but extend the field-rules section in [`lib/ai/prompts.ts`](lib/ai/prompts.ts).

## Routes

| Path | Purpose |
|---|---|
| `/` | Marketing landing for the platform itself |
| `/builder` | Dashboard (requires shared secret) |
| `/builder/new` | Brief → AI → preview → save → publish |
| `/builder-login` | Secret login |
| `/landing/[...slug]` | Public landing pages (ISR) |
| `/api/ai-generate` | Brief → validated draft |
| `/api/storyblok/create-story` | Draft → SB story |
| `/api/storyblok/update-story` | Patch existing SB story |
| `/api/storyblok/publish-story` | Publish + revalidate |
| `/api/storyblok/check-slug` | Slug uniqueness check |
| `/api/draft` | Toggle draftMode for SB Visual Editor |
| `/api/revalidate` | Webhook target for SB publish events |

## Notes
- v1 uses a single shared-secret cookie for builder access. For multi-user
  setups, swap [`lib/auth.ts`](lib/auth.ts) for NextAuth or your provider.
- The form section is intentionally non-functional in v1 — wire it to your
  email/CRM provider in [`components/storyblok/FormSection.tsx`](components/storyblok/FormSection.tsx).
