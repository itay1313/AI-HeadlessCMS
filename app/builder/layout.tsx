import { redirect } from "next/navigation";
import { isAuthorizedPage } from "@/lib/auth";
import Sidebar from "@/components/builder/Sidebar";

export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAuthorizedPage();
  if (!ok) redirect("/builder-login");

  const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID ?? "";

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 [background:radial-gradient(60%_45%_at_50%_-5%,rgba(99,102,241,0.14),transparent_70%)]"
      />
      <Sidebar spaceId={spaceId} />
      <main className="relative pl-[84px]">
        <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">{children}</div>
      </main>
    </div>
  );
}
