import { readTable, writeTable } from "./index";
import { Reservation, ReservationStatus } from "./types";
import { getDbProductById, updateDbProduct } from "./products";
import { recordAuditLog } from "./audit";

const TABLE_NAME = "reservations";

/**
 * Fetch all reservations
 */
export async function getAllReservations(): Promise<Reservation[]> {
  return await readTable<Reservation>(TABLE_NAME, []);
}

/**
 * Create a new customer reservation
 */
export async function createDbReservation(input: {
  productId: string;
  variantId?: string;
  size: string;
  color?: string;
  quantity?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}): Promise<{ success: boolean; reservation?: Reservation; error?: string }> {
  const product = await getDbProductById(input.productId);
  if (!product) {
    return { success: false, error: "Product not found" };
  }

  const reservations = await readTable<Reservation>(TABLE_NAME, []);
  const quantity = input.quantity || 1;
  const color = input.color || product.colors[0] || "Standard";

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const reservationNumber = `#RES-${randomDigits}`;
  const id = `res-${Date.now()}-${randomDigits}`;

  // Find or determine variant
  let variantId = input.variantId;
  if (!variantId) {
    const matched = product.variants.find((v) => v.size === input.size);
    variantId = matched ? matched.id : undefined;
  }

  // If variant matched, hold reserved stock
  if (variantId) {
    const variantIndex = product.variants.findIndex((v) => v.id === variantId);
    if (variantIndex !== -1) {
      const v = product.variants[variantIndex];
      const updatedVariants = [...product.variants];
      const newReserved = v.reservedStock + quantity;
      updatedVariants[variantIndex] = {
        ...v,
        reservedStock: newReserved,
        availableStock: Math.max(0, v.physicalStock - newReserved - v.allocatedStock),
      };
      await updateDbProduct(product.id, { variants: updatedVariants });
    }
  }

  const reservation: Reservation = {
    id,
    reservationNumber,
    productId: product.id,
    productName: product.name,
    variantId,
    size: input.size,
    color,
    quantity,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    status: "PENDING",
    notes: input.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  reservations.unshift(reservation);
  await writeTable(TABLE_NAME, reservations);

  await recordAuditLog({
    admin: "Customer / Storefront",
    action: "RESERVATION_CREATED",
    targetType: "RESERVATION",
    targetId: reservation.id,
    targetName: `${reservation.reservationNumber} - ${product.name}`,
    details: `${input.customerName} reserved size ${input.size} (${quantity} unit)`,
  });

  return { success: true, reservation };
}

/**
 * Update reservation status (PENDING, CONFIRMED, CANCELLED, FULFILLED, EXPIRED)
 */
export async function updateReservationStatus(
  id: string,
  newStatus: ReservationStatus,
  admin = "System Admin"
): Promise<{ success: boolean; error?: string }> {
  const reservations = await readTable<Reservation>(TABLE_NAME, []);
  const index = reservations.findIndex((r) => r.id === id);
  if (index === -1) {
    return { success: false, error: "Reservation not found" };
  }

  const current = reservations[index];
  const oldStatus = current.status;

  // Release reserved stock if transitioning to CANCELLED or EXPIRED or FULFILLED
  if (
    (newStatus === "CANCELLED" || newStatus === "EXPIRED" || newStatus === "FULFILLED") &&
    (oldStatus === "PENDING" || oldStatus === "CONFIRMED")
  ) {
    if (current.variantId) {
      const product = await getDbProductById(current.productId);
      if (product) {
        const vIndex = product.variants.findIndex((v) => v.id === current.variantId);
        if (vIndex !== -1) {
          const v = product.variants[vIndex];
          const newReserved = Math.max(0, v.reservedStock - current.quantity);
          const updatedVariants = [...product.variants];
          updatedVariants[vIndex] = {
            ...v,
            reservedStock: newReserved,
            availableStock: Math.max(0, v.physicalStock - newReserved - v.allocatedStock),
          };
          await updateDbProduct(product.id, { variants: updatedVariants }, admin);
        }
      }
    }
  }

  reservations[index] = {
    ...current,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  await writeTable(TABLE_NAME, reservations);

  await recordAuditLog({
    admin,
    action: "RESERVATION_STATUS_CHANGED",
    targetType: "RESERVATION",
    targetId: id,
    targetName: current.reservationNumber,
    details: `Changed status from ${oldStatus} to ${newStatus}`,
  });

  return { success: true };
}

/**
 * Aggregate reservation demand by product, size, and status
 */
export async function getReservationDemandSummary() {
  const reservations = await getAllReservations();
  
  const byProduct: { [productId: string]: { name: string; total: number; sizes: { [size: string]: number } } } = {};
  const byStatus: { [status: string]: number } = {
    PENDING: 0,
    CONFIRMED: 0,
    CANCELLED: 0,
    FULFILLED: 0,
    EXPIRED: 0,
  };

  for (const r of reservations) {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;

    if (!byProduct[r.productId]) {
      byProduct[r.productId] = { name: r.productName, total: 0, sizes: {} };
    }
    byProduct[r.productId].total += r.quantity;
    byProduct[r.productId].sizes[r.size] = (byProduct[r.productId].sizes[r.size] || 0) + r.quantity;
  }

  return {
    total: reservations.length,
    byStatus,
    byProduct,
  };
}
