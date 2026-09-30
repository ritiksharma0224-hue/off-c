import { NextRequest, NextResponse } from "next/server";
import {
  getDbProductById,
  updateDbProduct,
  deleteDbProduct,
  archiveDbProduct,
  duplicateDbProduct,
} from "@/lib/db/products";
import { requireAdminPermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/products/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getDbProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id]
 * Protected admin endpoint to update product info, pricing, images, variants, stock, etc.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdminPermission(request, "canManageProducts");
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await updateDbProduct(id, body, auth.email || "Admin");
    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Supports soft-archive (default or action=archive) or permanent delete (action=delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdminPermission(request, "canManageProducts");
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const action = request.nextUrl.searchParams.get("action") || "archive";

    if (action === "permanent") {
      const ok = await deleteDbProduct(id, auth.email || "Admin");
      return NextResponse.json({ success: ok });
    } else {
      const ok = await archiveDbProduct(id, auth.email || "Admin");
      return NextResponse.json({ success: ok });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products/[id]
 * Actions like duplicate
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAdminPermission(request, "canManageProducts");
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const action = request.nextUrl.searchParams.get("action");

    if (action === "duplicate") {
      const duplicated = await duplicateDbProduct(id, auth.email || "Admin");
      return NextResponse.json({ success: true, product: duplicated });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
