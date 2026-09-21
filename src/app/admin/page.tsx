"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  CalendarCheck,
  Clock,
  Boxes,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  Plus,
  RefreshCw,
} from "lucide-react";

interface DashboardStats {
  today: {
    ordersCount: number;
    reservationsCount: number;
    preordersCount: number;
    revenue: number;
    unitsSold: number;
  };
  inventory: {
    totalProducts: number;
    totalUnits: number;
    lowStockCount: number;
    outOfStockCount: number;
    preorderProductCount: number;
  };
  activity: {
    newOrders: number;
    newReservations: number;
    newPreorders: number;
    pendingOrders: number;
    pendingReservations: number;
    pendingPreorders: number;
  };
  performance: {
    topReserved: Array<{ id: string; name: string; reservations: number }>;
    topPreordered: Array<{ id: string; name: string; preorders: number }>;
    topSelling: Array<{ id: string; name: string; unitsSold: number }>;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto select-none">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest block mb-1">
            EXECUTIVE OVERVIEW
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            STORE DASHBOARD
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Live metrics, variant inventory status, and real demand analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            title="Refresh Metrics"
            className="p-2.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-[#FF3B00] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e03400] transition-colors flex items-center gap-2 shadow-[2px_2px_0px_#000]"
          >
            <Plus className="h-4 w-4" />
            <span>CREATE PRODUCT</span>
          </Link>
        </div>
      </div>

      {/* SECTION 1: TODAY */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#FF3B00]" />
          <h2 className="text-xs font-mono font-black uppercase tracking-widest text-[#9AA0A6]">
            TODAY’S ACTIVITY
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-4 bg-[#14171F] border border-[#262B36] rounded">
            <span className="text-[10px] font-mono text-[#7B828F] uppercase block mb-1">ORDERS</span>
            <span className="font-mono text-2xl font-black text-white">
              {stats?.today.ordersCount ?? 0}
            </span>
            <span className="text-[10px] text-[#7B828F] block mt-1">Confirmed or Pending</span>
          </div>

          <div className="p-4 bg-[#14171F] border border-[#262B36] rounded">
            <span className="text-[10px] font-mono text-[#7B828F] uppercase block mb-1">RESERVATIONS</span>
            <span className="font-mono text-2xl font-black text-[#FF3B00]">
              {stats?.today.reservationsCount ?? 0}
            </span>
            <span className="text-[10px] text-[#7B828F] block mt-1">Size holds requested</span>
          </div>

          <div className="p-4 bg-[#14171F] border border-[#262B36] rounded">
            <span className="text-[10px] font-mono text-[#7B828F] uppercase block mb-1">PREORDERS</span>
            <span className="font-mono text-2xl font-black text-amber-400">
              {stats?.today.preordersCount ?? 0}
            </span>
            <span className="text-[10px] text-[#7B828F] block mt-1">Committed units</span>
          </div>

          <div className="p-4 bg-[#14171F] border border-[#262B36] rounded">
            <span className="text-[10px] font-mono text-[#7B828F] uppercase block mb-1">REVENUE (CAPTURED)</span>
            <span className="font-mono text-2xl font-black text-emerald-400">
              ₹{stats?.today.revenue ?? 0}
            </span>
            <span className="text-[10px] text-[#7B828F] block mt-1">Direct receipts</span>
          </div>

          <div className="p-4 bg-[#14171F] border border-[#262B36] rounded col-span-2 lg:col-span-1">
            <span className="text-[10px] font-mono text-[#7B828F] uppercase block mb-1">UNITS SOLD</span>
            <span className="font-mono text-2xl font-black text-white">
              {stats?.today.unitsSold ?? 0}
            </span>
            <span className="text-[10px] text-[#7B828F] block mt-1">Physical units</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: INVENTORY & HEALTH */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Boxes className="h-4 w-4 text-[#FF3B00]" />
          <h2 className="text-xs font-mono font-black uppercase tracking-widest text-[#9AA0A6]">
            CATALOG & INVENTORY HEALTH
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-4 bg-[#14171F] border border-[#262B36] rounded">
            <span className="text-[10px] font-mono text-[#7B828F] uppercase block mb-1">TOTAL PRODUCTS</span>
            <span className="font-mono text-2xl font-black text-white">
              {stats?.inventory.totalProducts ?? 0}
            </span>
            <Link href="/admin/products" className="text-[10px] text-[#FF3B00] hover:underline block mt-1 font-bold">
              View Catalog →
            </Link>
          </div>

          <div className="p-4 bg-[#14171F] border border-[#262B36] rounded">
            <span className="text-[10px] font-mono text-[#7B828F] uppercase block mb-1">PHYSICAL UNITS</span>
            <span className="font-mono text-2xl font-black text-white">
              {stats?.inventory.totalUnits ?? 0}
            </span>
            <span className="text-[10px] text-[#7B828F] block mt-1">In studio warehouse</span>
          </div>

          <div className="p-4 bg-[#14171F] border border-[#262B36] rounded">
            <span className="text-[10px] font-mono text-[#7B828F] uppercase block mb-1">LOW STOCK VARIANTS</span>
            <span className="font-mono text-2xl font-black text-amber-400">
              {stats?.inventory.lowStockCount ?? 0}
            </span>
            <span className="text-[10px] text-[#7B828F] block mt-1">Available &le; 5 units</span>
          </div>

          <div className="p-4 bg-[#14171F] border border-[#262B36] rounded">
            <span className="text-[10px] font-mono text-[#7B828F] uppercase block mb-1">OUT OF STOCK</span>
            <span className="font-mono text-2xl font-black text-red-400">
              {stats?.inventory.outOfStockCount ?? 0}
            </span>
            <span className="text-[10px] text-[#7B828F] block mt-1">Requires restock</span>
          </div>

          <div className="p-4 bg-[#14171F] border border-[#262B36] rounded col-span-2 lg:col-span-1">
            <span className="text-[10px] font-mono text-[#7B828F] uppercase block mb-1">PREORDER DESIGNS</span>
            <span className="font-mono text-2xl font-black text-white">
              {stats?.inventory.preorderProductCount ?? 0}
            </span>
            <span className="text-[10px] text-[#7B828F] block mt-1">Active campaigns</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: PRODUCT DEMAND & TOP PERFORMERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Top Reserved */}
        <div className="p-5 bg-[#14171F] border border-[#262B36] rounded space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#262B36]">
            <h3 className="text-xs font-mono font-black uppercase text-white tracking-wider flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-[#FF3B00]" />
              <span>TOP RESERVED DESIGNS</span>
            </h3>
            <Link href="/admin/reservations" className="text-[10px] font-mono text-[#FF3B00] hover:underline">
              ALL
            </Link>
          </div>

          {stats?.performance.topReserved && stats.performance.topReserved.length > 0 ? (
            <div className="divide-y divide-[#262B36] space-y-2">
              {stats.performance.topReserved.map((item, idx) => (
                <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-white font-medium truncate max-w-[200px]">{item.name}</span>
                  <span className="font-mono font-bold text-[#FF3B00]">{item.reservations} holds</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center font-mono text-xs text-[#7B828F] uppercase">
              NO DATA YET
            </div>
          )}
        </div>

        {/* Card 2: Top Preordered */}
        <div className="p-5 bg-[#14171F] border border-[#262B36] rounded space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#262B36]">
            <h3 className="text-xs font-mono font-black uppercase text-white tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>TOP PREORDERED PIECES</span>
            </h3>
            <Link href="/admin/preorders" className="text-[10px] font-mono text-[#FF3B00] hover:underline">
              ALL
            </Link>
          </div>

          {stats?.performance.topPreordered && stats.performance.topPreordered.length > 0 ? (
            <div className="divide-y divide-[#262B36] space-y-2">
              {stats.performance.topPreordered.map((item, idx) => (
                <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-white font-medium truncate max-w-[200px]">{item.name}</span>
                  <span className="font-mono font-bold text-amber-400">{item.preorders} units</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center font-mono text-xs text-[#7B828F] uppercase">
              NO DATA YET
            </div>
          )}
        </div>

        {/* Card 3: Top Selling Units */}
        <div className="p-5 bg-[#14171F] border border-[#262B36] rounded space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#262B36]">
            <h3 className="text-xs font-mono font-black uppercase text-white tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>TOP DISPATCHED DESIGNS</span>
            </h3>
            <Link href="/admin/orders" className="text-[10px] font-mono text-[#FF3B00] hover:underline">
              ALL
            </Link>
          </div>

          {stats?.performance.topSelling && stats.performance.topSelling.length > 0 ? (
            <div className="divide-y divide-[#262B36] space-y-2">
              {stats.performance.topSelling.map((item, idx) => (
                <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-white font-medium truncate max-w-[200px]">{item.name}</span>
                  <span className="font-mono font-bold text-emerald-400">{item.unitsSold} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center font-mono text-xs text-[#7B828F] uppercase">
              NO DATA YET
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
