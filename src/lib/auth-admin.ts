import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getAdminCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return null;
  return { email: email.trim(), password };
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  const creds = getAdminCredentials();
  if (!creds) return false;
  return verifySessionCookie(cookie, creds.password);
}

function verifySessionCookie(cookie: string, secret: string): boolean {
  const parts = cookie.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sig] = parts;
  try {
    const crypto = require("crypto");
    const expected = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
    if (expected !== sig) return false;
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) return false;
    return payload.email === process.env.ADMIN_EMAIL?.trim();
  } catch {
    return false;
  }
}

export function createSessionCookie(email: string, secret: string): string {
  const crypto = require("crypto");
  const exp = Date.now() + SESSION_MS;
  const payload = JSON.stringify({ email, exp });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
