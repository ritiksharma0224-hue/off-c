import { NextRequest, NextResponse } from "next/server";
import {
  getAllOrders,
  getOrderById,
  createDbOrder,
  updateOrderPaymentStatus,
  updateOrderFulfillmentStatus,
} from "@/lib/db/orders";
import { getDbProductById } from "@/lib/db/products";
import { getDbSettings } from "@/lib/db/settings";
import { OrderItemRecord } from "@/lib/db/types";
import { requireAdminPermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/orders
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("id") || searchParams.get("orderNumber");

    if (orderId) {
      const order = await getOrderById(orderId);
      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    const auth = requireAdminPermission(request, "canManageOrders");
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
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
 * Storefront checkout endpoint to place an order with server-authoritative pricing and calculations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, shippingAddress, items, deliveryMethod, discountCode, promoCode, notes } = body;

    // 1. Validate customer object
    if (!customer || typeof customer !== "object") {
      return NextResponse.json(
        { success: false, error: "Customer details are required." },
        { status: 400 }
      );
    }

    const fullName = typeof customer.fullName === "string" ? customer.fullName.trim() : "";
    const email = typeof customer.email === "string" ? customer.email.trim().toLowerCase() : "";
    const phone = typeof customer.phone === "string" ? customer.phone.trim() : "";

    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid full name." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const phoneDigits = phone.replace(/\D/g, "");
    if (!cleanPhone || phoneDigits.length < 7 || phoneDigits.length > 15) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid contact phone number." },
        { status: 400 }
      );
    }

    // 2. Validate shippingAddress object
    if (!shippingAddress || typeof shippingAddress !== "object") {
      return NextResponse.json(
        { success: false, error: "Shipping address is required." },
        { status: 400 }
      );
    }

    const addressLine1 = typeof shippingAddress.addressLine1 === "string" ? shippingAddress.addressLine1.trim() : "";
    const addressLine2 = typeof shippingAddress.addressLine2 === "string" ? shippingAddress.addressLine2.trim() : "";
    const city = typeof shippingAddress.city === "string" ? shippingAddress.city.trim() : "";
    const state = typeof shippingAddress.state === "string" ? shippingAddress.state.trim() : "";
    const pincode = typeof shippingAddress.pincode === "string" ? shippingAddress.pincode.trim() : "";

    if (!addressLine1 || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, error: "Complete shipping address (street, city, state, pincode) is required." },
        { status: 400 }
      );
    }

    // 3. Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your bag is empty. Please add items before checking out." },
        { status: 400 }
      );
    }

    if (items.length > 50) {
      return NextResponse.json(
        { success: false, error: "Order exceeds maximum limit of 50 item lines." },
        { status: 400 }
      );
    }

    // 4. Authoritative product lookup & calculation from master DB
    const validatedItems: OrderItemRecord[] = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      if (!item || typeof item !== "object" || !item.productId) {
        return NextResponse.json(
          { success: false, error: "Invalid product item line in order." },
          { status: 400 }
        );
      }

      const product = await getDbProductById(String(item.productId));
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product with ID '${item.productId}' not found in catalog.` },
          { status: 400 }
        );
      }

      if (product.status === "ARCHIVED") {
        return NextResponse.json(
          { success: false, error: `Product '${product.name}' is archived and no longer available.` },
          { status: 400 }
        );
      }

      const quantity = Math.floor(Number(item.quantity));
      if (isNaN(quantity) || quantity < 1 || quantity > 10) {
        return NextResponse.json(
          { success: false, error: `Invalid quantity (${item.quantity}) for '${product.name}'. Must be 1 to 10 units.` },
          { status: 400 }
        );
      }

      const size = typeof item.size === "string" ? item.size.trim().toUpperCase() : "";
      if (!size || !product.availableSizes.map((s) => s.toUpperCase()).includes(size)) {
        return NextResponse.json(
          {
            success: false,
            error: `Size '${size}' is invalid for '${product.name}'. Available sizes: ${product.availableSizes.join(", ")}`,
          },
          { status: 400 }
        );
      }

      // Security: Authoritative unit price from Master DB (ignores any client-provided price)
      const unitPrice = Number(product.price);
      const totalPrice = unitPrice * quantity;
      calculatedSubtotal += totalPrice;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        slug: product.slug,
        size,
        color: typeof item.color === "string" && item.color.trim() ? item.color.trim() : (product.colors[0] || "Standard"),
        quantity,
        unitPrice,
        totalPrice,
        image: product.image || (product.images && product.images[0]) || "/images/hero.png",
      });
    }

    // 5. Authoritative shipping calculation from store settings
    const settings = await getDbSettings();
    const freeShippingThreshold = settings.freeShippingThreshold ?? 1999;
    const standardShippingFee = settings.standardShippingFee ?? 99;
    const calculatedShipping = calculatedSubtotal >= freeShippingThreshold ? 0 : standardShippingFee;

    // 6. Authoritative promo code verification
    const rawPromo = discountCode || promoCode || "";
    const sanitizedPromo = typeof rawPromo === "string" ? rawPromo.trim().toUpperCase() : "";
    let calculatedDiscount = 0;

    if (sanitizedPromo === "DROP001") {
      calculatedDiscount = Math.round(calculatedSubtotal * 0.10); // 10% launch promo
    }

    // 7. Authoritative total calculation (subtotal + shipping - discount)
    const calculatedTotal = Math.max(0, calculatedSubtotal + calculatedShipping - calculatedDiscount);

    // 8. Create DB order with authoritative amounts and enforced pending status
    const order = await createDbOrder({
      orderNumber: typeof body.orderNumber === "string" && body.orderNumber.startsWith("#KPD-") ? body.orderNumber : undefined,
      customer: {
        fullName,
        email,
        phone: cleanPhone,
      },
      shippingAddress: {
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        state,
        pincode,
        country: "India",
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      discount: calculatedDiscount,
      total: calculatedTotal,
      deliveryMethod: typeof deliveryMethod === "string" && deliveryMethod.trim()
        ? deliveryMethod.trim()
        : "Standard Pan-India Delivery (3-5 Business Days)",
      paymentMethod: "GATEWAY_PREORDER",
      paymentStatus: "PAYMENT_NOT_INTEGRATED",
      fulfillmentStatus: "UNFULFILLED",
      notes: typeof notes === "string" ? notes.slice(0, 500) : undefined,
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
    const auth = requireAdminPermission(request, "canManageOrders");
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
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
