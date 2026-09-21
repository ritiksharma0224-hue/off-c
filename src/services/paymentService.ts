/**
 * KAPDOLOGY® Payment Gateway Service Abstraction
 * 
 * Decoupled architecture allowing future plug-in of Razorpay, Cashfree, Stripe, or UPI
 * without altering UI or checkout state logic.
 */

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  slug: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface OrderPayload {
  orderId?: string;
  customer: CustomerDetails;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  deliveryMethod: string;
  paymentMethod: "GATEWAY_PREORDER" | "UPI" | "CARD" | "NETBANKING" | "COD";
  status: "ORDER_CREATED" | "PAYMENT_PENDING" | "PAYMENT_CONFIRMED" | "CANCELLED";
  createdAt: string;
}

export interface PaymentInitResult {
  success: boolean;
  orderId: string;
  orderStatus: "ORDER_CREATED" | "PAYMENT_PENDING" | "PAYMENT_CONFIRMED";
  message: string;
  gatewayAvailable: boolean;
  redirectUrl?: string;
}

/**
 * Generate a clean Kapdology order ID format: #KPD-XXXX
 */
export function generateOrderId(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `KPD-${randomDigits}`;
}

/**
 * Creates a recorded order abstraction.
 * Currently stores the active order in sessionStorage/localStorage for confirmation page display,
 * pending future payment webhook activation.
 */
export async function createPaymentOrder(order: OrderPayload): Promise<PaymentInitResult> {
  let finalOrderId = order.orderId || generateOrderId();

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: order.customer,
        shippingAddress: order.shippingAddress,
        items: order.items.map((i) => ({
          productId: i.productId,
          variantId: `var-${i.productId}-${i.size.toLowerCase()}`,
          name: i.productName,
          slug: i.slug,
          size: i.size,
          color: "Standard",
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
          image: i.image,
        })),
        subtotal: order.subtotal,
        shipping: order.shipping,
        discount: order.discount,
        total: order.total,
        paymentMethod: order.paymentMethod || "GATEWAY_PREORDER",
        notes: "Storefront pre-release order placement",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.order) {
        finalOrderId = data.order.orderNumber;
      }
    }
  } catch (err) {
    console.error("Master order persistence error:", err);
  }

  const finalOrder: OrderPayload = {
    ...order,
    orderId: finalOrderId,
    status: "PAYMENT_PENDING",
    createdAt: new Date().toISOString(),
  };

  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("kapdology_latest_order", JSON.stringify(finalOrder));
    }
  } catch {
    // Session storage fallback
  }

  return {
    success: true,
    orderId: finalOrderId,
    orderStatus: "PAYMENT_PENDING",
    message: "Pre-order reservation placed successfully. Payment gateway will be connected soon.",
    gatewayAvailable: false,
    redirectUrl: `/order-confirmation?orderId=${finalOrderId}`,
  };
}

/**
 * Future Payment Processor hook
 */
export async function processPayment(orderId: string, paymentMethodDetails: unknown): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  // Stub for upcoming Razorpay/Cashfree SDK
  return {
    success: false,
    error: "Online payment gateway is in pre-launch integration mode. Pre-orders are accepted in pending status.",
  };
}
