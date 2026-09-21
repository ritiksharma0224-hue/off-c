"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Search,
  Download,
  Filter,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Preorder, PreorderStatus } from "@/lib/db/types";

export default function AdminPreordersPage() {
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [demand, setDemand] = useState<{
    total: number;
    byStatus: { [status: string]: number };
    byProduct: { [productId: string]: { name: string; total: number; sizes: { [size: string]: number } } };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchPreorders = async () => {
    setLoading(true);
    try {
      const [pList, pDemand] = await Promise.all([
        fetch("/api/preorders"),
        fetch("/api/preorders?view=demand"),
      ]);
      const dataList = await pList.json();
      const dataDemand = await pDemand.json();

      if (dataList.success) setPreorders(dataList.preorders);
      if (dataDemand.success) setDemand(dataDemand.demand);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreorders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: PreorderStatus) => {
    try {
      const res = await fetch("/api/preorders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(`Preorder updated to ${newStatus}`);
        setTimeout(() => setActionNotice(null), 3000);
        fetchPreorders();
      }
    } catch {
      // Error
    }
  };

  const exportCSV = () => {
    if (preorders.length === 0) return;
    const headers = ["Preorder ID,Product,Size,Qty,Price,Total,Expected Dispatch,Customer,Email,Phone,Status,Date\n"];
    const rows = preorders.map((p) =>
      `"${p.preorderNumber}","${p.productName}","${p.size}","${p.quantity}","${p.unitPrice}","${p.totalPrice}","${p.expectedFulfillmentDate || "TBD"}","${p.customerName}","${p.customerEmail}","${p.customerPhone}","${p.status}","${p.createdAt}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kapdology-preorders-${Date.now()}.csv`;
    a.click();
  };

  const filtered = preorders.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.preorderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
        <div>
          <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
            PRODUCTION COMMITTED DEMAND
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            PREORDERS DASHBOARD
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Committed orders scheduled for fulfillment upon batch completion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPreorders}
            title="Refresh"
            className="p-2.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={exportCSV}
            disabled={preorders.length === 0}
            className="px-4 py-2 bg-[#1E232E] hover:bg-[#262B36] text-white font-mono text-xs font-bold uppercase rounded transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Demand Breakdown by Product & Size */}
      {demand && demand.total > 0 && (
        <div className="p-5 bg-[#14171F] border border-[#262B36] rounded-lg space-y-4">
          <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-[#262B36]">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>PREORDER BATCH ALLOCATION BY SIZE</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(demand.byProduct).map(([prodId, prod]) => (
              <div key={prodId} className="p-3.5 bg-[#0E1015] border border-[#262B36] rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase text-xs truncate max-w-[220px]">
                    {prod.name}
                  </span>
                  <span className="font-mono text-xs font-black text-amber-400">
                    {prod.total} UNITS
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                  {Object.entries(prod.sizes).map(([sz, count]) => (
                    <span
                      key={sz}
                      className="px-2 py-0.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6]"
                    >
                      {sz}: <strong className="text-white">{count}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="p-4 bg-[#14171F] border border-[#262B36] rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7B828F]" />
          <input
            type="text"
            placeholder="Search preorder #, customer, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white placeholder-[#7B828F] focus:outline-none focus:border-[#FF3B00]"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white focus:outline-none focus:border-[#FF3B00] font-mono"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="FULFILLED">FULFILLED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Preorders Table */}
      <div className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-[#7B828F] uppercase tracking-widest">
            FETCHING ACTIVE PREORDERS...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Clock className="h-8 w-8 text-[#7B828F] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">NO PREORDERS RECORDED YET</h3>
            <p className="text-xs text-[#7B828F]">
              Preorders submitted on product pages will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#262B36] bg-[#10131A] text-[10px] font-mono text-[#7B828F] uppercase tracking-wider">
                  <th className="py-3 px-4">PREORDER #</th>
                  <th className="py-3 px-4">GARMENT & SIZE</th>
                  <th className="py-3 px-4">DISPATCH TARGET</th>
                  <th className="py-3 px-4">TOTAL</th>
                  <th className="py-3 px-4">CUSTOMER</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B36] font-mono">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1A1E27] transition-colors">
                    <td className="py-3 px-4 font-bold text-amber-400">
                      {p.preorderNumber}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-white font-bold block truncate max-w-xs">{p.productName}</span>
                      <span className="text-[10px] text-[#7B828F]">SIZE: {p.size} • QTY: {p.quantity}</span>
                    </td>

                    <td className="py-3 px-4 text-[10px] text-[#7B828F]">
                      {p.expectedFulfillmentDate || "TBD"}
                    </td>

                    <td className="py-3 px-4 text-white font-bold text-sm">
                      ₹{p.totalPrice}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-white font-bold block">{p.customerName}</span>
                      <span className="text-[10px] text-[#7B828F] block">{p.customerPhone}</span>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value as PreorderStatus)}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[#0E1015] border border-[#262B36] focus:outline-none ${
                          p.status === "PENDING"
                            ? "text-amber-400"
                            : p.status === "CONFIRMED"
                            ? "text-blue-400"
                            : p.status === "FULFILLED"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="FULFILLED">FULFILLED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <a
                        href={`mailto:${p.customerEmail}?subject=KAPDOLOGY%20Preorder%20${p.preorderNumber}`}
                        className="px-2.5 py-1 bg-[#0E1015] hover:bg-[#FF3B00] text-[#9AA0A6] hover:text-white border border-[#262B36] rounded text-[10px] font-bold uppercase transition-colors"
                      >
                        CONTACT
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
