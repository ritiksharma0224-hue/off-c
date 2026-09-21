import {
  readTable,
  writeTable,
  getInitialProductsSeed,
} from "./index";
import { MasterProduct, ProductVariant, ProductImageSlot } from "./types";
import { recordAuditLog } from "./audit";

const TABLE_NAME = "products";

/**
 * Fetch all products from Master Database
 */
export async function getDbProducts(includeArchived = false): Promise<MasterProduct[]> {
  const products = await readTable<MasterProduct>(TABLE_NAME, getInitialProductsSeed());
  if (includeArchived) return products;
  return products.filter((p) => p.status !== "ARCHIVED");
}

/**
 * Fetch single product by ID
 */
export async function getDbProductById(id: string): Promise<MasterProduct | null> {
  const products = await getDbProducts(true);
  return products.find((p) => p.id === id) || null;
}

/**
 * Fetch single product by slug
 */
export async function getDbProductBySlug(slug: string): Promise<MasterProduct | null> {
  const products = await getDbProducts(false);
  return products.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

/**
 * Create a new product in Master Database
 */
export async function createDbProduct(
  input: Partial<MasterProduct> & { name: string; price: number; description?: string },
  admin = "System Admin"
): Promise<MasterProduct> {
  const products = await readTable<MasterProduct>(TABLE_NAME, getInitialProductsSeed());

  const id = input.id || `kpd-${Date.now().toString().slice(-6)}`;
  const slug =
    input.slug ||
    input.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  // Ensure unique slug
  let finalSlug = slug;
  let counter = 1;
  while (products.some((p) => p.slug === finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const availableSizes = input.availableSizes && input.availableSizes.length > 0
    ? input.availableSizes
    : ["S", "M", "L", "XL"];

  const colors = input.colors && input.colors.length > 0 ? input.colors : ["Standard Black"];

  // Generate variants if not provided
  const variants: ProductVariant[] = input.variants && input.variants.length > 0
    ? input.variants
    : availableSizes.map((size, idx) => ({
        id: `var-${id}-${size.toLowerCase()}`,
        productId: id,
        size,
        color: colors[0],
        sku: `KPD-${id.toUpperCase()}-${size}`,
        physicalStock: 10,
        reservedStock: 0,
        preorderedStock: 0,
        allocatedStock: 0,
        availableStock: 10,
      }));

  const totalPhysical = variants.reduce((sum, v) => sum + v.physicalStock, 0);
  const totalReserved = variants.reduce((sum, v) => sum + v.reservedStock, 0);
  const totalPreordered = variants.reduce((sum, v) => sum + v.preorderedStock, 0);
  const totalAvailable = variants.reduce((sum, v) => sum + v.availableStock, 0);

  const images = input.images && input.images.length > 0 ? input.images : [input.image || "/images/hero.png"];
  const primaryImage = input.image || images[0];

  const imageSlots: ProductImageSlot[] = input.imageSlots && input.imageSlots.length > 0
    ? input.imageSlots
    : images.map((url, i) => ({
        id: `img-${id}-${i + 1}`,
        url,
        alt: `${input.name} - View ${i + 1}`,
        slot: i === 0 ? "PRIMARY" : i === 1 ? "SECONDARY" : "DETAIL",
        isPrimary: i === 0,
        isHover: i === 1,
        position: i + 1,
      }));

  const now = new Date().toISOString();

  const newProduct: MasterProduct = {
    id,
    name: input.name,
    slug: finalSlug,
    shortDescription: input.shortDescription || input.description || "",
    fullDescription: input.fullDescription || input.description || "",
    price: Number(input.price),
    compareAtPrice: input.compareAtPrice ? Number(input.compareAtPrice) : undefined,
    discountPercentage: input.compareAtPrice
      ? Math.round(((input.compareAtPrice - input.price) / input.compareAtPrice) * 100)
      : undefined,
    categoryId: input.categoryId || "oversized-tees",
    categoryName: input.categoryName || "OVERSIZED T-SHIRTS",
    categorySlug: input.categorySlug || "oversized-tees",
    designFamilyId: input.designFamilyId || "global",
    designFamilyName: input.designFamilyName || "GLOBAL",
    collectionId: input.collectionId || "drop-001",
    collectionName: input.collectionName || "DROP 001",
    drop: input.drop || "DROP 001",
    tags: input.tags || ["streetwear"],
    fabric: input.fabric || "100% Combed Cotton",
    gsm: input.gsm || "240 GSM",
    fit: input.fit || "Signature Oversized Cut",
    printMethod: input.printMethod || "Direct Screenprint",
    care: input.care || "Machine wash cold inside-out. Hang dry.",
    details: input.details || ["Heavyweight Construction", "Drop Shoulder Drape"],
    gender: input.gender || "UNISEX",
    image: primaryImage,
    images,
    imageSlots,
    availableSizes,
    colors,
    variants,
    totalPhysicalStock: totalPhysical,
    totalReservedStock: totalReserved,
    totalPreorderedStock: totalPreordered,
    totalAvailableStock: totalAvailable,
    lowStockThreshold: input.lowStockThreshold || 5,
    status: input.status || "ACTIVE",
    badge: input.badge,
    isNew: input.isNew ?? true,
    isPopular: input.isPopular ?? false,
    featured: input.featured ?? false,
    reservationEnabled: input.reservationEnabled ?? false,
    reservationStartDate: input.reservationStartDate,
    reservationEndDate: input.reservationEndDate,
    maxReservations: input.maxReservations,
    reservationLimitPerCustomer: input.reservationLimitPerCustomer || 2,
    reservationAllowedSizes: input.reservationAllowedSizes || availableSizes,
    reservationAllowedColors: input.reservationAllowedColors || colors,
    reservationMessage: input.reservationMessage,
    reservationCtaText: input.reservationCtaText || "RESERVE YOUR SIZE",
    preorderEnabled: input.preorderEnabled ?? false,
    preorderStartDate: input.preorderStartDate,
    preorderEndDate: input.preorderEndDate,
    expectedFulfillmentDate: input.expectedFulfillmentDate,
    maxPreorders: input.maxPreorders,
    preorderPrice: input.preorderPrice ? Number(input.preorderPrice) : undefined,
    preorderMessage: input.preorderMessage,
    preorderAllowedSizes: input.preorderAllowedSizes || availableSizes,
    preorderAllowedColors: input.preorderAllowedColors || colors,
    preorderCtaText: input.preorderCtaText || "PREORDER NOW →",
    showPreorderCapacity: input.showPreorderCapacity ?? false,
    createdAt: now,
    updatedAt: now,
  };

  products.unshift(newProduct);
  await writeTable(TABLE_NAME, products);

  await recordAuditLog({
    admin,
    action: "PRODUCT_CREATED",
    targetType: "PRODUCT",
    targetId: newProduct.id,
    targetName: newProduct.name,
    details: `Created new product ${newProduct.name} at ₹${newProduct.price}`,
  });

  return newProduct;
}

/**
 * Update an existing product in Master Database
 */
export async function updateDbProduct(
  id: string,
  updates: Partial<MasterProduct>,
  admin = "System Admin"
): Promise<MasterProduct | null> {
  const products = await readTable<MasterProduct>(TABLE_NAME, getInitialProductsSeed());
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = products[index];

  // Recalculate variants & stock if variants changed
  let updatedVariants = updates.variants || current.variants;
  if (updates.availableSizes && updates.availableSizes.length > 0) {
    // Sync any new sizes into variants
    const currentSizes = new Set(updatedVariants.map((v) => v.size));
    const newVariants = [...updatedVariants];
    for (const size of updates.availableSizes) {
      if (!currentSizes.has(size)) {
        newVariants.push({
          id: `var-${id}-${size.toLowerCase()}`,
          productId: id,
          size,
          color: (updates.colors && updates.colors[0]) || current.colors[0] || "Standard",
          sku: `KPD-${id.toUpperCase()}-${size}`,
          physicalStock: 10,
          reservedStock: 0,
          preorderedStock: 0,
          allocatedStock: 0,
          availableStock: 10,
        });
      }
    }
    updatedVariants = newVariants.filter((v) => updates.availableSizes!.includes(v.size));
  }

  // Recalculate stock tallies
  const totalPhysical = updatedVariants.reduce((sum, v) => sum + v.physicalStock, 0);
  const totalReserved = updatedVariants.reduce((sum, v) => sum + v.reservedStock, 0);
  const totalPreordered = updatedVariants.reduce((sum, v) => sum + v.preorderedStock, 0);
  const totalAvailable = updatedVariants.reduce((sum, v) => sum + v.availableStock, 0);

  // Sync image alias
  const images = updates.images || current.images;
  const primaryImage = updates.image || (images.length > 0 ? images[0] : current.image);

  const updatedProduct: MasterProduct = {
    ...current,
    ...updates,
    image: primaryImage,
    images,
    variants: updatedVariants,
    totalPhysicalStock: totalPhysical,
    totalReservedStock: totalReserved,
    totalPreorderedStock: totalPreordered,
    totalAvailableStock: totalAvailable,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  await writeTable(TABLE_NAME, products);

  await recordAuditLog({
    admin,
    action: "PRODUCT_UPDATED",
    targetType: "PRODUCT",
    targetId: id,
    targetName: updatedProduct.name,
    details: `Updated product fields: ${Object.keys(updates).join(", ")}`,
  });

  return updatedProduct;
}

/**
 * Archive a product (soft delete)
 */
export async function archiveDbProduct(id: string, admin = "System Admin"): Promise<boolean> {
  const updated = await updateDbProduct(id, { status: "ARCHIVED" }, admin);
  return Boolean(updated);
}

/**
 * Delete a product permanently
 */
export async function deleteDbProduct(id: string, admin = "System Admin"): Promise<boolean> {
  const products = await readTable<MasterProduct>(TABLE_NAME, getInitialProductsSeed());
  const toDelete = products.find((p) => p.id === id);
  if (!toDelete) return false;

  const filtered = products.filter((p) => p.id !== id);
  await writeTable(TABLE_NAME, filtered);

  await recordAuditLog({
    admin,
    action: "PRODUCT_DELETED",
    targetType: "PRODUCT",
    targetId: id,
    targetName: toDelete.name,
    details: `Permanently deleted product ${toDelete.name}`,
  });

  return true;
}

/**
 * Duplicate an existing product
 */
export async function duplicateDbProduct(id: string, admin = "System Admin"): Promise<MasterProduct | null> {
  const source = await getDbProductById(id);
  if (!source) return null;

  return await createDbProduct(
    {
      ...source,
      id: undefined,
      slug: undefined,
      name: `${source.name} (Copy)`,
      status: "DRAFT",
    },
    admin
  );
}
