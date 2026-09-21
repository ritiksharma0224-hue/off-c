import fs from "fs/promises";
import path from "path";
import {
  MasterProduct,
  GarmentCategoryEntity,
  DesignFamilyEntity,
  CollectionEntity,
  InventoryMovement,
  Reservation,
  Preorder,
  MasterOrder,
  CustomerProfile,
  MediaAsset,
  AuditLog,
  StoreSettings,
} from "./types";
import { productsData } from "@/data/products";
import { garmentCategories } from "@/data/categories";
import { designFamilies } from "@/data/collections";

const DATA_DIR = path.join(process.cwd(), "data", "store");

// In-memory cache for fast sub-millisecond retrieval
const memoryCache: { [tableName: string]: unknown } = {};

/**
 * Ensures the data storage directory exists
 */
async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Already exists
  }
}

/**
 * Generic atomic JSON file reader with in-memory caching
 */
export async function readTable<T>(tableName: string, defaultSeed: T[]): Promise<T[]> {
  if (memoryCache[tableName]) {
    return memoryCache[tableName] as T[];
  }

  await ensureDir();
  const filePath = path.join(DATA_DIR, `${tableName}.json`);

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(data) as T[];
    memoryCache[tableName] = parsed;
    return parsed;
  } catch {
    // If file doesn't exist or is empty, write the initial seed
    await writeTable<T>(tableName, defaultSeed);
    memoryCache[tableName] = defaultSeed;
    return defaultSeed;
  }
}

/**
 * Generic atomic JSON file writer with write-to-temp-then-rename safety
 */
export async function writeTable<T>(tableName: string, data: T[]): Promise<void> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  const tempPath = path.join(DATA_DIR, `${tableName}.${Date.now()}.tmp`);

  const serialized = JSON.stringify(data, null, 2);
  await fs.writeFile(tempPath, serialized, "utf-8");
  await fs.rename(tempPath, filePath);

  // Update in-memory cache immediately
  memoryCache[tableName] = data;
}

/**
 * Single object reader/writer for Settings
 */
export async function readSettings(defaultSettings: StoreSettings): Promise<StoreSettings> {
  if (memoryCache["settings"]) {
    return memoryCache["settings"] as StoreSettings;
  }

  await ensureDir();
  const filePath = path.join(DATA_DIR, "settings.json");

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(data) as StoreSettings;
    memoryCache["settings"] = parsed;
    return parsed;
  } catch {
    await writeSettings(defaultSettings);
    return defaultSettings;
  }
}

export async function writeSettings(settings: StoreSettings): Promise<void> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, "settings.json");
  const tempPath = path.join(DATA_DIR, `settings.${Date.now()}.tmp`);

  const serialized = JSON.stringify(settings, null, 2);
  await fs.writeFile(tempPath, serialized, "utf-8");
  await fs.rename(tempPath, filePath);

  memoryCache["settings"] = settings;
}

/**
 * Initial Seeds Generator
 */
export function getInitialProductsSeed(): MasterProduct[] {
  return productsData.map((p) => {
    // Build initial variants from sizes and colors
    const variants = p.sizes.map((size, idx) => {
      const color = p.colors[0] || "Standard";
      const sku = `KPD-${p.id.toUpperCase()}-${size}-${idx + 1}`;
      const physicalStock = 15; // Initial realistic inventory for Drop 001
      const reservedStock = 0;
      const preorderedStock = 0;
      const allocatedStock = 0;
      const availableStock = physicalStock - reservedStock - allocatedStock;

      return {
        id: `var-${p.id}-${size.toLowerCase()}`,
        productId: p.id,
        size,
        color,
        sku,
        physicalStock,
        reservedStock,
        preorderedStock,
        allocatedStock,
        availableStock,
      };
    });

    const totalPhysical = variants.reduce((sum, v) => sum + v.physicalStock, 0);
    const totalAvailable = variants.reduce((sum, v) => sum + v.availableStock, 0);

    const imageSlots = p.images.map((url, i) => ({
      id: `img-${p.id}-${i + 1}`,
      url,
      alt: `${p.name} - View ${i + 1}`,
      slot: i === 0 ? ("PRIMARY" as const) : i === 1 ? ("SECONDARY" as const) : ("DETAIL" as const),
      isPrimary: i === 0,
      isHover: i === 1,
      position: i + 1,
    }));

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.description,
      fullDescription: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      discountPercentage: p.compareAtPrice
        ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
        : undefined,
      categoryId: p.categorySlug,
      categoryName: p.category,
      categorySlug: p.categorySlug,
      designFamilyId: p.designFamily.toLowerCase(),
      designFamilyName: p.designFamily,
      collectionId: "drop-001",
      collectionName: "DROP 001",
      drop: p.drop || "DROP 001",
      tags: [p.categorySlug, p.designFamily.toLowerCase(), "drop-001"],
      fabric: p.fabric,
      gsm: p.gsm,
      fit: p.fit,
      printMethod: p.printMethod,
      care: p.care,
      details: p.details || [],
      gender: "UNISEX",
      image: p.image,
      images: p.images,
      imageSlots,
      availableSizes: p.sizes,
      colors: p.colors,
      variants,
      totalPhysicalStock: totalPhysical,
      totalReservedStock: 0,
      totalPreorderedStock: 0,
      totalAvailableStock: totalAvailable,
      lowStockThreshold: 5,
      status: "ACTIVE" as const,
      badge: p.badge,
      isNew: Boolean(p.isNew),
      isPopular: Boolean(p.isPopular),
      featured: Boolean(p.featured),
      reservationEnabled: false,
      reservationAllowedSizes: p.sizes,
      reservationAllowedColors: p.colors,
      reservationCtaText: "RESERVE YOUR SIZE",
      preorderEnabled: false,
      preorderAllowedSizes: p.sizes,
      preorderAllowedColors: p.colors,
      preorderCtaText: "PREORDER NOW →",
      showPreorderCapacity: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

export function getInitialCategoriesSeed(): GarmentCategoryEntity[] {
  return garmentCategories.map((c, i) => ({
    id: c.slug,
    name: c.name,
    slug: c.slug,
    displayNumber: c.displayNumber,
    shortDescription: c.shortDescription,
    fullDescription: c.fullDescription,
    image: c.image,
    fitNote: c.fitNote,
    sortOrder: i + 1,
    status: "ACTIVE",
  }));
}

export function getInitialDesignFamiliesSeed(): DesignFamilyEntity[] {
  return designFamilies.map((f, i) => ({
    id: f.slug,
    name: f.name,
    slug: f.slug,
    subtitle: f.subtitle,
    description: f.description,
    features: f.features,
    tag: f.tag,
    coverImage: f.coverImage,
    sortOrder: i + 1,
    status: "ACTIVE",
  }));
}

export function getInitialCollectionsSeed(): CollectionEntity[] {
  return [
    {
      id: "drop-001",
      name: "DROP 001",
      slug: "drop-001",
      description: "Inaugural Chapter of Kapdology. 200-240 GSM organic cotton streetwear silhouettes.",
      coverImage: "/images/hero.png",
      startDate: "2026-09-01",
      featured: true,
      sortOrder: 1,
      status: "ACTIVE",
    },
  ];
}

export function getInitialSettingsSeed(): StoreSettings {
  return {
    lowStockThreshold: 5,
    currency: "INR",
    currencySymbol: "₹",
    freeShippingThreshold: 1999,
    standardShippingFee: 99,
    storeEmail: "contact@kapdology.store",
    paymentGatewayStatus: "PRE_RELEASE_INACTIVE",
    reservationNotice: "Drop inventory reserved directly with studio concierge.",
    preorderNotice: "Pre-order reservation confirmed. Dispatched upon drop completion.",
  };
}
