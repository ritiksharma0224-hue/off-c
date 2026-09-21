import {
  readTable,
  writeTable,
  getInitialCollectionsSeed,
} from "./index";
import { CollectionEntity } from "./types";
import { getDbProducts } from "./products";
import { recordAuditLog } from "./audit";

const TABLE_NAME = "collections";

/**
 * Fetch all collections with dynamic item counts
 */
export async function getDbCollections(): Promise<(CollectionEntity & { itemCount: number })[]> {
  const collections = await readTable<CollectionEntity>(TABLE_NAME, getInitialCollectionsSeed());
  const products = await getDbProducts(false);

  return collections.map((col) => {
    const matchingProducts = products.filter(
      (p) =>
        p.collectionId.toLowerCase() === col.slug.toLowerCase() ||
        p.collectionName.toLowerCase() === col.name.toLowerCase() ||
        p.drop.toLowerCase() === col.name.toLowerCase()
    );
    return {
      ...col,
      itemCount: matchingProducts.length,
    };
  });
}

/**
 * Fetch collection by slug
 */
export async function getDbCollectionBySlug(slug: string): Promise<CollectionEntity | null> {
  const collections = await readTable<CollectionEntity>(TABLE_NAME, getInitialCollectionsSeed());
  return collections.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

/**
 * Create a new collection
 */
export async function createDbCollection(
  input: Omit<CollectionEntity, "id" | "sortOrder"> & { sortOrder?: number },
  admin = "System Admin"
): Promise<CollectionEntity> {
  const collections = await readTable<CollectionEntity>(TABLE_NAME, getInitialCollectionsSeed());
  const id = input.slug.toLowerCase();

  const newCol: CollectionEntity = {
    ...input,
    id,
    sortOrder: input.sortOrder || collections.length + 1,
    status: input.status || "ACTIVE",
  };

  collections.push(newCol);
  await writeTable(TABLE_NAME, collections);

  await recordAuditLog({
    admin,
    action: "COLLECTION_CREATED",
    targetType: "COLLECTION",
    targetId: id,
    targetName: newCol.name,
    details: `Created collection ${newCol.name}`,
  });

  return newCol;
}

/**
 * Update collection
 */
export async function updateDbCollection(
  id: string,
  updates: Partial<CollectionEntity>,
  admin = "System Admin"
): Promise<CollectionEntity | null> {
  const collections = await readTable<CollectionEntity>(TABLE_NAME, getInitialCollectionsSeed());
  const index = collections.findIndex((c) => c.id === id || c.slug === id);
  if (index === -1) return null;

  const current = collections[index];
  const updated: CollectionEntity = {
    ...current,
    ...updates,
  };

  collections[index] = updated;
  await writeTable(TABLE_NAME, collections);

  await recordAuditLog({
    admin,
    action: "COLLECTION_UPDATED",
    targetType: "COLLECTION",
    targetId: id,
    targetName: updated.name,
    details: `Updated collection ${updated.name}`,
  });

  return updated;
}
