"use client";

import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

// Initialize the Storyblok bridge on the client so the Visual Editor can
// communicate with the page. Components themselves use storyblokEditable
// via the helper in components/storyblok/editable.ts.
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  bridge: true,
});

export default function StoryblokProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
