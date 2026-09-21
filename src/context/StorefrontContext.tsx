"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { MasterProduct, GarmentCategoryEntity, DesignFamilyEntity, CollectionEntity } from "@/lib/db/types";
import { productsData } from "@/data/products";
import { garmentCategories } from "@/data/categories";
import { designFamilies } from "@/data/collections";

// Convert fallback data to match MasterProduct schema
function getFallbackProducts(): MasterProduct[] {
  return productsData.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    shortDescription: p.description,
    fullDescription: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    categoryId: p.categorySlug,
    categoryName: p.category,
    categorySlug: p.categorySlug,
    designFamilyId: p.designFamily.toLowerCase(),
    designFamilyName: p.designFamily,
    collectionId: "drop-001",
    collectionName: "DROP 001",
    drop: p.drop || "DROP 001",
    tags: [p.categorySlug, p.designFamily.toLowerCase()],
    fabric: p.fabric,
    gsm: p.gsm,
    fit: p.fit,
    printMethod: p.printMethod,
    care: p.care,
    details: p.details || [],
    gender: "UNISEX",
    image: p.image,
    images: p.images,
    imageSlots: p.images.map((url, idx) => ({
      id: `img-${idx}`,
      url,
      alt: p.name,
      slot: idx === 0 ? "PRIMARY" : idx === 1 ? "SECONDARY" : "DETAIL",
      isPrimary: idx === 0,
      isHover: idx === 1,
      position: idx + 1,
    })),
    availableSizes: p.sizes,
    colors: p.colors,
    variants: p.sizes.map((s) => ({
      id: `var-${p.id}-${s.toLowerCase()}`,
      productId: p.id,
      size: s,
      color: p.colors[0] || "Standard",
      sku: `KPD-${p.id.toUpperCase()}-${s}`,
      physicalStock: 15,
      reservedStock: 0,
      preorderedStock: 0,
      allocatedStock: 0,
      availableStock: 15,
    })),
    totalPhysicalStock: 60,
    totalReservedStock: 0,
    totalPreorderedStock: 0,
    totalAvailableStock: 60,
    lowStockThreshold: 5,
    status: "ACTIVE",
    badge: p.badge,
    isNew: Boolean(p.isNew),
    isPopular: Boolean(p.isPopular),
    featured: Boolean(p.featured),
    reservationEnabled: false,
    reservationAllowedSizes: p.sizes,
    reservationAllowedColors: p.colors,
    preorderEnabled: false,
    preorderAllowedSizes: p.sizes,
    preorderAllowedColors: p.colors,
    showPreorderCapacity: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

interface StorefrontContextType {
  products: MasterProduct[];
  categories: (GarmentCategoryEntity & { itemCount: number })[];
  designFamilies: (DesignFamilyEntity & { itemCount: number })[];
  collections: (CollectionEntity & { itemCount: number })[];
  isLoading: boolean;
  refreshStorefront: () => Promise<void>;
  getProductBySlug: (slug: string) => MasterProduct | undefined;
  getProductById: (id: string) => MasterProduct | undefined;
}

const StorefrontContext = createContext<StorefrontContextType | undefined>(undefined);

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<MasterProduct[]>(getFallbackProducts());
  const [categories, setCategories] = useState<(GarmentCategoryEntity & { itemCount: number })[]>(
    garmentCategories.map((c, i) => ({
      ...c,
      displayNumber: c.displayNumber,
      sortOrder: i + 1,
      status: "ACTIVE",
      itemCount: c.itemCount,
    }))
  );
  const [designFamiliesList, setDesignFamiliesList] = useState<(DesignFamilyEntity & { itemCount: number })[]>(
    designFamilies.map((f, i) => ({
      ...f,
      sortOrder: i + 1,
      status: "ACTIVE",
      itemCount: 2,
    }))
  );
  const [collectionsList, setCollectionsList] = useState<(CollectionEntity & { itemCount: number })[]>([
    {
      id: "drop-001",
      name: "DROP 001",
      slug: "drop-001",
      description: "The Inaugural Release of Kapdology",
      coverImage: "/images/hero.png",
      featured: true,
      sortOrder: 1,
      status: "ACTIVE",
      itemCount: 10,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live single source of truth from API
  const refreshStorefront = useCallback(async () => {
    try {
      const res = await fetch("/api/storefront/data", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
        if (data.designFamilies && Array.isArray(data.designFamilies)) {
          setDesignFamiliesList(data.designFamilies);
        }
        if (data.collections && Array.isArray(data.collections)) {
          setCollectionsList(data.collections);
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    refreshStorefront();

    // Revalidate when user returns to tab
    const handleFocus = () => refreshStorefront();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshStorefront]);

  const getProductBySlug = useCallback(
    (slug: string) => {
      return products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    },
    [products]
  );

  const getProductById = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  return (
    <StorefrontContext.Provider
      value={{
        products,
        categories,
        designFamilies: designFamiliesList,
        collections: collectionsList,
        isLoading,
        refreshStorefront,
        getProductBySlug,
        getProductById,
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront(): StorefrontContextType {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error("useStorefront must be used within a StorefrontProvider");
  }
  return context;
}
