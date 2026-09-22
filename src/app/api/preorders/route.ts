import { NextRequest, NextResponse } from "next/server";
import {
  getAllPreorders,
  createDbPreorder,
  updatePreorderStatus,
  getPreorderDemandSummary,
} from "@/lib/db/preorders";
import { getDbProductById } from "@/lib/db/products";
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
 * Customer storefront endpoint to commit to a preorder with validation and guardrails
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customerEmail = (body.customerEmail || body.email || "").trim().toLowerCase();
    const customerPhone = (body.customerPhone || body.phone || "").trim();
    const customerName = (body.customerName || body.name || "").trim();
    const { productId, size, shippingAddress } = body;

    // 1. Basic presence checks
    if (!productId || !size || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { success: false, error: "Product, size, name, email, and phone are required." },
        { status: 400 }
      );
    }

    if (customerName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid customer name." },
        { status: 400 }
      );
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 3. Phone format validation
    const phoneDigits = customerPhone.replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid phone number (7 to 15 digits)." },
        { status: 400 }
      );
    }

    // 4. Quantity bounds (1 to 5)
    const quantity = Math.min(5, Math.max(1, Math.floor(Number(body.quantity)) || 1));

    // 5. Product lookup & eligibility
    const product = await getDbProductById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 400 }
      );
    }

    if (product.status === "ARCHIVED") {
      return NextResponse.json(
        { success: false, error: "Preorders are not available for archived products." },
        { status: 400 }
      );
    }

    // Check size validity
    const allowedSizes = (product.preorderAllowedSizes && product.preorderAllowedSizes.length > 0)
      ? product.preorderAllowedSizes
      : product.availableSizes;

    const normalizedSize = String(size).trim().toUpperCase();
    if (!allowedSizes.map((s) => s.toUpperCase()).includes(normalizedSize)) {
      return NextResponse.json(
        {
          success: false,
          error: `Size '${size}' is not eligible for preorder on this garment. Available: ${allowedSizes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const result = await createDbPreorder({
      productId: product.id,
      size: normalizedSize,
      color: body.color,
      quantity,
      customerName,
      customerEmail,
      customerPhone: phoneDigits,
      shippingAddress,
      notes: typeof body.notes === "string" ? body.notes.slice(0, 500) : undefined,
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
