"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Download,
  Filter,
  Check,
  AlertCircle,
  Truck,
  MapPin,
  Clock,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  MasterOrder,
  OrderPaymentStatus,
  OrderFulfillmentStatus,
} from "@/lib/db/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<MasterOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<MasterOrder | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [carrierInput, setCarrierInput] = useState("BlueDart");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdatePayment = async (id: string, paymentStatus: OrderPaymentStatus) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(`Payment status updated to ${paymentStatus}`);
        setTimeout(() => setActionNotice(null), 3000);
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, paymentStatus });
        }
      }
    } catch {
      // Error
    }
  };

  const handleUpdateFulfillment = async (
    id: string,
    fulfillmentStatus: OrderFulfillmentStatus,
    tracking?: string,
    carrier?: string
  ) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          fulfillmentStatus,
          trackingNumber: tracking,
          carrier,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(`Fulfillment status updated to ${fulfillmentStatus}`);
        setTimeout(() => setActionNotice(null), 3000);
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({
            ...selectedOrder,
            fulfillmentStatus,
            trackingNumber: tracking || selectedOrder.trackingNumber,
            carrier: carrier || selectedOrder.carrier,
          });
        }
      }
    } catch {
      // Error
    }
  };

  const exportCSV = () => {
    if (orders.length === 0) return;
    const headers = ["Order Number,Customer Name,Email,Phone,Items Count,Subtotal,Shipping,Total,Payment Status,Fulfillment Status,Tracking,Carrier,Date\n"];
    const rows = orders.map((o) =>
      `"${o.orderNumber}","${o.customer.fullName}","${o.customer.email}","${o.customer.phone}","${o.items.length}","${o.subtotal}","${o.shipping}","${o.total}","${o.paymentStatus}","${o.fulfillmentStatus}","${o.trackingNumber || ""}","${o.carrier || ""}","${o.createdAt}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kapdology-orders-${Date.now()}.csv`;
    a.click();
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      searchQuery === "" ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPayment = paymentFilter === "ALL" || o.paymentStatus === paymentFilter;
    const matchesFulfill = fulfillmentFilter === "ALL" || o.fulfillmentStatus === fulfillmentFilter;

    return matchesSearch && matchesPayment && matchesFulfill;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest block mb-1">
            COMMERCE FULFILLMENT PIPELINE
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            ORDERS MANAGEMENT
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Checkout orders, payment verification, and pan-India dispatch tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            title="Refresh"
            className="p-2.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={exportCSV}
            disabled={orders.length === 0}
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

      {/* Toolbar */}
      <div className="p-4 bg-[#14171F] border border-[#262B36] rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7B828F]" />
          <input
            type="text"
            placeholder="Search order #, customer name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white placeholder-[#7B828F] focus:outline-none focus:border-[#FF3B00]"
          />
        </div>

        <div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white focus:outline-none focus:border-[#FF3B00] font-mono"
          >
            <option value="ALL">ALL PAYMENT STATUSES</option>
            <option value="PAYMENT_NOT_INTEGRATED">PAYMENT NOT INTEGRATED</option>
            <option value="PAYMENT_PENDING">PAYMENT PENDING</option>
            <option value="PAYMENT_CONFIRMED">PAYMENT CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        <div>
          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white focus:outline-none focus:border-[#FF3B00] font-mono"
          >
            <option value="ALL">ALL FULFILLMENT STATUSES</option>
            <option value="UNFULFILLED">UNFULFILLED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="PACKED">PACKED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-[#7B828F] uppercase tracking-widest">
            FETCHING ORDER PIPELINE...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <ShoppingBag className="h-8 w-8 text-[#7B828F] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">NO ORDERS RECORDED YET</h3>
            <p className="text-xs text-[#7B828F]">
              Checkout orders placed on the storefront will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#262B36] bg-[#10131A] text-[10px] font-mono text-[#7B828F] uppercase tracking-wider">
                  <th className="py-3 px-4">ORDER #</th>
                  <th className="py-3 px-4">CUSTOMER</th>
                  <th className="py-3 px-4">ITEMS</th>
                  <th className="py-3 px-4">TOTAL</th>
                  <th className="py-3 px-4">PAYMENT</th>
                  <th className="py-3 px-4">FULFILLMENT</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4 text-right">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B36] font-mono">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1A1E27] transition-colors">
                    <td className="py-3 px-4 font-black text-[#FF3B00]">
                      {order.orderNumber}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-white font-bold block">{order.customer.fullName}</span>
                      <span className="text-[10px] text-[#7B828F] block">{order.customer.phone}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-white font-bold">{order.items.length} item(s)</span>
                      <span className="text-[10px] text-[#7B828F] block truncate max-w-[180px]">
                        {order.items.map((i) => `${i.productName} (${i.size})`).join(", ")}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-black text-sm text-white">
                      ₹{order.total}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          order.paymentStatus === "PAYMENT_CONFIRMED"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : order.paymentStatus === "PAYMENT_PENDING"
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {order.paymentStatus.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          order.fulfillmentStatus === "DELIVERED"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : order.fulfillmentStatus === "SHIPPED"
                            ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                            : order.fulfillmentStatus === "PACKED"
                            ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                            : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[10px] text-[#7B828F]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrder(order);
                          setTrackingNumberInput(order.trackingNumber || "");
                          setCarrierInput(order.carrier || "BlueDart");
                        }}
                        className="px-2.5 py-1 bg-[#0E1015] hover:bg-[#FF3B00] text-[#9AA0A6] hover:text-white border border-[#262B36] rounded text-[10px] font-bold uppercase transition-colors cursor-pointer"
                      >
                        INSPECT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#14171F] border border-[#262B36] rounded-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#262B36]">
              <div>
                <span className="font-mono text-[10px] text-[#FF3B00] font-bold uppercase block">
                  ORDER SPECIFICATION
                </span>
                <h3 className="font-black text-xl text-white uppercase mt-0.5">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-[#9AA0A6] hover:text-white font-mono text-sm uppercase"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#0E1015] border border-[#262B36] rounded font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7B828F] uppercase block">CLIENT DETAILS</span>
                <p className="font-bold text-white text-sm">{selectedOrder.customer.fullName}</p>
                <p className="text-[#7B828F]">{selectedOrder.customer.email}</p>
                <p className="text-[#7B828F]">{selectedOrder.customer.phone}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#7B828F] uppercase block">SHIPPING DESTINATION</span>
                <p className="text-white">{selectedOrder.shippingAddress.addressLine1}</p>
                {selectedOrder.shippingAddress.addressLine2 && <p className="text-[#7B828F]">{selectedOrder.shippingAddress.addressLine2}</p>}
                <p className="text-[#7B828F]">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
                <p className="text-[#7B828F]">{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#7B828F] uppercase block">
                ORDERED GARMENTS ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-[#262B36] border border-[#262B36] rounded bg-[#0E1015] p-3 space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="pt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-black border border-[#262B36] rounded overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.productName} fill sizes="40px" className="object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-xs">{item.productName}</span>
                        <span className="font-mono text-[10px] text-[#7B828F]">SIZE: {item.size} • QTY: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white text-xs">
                      ₹{item.totalPrice}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-3 bg-[#0E1015] border border-[#262B36] rounded font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-[#7B828F]">
                <span>SUBTOTAL:</span>
                <span className="text-white">₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#7B828F]">
                <span>SHIPPING:</span>
                <span className="text-white">₹{selectedOrder.shipping}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>DISCOUNT:</span>
                  <span>-₹{selectedOrder.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#262B36] flex justify-between text-white font-bold text-sm">
                <span>TOTAL:</span>
                <span className="text-[#FF3B00]">₹{selectedOrder.total}</span>
              </div>
            </div>

            {/* Status Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#9AA0A6] uppercase">
                  PAYMENT GATEWAY STATUS
                </label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => handleUpdatePayment(selectedOrder.id, e.target.value as OrderPaymentStatus)}
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                >
                  <option value="PAYMENT_NOT_INTEGRATED">PAYMENT NOT INTEGRATED (Pre-Release)</option>
                  <option value="PAYMENT_PENDING">PAYMENT PENDING</option>
                  <option value="PAYMENT_CONFIRMED">PAYMENT CONFIRMED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#9AA0A6] uppercase">
                  FULFILLMENT DISPATCH STATUS
                </label>
                <select
                  value={selectedOrder.fulfillmentStatus}
                  onChange={(e) =>
                    handleUpdateFulfillment(
                      selectedOrder.id,
                      e.target.value as OrderFulfillmentStatus,
                      trackingNumberInput,
                      carrierInput
                    )
                  }
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                >
                  <option value="UNFULFILLED">UNFULFILLED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {/* Courier Dispatch Tracking Details */}
            <div className="p-4 bg-[#0E1015] border border-[#262B36] rounded space-y-3 font-mono">
              <span className="text-[10px] font-bold text-white uppercase block">
                COURIER TRACKING SPECIFICATIONS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-[#7B828F] uppercase mb-1">CARRIER</label>
                  <select
                    value={carrierInput}
                    onChange={(e) => setCarrierInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#14171F] border border-[#262B36] rounded text-white text-xs focus:outline-none"
                  >
                    <option value="BlueDart">BlueDart Express</option>
                    <option value="Delhivery">Delhivery Surface/Air</option>
                    <option value="DTDC">DTDC Priority</option>
                    <option value="Xpressbees">Xpressbees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-[#7B828F] uppercase mb-1">AWB TRACKING NUMBER</label>
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="e.g. BD987462810"
                    className="w-full px-3 py-1.5 bg-[#14171F] border border-[#262B36] rounded text-white text-xs focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleUpdateFulfillment(
                    selectedOrder.id,
                    selectedOrder.fulfillmentStatus,
                    trackingNumberInput,
                    carrierInput
                  )
                }
                className="px-3 py-1.5 bg-[#1E232E] hover:bg-[#FF3B00] text-white rounded text-[10px] font-bold uppercase transition-colors cursor-pointer"
              >
                SAVE TRACKING INFO
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
