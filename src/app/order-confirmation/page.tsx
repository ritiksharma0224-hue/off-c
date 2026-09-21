"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { brandData } from "@/data/brand";
import { OrderPayload } from "@/services/paymentService";
import {
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  ArrowRight,
  Printer,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderPayload | null>(null);
  const [orderId, setOrderId] = useState<string>(queryOrderId || "KPD-8492");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("kapdology_latest_order");
      if (stored) {
        const parsed: OrderPayload = JSON.parse(stored);
        setOrder(parsed);
        if (parsed.orderId) {
          setOrderId(parsed.orderId);
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Top Status Banner */}
        <div className="p-6 md:p-8 bg-white border-3 border-[#111111] shadow-[8px_8px_0px_#111111] mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#111111]/15">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#00875A]/10 border-2 border-[#00875A] flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-7 w-7 text-[#00875A]" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#00875A] block">
                  ORDER RESERVATION RECORDED
                </span>
                <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-[#111111]">
                  RESERVATION CONFIRMED
                </h1>
              </div>
            </div>

            <div className="font-mono text-left sm:text-right">
              <span className="text-[10px] font-bold text-[#111111]/50 uppercase block">RESERVATION ID</span>
              <span className="text-lg md:text-xl font-black text-[#FF3B00]">
                #{orderId}
              </span>
            </div>
          </div>

          {/* Payment Gateway Pre-Release Notice */}
          <div className="mt-6 p-4 md:p-5 bg-amber-50 border-2 border-amber-400/80 flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-black uppercase text-xs tracking-wider text-amber-900">
                DROP 001 INVENTORY SECURED • PAYMENT PENDING
              </h4>
              <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                Your drop inventory has been officially reserved in our system. Because our direct online payment gateway is in pre-launch testing, our studio team will contact you via WhatsApp/Email shortly to verify your delivery address and facilitate your preferred payment before dispatch.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono font-bold text-[#111111]/70">
            <div>
              <span>DATE: </span>
              <span className="text-[#111111]">
                {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div>
              <span>ORIGIN: </span>
              <span className="text-[#111111]">JAIPUR STUDIO, RAJASTHAN</span>
            </div>
            <div>
              <span>FULFILLMENT: </span>
              <span className="text-[#00875A]">PRE-ORDER PRIORITY QUEUE</span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Left Column: Reserved Items */}
          <div className="md:col-span-7 space-y-6">
            <div className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#111111]/15">
                <h2 className="font-black uppercase text-sm tracking-wider text-[#111111] flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#FF3B00]" />
                  <span>RESERVED GARMENTS</span>
                </h2>
                <span className="font-mono text-xs text-[#111111]/50">
                  {order?.items ? order.items.length : 1} ITEM(S)
                </span>
              </div>

              {order?.items && order.items.length > 0 ? (
                <div className="divide-y divide-[#111111]/10">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-16 bg-gray-100 border border-[#111111] shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-black uppercase text-xs text-[#111111]">
                            {item.productName}
                          </h4>
                          <span className="font-mono text-[10px] text-[#111111]/60 block">
                            SIZE: {item.size} • QTY: {item.quantity}
                          </span>
                          <span className="font-mono text-xs font-black text-[#111111] mt-0.5 block">
                            ₹{item.unitPrice} each
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-black text-xs text-[#111111]">
                        ₹{item.totalPrice}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-16 bg-gray-100 border border-[#111111] shrink-0 overflow-hidden">
                      <Image
                        src="/images/cyber-tee.jpg"
                        alt="KAPDOLOGY Tee"
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-xs text-[#111111]">
                        KAPDOLOGY® CYBER TECH OVERSIZED TEE
                      </h4>
                      <span className="font-mono text-[10px] text-[#111111]/60 block">
                        SIZE: L • QTY: 1
                      </span>
                      <span className="font-mono text-xs font-black text-[#111111] mt-0.5 block">
                        ₹1,499
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-xs text-[#111111]">
                    ₹1,499
                  </span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="pt-4 border-t-2 border-[#111111]/15 space-y-2 font-mono text-xs uppercase">
                <div className="flex justify-between text-[#111111]/70">
                  <span>SUBTOTAL:</span>
                  <span className="font-bold text-[#111111]">
                    ₹{order ? order.subtotal : 1499}
                  </span>
                </div>

                {order && order.discount > 0 && (
                  <div className="flex justify-between text-[#00875A]">
                    <span>DISCOUNT APPLIED:</span>
                    <span className="font-bold">-₹{order.discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#111111]/70">
                  <span>SHIPPING:</span>
                  <span className="font-bold text-[#111111]">
                    {order ? (order.shipping === 0 ? "FREE" : `₹${order.shipping}`) : "FREE"}
                  </span>
                </div>

                <div className="pt-3 border-t-2 border-[#111111] flex justify-between text-base font-black text-[#111111]">
                  <span>ESTIMATED PAYABLE:</span>
                  <span className="text-[#FF3B00]">
                    ₹{order ? order.total : 1499}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Delivery Address */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
              <h3 className="font-black uppercase text-sm tracking-wider text-[#111111] pb-3 border-b border-[#111111]/15 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#FF3B00]" />
                <span>DELIVERY DESTINATION</span>
              </h3>

              <div className="font-mono text-xs space-y-2 text-[#111111]">
                {order?.customer ? (
                  <div>
                    <span className="font-black uppercase block text-sm">
                      {order.customer.fullName}
                    </span>
                    <span className="text-[#111111]/70 block">
                      {order.customer.email}
                    </span>
                    <span className="text-[#111111]/70 block">
                      {order.customer.phone}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="font-black uppercase block text-sm">
                      VALUED CLIENT
                    </span>
                    <span className="text-[#111111]/70 block">
                      Direct WhatsApp Dispatch
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#111111]/10 text-[#111111]/80 space-y-0.5">
                  {order?.shippingAddress ? (
                    <>
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                      <p>{order.shippingAddress.country || "India"}</p>
                    </>
                  ) : (
                    <p className="text-xs text-[#111111]/70">
                      Standard Pan-India Express Delivery (3-5 business days)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Need Help / Concierge Support */}
            <div className="p-6 bg-[#111111] text-[#FAF7F2] border-2 border-[#111111] shadow-[4px_4px_0px_#FF3B00] space-y-3">
              <div className="flex items-center gap-2 text-[#FF3B00]">
                <PhoneCall className="h-4 w-4" />
                <span className="font-black uppercase text-xs tracking-wider">
                  STUDIO CONCIERGE
                </span>
              </div>
              <p className="text-xs text-[#FAF7F2]/80 leading-relaxed">
                Have questions or need to modify your size/address before dispatch? DM us directly on Instagram or write to our support desk.
              </p>
              <div className="pt-2 flex flex-col gap-2 font-mono text-xs font-bold">
                <a
                  href={brandData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF3B00] hover:underline flex items-center gap-1.5"
                >
                  <span>@kapdology on Instagram</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={`mailto:${brandData.email}`}
                  className="text-[#FAF7F2] hover:underline"
                >
                  {brandData.email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 border-2 border-[#111111] bg-[#FAF7F2] text-[#111111] font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-white transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>PRINT RECEIPT</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/drop-001"
              className="w-full sm:w-auto px-5 py-3 border-2 border-[#111111] bg-white text-[#111111] font-black uppercase text-xs text-center hover:bg-[#FAF7F2] transition-colors"
            >
              EXPLORE DROP 001
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 py-3 border-2 border-[#111111] bg-[#111111] text-white font-black uppercase text-xs text-center flex items-center justify-center gap-2 hover:bg-[#FF3B00] hover:border-[#FF3B00] transition-colors"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#FAF7F2] flex items-center justify-center font-mono text-xs font-bold uppercase tracking-widest text-[#111111]">
          LOADING RESERVATION RECEIPT...
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
