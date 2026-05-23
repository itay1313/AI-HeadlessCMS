// Thin wrapper around the Storyblok Management API.
// Docs: https://www.storyblok.com/docs/api/management

const BASE = "https://mapi.storyblok.com/v1";

function spaceId() {
  const id = process.env.STORYBLOK_SPACE_ID;
  if (!id) throw new Error("STORYBLOK_SPACE_ID is not set");
  return id;
}

function token() {
  const t = process.env.STORYBLOK_MANAGEMENT_TOKEN;
  if (!t) throw new Error("STORYBLOK_MANAGEMENT_TOKEN is not set");
  return t;
}

async function mapi<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE}/spaces/${spaceId()}${path}`, {
    ...init,
    headers: {
      Authorization: token(),
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Storyblok MAPI ${res.status}: ${body}`);
  }
  // Some endpoints (delete) return 204
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export type CreateStoryInput = {
  name: string;
  slug: string; // story-level slug (under landing/ folder)
  content: Record<string, unknown>;
  parent_id?: number;
};

export async function createStory(input: CreateStoryInput) {
  return mapi<{ story: { id: number; slug: string; full_slug: string } }>(
    "/stories",
    {
      method: "POST",
      body: JSON.stringify({ story: input }),
    },
  );
}

export async function updateStory(
  storyId: number,
  patch: Partial<CreateStoryInput>,
) {
  return mapi<{ story: { id: number; full_slug: string } }>(
    `/stories/${storyId}`,
    {
      method: "PUT",
      body: JSON.stringify({ story: patch }),
    },
  );
}

export async function publishStory(storyId: number) {
  return mapi(`/stories/${storyId}/publish`, { method: "GET" });
}

export async function unpublishStory(storyId: number) {
  return mapi(`/stories/${storyId}/unpublish`, { method: "GET" });
}

export async function getStoryById(storyId: number) {
  return mapi<{
    story: { id: number; name: string; full_slug: string; content: unknown };
  }>(`/stories/${storyId}`);
}

export async function findStoryBySlug(fullSlug: string) {
  const res = await mapi<{ stories: Array<{ id: number; full_slug: string }> }>(
    `/stories?with_slug=${encodeURIComponent(fullSlug)}`,
  );
  return res.stories?.[0] ?? null;
}

export async function ensureLandingFolder() {
  const existing = await findStoryBySlug("landing");
  if (existing) return existing.id;
  const created = await mapi<{ story: { id: number } }>("/stories", {
    method: "POST",
    body: JSON.stringify({
      story: { name: "Landing", slug: "landing", is_folder: true },
    }),
  });
  return created.story.id;
}
