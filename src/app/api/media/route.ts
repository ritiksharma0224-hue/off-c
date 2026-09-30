import { NextRequest, NextResponse } from "next/server";
import { getDbMedia, deleteDbMedia } from "@/lib/db/media";
import { validateAdminRequest, hasPermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/media
 * Fetch all media assets with resolved "usedBy" product references
 */
export async function GET(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const assets = await getDbMedia();
    return NextResponse.json({ success: true, media: assets });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/media
 * Delete media asset with protection if in use
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const canDelete =
      hasPermission(auth.role, "canManageProducts") ||
      hasPermission(auth.role, "canManageContent");
    if (!canDelete) {
      return NextResponse.json(
        { success: false, error: "Forbidden: insufficient permissions to manage media." },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const force = searchParams.get("force") === "true";

    if (!id) {
      return NextResponse.json({ success: false, error: "Asset id is required" }, { status: 400 });
    }

    const result = await deleteDbMedia(id, force, auth.email || "Admin");
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
