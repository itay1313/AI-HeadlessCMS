import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";
import { mockDraft } from "./mockDraft";
import {
  landingPageDraftSchema,
  type Brief,
  type LandingPageDraft,
} from "@/lib/validation/landingPageSchema";

const MODEL = "claude-opus-4-7";

function isMockMode() {
  return (
    process.env.AI_MOCK === "true" || !process.env.ANTHROPIC_API_KEY
  );
}

function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey: key });
}

function extractJson(text: string): string {
  // Be tolerant of accidental code fences even though we tell the model not to.
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1) return text;
  return text.slice(first, last + 1);
}

async function callClaude(messages: Anthropic.MessageParam[]): Promise<string> {
  const client = getClient();
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages,
  });
  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return text;
}

export type GenerateResult = {
  draft: LandingPageDraft;
  modelUsed: string;
};

export async function generateLandingPage(brief: Brief): Promise<GenerateResult> {
  if (isMockMode()) {
    const draft = landingPageDraftSchema.parse(mockDraft(brief));
    return { draft, modelUsed: "mock" };
  }
  const userMsg = buildUserPrompt(brief);

  const attempt = async (
    messages: Anthropic.MessageParam[],
  ): Promise<LandingPageDraft> => {
    const raw = await callClaude(messages);
    const json = extractJson(raw);
    const parsed = JSON.parse(json);
    // Inject brief into meta so we keep traceability even if AI omits it.
    parsed.meta = { ...(parsed.meta ?? {}), generatedByAI: true, model: MODEL, brief };
    return landingPageDraftSchema.parse(parsed);
  };

  const initial: Anthropic.MessageParam[] = [{ role: "user", content: userMsg }];

  try {
    const draft = await attempt(initial);
    return { draft, modelUsed: MODEL };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    // Auto-fallback to mock if Anthropic billing is the blocker — keeps
    // the rest of the flow testable while credits are being topped up.
    if (/credit balance|billing|insufficient|payment/i.test(errMsg)) {
      const draft = landingPageDraftSchema.parse(mockDraft(brief));
      return { draft, modelUsed: "mock (anthropic billing fallback)" };
    }
    // One retry with the validation error fed back as a correction.
    const correction: Anthropic.MessageParam[] = [
      ...initial,
      {
        role: "assistant",
        content: "I produced invalid output.",
      },
      {
        role: "user",
        content: `Your previous output failed validation:\n${errMsg}\n\nReturn a corrected JSON object only.`,
      },
    ];
    const draft = await attempt(correction);
    return { draft, modelUsed: MODEL };
  }
}
