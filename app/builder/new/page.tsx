import { cookies } from "next/headers";
import { SECRET_COOKIE } from "@/lib/auth";
import BuilderClient from "./BuilderClient";

export default async function NewPage() {
  const c = await cookies();
  const secret = c.get(SECRET_COOKIE)?.value ?? "";
  return <BuilderClient secret={secret} />;
}
