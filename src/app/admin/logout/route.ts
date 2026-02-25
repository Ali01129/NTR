import { NextResponse } from "next/server";
import { getSessionCookieName } from "@/lib/auth-admin";
import { cookies } from "next/headers";

export async function POST() {
  const store = await cookies();
  store.delete(getSessionCookieName());
  return NextResponse.redirect(new URL("/admin", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
}
