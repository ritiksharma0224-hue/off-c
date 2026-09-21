"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Check, AlertCircle, ShieldCheck } from "lucide-react";
import { StoreSettings } from "@/lib/db/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    lowStockThreshold: 5,
    currency: "INR",
    currencySymbol: "₹",
    freeShippingThreshold: 1999,
    standardShippingFee: 99,
    storeEmail: "contact@kapdology.store",
    paymentGatewayStatus: "PRE_RELEASE_INACTIVE",
    reservationNotice: "Drop inventory reserved directly with studio concierge.",
    preorderNotice: "Pre-order reservation confirmed. Dispatched upon drop completion.",
  });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("Settings saved successfully.");
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none font-sans text-xs">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#262B36]">
        <span className="font-mono text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest block mb-1">
          CONFIGURATION & PARAMETERS
        </span>
        <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
          STORE SETTINGS
        </h1>
        <p className="text-xs text-[#7B828F] mt-1 font-medium">
          Global thresholds, logistics charges, and payment gateway state.
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Card 1: Inventory & Shipping Thresholds */}
        <div className="p-6 bg-[#14171F] border border-[#262B36] rounded-lg space-y-4 font-mono">
          <h3 className="text-xs font-black uppercase text-white tracking-wider pb-2 border-b border-[#262B36]">
            COMMERCE THRESHOLDS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                LOW STOCK ALERT THRESHOLD (UNITS)
              </label>
              <input
                type="number"
                min={1}
                value={settings.lowStockThreshold}
                onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
              />
              <span className="text-[9px] text-[#7B828F] mt-1 block">
                Variants at or below this number trigger low stock alerts.
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                FREE SHIPPING THRESHOLD (INR ₹)
              </label>
              <input
                type="number"
                min={0}
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
              />
              <span className="text-[9px] text-[#7B828F] mt-1 block">
                Orders equal or above this receive free express delivery nationwide.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
              STANDARD PAN-INDIA SHIPPING CHARGE (INR ₹)
            </label>
            <input
              type="number"
              min={0}
              value={settings.standardShippingFee}
              onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00] max-w-xs"
            />
          </div>
        </div>

        {/* Card 2: Payment Architecture State */}
        <div className="p-6 bg-[#14171F] border border-[#262B36] rounded-lg space-y-4 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-[#262B36]">
            <h3 className="text-xs font-black uppercase text-white tracking-wider">
              PAYMENT GATEWAY DECOUPLING
            </h3>
            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-bold border border-amber-500/30">
              PRE-RELEASE MODE
            </span>
          </div>

          <div className="p-4 bg-[#0E1015] border border-[#262B36] rounded space-y-2">
            <p className="text-xs text-[#E4E6EB] leading-relaxed">
              Online payment gateways (Razorpay, Cashfree, UPI) are decoupled. The storefront captures drop pre-orders with inventory reservations, without collecting sensitive credit card details.
            </p>
            <p className="text-xs text-[#7B828F] leading-relaxed">
              When ready for direct payment collection, the upcoming payment gateway module will plug directly into the abstracted <code className="text-[#FF3B00]">paymentService.ts</code> layer without redesigning checkout, cart, or order flows.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#FF3B00] text-white font-bold uppercase text-xs rounded hover:bg-[#e03400] transition-colors flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000]"
        >
          <Save className="h-4 w-4" />
          <span>SAVE SETTINGS</span>
        </button>
      </form>

    </div>
  );
}
