"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Search,
  Download,
  Filter,
  Check,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Reservation, ReservationStatus } from "@/lib/db/types";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [demand, setDemand] = useState<{
    total: number;
    byStatus: { [status: string]: number };
    byProduct: { [productId: string]: { name: string; total: number; sizes: { [size: string]: number } } };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const [resList, resDemand] = await Promise.all([
        fetch("/api/reservations"),
        fetch("/api/reservations?view=demand"),
      ]);
      const dataList = await resList.json();
      const dataDemand = await resDemand.json();

      if (dataList.success) setReservations(dataList.reservations);
      if (dataDemand.success) setDemand(dataDemand.demand);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(`Reservation updated to ${newStatus}`);
        setTimeout(() => setActionNotice(null), 3000);
        fetchReservations();
      }
    } catch {
      // Error
    }
  };

  const exportCSV = () => {
    if (reservations.length === 0) return;
    const headers = ["Reservation ID,Product,Size,Qty,Customer Name,Email,Phone,Status,Date\n"];
    const rows = reservations.map((r) =>
      `"${r.reservationNumber}","${r.productName}","${r.size}","${r.quantity}","${r.customerName}","${r.customerEmail}","${r.customerPhone}","${r.status}","${r.createdAt}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kapdology-reservations-${Date.now()}.csv`;
    a.click();
  };

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      searchQuery === "" ||
      r.reservationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest block mb-1">
            DEMAND CAPTURE & HOLDS
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            RESERVATIONS DASHBOARD
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Customer intent reservations prior to stock availability and drop launches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReservations}
            title="Refresh"
            className="p-2.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={exportCSV}
            disabled={reservations.length === 0}
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
            <CalendarCheck className="h-4 w-4 text-[#FF3B00]" />
            <span>DIRECT DEMAND BREAKDOWN BY SIZE</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(demand.byProduct).map(([prodId, prod]) => (
              <div key={prodId} className="p-3.5 bg-[#0E1015] border border-[#262B36] rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase text-xs truncate max-w-[220px]">
                    {prod.name}
                  </span>
                  <span className="font-mono text-xs font-black text-[#FF3B00]">
                    {prod.total} HOLDS
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
            placeholder="Search reservation #, customer, product..."
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
            <option value="EXPIRED">EXPIRED</option>
          </select>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-[#7B828F] uppercase tracking-widest">
            FETCHING ACTIVE RESERVATIONS...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <CalendarCheck className="h-8 w-8 text-[#7B828F] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">NO RESERVATIONS RECORDED YET</h3>
            <p className="text-xs text-[#7B828F]">
              Reservations placed on storefront product pages will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#262B36] bg-[#10131A] text-[10px] font-mono text-[#7B828F] uppercase tracking-wider">
                  <th className="py-3 px-4">RESERVATION #</th>
                  <th className="py-3 px-4">PRODUCT & SIZE</th>
                  <th className="py-3 px-4">CUSTOMER</th>
                  <th className="py-3 px-4">QTY</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">CREATED</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B36] font-mono">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#1A1E27] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#FF3B00]">
                      {r.reservationNumber}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-white font-bold block truncate max-w-xs">{r.productName}</span>
                      <span className="text-[10px] text-[#7B828F]">SIZE: {r.size} • {r.color}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-white font-bold block">{r.customerName}</span>
                      <span className="text-[10px] text-[#7B828F] block">{r.customerEmail}</span>
                      <span className="text-[10px] text-[#7B828F] block">{r.customerPhone}</span>
                    </td>

                    <td className="py-3 px-4 text-white font-bold">{r.quantity}</td>

                    <td className="py-3 px-4">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value as ReservationStatus)}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase bg-[#0E1015] border border-[#262B36] focus:outline-none ${
                          r.status === "PENDING"
                            ? "text-amber-400"
                            : r.status === "CONFIRMED"
                            ? "text-blue-400"
                            : r.status === "FULFILLED"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="FULFILLED">FULFILLED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="EXPIRED">EXPIRED</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-[10px] text-[#7B828F]">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <a
                        href={`mailto:${r.customerEmail}?subject=KAPDOLOGY%20Reservation%20${r.reservationNumber}`}
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
