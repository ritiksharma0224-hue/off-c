import { readTable, writeTable } from "./index";
import {
  MasterOrder,
  OrderPaymentStatus,
  OrderFulfillmentStatus,
  CustomerProfile,
} from "./types";
import { recordAuditLog } from "./audit";
import { getDbProductById, updateDbProduct } from "./products";

const ORDERS_TABLE = "orders";
const CUSTOMERS_TABLE = "customers";

/**
 * Fetch all orders
 */
export async function getAllOrders(): Promise<MasterOrder[]> {
  return await readTable<MasterOrder>(ORDERS_TABLE, []);
}

/**
 * Fetch single order by ID or order number
 */
export async function getOrderById(idOrNumber: string): Promise<MasterOrder | null> {
  const orders = await getAllOrders();
  return (
    orders.find(
      (o) =>
        o.id === idOrNumber ||
        o.orderNumber.toLowerCase() === idOrNumber.toLowerCase() ||
        o.orderNumber.replace("#", "").toLowerCase() === idOrNumber.toLowerCase()
    ) || null
  );
}

/**
 * Create a new master order from checkout
 */
export async function createDbOrder(payload: Omit<MasterOrder, "id" | "orderNumber" | "createdAt" | "updatedAt"> & { orderNumber?: string }): Promise<MasterOrder> {
  const orders = await getAllOrders();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = payload.orderNumber || `#KPD-${randomDigits}`;
  const id = `order-${Date.now()}-${randomDigits}`;
  const now = new Date().toISOString();

  const newOrder: MasterOrder = {
    ...payload,
    id,
    orderNumber,
    paymentStatus: payload.paymentStatus || "PAYMENT_NOT_INTEGRATED",
    fulfillmentStatus: payload.fulfillmentStatus || "UNFULFILLED",
    createdAt: now,
    updatedAt: now,
  };

  orders.unshift(newOrder);
  await writeTable(ORDERS_TABLE, orders);

  // Allocate stock for each item in the order
  for (const item of newOrder.items) {
    try {
      const product = await getDbProductById(item.productId);
      if (product && product.variants && product.variants.length > 0) {
        const vIndex = product.variants.findIndex(
          (v) => v.size.toUpperCase() === item.size.toUpperCase()
        );
        if (vIndex !== -1) {
          const v = product.variants[vIndex];
          const newAllocated = (v.allocatedStock || 0) + item.quantity;
          const updatedVariants = [...product.variants];
          updatedVariants[vIndex] = {
            ...v,
            allocatedStock: newAllocated,
            availableStock: Math.max(0, v.physicalStock - (v.reservedStock || 0) - newAllocated),
          };
          await updateDbProduct(product.id, { variants: updatedVariants }, "System (Stock Allocation)");
        }
      }
    } catch {
      // Non-blocking stock allocation
    }
  }

  // Update or create customer profile
  await updateCustomerFromOrder(newOrder);

  await recordAuditLog({
    admin: "Customer / Checkout",
    action: "ORDER_PLACED",
    targetType: "ORDER",
    targetId: id,
    targetName: orderNumber,
    details: `Order placed for ₹${newOrder.total} by ${newOrder.customer.fullName} (${newOrder.customer.email})`,
  });

  return newOrder;
}

/**
 * Release allocated inventory when an order is cancelled
 */
async function releaseOrderAllocatedStock(order: MasterOrder, admin = "System Admin") {
  for (const item of order.items) {
    try {
      const product = await getDbProductById(item.productId);
      if (product && product.variants) {
        const vIndex = product.variants.findIndex(
          (v) => v.size.toUpperCase() === item.size.toUpperCase()
        );
        if (vIndex !== -1) {
          const v = product.variants[vIndex];
          const newAllocated = Math.max(0, (v.allocatedStock || 0) - item.quantity);
          const updatedVariants = [...product.variants];
          updatedVariants[vIndex] = {
            ...v,
            allocatedStock: newAllocated,
            availableStock: Math.max(0, v.physicalStock - (v.reservedStock || 0) - newAllocated),
          };
          await updateDbProduct(product.id, { variants: updatedVariants }, admin);
        }
      }
    } catch {
      // Non-blocking
    }
  }
}

/**
 * Deduct physical inventory when an order is shipped
 */
async function deductOrderShippedStock(order: MasterOrder, admin = "System Admin") {
  for (const item of order.items) {
    try {
      const product = await getDbProductById(item.productId);
      if (product && product.variants) {
        const vIndex = product.variants.findIndex(
          (v) => v.size.toUpperCase() === item.size.toUpperCase()
        );
        if (vIndex !== -1) {
          const v = product.variants[vIndex];
          const newAllocated = Math.max(0, (v.allocatedStock || 0) - item.quantity);
          const newPhysical = Math.max(0, (v.physicalStock || 0) - item.quantity);
          const updatedVariants = [...product.variants];
          updatedVariants[vIndex] = {
            ...v,
            physicalStock: newPhysical,
            allocatedStock: newAllocated,
            availableStock: Math.max(0, newPhysical - (v.reservedStock || 0) - newAllocated),
          };
          await updateDbProduct(product.id, { variants: updatedVariants }, admin);
        }
      }
    } catch {
      // Non-blocking
    }
  }
}

/**
 * Update payment status
 */
export async function updateOrderPaymentStatus(
  id: string,
  paymentStatus: OrderPaymentStatus,
  admin = "System Admin"
): Promise<{ success: boolean; error?: string }> {
  const orders = await getAllOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return { success: false, error: "Order not found" };

  const current = orders[index];
  const oldStatus = current.paymentStatus;

  // If order is cancelled, release allocated stock if not already cancelled
  if (paymentStatus === "CANCELLED" && oldStatus !== "CANCELLED" && current.fulfillmentStatus !== "CANCELLED") {
    await releaseOrderAllocatedStock(current, admin);
  }

  orders[index] = {
    ...current,
    paymentStatus,
    updatedAt: new Date().toISOString(),
  };

  await writeTable(ORDERS_TABLE, orders);

  await recordAuditLog({
    admin,
    action: "ORDER_PAYMENT_STATUS_CHANGED",
    targetType: "ORDER",
    targetId: id,
    targetName: current.orderNumber,
    details: `Payment status changed from ${oldStatus} to ${paymentStatus}`,
  });

  return { success: true };
}

/**
 * Update fulfillment status and tracking information
 */
export async function updateOrderFulfillmentStatus(
  id: string,
  fulfillmentStatus: OrderFulfillmentStatus,
  trackingInfo?: { trackingNumber?: string; carrier?: string },
  admin = "System Admin"
): Promise<{ success: boolean; error?: string }> {
  const orders = await getAllOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return { success: false, error: "Order not found" };

  const current = orders[index];
  const oldStatus = current.fulfillmentStatus;

  // Handle inventory state transitions
  if (fulfillmentStatus === "CANCELLED" && oldStatus !== "CANCELLED") {
    await releaseOrderAllocatedStock(current, admin);
  } else if (
    (fulfillmentStatus === "SHIPPED" || fulfillmentStatus === "DELIVERED") &&
    oldStatus !== "SHIPPED" &&
    oldStatus !== "DELIVERED"
  ) {
    await deductOrderShippedStock(current, admin);
  }

  orders[index] = {
    ...current,
    fulfillmentStatus,
    trackingNumber: trackingInfo?.trackingNumber !== undefined ? trackingInfo.trackingNumber : current.trackingNumber,
    carrier: trackingInfo?.carrier !== undefined ? trackingInfo.carrier : current.carrier,
    updatedAt: new Date().toISOString(),
  };

  await writeTable(ORDERS_TABLE, orders);

  await recordAuditLog({
    admin,
    action: "ORDER_FULFILLMENT_STATUS_CHANGED",
    targetType: "ORDER",
    targetId: id,
    targetName: current.orderNumber,
    details: `Fulfillment status changed from ${oldStatus} to ${fulfillmentStatus}${trackingInfo?.trackingNumber ? ` (Tracking: ${trackingInfo.trackingNumber})` : ""}`,
  });

  return { success: true };
}

/**
 * Customer profile aggregation helper
 */
async function updateCustomerFromOrder(order: MasterOrder) {
  const customers = await readTable<CustomerProfile>(CUSTOMERS_TABLE, []);
  const emailLower = order.customer.email.toLowerCase().trim();
  const index = customers.findIndex((c) => c.email.toLowerCase() === emailLower);

  const now = new Date().toISOString();

  if (index !== -1) {
    const existing = customers[index];
    customers[index] = {
      ...existing,
      fullName: order.customer.fullName || existing.fullName,
      phone: order.customer.phone || existing.phone,
      totalOrders: existing.totalOrders + 1,
      totalSpent: existing.totalSpent + (order.paymentStatus === "PAYMENT_CONFIRMED" ? order.total : 0),
      lastActivityAt: now,
    };
  } else {
    customers.push({
      id: `cust-${Date.now()}`,
      fullName: order.customer.fullName,
      email: order.customer.email,
      phone: order.customer.phone,
      totalOrders: 1,
      totalReservations: 0,
      totalPreorders: 0,
      totalSpent: order.paymentStatus === "PAYMENT_CONFIRMED" ? order.total : 0,
      lastActivityAt: now,
      createdAt: now,
    });
  }

  await writeTable(CUSTOMERS_TABLE, customers);
}

/**
 * Fetch all customer profiles
 */
export async function getAllCustomers(): Promise<CustomerProfile[]> {
  return await readTable<CustomerProfile>(CUSTOMERS_TABLE, []);
}
