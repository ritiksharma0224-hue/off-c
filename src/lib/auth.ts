import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import {
  AdminRole,
  getAdminByEmail,
  verifyPassword,
  recordAdminLogin,
} from "./db/admins";

export const ADMIN_COOKIE_NAME = "kapdology_admin_token";
export const SECRET_KEY =
  process.env.ADMIN_SECRET_KEY || "kapdology_super_secret_jwt_key_2026_jaipur";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export const ROLE_PERMISSIONS: Record<
  AdminRole,
  {
    canManageAdmins: boolean;
    canManageSettings: boolean;
    canManageProducts: boolean;
    canManageInventory: boolean;
    canManageOrders: boolean;
    canManageContent: boolean;
  }
> = {
  SUPER_ADMIN: {
    canManageAdmins: true,
    canManageSettings: true,
    canManageProducts: true,
    canManageInventory: true,
    canManageOrders: true,
    canManageContent: true,
  },
  STORE_MANAGER: {
    canManageAdmins: false,
    canManageSettings: false,
    canManageProducts: true,
    canManageInventory: true,
    canManageOrders: true,
    canManageContent: true,
  },
  ORDER_OPERATOR: {
    canManageAdmins: false,
    canManageSettings: false,
    canManageProducts: false,
    canManageInventory: true,
    canManageOrders: true,
    canManageContent: false,
  },
  CATALOG_EDITOR: {
    canManageAdmins: false,
    canManageSettings: false,
    canManageProducts: true,
    canManageInventory: false,
    canManageOrders: false,
    canManageContent: true,
  },
};

/**
 * Verify admin login credentials against database
 */
export async function verifyAdminCredentials(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  const admin = await getAdminByEmail(email);
  if (!admin) {
    return { success: false, error: "Invalid admin credentials." };
  }

  if (admin.status !== "ACTIVE") {
    return {
      success: false,
      error: "This administrator account is currently deactivated. Contact your Super Admin.",
    };
  }

  const isValid = verifyPassword(pass, admin.passwordHash, admin.salt);
  if (!isValid) {
    return { success: false, error: "Invalid admin credentials." };
  }

  // Update last login
  await recordAdminLogin(admin.id);

  return {
    success: true,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  };
}

/**
 * Create a secure HMAC-signed session token
 */
export function createSessionToken(user: SessionUser): string {
  const payload = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
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
export function verifySessionToken(token: string): {
  valid: boolean;
  user?: SessionUser;
  email?: string;
} {
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

    const sessionUser: SessionUser = {
      id: payload.id || "adm-legacy",
      email: payload.email,
      name: payload.name || "Administrator",
      role: (payload.role as AdminRole) || "SUPER_ADMIN",
    };

    return {
      valid: true,
      user: sessionUser,
      email: sessionUser.email,
    };
  } catch {
    return { valid: false };
  }
}

/**
 * Server-side check for Next.js App Router API or Server Components
 */
export async function getAdminSession(): Promise<{
  authenticated: boolean;
  user?: SessionUser;
  email?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return { authenticated: false };

    const result = verifySessionToken(token);
    return {
      authenticated: result.valid,
      user: result.user,
      email: result.user?.email,
    };
  } catch {
    return { authenticated: false };
  }
}

/**
 * Validate request in Route Handlers
 */
export function validateAdminRequest(request: NextRequest): {
  authenticated: boolean;
  user?: SessionUser;
  email?: string;
  role?: AdminRole;
} {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.substring(7);
      const res = verifySessionToken(bearerToken);
      return {
        authenticated: res.valid,
        user: res.user,
        email: res.user?.email,
        role: res.user?.role,
      };
    }
    return { authenticated: false };
  }

  const result = verifySessionToken(token);
  return {
    authenticated: result.valid,
    user: result.user,
    email: result.user?.email,
    role: result.user?.role,
  };
}
