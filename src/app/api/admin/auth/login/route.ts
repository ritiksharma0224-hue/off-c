import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createSessionToken,
  ADMIN_COOKIE_NAME,
} from "@/lib/auth";
import { recordAuditLog } from "@/lib/db/audit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Admin Email/ID and password are required" },
        { status: 400 }
      );
    }

    const verification = await verifyAdminCredentials(email, password);
    if (!verification.success || !verification.user) {
      return NextResponse.json(
        { success: false, error: verification.error || "Invalid admin credentials" },
        { status: 401 }
      );
    }

    const { user } = verification;
    const token = createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}`,
      user,
      token,
    });

    // Set secure HTTP-only cookie (7 days)
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    await recordAuditLog({
      admin: user.name,
      action: "ADMIN_LOGIN",
      targetType: "AUTH",
      targetId: user.id,
      targetName: user.name,
      details: `Admin ${user.name} (${user.email}) logged in with role [${user.role}]`,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
