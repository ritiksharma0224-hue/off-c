"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Boxes,
  Search,
  Filter,
  AlertTriangle,
  Plus,
  Minus,
  History,
  Check,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";
import { InventoryItemRow } from "@/lib/db/inventory";
import { InventoryMovement } from "@/lib/db/types";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItemRow[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"matrix" | "history">("matrix");
  const [searchQuery, setSearchQuery] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Adjustment Modal State
  const [adjustTarget, setAdjustTarget] = useState<InventoryItemRow | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<string>("PRODUCTION_RECEIVED");
  const [adjustReason, setAdjustReason] = useState<string>("New Production Batch Received");
  const [isSubmittingAdjust, setIsSubmittingAdjust] = useState(false);
  const [adjustNotice, setAdjustNotice] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [invRes, movRes] = await Promise.all([
        fetch("/api/inventory"),
        fetch("/api/inventory?view=movements"),
      ]);
      const invData = await invRes.json();
      const movData = await movRes.json();

      if (invData.success) setInventory(invData.inventory);
      if (movData.success) setMovements(movData.movements);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTarget) return;

    setIsSubmittingAdjust(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: adjustTarget.variantId,
          quantityChange: adjustQty,
          type: adjustType,
          reason: adjustReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAdjustNotice(
          `Adjusted ${adjustTarget.productName} (${adjustTarget.size}) by ${adjustQty > 0 ? "+" : ""}${adjustQty}`
        );
        setTimeout(() => setAdjustNotice(null), 3000);
        setAdjustTarget(null);
        fetchInventory();
      }
    } catch {
      // Error
    } finally {
      setIsSubmittingAdjust(false);
    }
  };

  const filtered = inventory.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.size.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLow = !lowStockOnly || item.isLowStock || item.isOutOfStock;

    return matchesSearch && matchesLow;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest block mb-1">
            REAL-TIME WAREHOUSE MATRIX
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            INVENTORY MANAGEMENT
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Variant-level physical stock, reserved allocations, and audit movements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInventory}
            title="Refresh Inventory"
            className="p-2.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="flex bg-[#14171F] border border-[#262B36] rounded p-1">
            <button
              onClick={() => setView("matrix")}
              className={`px-3 py-1.5 rounded font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                view === "matrix" ? "bg-[#FF3B00] text-white" : "text-[#9AA0A6] hover:text-white"
              }`}
            >
              STOCK MATRIX
            </button>
            <button
              onClick={() => setView("history")}
              className={`px-3 py-1.5 rounded font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                view === "history" ? "bg-[#FF3B00] text-white" : "text-[#9AA0A6] hover:text-white"
              }`}
            >
              MOVEMENT AUDIT ({movements.length})
            </button>
          </div>
        </div>
      </div>

      {adjustNotice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{adjustNotice}</span>
        </div>
      )}

      {/* Toolbar */}
      {view === "matrix" && (
        <div className="p-4 bg-[#14171F] border border-[#262B36] rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7B828F]" />
            <input
              type="text"
              placeholder="Search product, variant, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white placeholder-[#7B828F] focus:outline-none focus:border-[#FF3B00]"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer self-start sm:self-center">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="accent-[#FF3B00] h-4 w-4"
            />
            <span className="font-mono text-xs text-white">Show Low / Out of Stock Only</span>
          </label>
        </div>
      )}

      {/* VIEW 1: STOCK MATRIX */}
      {view === "matrix" && (
        <div className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden">
          {loading ? (
            <div className="py-20 text-center font-mono text-xs text-[#7B828F] uppercase tracking-widest">
              QUERYING WAREHOUSE DATABASE...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Boxes className="h-8 w-8 text-[#7B828F] mx-auto opacity-50" />
              <h3 className="text-sm font-bold text-white uppercase font-mono">NO MATCHING VARIANTS</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#262B36] bg-[#10131A] text-[10px] font-mono text-[#7B828F] uppercase tracking-wider">
                    <th className="py-3 px-4">GARMENT</th>
                    <th className="py-3 px-4">SIZE</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">PHYSICAL</th>
                    <th className="py-3 px-4">RESERVED</th>
                    <th className="py-3 px-4">PREORDERED</th>
                    <th className="py-3 px-4">AVAILABLE</th>
                    <th className="py-3 px-4">HEALTH</th>
                    <th className="py-3 px-4 text-right">QUICK ADJUST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262B36] font-mono">
                  {filtered.map((row) => (
                    <tr key={row.variantId} className="hover:bg-[#1A1E27] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-11 bg-black border border-[#262B36] rounded overflow-hidden shrink-0">
                            <Image src={row.image} alt={row.productName} fill sizes="36px" className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-white block text-xs truncate max-w-xs">{row.productName}</span>
                            <span className="text-[10px] text-[#7B828F] uppercase font-mono">{row.category}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-white text-sm">{row.size}</td>
                      <td className="py-3 px-4 text-[10px] text-[#7B828F]">{row.sku}</td>
                      <td className="py-3 px-4 font-bold text-white">{row.physicalStock}</td>
                      <td className="py-3 px-4 text-[#FF3B00] font-bold">{row.reservedStock}</td>
                      <td className="py-3 px-4 text-amber-400 font-bold">{row.preorderedStock}</td>
                      <td className="py-3 px-4 font-black text-sm text-emerald-400">
                        {row.availableStock}
                      </td>

                      <td className="py-3 px-4">
                        {row.isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-red-500/15 text-red-400 border border-red-500/30 uppercase">
                            OUT OF STOCK
                          </span>
                        ) : row.isLowStock ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                            HEALTHY
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setAdjustTarget(row)}
                          className="px-2.5 py-1 bg-[#0E1015] hover:bg-[#FF3B00] text-[#9AA0A6] hover:text-white border border-[#262B36] rounded text-[10px] font-bold uppercase transition-colors cursor-pointer"
                        >
                          ADJUST
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MOVEMENT AUDIT HISTORY */}
      {view === "history" && (
        <div className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden">
          {movements.length === 0 ? (
            <div className="py-20 text-center font-mono text-xs text-[#7B828F] uppercase">
              NO INVENTORY MOVEMENTS LOGGED YET
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-[#262B36] bg-[#10131A] text-[10px] text-[#7B828F] uppercase tracking-wider">
                    <th className="py-3 px-4">TIMESTAMP</th>
                    <th className="py-3 px-4">GARMENT & SIZE</th>
                    <th className="py-3 px-4">MOVEMENT</th>
                    <th className="py-3 px-4">PREVIOUS → NEW</th>
                    <th className="py-3 px-4">TYPE</th>
                    <th className="py-3 px-4">REASON</th>
                    <th className="py-3 px-4">ADMIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262B36]">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-[#1A1E27]">
                      <td className="py-3 px-4 text-[10px] text-[#7B828F]">
                        {new Date(m.timestamp).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white font-bold block">{m.productName}</span>
                        <span className="text-[10px] text-[#FF3B00]">SIZE {m.size}</span>
                      </td>
                      <td className="py-3 px-4 font-black text-sm">
                        <span className={m.quantityChange > 0 ? "text-emerald-400" : "text-red-400"}>
                          {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#7B828F]">
                        {m.previousStock} → <strong className="text-white">{m.newStock}</strong>
                      </td>
                      <td className="py-3 px-4 text-[10px] uppercase text-white font-bold">
                        {m.type.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 px-4 text-white font-sans text-xs">{m.reason}</td>
                      <td className="py-3 px-4 text-[10px] text-[#7B828F]">{m.admin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Manual Stock Adjustment Modal */}
      {adjustTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#14171F] border border-[#262B36] rounded-lg p-6 space-y-4">
            <div className="pb-3 border-b border-[#262B36]">
              <span className="font-mono text-[10px] text-[#FF3B00] font-bold uppercase block">
                AUDIT LOGGED ADJUSTMENT
              </span>
              <h3 className="font-black text-lg text-white uppercase mt-0.5">
                {adjustTarget.productName}
              </h3>
              <p className="font-mono text-xs text-[#7B828F]">
                SIZE: {adjustTarget.size} • SKU: {adjustTarget.sku} • CURRENT PHYSICAL: {adjustTarget.physicalStock}
              </p>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 font-mono">
              <div>
                <label className="block text-[10px] font-bold text-[#9AA0A6] uppercase mb-1">
                  QUANTITY CHANGE (+ FOR ADDITION, - FOR DEDUCTION) *
                </label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-base font-bold focus:outline-none focus:border-[#FF3B00]"
                />
                <span className="text-[10px] text-[#7B828F] mt-1 block">
                  Resulting Physical Stock: <strong>{Math.max(0, adjustTarget.physicalStock + adjustQty)}</strong>
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#9AA0A6] uppercase mb-1">
                  ADJUSTMENT TYPE *
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                >
                  <option value="PRODUCTION_RECEIVED">PRODUCTION BATCH RECEIVED (+)</option>
                  <option value="DAMAGED">DAMAGED / DEFECT (-)</option>
                  <option value="SAMPLE">SAMPLE REMOVED (-)</option>
                  <option value="AUDIT_CORRECTION">INVENTORY AUDIT CORRECTION</option>
                  <option value="ORDER_CANCELLED">ORDER CANCELLED RESTOCK (+)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#9AA0A6] uppercase mb-1">
                  REASON / AUDIT NOTE *
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Batch 04 received from Jaipur factory"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-sans focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAdjustTarget(null)}
                  className="flex-1 py-2.5 bg-[#1E232E] text-white font-bold uppercase rounded hover:bg-[#262B36] text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdjust}
                  className="flex-1 py-2.5 bg-[#FF3B00] text-white font-bold uppercase rounded hover:bg-[#e03400] text-xs disabled:opacity-50"
                >
                  {isSubmittingAdjust ? "RECORDING..." : "COMMIT CHANGE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
