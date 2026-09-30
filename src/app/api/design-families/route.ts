import { NextRequest, NextResponse } from "next/server";
import {
  getDbDesignFamilies,
  createDbDesignFamily,
  updateDbDesignFamily,
} from "@/lib/db/design-families";
import { requireAdminPermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const families = await getDbDesignFamilies();
    return NextResponse.json({ success: true, designFamilies: families });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAdminPermission(request, "canManageContent");
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, error: "Name and slug are required" }, { status: 400 });
    }

    const created = await createDbDesignFamily(body, auth.email || "Admin");
    return NextResponse.json({ success: true, designFamily: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = requireAdminPermission(request, "canManageContent");
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Design family id is required" }, { status: 400 });
    }

    const updated = await updateDbDesignFamily(id, updates, auth.email || "Admin");
    if (!updated) {
      return NextResponse.json({ success: false, error: "Design family not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, designFamily: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
