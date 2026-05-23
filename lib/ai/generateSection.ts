import Anthropic from "@anthropic-ai/sdk";
import { SECTION_SYSTEM_PROMPT, buildSectionUserPrompt } from "./prompts";
import { mockSection } from "./mockSection";
import { sectionSchema, type Section } from "@/lib/validation/landingPageSchema";

const MODEL = "claude-opus-4-7";

function isMockMode() {
  return process.env.AI_MOCK === "true" || !process.env.ANTHROPIC_API_KEY;
}

function extractJson(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1) return text;
  return text.slice(first, last + 1);
}

export type GenerateSectionResult = {
  section: Section;
  modelUsed: string;
};

export async function generateSection(
  prompt: string,
): Promise<GenerateSectionResult> {
  if (isMockMode()) {
    return { section: sectionSchema.parse(mockSection(prompt)), modelUsed: "mock" };
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const attempt = async (
    messages: Anthropic.MessageParam[],
  ): Promise<Section> => {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: SECTION_SYSTEM_PROMPT,
      messages,
    });
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    return sectionSchema.parse(JSON.parse(extractJson(text)));
  };

  const initial: Anthropic.MessageParam[] = [
    { role: "user", content: buildSectionUserPrompt(prompt) },
  ];

  try {
    return { section: await attempt(initial), modelUsed: MODEL };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Fall back to mock if billing is the blocker — keeps the flow usable.
    if (/credit balance|billing|insufficient|payment/i.test(msg)) {
      return {
        section: sectionSchema.parse(mockSection(prompt)),
        modelUsed: "mock (anthropic billing fallback)",
      };
    }
    // One retry feeding the validation error back.
    const section = await attempt([
      ...initial,
      { role: "assistant", content: "I produced invalid output." },
      {
        role: "user",
        content: `Your previous output failed validation:\n${msg}\n\nReturn a corrected single JSON section object only.`,
      },
    ]);
    return { section, modelUsed: MODEL };
  }
}
