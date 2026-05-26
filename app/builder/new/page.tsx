import { cookies } from "next/headers";
import { SECRET_COOKIE } from "@/lib/auth";
import BuilderClient from "./BuilderClient";

export default async function NewPage() {
  const c = await cookies();
  const secret = c.get(SECRET_COOKIE)?.value ?? "";
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-white">
        Create a page
      </h1>
      {/* Light document panel on the dark studio canvas */}
      <div className="rounded-3xl bg-white p-6 text-ink shadow-lift md:p-8">
        <BuilderClient secret={secret} />
      </div>
    </div>
  );
}
