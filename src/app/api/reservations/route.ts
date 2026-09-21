import { NextRequest, NextResponse } from "next/server";
import {
  getAllReservations,
  createDbReservation,
  updateReservationStatus,
  getReservationDemandSummary,
} from "@/lib/db/reservations";
import { validateAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/reservations
 */
export async function GET(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
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
 * Public customer endpoint to submit a drop reservation
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

    const result = await createDbReservation({
      ...body,
      customerEmail,
      customerPhone,
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
