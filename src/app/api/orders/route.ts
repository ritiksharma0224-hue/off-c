import { NextRequest, NextResponse } from "next/server";
import {
  getAllOrders,
  getOrderById,
  createDbOrder,
  updateOrderPaymentStatus,
  updateOrderFulfillmentStatus,
} from "@/lib/db/orders";
import { validateAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/orders
 */
export async function GET(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("id") || searchParams.get("orderNumber");

    if (orderId) {
      const order = await getOrderById(orderId);
      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Storefront checkout endpoint to place an order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, shippingAddress, items, total } = body;

    if (!customer || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer, shipping address, and items are required." },
        { status: 400 }
      );
    }

    const order = await createDbOrder({
      orderNumber: body.orderNumber,
      customer,
      shippingAddress,
      items,
      subtotal: Number(body.subtotal) || 0,
      shipping: Number(body.shipping) || 0,
      discount: Number(body.discount) || 0,
      total: Number(total) || 0,
      deliveryMethod: body.deliveryMethod || "Standard Pan-India Delivery",
      paymentMethod: body.paymentMethod || "GATEWAY_PREORDER",
      paymentStatus: body.paymentStatus || "PAYMENT_NOT_INTEGRATED",
      fulfillmentStatus: "UNFULFILLED",
      notes: body.notes,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders
 * Protected admin endpoint to update payment or fulfillment status
 */
export async function PATCH(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, paymentStatus, fulfillmentStatus, trackingNumber, carrier } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Order id is required" }, { status: 400 });
    }

    if (paymentStatus) {
      const res = await updateOrderPaymentStatus(id, paymentStatus, auth.email || "Admin");
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
    }

    if (fulfillmentStatus) {
      const res = await updateOrderFulfillmentStatus(
        id,
        fulfillmentStatus,
        { trackingNumber, carrier },
        auth.email || "Admin"
      );
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
