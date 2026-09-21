"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Truck, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    total,
    freeShippingThreshold,
    freeShippingRemaining,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-[#111111]/70 backdrop-blur-sm"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md md:max-w-lg bg-[#FAF7F2] border-l-3 border-[#111111] shadow-[-10px_0_30px_rgba(0,0,0,0.25)] flex flex-col h-full z-10"
          >
            {/* Drawer Header */}
            <div className="p-4 md:p-5 border-b-2 border-[#111111] bg-white flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#111111] text-white">
                  <ShoppingBag className="h-4 w-4 text-[#FF3B00]" />
                </div>
                <div>
                  <h3 className="font-black uppercase text-sm md:text-base tracking-tight text-[#111111]">
                    BAG ({itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"})
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#111111]/50">
                    KAPDOLOGY® DROP 001
                  </span>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-1.5 border-2 border-[#111111] bg-white hover:bg-[#FF3B00] hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_#111111]"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-[#111111] text-[#FAF7F2] px-4 py-2.5 border-b border-[#111111] select-none">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-3 w-3 text-[#FF3B00]" />
                  <span>
                    {freeShippingRemaining > 0 ? (
                      <>
                        ADD <strong className="text-[#FF3B00]">₹{freeShippingRemaining}</strong> FOR FREE SHIPPING
                      </>
                    ) : (
                      <span className="text-[#A3E635] font-bold">FREE SHIPPING UNLOCKED!</span>
                    )}
                  </span>
                </div>
                <span className="opacity-70">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF3B00] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="p-3 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex gap-3.5 relative"
                  >
                    {/* Item Thumbnail */}
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="relative w-20 h-24 bg-gray-100 border border-[#111111] shrink-0 overflow-hidden group"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Item Info */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="font-black uppercase text-xs text-[#111111] hover:text-[#FF3B00] transition-colors line-clamp-1 leading-snug"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="text-[#111111]/40 hover:text-[#FF3B00] transition-colors p-0.5 cursor-pointer shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-black uppercase bg-[#FAF7F2] border border-[#111111]/30">
                            SIZE: {item.size}
                          </span>
                          <span className="text-[9px] font-mono text-[#111111]/50 uppercase">
                            {item.product.gsm}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#111111]/10">
                        <div className="flex items-center border border-[#111111] bg-[#FAF7F2]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="p-1 hover:bg-white text-[#111111] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 font-mono font-bold text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="p-1 hover:bg-white text-[#111111] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-black text-sm text-[#111111]">
                            ₹{item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty State */
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-16 h-16 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex items-center justify-center mb-4">
                    <ShoppingBag className="h-7 w-7 text-[#FF3B00]" />
                  </div>
                  <h3 className="font-black uppercase text-xl text-[#111111] mb-1">
                    YOUR BAG IS EMPTY.
                  </h3>
                  <p className="text-xs font-semibold text-[#111111]/60 max-w-xs mb-6">
                    Drop 001 is live. Explore our heavy-weight oversized box silhouettes and secure your fit.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-6 py-3 font-black uppercase text-xs tracking-wider border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[3px_3px_0px_#FF3B00] hover:bg-[#FF3B00] hover:text-white transition-all"
                  >
                    <span>START SHOPPING</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Footer & Checkout Action */}
            {items.length > 0 && (
              <div className="p-4 md:p-5 border-t-2 border-[#111111] bg-white space-y-3 select-none">
                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs font-bold uppercase tracking-wider">
                  <div className="flex justify-between text-[#111111]/70">
                    <span>SUBTOTAL</span>
                    <span className="font-mono font-bold text-[#111111]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#111111]/70">
                    <span>ESTIMATED SHIPPING</span>
                    <span className="font-mono font-bold text-[#111111]">
                      {shipping === 0 ? <span className="text-[#00875A]">FREE</span> : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#111111] pt-2 border-t border-[#111111]/15">
                    <span>TOTAL</span>
                    <span className="font-mono text-base text-[#FF3B00]">₹{total}</span>
                  </div>
                </div>

                {/* Primary Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[4px_4px_0px_#FF3B00] hover:shadow-[2px_2px_0px_#FF3B00] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#FF3B00] hover:border-[#FF3B00] hover:text-white transition-all cursor-pointer"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* View Full Cart Link */}
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider pt-1 text-[#111111]/60">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="hover:text-[#FF3B00] hover:underline"
                  >
                    VIEW FULL BAG →
                  </Link>
                  <span>TAXES INCLUDED</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
