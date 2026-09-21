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
  const generatedId = order.orderId || generateOrderId();
  
  const finalOrder: OrderPayload = {
    ...order,
    orderId: generatedId,
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

  // Future integration point:
  // e.g. const res = await fetch("/api/payment/create-order", { method: "POST", body: JSON.stringify(finalOrder) });
  // return await res.json();

  return {
    success: true,
    orderId: generatedId,
    orderStatus: "PAYMENT_PENDING",
    message: "Pre-order reservation placed successfully. Payment gateway will be connected soon.",
    gatewayAvailable: false,
    redirectUrl: `/order-confirmation?orderId=${generatedId}`,
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
