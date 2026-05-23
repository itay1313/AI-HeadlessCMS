// Lightweight typing for storyblokEditable so we don't need to import the SDK
// in every server component. The SDK injects data-* attrs read by the bridge.
import { storyblokEditable } from "@storyblok/react/rsc";
import type { StoryblokBlok } from "@/types/storyblok";

export function editable(blok: StoryblokBlok | Record<string, unknown>) {
  return storyblokEditable(blok as Parameters<typeof storyblokEditable>[0]);
}
