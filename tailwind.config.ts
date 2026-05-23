import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#6366f1",
          dark: "#4338ca",
          light: "#a5b4fc",
        },
        ink: {
          DEFAULT: "#0a0a0f",
          soft: "#1c1c28",
          muted: "#52525b",
        },
      },
      fontSize: {
        // Modern, large display scale with tight leading
        "display-lg": ["clamp(3rem, 7vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "heading": ["clamp(1.875rem, 3vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.06)",
        lift: "0 4px 12px rgba(16,24,40,0.06), 0 24px 48px rgba(16,24,40,0.10)",
        glow: "0 20px 60px -12px rgba(99,102,241,0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
