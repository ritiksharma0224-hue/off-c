"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { brandData } from "@/data/brand";
import { createPaymentOrder, OrderPayload } from "@/services/paymentService";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, shipping, total, clearCart } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState("STANDARD");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError("");
    if (!discountCode.trim()) return;

    if (discountCode.trim().toUpperCase() === "DROP001") {
      setAppliedDiscount(Math.round(subtotal * 0.1)); // 10% demo discount
    } else {
      setDiscountError("Promo code is invalid or expired.");
    }
  };

  const finalTotal = Math.max(0, total - appliedDiscount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.addressLine1.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      setValidationError("Please fill out all required contact and shipping fields.");
      return;
    }

    if (items.length === 0) {
      setValidationError("Your cart is empty. Add items before checking out.");
      return;
    }

    setSubmitting(true);

    const orderPayload: OrderPayload = {
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: "India",
      },
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        slug: i.product.slug,
        size: i.size,
        quantity: i.quantity,
        unitPrice: i.product.price,
        totalPrice: i.product.price * i.quantity,
        image: i.product.image,
      })),
      subtotal,
      shipping,
      discount: appliedDiscount,
      total: finalTotal,
      deliveryMethod: "Standard Pan-India Delivery (3-5 Business Days)",
      paymentMethod: "GATEWAY_PREORDER",
      status: "PAYMENT_PENDING",
      createdAt: new Date().toISOString(),
    };

    try {
      const result = await createPaymentOrder(orderPayload);
      clearCart();
      router.push(result.redirectUrl || `/order-confirmation?orderId=${result.orderId}`);
    } catch {
      setValidationError("Failed to register order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-8 md:py-16 select-none">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#111111]/70 hover:text-[#FF3B00] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETURN TO BAG</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-10 pb-4 border-b-2 border-[#111111]/15">
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#FF3B00] block mb-1">
            SECURE ORDER GATEWAY
          </span>
          <h1 className="font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#111111]">
            CHECKOUT
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="p-8 bg-white border-2 border-[#111111] text-center max-w-lg mx-auto space-y-4">
            <h3 className="font-black uppercase text-lg text-[#111111]">NO ITEMS IN BAG</h3>
            <p className="text-xs font-semibold text-[#111111]/60">
              Please add garments to your bag before proceeding with checkout.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 bg-[#111111] text-white font-black uppercase text-xs border border-[#111111] hover:bg-[#FF3B00] transition-colors"
            >
              SHOP CATALOG →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: 4-Step Checkout Form */}
            <div className="lg:col-span-7 space-y-8">
              
              {validationError && (
                <div className="p-4 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-bold uppercase flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* STEP 01: Contact Information */}
              <div className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#111111]/10">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-white font-mono text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <h2 className="font-black uppercase text-sm tracking-wider text-[#111111]">
                      CONTACT INFORMATION
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#111111]/50 uppercase">REQUIRED</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] font-black uppercase text-[#111111] mb-1">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Yash Vardhan"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-black uppercase text-[#111111] mb-1">
                      EMAIL ADDRESS (FOR ORDER CONFIRMATION) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="yash@example.com"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-black uppercase text-[#111111] mb-1">
                      PHONE NUMBER (FOR DISPATCH SMS) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 02: Shipping Address */}
              <div className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#111111]/10">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-white font-mono text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <h2 className="font-black uppercase text-sm tracking-wider text-[#111111]">
                      SHIPPING ADDRESS
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#111111]/50 uppercase">INDIA DELIVERY</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] font-black uppercase text-[#111111] mb-1">
                      STREET ADDRESS / HOUSE NO. *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      required
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="Flat / House No., Building Name, Street"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-black uppercase text-[#111111] mb-1">
                      APARTMENT, LANDMARK, AREA (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Landmark near address"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] font-black uppercase text-[#111111] mb-1">
                        CITY *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Jaipur"
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-black uppercase text-[#111111] mb-1">
                        STATE *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                      >
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Delhi">Delhi NCR</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Other">Other State</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-black uppercase text-[#111111] mb-1">
                        PINCODE *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="302001"
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 03: Delivery Options */}
              <div className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#111111]/10">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-white font-mono text-xs font-black flex items-center justify-center">
                      3
                    </span>
                    <h2 className="font-black uppercase text-sm tracking-wider text-[#111111]">
                      DELIVERY METHOD
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#00875A] uppercase font-bold">DISPATCH 24-48H</span>
                </div>

                <div className="p-4 bg-[#FAF7F2] border-2 border-[#111111] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-[#FF3B00] shrink-0" />
                    <div>
                      <h4 className="font-black uppercase text-xs text-[#111111]">
                        STANDARD PAN-INDIA DISPATCH
                      </h4>
                      <p className="text-[11px] font-medium text-[#111111]/70">
                        Estimated transit: {brandData.shipping.standardTime}. Full tracking provided via SMS/Email.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-black text-xs text-[#111111]">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
              </div>

              {/* STEP 04: Payment Architecture Placeholder */}
              <div className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#111111]/10">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-white font-mono text-xs font-black flex items-center justify-center">
                      4
                    </span>
                    <h2 className="font-black uppercase text-sm tracking-wider text-[#111111]">
                      PAYMENT GATEWAY
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#FF3B00] uppercase font-bold">PRE-RELEASE MODE</span>
                </div>

                {/* Polished Pre-Release State Notice */}
                <div className="p-5 bg-yellow-50 border-2 border-[#111111] space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#FF3B00] shrink-0" />
                    <span className="font-mono text-xs font-black uppercase text-[#111111]">
                      PAYMENT GATEWAY INTEGRATION — COMING SOON
                    </span>
                  </div>
                  <p className="text-xs text-[#111111]/80 leading-relaxed font-medium">
                    Our direct online payment gateway is undergoing scheduled testing and will be activated shortly.
                  </p>
                  <p className="text-xs text-[#111111]/80 leading-relaxed font-medium">
                    By submitting this pre-order reservation, your drop inventory will be locked. Our studio concierge will contact you directly via WhatsApp/Email to confirm delivery details and facilitate your preferred payment method prior to dispatch.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-[#111111]/60 pt-2">
                  <Lock className="h-3 w-3 text-[#00875A]" />
                  <span>NO CARD DETAILS ARE COLLECTED • 100% SECURE DROP RESERVATION</span>
                </div>
              </div>

              {/* Final Place Order Submit Action */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 flex items-center justify-center gap-2.5 font-black uppercase tracking-wider text-xs md:text-sm border-3 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[5px_5px_0px_#FF3B00] hover:shadow-[2px_2px_0px_#FF3B00] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#FF3B00] hover:border-[#FF3B00] hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                <span>
                  {submitting ? "RECORDING DROP RESERVATION..." : `PLACE PRE-ORDER RESERVATION (₹${finalTotal})`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>

            {/* Right: Checkout Order Summary */}
            <div className="lg:col-span-5 space-y-4 sticky top-24">
              <div className="p-6 bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#111111] space-y-5">
                <h3 className="font-black uppercase text-sm tracking-wider text-[#111111] pb-3 border-b border-[#111111]/15">
                  BAG SUMMARY ({itemCount} ITEMS)
                </h3>

                {/* Selected Products Preview */}
                <div className="divide-y divide-[#111111]/10 max-h-60 overflow-y-auto pr-1 space-y-2.5">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="pt-2 flex items-center gap-3 justify-between"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-12 h-14 bg-gray-100 border border-[#111111] shrink-0 overflow-hidden">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-black uppercase text-xs text-[#111111] truncate">
                            {item.product.name}
                          </h5>
                          <div className="text-[10px] font-mono text-[#111111]/60">
                            SIZE: {item.size} • QTY: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono font-black text-xs text-[#111111] shrink-0">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="pt-3 border-t border-[#111111]/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="PROMO CODE (e.g. DROP001)"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#111111] font-mono text-xs uppercase focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3 py-2 bg-[#111111] text-white font-mono text-xs font-bold uppercase hover:bg-[#FF3B00] transition-colors cursor-pointer"
                    >
                      APPLY
                    </button>
                  </div>
                  {appliedDiscount > 0 && (
                    <span className="text-[10px] font-mono text-[#00875A] font-bold block mt-1">
                      PROMO DROP001 APPLIED (-₹{appliedDiscount})
                    </span>
                  )}
                  {discountError && (
                    <span className="text-[10px] font-mono text-red-600 block mt-1">
                      {discountError}
                    </span>
                  )}
                </div>

                {/* Totals Breakdown */}
                <div className="pt-3 border-t border-[#111111]/10 space-y-2 font-mono text-xs uppercase">
                  <div className="flex justify-between text-[#111111]/70">
                    <span>SUBTOTAL:</span>
                    <span className="font-bold text-[#111111]">₹{subtotal}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-[#00875A]">
                      <span>DISCOUNT:</span>
                      <span className="font-bold">-₹{appliedDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#111111]/70">
                    <span>SHIPPING:</span>
                    <span className="font-bold text-[#111111]">
                      {shipping === 0 ? <span className="text-[#00875A]">FREE</span> : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="pt-3 border-t-2 border-[#111111] flex justify-between text-base font-black text-[#111111]">
                    <span>TOTAL:</span>
                    <span className="text-lg text-[#FF3B00]">₹{finalTotal}</span>
                  </div>
                </div>

              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
