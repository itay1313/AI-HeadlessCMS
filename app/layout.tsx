import type { Metadata } from "next";
import { Inter, Space_Grotesk, Fraunces, Sora } from "next/font/google";
import "./globals.css";
import StoryblokProvider from "./storyblok-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Display font pool — AI templates pick one per page via CSS vars.
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Landing Platform",
  description: "Generate and manage landing pages with AI + Storyblok.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${grotesk.variable} ${fraunces.variable} ${sora.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <StoryblokProvider>{children}</StoryblokProvider>
      </body>
    </html>
  );
}
