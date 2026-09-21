import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "kapdology_admin_token";
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "kapdology_super_secret_jwt_key_2026_jaipur";

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@kapdology.store";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kapdology2026";

/**
 * Verify admin login credentials
 */
export function verifyAdminCredentials(email: string, pass: string): boolean {
  return (
    email.toLowerCase().trim() === DEFAULT_ADMIN_EMAIL.toLowerCase().trim() &&
    pass === DEFAULT_ADMIN_PASSWORD
  );
}

/**
 * Create a secure HMAC-signed session token
 */
export function createSessionToken(email: string): string {
  const payload = JSON.stringify({
    email,
    role: "ADMIN",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

/**
 * Validate and unpack session token
 */
export function verifySessionToken(token: string): { valid: boolean; email?: string } {
  if (!token || !token.includes(".")) {
    return { valid: false };
  }

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(encodedPayload)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return { valid: false };
  }

  try {
    const payloadStr = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadStr);

    if (Date.now() > payload.expiresAt) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

/**
 * Server-side check for Next.js App Router API or Server Components
 */
export async function getAdminSession(): Promise<{ authenticated: boolean; email?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return { authenticated: false };

    const result = verifySessionToken(token);
    return { authenticated: result.valid, email: result.email };
  } catch {
    return { authenticated: false };
  }
}

/**
 * Validate request in Route Handlers
 */
export function validateAdminRequest(request: NextRequest): { authenticated: boolean; email?: string } {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    // Also check Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.substring(7);
      const res = verifySessionToken(bearerToken);
      return { authenticated: res.valid, email: res.email };
    }
    return { authenticated: false };
  }

  const result = verifySessionToken(token);
  return { authenticated: result.valid, email: result.email };
}
