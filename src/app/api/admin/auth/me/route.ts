import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest, ROLE_PERMISSIONS } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = validateAdminRequest(request);
  if (!auth.authenticated || !auth.user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const permissions = auth.user.role
    ? ROLE_PERMISSIONS[auth.user.role]
    : ROLE_PERMISSIONS["SUPER_ADMIN"];

  return NextResponse.json({
    authenticated: true,
    user: auth.user,
    permissions,
  });
}
