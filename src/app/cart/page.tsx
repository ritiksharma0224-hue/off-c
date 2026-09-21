"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { brandData } from "@/data/brand";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    total,
    freeShippingThreshold,
    freeShippingRemaining,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-10 md:py-16 select-none">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Navigation / Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#111111]/70 hover:text-[#FF3B00] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>

        <div className="mb-8 flex items-baseline justify-between border-b-2 border-[#111111]/15 pb-4">
          <div>
            <h1 className="font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#111111]">
              YOUR SHOPPING BAG
            </h1>
            <span className="font-mono text-xs text-[#111111]/60 uppercase">
              {itemCount} {itemCount === 1 ? "PIECE" : "PIECES"} SELECTED • KAPDOLOGY® DROP 001
            </span>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free Shipping Tracker */}
              <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111]">
                <div className="flex items-center justify-between font-mono text-xs uppercase mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#FF3B00]" />
                    <span className="font-bold text-[#111111]">
                      {freeShippingRemaining > 0 ? (
                        <>
                          ADD <strong className="text-[#FF3B00]">₹{freeShippingRemaining}</strong> MORE FOR FREE PAN-INDIA SHIPPING
                        </>
                      ) : (
                        <span className="text-[#00875A] font-black">YOU HAVE UNLOCKED FREE SHIPPING!</span>
                      )}
                    </span>
                  </div>
                  <span className="text-xs font-black">{progressPercent}%</span>
                </div>

                <div className="w-full h-2 bg-[#FAF7F2] border border-[#111111]/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF3B00] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="divide-y-2 divide-[#111111]/10 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="p-4 md:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                  >
                    {/* Item Media & Basic Info */}
                    <div className="flex gap-4 items-center min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="relative w-20 h-24 md:w-24 md:h-28 bg-gray-100 border-2 border-[#111111] shrink-0 overflow-hidden"
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="96px"
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold uppercase text-[#FF3B00]">
                            {item.product.drop}
                          </span>
                          <span className="text-[#111111]/20">•</span>
                          <span className="text-[9px] font-mono uppercase text-[#111111]/50">
                            {item.product.gsm}
                          </span>
                        </div>

                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-black uppercase text-sm md:text-base text-[#111111] hover:text-[#FF3B00] transition-colors block line-clamp-1"
                        >
                          {item.product.name}
                        </Link>

                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="px-2 py-0.5 text-[10px] font-mono font-black uppercase bg-[#FAF7F2] border border-[#111111]/30">
                            SIZE: {item.size}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#111111]/70">
                            ₹{item.product.price} each
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Modifier & Line Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#111111]/10">
                      {/* Stepper */}
                      <div className="flex items-center border-2 border-[#111111] bg-[#FAF7F2] shadow-[2px_2px_0px_#111111]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="p-1.5 md:p-2 hover:bg-white text-[#111111] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        </button>
                        <span className="px-3 font-mono font-black text-xs md:text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="p-1.5 md:p-2 hover:bg-white text-[#111111] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[70px]">
                        <span className="font-mono font-black text-base md:text-lg text-[#111111]">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="text-[#111111]/40 hover:text-[#FF3B00] transition-colors p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4 space-y-4 sticky top-24">
              <div className="p-6 bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#111111] space-y-5">
                <h3 className="font-black uppercase text-base tracking-wider text-[#111111] pb-3 border-b border-[#111111]/15">
                  ORDER SUMMARY
                </h3>

                <div className="space-y-2.5 font-mono text-xs uppercase">
                  <div className="flex justify-between text-[#111111]/70">
                    <span>ITEMS ({itemCount}):</span>
                    <span className="font-bold text-[#111111]">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-[#111111]/70">
                    <span>SHIPPING:</span>
                    <span className="font-bold text-[#111111]">
                      {shipping === 0 ? <span className="text-[#00875A]">FREE</span> : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#111111]/70">
                    <span>TAXES:</span>
                    <span className="font-bold text-[#00875A]">INCLUDED</span>
                  </div>

                  <div className="pt-3 border-t-2 border-[#111111] flex justify-between text-base font-black text-[#111111]">
                    <span>TOTAL:</span>
                    <span className="text-lg text-[#FF3B00]">₹{total}</span>
                  </div>
                </div>

                {/* Primary Proceed CTA */}
                <Link
                  href="/checkout"
                  className="w-full py-4 px-6 flex items-center justify-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[4px_4px_0px_#FF3B00] hover:shadow-[2px_2px_0px_#FF3B00] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#FF3B00] hover:border-[#FF3B00] hover:text-white transition-all cursor-pointer text-center"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="pt-3 border-t border-[#111111]/10 text-[10px] font-mono text-[#111111]/60 uppercase space-y-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#FF3B00]" />
                    <span>PRE-ORDER RESERVATION SECURED</span>
                  </div>
                  <p>Concierge order verification prior to final dispatch.</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Editorial Empty Cart State */
          <div className="py-24 text-center bg-white border-3 border-[#111111] shadow-[8px_8px_0px_#111111] p-8 max-w-xl mx-auto flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#FAF7F2] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-center mb-4">
              <ShoppingBag className="h-7 w-7 text-[#FF3B00]" />
            </div>

            <h2 className="font-black text-2xl uppercase tracking-tight text-[#111111] mb-2">
              YOUR BAG IS EMPTY.
            </h2>

            <p className="text-sm font-medium text-[#111111]/70 max-w-sm mb-8 leading-relaxed">
              You haven&apos;t added any Drop 001 pieces to your bag yet. Explore our signature box cuts, distressed washes, and graphic silhouettes.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[4px_4px_0px_#FF3B00] hover:bg-[#FF3B00] hover:text-white transition-all"
            >
              <span>EXPLORE ALL GARMENTS</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
