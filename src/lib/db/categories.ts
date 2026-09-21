import {
  readTable,
  writeTable,
  getInitialCategoriesSeed,
} from "./index";
import { GarmentCategoryEntity } from "./types";
import { getDbProducts } from "./products";
import { recordAuditLog } from "./audit";

const TABLE_NAME = "categories";

/**
 * Fetch all garment categories with dynamic active product item counts
 */
export async function getDbCategories(): Promise<(GarmentCategoryEntity & { itemCount: number })[]> {
  const categories = await readTable<GarmentCategoryEntity>(TABLE_NAME, getInitialCategoriesSeed());
  const products = await getDbProducts(false);

  return categories.map((cat) => {
    const matchingProducts = products.filter(
      (p) => p.categorySlug === cat.slug || p.categoryId === cat.id
    );
    return {
      ...cat,
      itemCount: matchingProducts.length,
    };
  });
}

/**
 * Fetch category by slug
 */
export async function getDbCategoryBySlug(slug: string): Promise<GarmentCategoryEntity | null> {
  const categories = await readTable<GarmentCategoryEntity>(TABLE_NAME, getInitialCategoriesSeed());
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

/**
 * Create a new category
 */
export async function createDbCategory(
  input: Omit<GarmentCategoryEntity, "id" | "displayNumber" | "sortOrder"> & {
    displayNumber?: string;
    sortOrder?: number;
  },
  admin = "System Admin"
): Promise<GarmentCategoryEntity> {
  const categories = await readTable<GarmentCategoryEntity>(TABLE_NAME, getInitialCategoriesSeed());
  const id = input.slug || `cat-${Date.now()}`;
  const displayNumber =
    input.displayNumber || (categories.length + 1).toString().padStart(2, "0");

  const newCat: GarmentCategoryEntity = {
    ...input,
    id,
    displayNumber,
    sortOrder: input.sortOrder || categories.length + 1,
    status: input.status || "ACTIVE",
  };

  categories.push(newCat);
  await writeTable(TABLE_NAME, categories);

  await recordAuditLog({
    admin,
    action: "CATEGORY_CREATED",
    targetType: "CATEGORY",
    targetId: id,
    targetName: newCat.name,
    details: `Created garment category ${newCat.name}`,
  });

  return newCat;
}

/**
 * Update category
 */
export async function updateDbCategory(
  id: string,
  updates: Partial<GarmentCategoryEntity>,
  admin = "System Admin"
): Promise<GarmentCategoryEntity | null> {
  const categories = await readTable<GarmentCategoryEntity>(TABLE_NAME, getInitialCategoriesSeed());
  const index = categories.findIndex((c) => c.id === id || c.slug === id);
  if (index === -1) return null;

  const current = categories[index];
  const updated: GarmentCategoryEntity = {
    ...current,
    ...updates,
  };

  categories[index] = updated;
  await writeTable(TABLE_NAME, categories);

  await recordAuditLog({
    admin,
    action: "CATEGORY_UPDATED",
    targetType: "CATEGORY",
    targetId: id,
    targetName: updated.name,
    details: `Updated category ${updated.name}`,
  });

  return updated;
}
