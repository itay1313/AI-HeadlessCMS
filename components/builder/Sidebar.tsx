"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const iconCls = "h-[22px] w-[22px]";

const HomeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconCls}>
    <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9.5V20h14V9.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const WandIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconCls}>
    <path d="M5 19 19 5" strokeLinecap="round" />
    <path d="M14 5h.01M19 10h.01M9 4h.01M4 9h.01" strokeLinecap="round" />
    <path d="m13 7 4 4" strokeLinecap="round" />
  </svg>
);
const StoryblokIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconCls}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M9 9h5M9 13h6M9 9v8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GlobeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconCls}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
  </svg>
);

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
  match?: (p: string) => boolean;
};

export default function Sidebar({ spaceId }: { spaceId: string }) {
  const path = usePathname() ?? "";

  const items: Item[] = [
    { href: "/builder", label: "Home", icon: HomeIcon, match: (p) => p === "/builder" },
    { href: "/builder/new", label: "Create", icon: WandIcon, match: (p) => p.startsWith("/builder/new") },
    {
      href: `https://app.storyblok.com/#/me/spaces/${spaceId}`,
      label: "Storyblok",
      icon: StoryblokIcon,
      external: true,
    },
    { href: "/", label: "Site", icon: GlobeIcon, external: true },
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[84px] flex-col items-center border-r border-white/10 bg-white/[0.02] py-5 backdrop-blur-xl">
      <Link
        href="/builder"
        className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-glow"
        aria-label="Landing Studio home"
      >
        AI
      </Link>

      <nav className="flex w-full flex-col gap-1 px-3">
        {items.map((it) => {
          const active = it.match?.(path) ?? false;
          const cls = `group flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-[11px] font-medium transition ${
            active
              ? "bg-white/10 text-white"
              : "text-white/45 hover:bg-white/5 hover:text-white"
          }`;
          const inner = (
            <>
              <span className={active ? "text-white" : "text-current"}>
                {it.icon}
              </span>
              {it.label}
            </>
          );
          return it.external ? (
            <a key={it.label} href={it.href} target="_blank" rel="noreferrer" className={cls}>
              {inner}
            </a>
          ) : (
            <Link key={it.label} href={it.href} className={cls}>
              {inner}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/80">
        I
      </div>
    </aside>
  );
}
