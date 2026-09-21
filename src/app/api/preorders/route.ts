import { NextRequest, NextResponse } from "next/server";
import {
  getAllPreorders,
  createDbPreorder,
  updatePreorderStatus,
  getPreorderDemandSummary,
} from "@/lib/db/preorders";
import { validateAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/preorders
 */
export async function GET(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    if (searchParams.get("view") === "demand") {
      const demand = await getPreorderDemandSummary();
      return NextResponse.json({ success: true, demand });
    }

    const preorders = await getAllPreorders();
    return NextResponse.json({ success: true, preorders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/preorders
 * Customer storefront endpoint to commit to a preorder
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customerEmail = body.customerEmail || body.email;
    const customerPhone = body.customerPhone || body.phone;
    const { productId, size, customerName } = body;

    if (!productId || !size || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { success: false, error: "Product, size, name, email, and phone are required." },
        { status: 400 }
      );
    }

    const result = await createDbPreorder({
      ...body,
      customerEmail,
      customerPhone,
    });
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, preorder: result.preorder }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/preorders
 * Protected admin endpoint to update preorder status
 */
export async function PATCH(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required" },
        { status: 400 }
      );
    }

    const result = await updatePreorderStatus(id, status, auth.email || "Admin");
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
