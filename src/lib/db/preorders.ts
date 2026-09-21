import { readTable, writeTable } from "./index";
import { Preorder, PreorderStatus } from "./types";
import { getDbProductById, updateDbProduct } from "./products";
import { recordAuditLog } from "./audit";

const TABLE_NAME = "preorders";

/**
 * Fetch all preorders
 */
export async function getAllPreorders(): Promise<Preorder[]> {
  return await readTable<Preorder>(TABLE_NAME, []);
}

/**
 * Create a new customer preorder commitment
 */
export async function createDbPreorder(input: {
  productId: string;
  variantId?: string;
  size: string;
  color?: string;
  quantity?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  notes?: string;
}): Promise<{ success: boolean; preorder?: Preorder; error?: string }> {
  const product = await getDbProductById(input.productId);
  if (!product) {
    return { success: false, error: "Product not found" };
  }

  const preorders = await readTable<Preorder>(TABLE_NAME, []);
  const quantity = input.quantity || 1;
  const unitPrice = product.preorderPrice || product.price;
  const totalPrice = unitPrice * quantity;
  const color = input.color || product.colors[0] || "Standard";

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const preorderNumber = `#PRE-${randomDigits}`;
  const id = `pre-${Date.now()}-${randomDigits}`;

  // Match variant
  let variantId = input.variantId;
  if (!variantId) {
    const matched = product.variants.find((v) => v.size === input.size);
    variantId = matched ? matched.id : undefined;
  }

  // Increment preordered count
  if (variantId) {
    const vIndex = product.variants.findIndex((v) => v.id === variantId);
    if (vIndex !== -1) {
      const v = product.variants[vIndex];
      const updatedVariants = [...product.variants];
      updatedVariants[vIndex] = {
        ...v,
        preorderedStock: v.preorderedStock + quantity,
      };
      await updateDbProduct(product.id, { variants: updatedVariants });
    }
  }

  const preorder: Preorder = {
    id,
    preorderNumber,
    productId: product.id,
    productName: product.name,
    variantId,
    size: input.size,
    color,
    quantity,
    unitPrice,
    totalPrice,
    expectedFulfillmentDate: product.expectedFulfillmentDate,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    shippingAddress: input.shippingAddress,
    status: "PENDING",
    notes: input.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  preorders.unshift(preorder);
  await writeTable(TABLE_NAME, preorders);

  await recordAuditLog({
    admin: "Customer / Storefront",
    action: "PREORDER_CREATED",
    targetType: "PREORDER",
    targetId: preorder.id,
    targetName: `${preorder.preorderNumber} - ${product.name}`,
    details: `${input.customerName} preordered ${input.size} (${quantity} unit) for ₹${totalPrice}`,
  });

  return { success: true, preorder };
}

/**
 * Update preorder status
 */
export async function updatePreorderStatus(
  id: string,
  newStatus: PreorderStatus,
  admin = "System Admin"
): Promise<{ success: boolean; error?: string }> {
  const preorders = await readTable<Preorder>(TABLE_NAME, []);
  const index = preorders.findIndex((p) => p.id === id);
  if (index === -1) {
    return { success: false, error: "Preorder not found" };
  }

  const current = preorders[index];
  const oldStatus = current.status;

  if (newStatus === "CANCELLED" && oldStatus !== "CANCELLED") {
    if (current.variantId) {
      const product = await getDbProductById(current.productId);
      if (product) {
        const vIndex = product.variants.findIndex((v) => v.id === current.variantId);
        if (vIndex !== -1) {
          const v = product.variants[vIndex];
          const updatedVariants = [...product.variants];
          updatedVariants[vIndex] = {
            ...v,
            preorderedStock: Math.max(0, v.preorderedStock - current.quantity),
          };
          await updateDbProduct(product.id, { variants: updatedVariants }, admin);
        }
      }
    }
  }

  preorders[index] = {
    ...current,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  await writeTable(TABLE_NAME, preorders);

  await recordAuditLog({
    admin,
    action: "PREORDER_STATUS_CHANGED",
    targetType: "PREORDER",
    targetId: id,
    targetName: current.preorderNumber,
    details: `Changed preorder status from ${oldStatus} to ${newStatus}`,
  });

  return { success: true };
}

/**
 * Preorder demand breakdown
 */
export async function getPreorderDemandSummary() {
  const preorders = await getAllPreorders();
  
  const byProduct: { [productId: string]: { name: string; total: number; sizes: { [size: string]: number } } } = {};
  const byStatus: { [status: string]: number } = {
    PENDING: 0,
    CONFIRMED: 0,
    FULFILLED: 0,
    CANCELLED: 0,
  };

  for (const p of preorders) {
    byStatus[p.status] = (byStatus[p.status] || 0) + 1;

    if (!byProduct[p.productId]) {
      byProduct[p.productId] = { name: p.productName, total: 0, sizes: {} };
    }
    byProduct[p.productId].total += p.quantity;
    byProduct[p.productId].sizes[p.size] = (byProduct[p.productId].sizes[p.size] || 0) + p.quantity;
  }

  return {
    total: preorders.length,
    byStatus,
    byProduct,
  };
}
