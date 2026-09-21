import { NextResponse } from "next/server";
import { getDbProducts } from "@/lib/db/products";
import { getDbCategories } from "@/lib/db/categories";
import { getDbDesignFamilies } from "@/lib/db/design-families";
import { getDbCollections } from "@/lib/db/collections";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [allProducts, categories, designFamilies, collections] = await Promise.all([
      getDbProducts(false),
      getDbCategories(),
      getDbDesignFamilies(),
      getDbCollections(),
    ]);

    // Only public active non-draft products for storefront
    const products = allProducts.filter(
      (p) => p.status !== "DRAFT" && p.status !== "ARCHIVED"
    );

    return NextResponse.json({
      success: true,
      products,
      categories,
      designFamilies,
      collections,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
