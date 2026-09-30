import { NextRequest, NextResponse } from "next/server";
import { getDbProducts, createDbProduct } from "@/lib/db/products";
import { validateAdminRequest, requireAdminPermission } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/products
 * Returns active products for storefront, or all products (including drafts/hidden) if admin
 */
export async function GET(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    const searchParams = request.nextUrl.searchParams;
    const includeArchived = searchParams.get("includeArchived") === "true" && auth.authenticated;
    const adminMode = searchParams.get("admin") === "true" && auth.authenticated;

    const allProducts = await getDbProducts(includeArchived);

    if (adminMode) {
      return NextResponse.json({ success: true, products: allProducts });
    }

    // Public Storefront filter: only non-draft, non-archived products
    const publicProducts = allProducts.filter(
      (p) => p.status !== "DRAFT" && p.status !== "ARCHIVED"
    );

    return NextResponse.json({ success: true, products: publicProducts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Protected admin endpoint to create a new master product
 */
export async function POST(request: NextRequest) {
  try {
    const auth = requireAdminPermission(request, "canManageProducts");
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!body.name || body.price === undefined) {
      return NextResponse.json(
        { success: false, error: "Product name and price are required." },
        { status: 400 }
      );
    }

    const product = await createDbProduct(body, auth.email || "Admin");
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
