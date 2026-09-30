import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/auth";
import {
  getDbAdmins,
  createDbAdmin,
  updateDbAdmin,
  deleteDbAdmin,
  AdminRole,
} from "@/lib/db/admins";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users
 * List all admin users (Super Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (auth.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied. Only Super Admins can manage admin users." },
        { status: 403 }
      );
    }

    const admins = await getDbAdmins();
    return NextResponse.json({ success: true, admins });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Create a new admin user (Super Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (auth.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied. Only Super Admins can create admin accounts." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role, status } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Name, Email/ID, Password, and Role are required." },
        { status: 400 }
      );
    }

    const validRoles: AdminRole[] = ["SUPER_ADMIN", "STORE_MANAGER", "ORDER_OPERATOR", "CATALOG_EDITOR"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role specified." },
        { status: 400 }
      );
    }

    const result = await createDbAdmin(
      { name, email, password, role, status },
      auth.user.name || auth.user.email
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, admin: result.admin }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users
 * Update an admin (role, name, status, or reset password)
 */
export async function PUT(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, email, password, role, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Admin ID is required." }, { status: 400 });
    }

    // A non-super admin can only update their own password or name
    const isSelf = auth.user.id === id;
    const isSuperAdmin = auth.user.role === "SUPER_ADMIN";

    if (!isSuperAdmin && !isSelf) {
      return NextResponse.json(
        { success: false, error: "Access denied. You can only update your own profile." },
        { status: 403 }
      );
    }

    // Only Super Admin can change roles or status
    const updates: {
      name?: string;
      email?: string;
      password?: string;
      role?: AdminRole;
      status?: "ACTIVE" | "INACTIVE";
    } = {};

    if (name) updates.name = name;
    if (email && isSuperAdmin) updates.email = email;
    if (password) updates.password = password;
    if (role && isSuperAdmin) updates.role = role;
    if (status && isSuperAdmin) updates.status = status;

    const result = await updateDbAdmin(
      id,
      updates,
      auth.user.name || auth.user.email
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, admin: result.admin });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users
 * Delete an admin user (Super Admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (auth.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied. Only Super Admins can delete admin accounts." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Admin ID is required." }, { status: 400 });
    }

    // Cannot delete your own account
    if (auth.user.id === id) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own logged-in admin account." },
        { status: 400 }
      );
    }

    const result = await deleteDbAdmin(id, auth.user.name || auth.user.email);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Admin account deleted successfully." });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
