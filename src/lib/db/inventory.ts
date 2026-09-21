import { readTable, writeTable } from "./index";
import {
  InventoryMovement,
  InventoryMovementType,
  ProductVariant,
} from "./types";
import { getDbProducts, updateDbProduct } from "./products";
import { recordAuditLog } from "./audit";

const MOVEMENTS_TABLE = "inventory_movements";

export interface InventoryItemRow {
  variantId: string;
  productId: string;
  productName: string;
  category: string;
  designFamily: string;
  image: string;
  size: string;
  color: string;
  sku: string;
  physicalStock: number;
  reservedStock: number;
  preorderedStock: number;
  allocatedStock: number;
  availableStock: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

/**
 * Fetch all variant inventory records across the catalog
 */
export async function getAllInventory(lowStockThreshold = 5): Promise<InventoryItemRow[]> {
  const products = await getDbProducts(false);
  const rows: InventoryItemRow[] = [];

  for (const product of products) {
    const threshold = product.lowStockThreshold || lowStockThreshold;
    for (const variant of product.variants) {
      const available = variant.physicalStock - variant.reservedStock - variant.allocatedStock;
      rows.push({
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        category: product.categoryName,
        designFamily: product.designFamilyName,
        image: product.image,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        physicalStock: variant.physicalStock,
        reservedStock: variant.reservedStock,
        preorderedStock: variant.preorderedStock,
        allocatedStock: variant.allocatedStock,
        availableStock: Math.max(0, available),
        isLowStock: available > 0 && available <= threshold,
        isOutOfStock: available <= 0,
      });
    }
  }

  return rows;
}

/**
 * Manually adjust physical stock with reason and audit trail
 */
export async function adjustVariantStock(params: {
  variantId: string;
  quantityChange: number;
  type: InventoryMovementType;
  reason: string;
  admin?: string;
}): Promise<{ success: boolean; updatedVariant?: ProductVariant; error?: string }> {
  const admin = params.admin || "System Admin";
  const products = await getDbProducts(true);

  let targetProduct = null;
  let targetVariantIndex = -1;

  for (const p of products) {
    const vIndex = p.variants.findIndex((v) => v.id === params.variantId);
    if (vIndex !== -1) {
      targetProduct = p;
      targetVariantIndex = vIndex;
      break;
    }
  }

  if (!targetProduct || targetVariantIndex === -1) {
    return { success: false, error: "Variant not found" };
  }

  const currentVariant = targetProduct.variants[targetVariantIndex];
  const previousStock = currentVariant.physicalStock;
  const newStock = Math.max(0, previousStock + params.quantityChange);

  // Update variant
  const updatedVariant: ProductVariant = {
    ...currentVariant,
    physicalStock: newStock,
    availableStock: Math.max(
      0,
      newStock - currentVariant.reservedStock - currentVariant.allocatedStock
    ),
  };

  const updatedVariants = [...targetProduct.variants];
  updatedVariants[targetVariantIndex] = updatedVariant;

  // Save product with updated variants
  await updateDbProduct(
    targetProduct.id,
    { variants: updatedVariants },
    admin
  );

  // Record movement in audit trail
  const movements = await readTable<InventoryMovement>(MOVEMENTS_TABLE, []);
  const movement: InventoryMovement = {
    id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    variantId: params.variantId,
    productId: targetProduct.id,
    productName: targetProduct.name,
    size: currentVariant.size,
    color: currentVariant.color,
    quantityChange: params.quantityChange,
    previousStock,
    newStock,
    type: params.type,
    reason: params.reason,
    admin,
    timestamp: new Date().toISOString(),
  };

  movements.unshift(movement);
  await writeTable(MOVEMENTS_TABLE, movements);

  await recordAuditLog({
    admin,
    action: "STOCK_ADJUSTED",
    targetType: "VARIANT",
    targetId: params.variantId,
    targetName: `${targetProduct.name} (${currentVariant.size})`,
    details: `${params.quantityChange > 0 ? "+" : ""}${params.quantityChange} units (${params.reason}). Previous: ${previousStock}, New: ${newStock}`,
  });

  return { success: true, updatedVariant };
}

/**
 * Fetch inventory movement history
 */
export async function getInventoryMovements(
  productId?: string,
  variantId?: string
): Promise<InventoryMovement[]> {
  const movements = await readTable<InventoryMovement>(MOVEMENTS_TABLE, []);
  if (variantId) {
    return movements.filter((m) => m.variantId === variantId);
  }
  if (productId) {
    return movements.filter((m) => m.productId === productId);
  }
  return movements;
}
