import {
  readTable,
  writeTable,
  getInitialDesignFamiliesSeed,
} from "./index";
import { DesignFamilyEntity } from "./types";
import { getDbProducts } from "./products";
import { recordAuditLog } from "./audit";

const TABLE_NAME = "design_families";

/**
 * Fetch all design families with dynamic product item counts
 */
export async function getDbDesignFamilies(): Promise<(DesignFamilyEntity & { itemCount: number })[]> {
  const families = await readTable<DesignFamilyEntity>(TABLE_NAME, getInitialDesignFamiliesSeed());
  const products = await getDbProducts(false);

  return families.map((fam) => {
    const matchingProducts = products.filter(
      (p) =>
        p.designFamilyId.toLowerCase() === fam.slug.toLowerCase() ||
        p.designFamilyName.toLowerCase() === fam.name.toLowerCase()
    );
    return {
      ...fam,
      itemCount: matchingProducts.length,
    };
  });
}

/**
 * Fetch design family by slug
 */
export async function getDbDesignFamilyBySlug(slug: string): Promise<DesignFamilyEntity | null> {
  const families = await readTable<DesignFamilyEntity>(TABLE_NAME, getInitialDesignFamiliesSeed());
  return families.find((f) => f.slug.toLowerCase() === slug.toLowerCase()) || null;
}

/**
 * Create a new design family
 */
export async function createDbDesignFamily(
  input: Omit<DesignFamilyEntity, "id" | "sortOrder"> & { sortOrder?: number },
  admin = "System Admin"
): Promise<DesignFamilyEntity> {
  const families = await readTable<DesignFamilyEntity>(TABLE_NAME, getInitialDesignFamiliesSeed());
  const id = input.slug.toLowerCase();

  const newFamily: DesignFamilyEntity = {
    ...input,
    id,
    sortOrder: input.sortOrder || families.length + 1,
    status: input.status || "ACTIVE",
  };

  families.push(newFamily);
  await writeTable(TABLE_NAME, families);

  await recordAuditLog({
    admin,
    action: "DESIGN_FAMILY_CREATED",
    targetType: "DESIGN_FAMILY",
    targetId: id,
    targetName: newFamily.name,
    details: `Created design family ${newFamily.name}`,
  });

  return newFamily;
}

/**
 * Update design family
 */
export async function updateDbDesignFamily(
  id: string,
  updates: Partial<DesignFamilyEntity>,
  admin = "System Admin"
): Promise<DesignFamilyEntity | null> {
  const families = await readTable<DesignFamilyEntity>(TABLE_NAME, getInitialDesignFamiliesSeed());
  const index = families.findIndex((f) => f.id === id || f.slug === id);
  if (index === -1) return null;

  const current = families[index];
  const updated: DesignFamilyEntity = {
    ...current,
    ...updates,
  };

  families[index] = updated;
  await writeTable(TABLE_NAME, families);

  await recordAuditLog({
    admin,
    action: "DESIGN_FAMILY_UPDATED",
    targetType: "DESIGN_FAMILY",
    targetId: id,
    targetName: updated.name,
    details: `Updated design family ${updated.name}`,
  });

  return updated;
}
