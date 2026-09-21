import { NextRequest, NextResponse } from "next/server";
import { getAllInventory, adjustVariantStock, getInventoryMovements } from "@/lib/db/inventory";
import { validateAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/inventory
 */
export async function GET(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const view = searchParams.get("view"); // "movements" or default "matrix"

    if (view === "movements") {
      const productId = searchParams.get("productId") || undefined;
      const variantId = searchParams.get("variantId") || undefined;
      const movements = await getInventoryMovements(productId, variantId);
      return NextResponse.json({ success: true, movements });
    }

    const rows = await getAllInventory();
    return NextResponse.json({ success: true, inventory: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inventory
 * Adjust stock of a variant
 */
export async function POST(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { variantId, quantityChange, type, reason } = body;

    if (!variantId || quantityChange === undefined || !reason) {
      return NextResponse.json(
        { success: false, error: "variantId, quantityChange, and reason are required" },
        { status: 400 }
      );
    }

    const result = await adjustVariantStock({
      variantId,
      quantityChange: Number(quantityChange),
      type: type || "AUDIT_CORRECTION",
      reason: String(reason).trim(),
      admin: auth.email || "Admin",
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, updatedVariant: result.updatedVariant });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
