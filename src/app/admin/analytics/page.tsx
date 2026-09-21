"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  CalendarCheck,
  Clock,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
  Eye,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
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
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest block mb-1">
            DEMAND INTELLIGENCE
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            DEMAND & CONVERSION ANALYTICS
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Real customer interest, requested sizes, and preorder commitments. Zero fabricated numbers.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          title="Refresh"
          className="p-2.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Demand Funnel Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="p-5 bg-[#14171F] border border-[#262B36] rounded-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#7B828F]">
            <span className="font-bold text-white uppercase">SIZE RESERVATION DEMAND</span>
            <CalendarCheck className="h-4 w-4 text-[#FF3B00]" />
          </div>
          <span className="font-mono text-3xl font-black text-white block">
            {stats?.today.reservationsCount ?? 0}
          </span>
          <p className="text-xs text-[#7B828F]">
            Uncommitted demand holds indicating which silhouettes are most requested.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-[#14171F] border border-[#262B36] rounded-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#7B828F]">
            <span className="font-bold text-white uppercase">PREORDER COMMITMENT</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <span className="font-mono text-3xl font-black text-white block">
            {stats?.today.preordersCount ?? 0}
          </span>
          <p className="text-xs text-[#7B828F]">
            Committed purchases awaiting factory production delivery.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-[#14171F] border border-[#262B36] rounded-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#7B828F]">
            <span className="font-bold text-white uppercase">COMMERCE CHECKOUTS</span>
            <ShoppingBag className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="font-mono text-3xl font-black text-white block">
            {stats?.today.ordersCount ?? 0}
          </span>
          <p className="text-xs text-[#7B828F]">
            Completed customer orders routed for Jaipur studio fulfillment.
          </p>
        </div>

      </div>

      {/* Top Product Demand Rankings */}
      <div className="p-6 bg-[#14171F] border border-[#262B36] rounded-lg space-y-4">
        <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white pb-2 border-b border-[#262B36] flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#FF3B00]" />
          <span>GARMENT DEMAND LEADERBOARD</span>
        </h3>

        {stats?.performance.topReserved && stats.performance.topReserved.length > 0 ? (
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#262B36] text-[10px] text-[#7B828F] uppercase">
                  <th className="py-2.5 px-3">GARMENT</th>
                  <th className="py-2.5 px-3">RESERVATIONS</th>
                  <th className="py-2.5 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B36]">
                {stats.performance.topReserved.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#1A1E27]">
                    <td className="py-2.5 px-3 font-bold text-white">{item.name}</td>
                    <td className="py-2.5 px-3 font-black text-[#FF3B00] text-sm">
                      {item.reservations} holds
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-emerald-400 font-bold uppercase">
                      HIGH INTEREST
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center font-mono text-xs text-[#7B828F] uppercase">
            NO DATA YET — METRICS WILL APPEAR AS CUSTOMERS INTERACT WITH DROP 001
          </div>
        )}
      </div>

    </div>
  );
}
