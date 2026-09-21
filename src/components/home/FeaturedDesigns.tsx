"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Check, Sparkles } from "lucide-react";
import { productsData, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function FeaturedDesigns() {
  const { addToCart } = useCart();
  const featured = productsData.filter((p) => p.featured || p.isPopular).slice(0, 4);

  // Track quick-size selections per card
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleQuickAdd = (product: Product) => {
    const chosenSize = selectedSizes[product.id] || product.sizes[0] || "L";
    addToCart(product, chosenSize, 1);
    setAddedNotice(product.id);
    setTimeout(() => setAddedNotice(null), 2000);
  };

  return (
    <section className="w-full py-20 md:py-28 bg-white border-b-2 border-[#111111] relative select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#FF3B00]" />
              <span className="font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
                DROP 001 CURATION
              </span>
            </div>
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.92] text-[#111111]">
              FEATURED DESIGNS
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm border-b-2 border-[#111111] pb-1 hover:text-[#FF3B00] hover:border-[#FF3B00] transition-colors self-start"
          >
            <span>EXPLORE FULL DROP</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Featured Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, index) => {
            const currentSize = selectedSizes[product.id] || product.sizes[0] || "L";
            const isAdded = addedNotice === product.id;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[8px_8px_0px_#111111] hover:translate-x-[-3px] hover:translate-y-[-3px] transition-all duration-300"
              >
                {/* Visual Area with Image Swap on Hover */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden block"
                >
                  {/* Primary Image */}
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`object-cover object-center transition-all duration-500 ${
                      product.images.length > 1
                        ? "group-hover:opacity-0 group-hover:scale-105"
                        : "group-hover:scale-105"
                    }`}
                  />

                  {/* Secondary Image for Hover Swap */}
                  {product.images.length > 1 && (
                    <Image
                      src={product.images[1]}
                      alt={`${product.name} alternate view`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-none">
                    {product.badge && (
                      <span className="bg-[#111111] text-white font-mono text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-white/20">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Bottom Micro-Pill: GSM & Fit */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-[#111111] text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border border-[#111111] shadow-[1px_1px_0px_#111111]">
                    {product.gsm}
                  </div>
                </Link>

                {/* Info Container */}
                <div className="p-4 flex-grow flex flex-col justify-between border-t border-[#111111] bg-white">
                  <div>
                    <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-[#111111]/50 mb-1">
                      <span>{product.category}</span>
                      <span>{product.designFamily}</span>
                    </div>

                    <Link
                      href={`/product/${product.slug}`}
                      className="font-black uppercase text-xs md:text-sm tracking-tight text-[#111111] hover:text-[#FF3B00] transition-colors line-clamp-1 block mb-2"
                    >
                      {product.name}
                    </Link>

                    {/* Price and Comparison */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-mono font-black text-sm md:text-base text-[#111111]">
                        ₹{product.price}
                      </span>
                      {product.compareAtPrice && (
                        <span className="font-mono text-xs text-[#111111]/40 line-through">
                          ₹{product.compareAtPrice}
                        </span>
                      )}
                    </div>

                    {/* Quick Size Selector */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-[9px] font-mono font-bold text-[#111111]/60 uppercase mr-1">
                        SIZE:
                      </span>
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSizeChange(product.id, s)}
                          className={`w-6 h-6 text-[10px] font-mono font-bold uppercase border transition-colors cursor-pointer ${
                            currentSize === s
                              ? "bg-[#111111] text-white border-[#111111]"
                              : "bg-[#FAF7F2] text-[#111111] border-[#111111]/30 hover:border-[#111111]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Bag Action */}
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className={`w-full py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider border-2 border-[#111111] transition-all cursor-pointer shadow-[2px_2px_0px_#111111] ${
                      isAdded
                        ? "bg-[#00875A] text-white border-[#00875A]"
                        : "bg-[#111111] text-[#FAF7F2] hover:bg-[#FF3B00] hover:border-[#FF3B00] hover:text-white"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>ADDED TO BAG</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>ADD TO BAG ({currentSize})</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
