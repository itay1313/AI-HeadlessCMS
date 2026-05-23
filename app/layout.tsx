import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import StoryblokProvider from "./storyblok-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Display font for big headlines — modern, geometric, distinctive.
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
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
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <StoryblokProvider>{children}</StoryblokProvider>
      </body>
    </html>
  );
}
