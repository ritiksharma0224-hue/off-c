"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { useStorefront } from "@/context/StorefrontContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES = ["OVERSIZED", "DROP 001", "BOXY FIT", "GRAPHIC", "240 GSM", "CROPPED SHIRT"];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { products, categories } = useStorefront();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Live filter results against single source of truth
  const trimmed = query.trim().toLowerCase();
  const matchedProducts = trimmed
    ? (products || []).filter(
        (p) =>
          p.status === "ACTIVE" &&
          (p.name.toLowerCase().includes(trimmed) ||
            (p.categoryName || (p as unknown as { category?: string }).category || "").toLowerCase().includes(trimmed) ||
            (p.designFamilyName || (p as unknown as { designFamily?: string }).designFamily || "").toLowerCase().includes(trimmed) ||
            p.fit.toLowerCase().includes(trimmed) ||
            p.gsm.toLowerCase().includes(trimmed) ||
            (p.shortDescription || p.fullDescription || (p as unknown as { description?: string }).description || "").toLowerCase().includes(trimmed))
      )
    : [];

  const matchedCategories = trimmed
    ? (categories || []).filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.shortDescription.toLowerCase().includes(trimmed)
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-start">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#111111]/80 backdrop-blur-md"
          />

          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full bg-[#FAF7F2] border-b-3 border-[#111111] shadow-[0_10px_30px_rgba(0,0,0,0.3)] z-10 max-h-[85vh] flex flex-col"
          >
            {/* Search Input Bar */}
            <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-5 border-b border-[#111111]/15">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="h-5 w-5 text-[#FF3B00] shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SEARCH TEES, HOODIES, FITS, OR GSM..."
                    className="w-full bg-transparent font-black uppercase text-base sm:text-lg md:text-xl tracking-tight text-[#111111] placeholder:text-[#111111]/30 focus:outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="text-xs font-mono font-bold uppercase text-[#111111]/40 hover:text-[#111111]"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="p-2 border-2 border-[#111111] bg-white text-[#111111] hover:bg-[#FF3B00] hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_#111111]"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Recent search suggestions */}
              {!trimmed && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#111111]/10">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#111111]/50">
                    QUICK SEARCH:
                  </span>
                  {RECENT_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-white border border-[#111111]/25 hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Results Area */}
            <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-6 overflow-y-auto flex-1">
              {trimmed ? (
                <div>
                  {matchedProducts.length > 0 || matchedCategories.length > 0 ? (
                    <div className="space-y-6">
                      {/* Matching Categories */}
                      {matchedCategories.length > 0 && (
                        <div>
                          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#111111]/50 mb-3">
                            MATCHING CATEGORIES ({matchedCategories.length})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {matchedCategories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/shop?category=${cat.slug}`}
                                onClick={onClose}
                                className="p-3 bg-white border-2 border-[#111111] hover:border-[#FF3B00] transition-colors shadow-[2px_2px_0px_#111111] flex items-center justify-between group"
                              >
                                <div>
                                  <span className="text-xs font-black uppercase text-[#111111] group-hover:text-[#FF3B00] transition-colors">
                                    {cat.name}
                                  </span>
                                  <span className="text-[10px] font-mono block text-[#111111]/60">
                                    {cat.itemCount} Designs
                                  </span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-[#111111]/40 group-hover:text-[#FF3B00] group-hover:translate-x-0.5 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matching Products */}
                      {matchedProducts.length > 0 && (
                        <div>
                          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#111111]/50 mb-3">
                            PRODUCTS ({matchedProducts.length})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {matchedProducts.map((product) => (
                              <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                onClick={onClose}
                                className="group p-3 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[5px_5px_0px_#111111] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex gap-3"
                              >
                                <div className="relative w-16 h-20 bg-gray-100 border border-[#111111] shrink-0 overflow-hidden">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <div className="flex flex-col justify-between flex-1 min-w-0">
                                  <div>
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className="text-[9px] font-mono font-bold uppercase text-[#FF3B00]">
                                        {product.gsm}
                                      </span>
                                      <span className="text-[#111111]/20">•</span>
                                      <span className="text-[9px] font-mono font-bold uppercase text-[#111111]/50 truncate">
                                        {product.categoryName || (product as unknown as { category?: string }).category || "STREETWEAR"}
                                      </span>
                                    </div>
                                    <h4 className="font-black uppercase text-xs text-[#111111] group-hover:text-[#FF3B00] transition-colors line-clamp-1">
                                      {product.name}
                                    </h4>
                                  </div>
                                  <div className="flex items-baseline gap-2 mt-1">
                                    <span className="font-black text-xs text-[#111111]">
                                      ₹{product.price}
                                    </span>
                                    {product.compareAtPrice && (
                                      <span className="text-[10px] text-[#111111]/40 line-through">
                                        ₹{product.compareAtPrice}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* No Signal Found State */
                    <div className="py-12 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-center mb-3">
                        <Search className="h-6 w-6 text-[#FF3B00]" />
                      </div>
                      <h3 className="font-black uppercase text-lg text-[#111111] mb-1">
                        NO SIGNAL FOUND.
                      </h3>
                      <p className="text-xs font-semibold text-[#111111]/60 max-w-sm mb-4">
                        We couldn&apos;t find any garments matching &quot;{query}&quot;. Try another term or browse our primary categories.
                      </p>
                      <Link
                        href="/shop"
                        onClick={onClose}
                        className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-[#111111] text-[#FAF7F2] border-2 border-[#111111] hover:bg-[#FF3B00] hover:border-[#FF3B00] transition-colors"
                      >
                        EXPLORE ALL PRODUCTS →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#111111]/50 mb-3 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-[#FF3B00]" />
                    <span>FEATURED PICKS FROM DROP 001</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(products || []).filter((p) => p.status === "ACTIVE" && (p.featured || p.isPopular)).slice(0, 4).map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={onClose}
                        className="p-2.5 bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:border-[#FF3B00] transition-colors group flex flex-col"
                      >
                        <div className="relative w-full aspect-[4/5] bg-gray-100 border border-[#111111]/20 mb-2 overflow-hidden">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="font-black uppercase text-[11px] text-[#111111] line-clamp-1 group-hover:text-[#FF3B00] transition-colors">
                          {p.name}
                        </span>
                        <span className="font-mono font-bold text-[11px] text-[#FF3B00]">
                          ₹{p.price}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
