"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, RefreshCw, ShoppingBag, CalendarCheck, Clock } from "lucide-react";
import { CustomerProfile } from "@/lib/db/types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders"); // Also updates customers
      // Read customers directly
      const custRes = await fetch("/api/admin/stats");
      // Load orders to extract customer records
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      const resRes = await fetch("/api/reservations");
      const resData = await resRes.json();
      const preRes = await fetch("/api/preorders");
      const preData = await preRes.json();

      const customerMap: { [email: string]: CustomerProfile } = {};

      if (ordersData.orders) {
        for (const o of ordersData.orders) {
          const em = o.customer.email.toLowerCase();
          if (!customerMap[em]) {
            customerMap[em] = {
              id: `cust-${em}`,
              fullName: o.customer.fullName,
              email: o.customer.email,
              phone: o.customer.phone,
              totalOrders: 0,
              totalReservations: 0,
              totalPreorders: 0,
              totalSpent: 0,
              lastActivityAt: o.createdAt,
              createdAt: o.createdAt,
            };
          }
          customerMap[em].totalOrders += 1;
          customerMap[em].totalSpent += o.total;
        }
      }

      if (resData.reservations) {
        for (const r of resData.reservations) {
          const em = r.customerEmail.toLowerCase();
          if (!customerMap[em]) {
            customerMap[em] = {
              id: `cust-${em}`,
              fullName: r.customerName,
              email: r.customerEmail,
              phone: r.customerPhone,
              totalOrders: 0,
              totalReservations: 0,
              totalPreorders: 0,
              totalSpent: 0,
              lastActivityAt: r.createdAt,
              createdAt: r.createdAt,
            };
          }
          customerMap[em].totalReservations += 1;
        }
      }

      if (preData.preorders) {
        for (const p of preData.preorders) {
          const em = p.customerEmail.toLowerCase();
          if (!customerMap[em]) {
            customerMap[em] = {
              id: `cust-${em}`,
              fullName: p.customerName,
              email: p.customerEmail,
              phone: p.customerPhone,
              totalOrders: 0,
              totalReservations: 0,
              totalPreorders: 0,
              totalSpent: 0,
              lastActivityAt: p.createdAt,
              createdAt: p.createdAt,
            };
          }
          customerMap[em].totalPreorders += 1;
        }
      }

      setCustomers(Object.values(customerMap));
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      searchQuery === "" ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest block mb-1">
            CLIENT DIRECTORY
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            CUSTOMERS & DEMAND AUDIENCE
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Profiles aggregated across drop pre-orders, orders, and size reservations.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          title="Refresh"
          className="p-2.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-[#14171F] border border-[#262B36] rounded-lg">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7B828F]" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white placeholder-[#7B828F] focus:outline-none focus:border-[#FF3B00]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-[#7B828F] uppercase tracking-widest">
            ANALYZING CLIENT RECORDS...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Users className="h-8 w-8 text-[#7B828F] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">NO CUSTOMER ACTIVITY YET</h3>
            <p className="text-xs text-[#7B828F]">
              Clients placing orders, preorders, or size reservations will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-[#262B36] bg-[#10131A] text-[10px] text-[#7B828F] uppercase tracking-wider">
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CONTACT</th>
                  <th className="py-3 px-4">ORDERS</th>
                  <th className="py-3 px-4">RESERVATIONS</th>
                  <th className="py-3 px-4">PREORDERS</th>
                  <th className="py-3 px-4">TOTAL COMMITTED</th>
                  <th className="py-3 px-4 text-right">LAST ACTIVITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B36]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1A1E27] transition-colors">
                    <td className="py-3 px-4 font-bold text-white text-sm">{c.fullName}</td>
                    <td className="py-3 px-4">
                      <span className="text-white block">{c.email}</span>
                      <span className="text-[10px] text-[#7B828F] block">{c.phone}</span>
                    </td>
                    <td className="py-3 px-4 text-white font-bold">{c.totalOrders}</td>
                    <td className="py-3 px-4 text-[#FF3B00] font-bold">{c.totalReservations}</td>
                    <td className="py-3 px-4 text-amber-400 font-bold">{c.totalPreorders}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold text-sm">
                      ₹{c.totalSpent}
                    </td>
                    <td className="py-3 px-4 text-[10px] text-[#7B828F] text-right">
                      {new Date(c.lastActivityAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
