import { NextRequest, NextResponse } from "next/server";
import { getDbProducts } from "@/lib/db/products";
import { getAllOrders } from "@/lib/db/orders";
import { getAllReservations } from "@/lib/db/reservations";
import { getAllPreorders } from "@/lib/db/preorders";
import { getAllInventory } from "@/lib/db/inventory";
import { validateAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [products, orders, reservations, preorders, inventoryRows] = await Promise.all([
      getDbProducts(true),
      getAllOrders(),
      getAllReservations(),
      getAllPreorders(),
      getAllInventory(),
    ]);

    const todayDateString = new Date().toISOString().split("T")[0];

    // Today's Activity
    const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayDateString));
    const todayReservations = reservations.filter((r) => r.createdAt.startsWith(todayDateString));
    const todayPreorders = preorders.filter((p) => p.createdAt.startsWith(todayDateString));

    const todayRevenue = todayOrders
      .filter((o) => o.paymentStatus === "PAYMENT_CONFIRMED")
      .reduce((sum, o) => sum + o.total, 0);

    const todayUnitsSold = todayOrders.reduce(
      (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.quantity, 0),
      0
    );

    // Inventory Metrics
    const activeProducts = products.filter((p) => p.status !== "ARCHIVED");
    const totalUnits = inventoryRows.reduce((sum, i) => sum + i.physicalStock, 0);
    const lowStockCount = inventoryRows.filter((i) => i.isLowStock).length;
    const outOfStockCount = inventoryRows.filter((i) => i.isOutOfStock).length;
    const preorderProductCount = products.filter(
      (p) => p.preorderEnabled || p.status === "PREORDER"
    ).length;

    // Customer Activity Counts
    const pendingOrdersCount = orders.filter(
      (o) => o.fulfillmentStatus === "UNFULFILLED" || o.paymentStatus === "PAYMENT_PENDING"
    ).length;
    const pendingReservationsCount = reservations.filter((r) => r.status === "PENDING").length;
    const pendingPreordersCount = preorders.filter((p) => p.status === "PENDING").length;

    // Product Demand & Top Performance (real data only)
    const demandByProduct: {
      [productId: string]: {
        name: string;
        reservations: number;
        preorders: number;
        orders: number;
        unitsSold: number;
      };
    } = {};

    for (const p of activeProducts) {
      demandByProduct[p.id] = {
        name: p.name,
        reservations: 0,
        preorders: 0,
        orders: 0,
        unitsSold: 0,
      };
    }

    for (const r of reservations) {
      if (demandByProduct[r.productId]) {
        demandByProduct[r.productId].reservations += r.quantity;
      }
    }

    for (const p of preorders) {
      if (demandByProduct[p.productId]) {
        demandByProduct[p.productId].preorders += p.quantity;
      }
    }

    for (const o of orders) {
      for (const item of o.items) {
        if (demandByProduct[item.productId]) {
          demandByProduct[item.productId].orders += 1;
          demandByProduct[item.productId].unitsSold += item.quantity;
        }
      }
    }

    const demandList = Object.entries(demandByProduct).map(([id, d]) => ({
      id,
      ...d,
    }));

    const topReserved = [...demandList]
      .filter((d) => d.reservations > 0)
      .sort((a, b) => b.reservations - a.reservations)
      .slice(0, 5);

    const topPreordered = [...demandList]
      .filter((d) => d.preorders > 0)
      .sort((a, b) => b.preorders - a.preorders)
      .slice(0, 5);

    const topSelling = [...demandList]
      .filter((d) => d.unitsSold > 0)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      stats: {
        today: {
          ordersCount: todayOrders.length,
          reservationsCount: todayReservations.length,
          preordersCount: todayPreorders.length,
          revenue: todayRevenue,
          unitsSold: todayUnitsSold,
        },
        inventory: {
          totalProducts: activeProducts.length,
          totalUnits,
          lowStockCount,
          outOfStockCount,
          preorderProductCount,
        },
        activity: {
          newOrders: todayOrders.length,
          newReservations: todayReservations.length,
          newPreorders: todayPreorders.length,
          pendingOrders: pendingOrdersCount,
          pendingReservations: pendingReservationsCount,
          pendingPreorders: pendingPreordersCount,
        },
        performance: {
          topReserved,
          topPreordered,
          topSelling,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
