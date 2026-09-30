import { NextRequest, NextResponse } from "next/server";
import {
  getAllReservations,
  createDbReservation,
  updateReservationStatus,
  getReservationDemandSummary,
} from "@/lib/db/reservations";
import { getDbProductById } from "@/lib/db/products";
import { requireAdminPermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/reservations
 */
export async function GET(request: NextRequest) {
  try {
    const auth = requireAdminPermission(request, "canManageOrders");
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const searchParams = request.nextUrl.searchParams;
    if (searchParams.get("view") === "demand") {
      const demand = await getReservationDemandSummary();
      return NextResponse.json({ success: true, demand });
    }

    const reservations = await getAllReservations();
    return NextResponse.json({ success: true, reservations });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reservations
 * Public customer endpoint to submit a drop reservation with input validation and guardrails
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customerEmail = (body.customerEmail || body.email || "").trim().toLowerCase();
    const customerPhone = (body.customerPhone || body.phone || "").trim();
    const customerName = (body.customerName || body.name || "").trim();
    const productId = body.productId;
    const size = body.size || body.selectedSize;

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
        { success: false, error: "Reservations are not available for archived products." },
        { status: 400 }
      );
    }

    // Check size validity
    const allowedSizes = (product.reservationAllowedSizes && product.reservationAllowedSizes.length > 0)
      ? product.reservationAllowedSizes
      : product.availableSizes;

    const normalizedSize = String(size).trim().toUpperCase();
    if (!allowedSizes.map((s) => s.toUpperCase()).includes(normalizedSize)) {
      return NextResponse.json(
        {
          success: false,
          error: `Size '${size}' is not eligible for reservation on this garment. Available: ${allowedSizes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 6. Check per-customer limit
    const existing = await getAllReservations();
    const customerExistingCount = existing
      .filter(
        (r) =>
          r.productId === productId &&
          (r.customerEmail.toLowerCase() === customerEmail || r.customerPhone.replace(/\D/g, "") === phoneDigits) &&
          r.status !== "CANCELLED" &&
          r.status !== "EXPIRED"
      )
      .reduce((sum, r) => sum + r.quantity, 0);

    const limit = product.reservationLimitPerCustomer || 2;
    if (customerExistingCount + quantity > limit) {
      return NextResponse.json(
        {
          success: false,
          error: `You have reached the limit of ${limit} reservation unit(s) for this garment.`,
        },
        { status: 400 }
      );
    }

    const result = await createDbReservation({
      ...body,
      productId: product.id,
      size: normalizedSize,
      quantity,
      customerName,
      customerEmail,
      customerPhone: phoneDigits,
      notes: typeof body.notes === "string" ? body.notes.slice(0, 500) : undefined,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, reservation: result.reservation }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/reservations
 * Protected admin endpoint to update status
 */
export async function PATCH(request: NextRequest) {
  try {
    const auth = requireAdminPermission(request, "canManageOrders");
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required" },
        { status: 400 }
      );
    }

    const result = await updateReservationStatus(id, status, auth.email || "Admin");
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
