"use server";

import { redirect } from "next/navigation";
import { getAdminCredentials, createSessionCookie, getSessionCookieName } from "@/lib/auth-admin";
import { cookies } from "next/headers";

export type LoginState = { ok: true } | { ok: false; error: string };

export async function loginAction(
  _prev: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string) ?? "";

  const creds = getAdminCredentials();
  if (!creds) {
    return { ok: false, error: "Admin login is not configured (missing ADMIN_EMAIL/ADMIN_PASSWORD)." };
  }

  if (email !== creds.email || password !== creds.password) {
    return { ok: false, error: "Invalid email or password." };
  }

  const value = createSessionCookie(email, creds.password);
  const store = await cookies();
  store.set(getSessionCookieName(), value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(getSessionCookieName());
  redirect("/admin");
}
