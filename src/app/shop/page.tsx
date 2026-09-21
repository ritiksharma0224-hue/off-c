"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ArrowUpDown, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { MasterProduct } from "@/lib/db/types";
import { useStorefront } from "@/context/StorefrontContext";
import { useCart } from "@/context/CartContext";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { products, categories, designFamilies } = useStorefront();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [addedId, setAddedId] = useState<string | null>(null);

  // Sync category from URL parameter
  useEffect(() => {
    const catQuery = searchParams.get("category");
    if (catQuery) {
      setSelectedCategory(catQuery);
    }
  }, [searchParams]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === "all") {
      router.push("/shop");
    } else {
      router.push(`/shop?category=${slug}`);
    }
  };

  // Filter and sort products from Master Single Source of Truth
  const filteredProducts = useMemo(() => {
    let result = (products || []).filter((p) => {
      // Show active, preorder, or reservation open garments
      if (p.status !== "ACTIVE" && p.status !== "PREORDER" && p.status !== "RESERVATION OPEN") {
        return false;
      }
      const catSlug = p.categorySlug || "";
      const familySlug = p.designFamilyId || p.designFamilyName?.toLowerCase() || (p as unknown as { designFamily?: string }).designFamily?.toLowerCase() || "";
      const matchesCat = selectedCategory === "all" || catSlug === selectedCategory;
      const matchesFamily = selectedFamily === "all" || familySlug === selectedFamily.toLowerCase();
      return matchesCat && matchesFamily;
    });

    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "featured":
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, selectedFamily, sortBy]);

  const handleQuickAdd = (product: MasterProduct) => {
    const productSizes = product.availableSizes?.length
      ? product.availableSizes
      : (product as unknown as { sizes?: string[] }).sizes || ["L"];
    const defaultSize = productSizes[0] || "L";
    addToCart(product, defaultSize, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 select-none">
      
      {/* Page Header */}
      <div className="mb-10 text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-[#FF3B00]" />
          <span className="font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
            CATALOG ARCHIVE / DROP 001
          </span>
        </div>
        <h1 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.92] text-[#111111]">
          ALL GARMENTS
        </h1>
        <p className="text-sm font-medium text-[#111111]/70 mt-2 max-w-lg">
          Heavyweight 200–240 GSM organic cotton, architectural box drapes, and high-definition DTF graphics.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="mb-10 pb-6 border-b-2 border-[#111111]/15 space-y-4">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#111111]/50 mr-1">
            CATEGORY:
          </span>
          <button
            onClick={() => handleCategorySelect("all")}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 border-[#111111] transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#111111] text-[#FAF7F2] shadow-[2px_2px_0px_#FF3B00]"
                : "bg-white text-[#111111] hover:bg-gray-100"
            }`}
          >
            ALL CATEGORIES
          </button>
          {(categories || []).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 border-[#111111] transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? "bg-[#111111] text-[#FAF7F2] shadow-[2px_2px_0px_#FF3B00]"
                : "bg-white text-[#111111] hover:bg-gray-100"
              }`}
            >
              {cat.name} ({cat.itemCount})
            </button>
          ))}
        </div>

        {/* Family & Sort Secondary Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {/* Design Family Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#111111]/50 mr-1">
              DESIGN FAMILY:
            </span>
            <button
              onClick={() => setSelectedFamily("all")}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border transition-colors cursor-pointer ${
                selectedFamily === "all"
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-[#111111]/70 border-[#111111]/25 hover:border-[#111111]"
              }`}
            >
              ALL
            </button>
            {(designFamilies || []).map((fam) => (
              <button
                key={fam.id}
                onClick={() => setSelectedFamily(fam.slug)}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border transition-colors cursor-pointer ${
                  selectedFamily === fam.slug
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white text-[#111111]/70 border-[#111111]/25 hover:border-[#111111]"
                }`}
              >
                {fam.name}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown + Counter */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs font-mono font-bold text-[#111111]/60 uppercase">
              {filteredProducts.length} {filteredProducts.length === 1 ? "PIECE" : "PIECES"}
            </span>

            <div className="flex items-center gap-2 bg-white border border-[#111111] px-3 py-1.5 shadow-[2px_2px_0px_#111111]">
              <ArrowUpDown className="h-3.5 w-3.5 text-[#FF3B00]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-mono text-xs font-bold uppercase text-[#111111] focus:outline-none cursor-pointer"
              >
                <option value="featured">SORT: FEATURED</option>
                <option value="newest">SORT: NEWEST FIRST</option>
                <option value="price-low">PRICE: LOW → HIGH</option>
                <option value="price-high">PRICE: HIGH → LOW</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const isAdded = addedId === product.id;

              return (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex flex-col bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[8px_8px_0px_#111111] hover:translate-x-[-3px] hover:translate-y-[-3px] transition-all duration-300"
                >
                  {/* Visual Image with Hover Swap */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden block"
                  >
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

                    {product.images.length > 1 && (
                      <Image
                        src={product.images[1]}
                        alt={`${product.name} alternate`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    )}

                    {/* Top Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-20 pointer-events-none">
                      {product.status === "RESERVATION OPEN" && (
                        <span className="bg-[#D97706] text-white font-mono text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-white/20">
                          RESERVATION
                        </span>
                      )}
                      {product.status === "PREORDER" && (
                        <span className="bg-[#2563EB] text-white font-mono text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-white/20">
                          PREORDER
                        </span>
                      )}
                      {product.badge && (
                        <span className="bg-[#111111] text-white font-mono text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-white/20">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Bottom Specs */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-[#111111] text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border border-[#111111] shadow-[1px_1px_0px_#111111]">
                      {product.gsm}
                    </div>
                  </Link>

                  {/* Info Container */}
                  <div className="p-4 flex-grow flex flex-col justify-between border-t border-[#111111] bg-white">
                    <div>
                      <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-[#111111]/50 mb-1">
                        <span>{product.categoryName || (product as unknown as { category?: string }).category || "STREETWEAR"}</span>
                        <span>{product.designFamilyName || (product as unknown as { designFamily?: string }).designFamily || "GLOBAL"}</span>
                      </div>

                      <Link
                        href={`/product/${product.slug}`}
                        className="font-black uppercase text-xs md:text-sm tracking-tight text-[#111111] hover:text-[#FF3B00] transition-colors line-clamp-1 block mb-2"
                      >
                        {product.name}
                      </Link>

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
                    </div>

                    {/* Actions: View Product & Quick Add */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#111111]/10">
                      <Link
                        href={`/product/${product.slug}`}
                        className="py-2 text-center text-[11px] font-black uppercase border border-[#111111] bg-[#FAF7F2] hover:bg-[#111111] hover:text-white transition-colors"
                      >
                        DETAILS
                      </Link>

                      <button
                        onClick={() => handleQuickAdd(product)}
                        className={`py-2 text-center text-[11px] font-black uppercase border border-[#111111] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          isAdded
                            ? "bg-[#00875A] text-white border-[#00875A]"
                            : "bg-[#111111] text-[#FAF7F2] hover:bg-[#FF3B00] hover:border-[#FF3B00] hover:text-white"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>ADDED</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-3 w-3" />
                            <span>ADD ({(product.availableSizes?.[0] || (product as unknown as { sizes?: string[] }).sizes?.[0] || "L")})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="py-20 border-2 border-dashed border-[#111111]/20 text-center bg-white flex flex-col items-center justify-center p-8">
          <h3 className="font-black uppercase text-xl text-[#111111] mb-2">
            NO DESIGNS MATCH YOUR FILTERS
          </h3>
          <p className="text-xs font-semibold text-[#111111]/60 max-w-sm mb-6">
            Try resetting category or design family selections to view the complete Drop 001 catalog.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedFamily("all");
              router.push("/shop");
            }}
            className="px-6 py-2.5 font-black uppercase text-xs border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] hover:bg-[#FF3B00] hover:border-[#FF3B00] transition-colors"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}

    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen">
      <Suspense
        fallback={
          <div className="w-full py-24 text-center font-mono text-xs font-black uppercase tracking-widest text-[#111111]/60">
            LOADING KAPDOLOGY® CATALOG...
          </div>
        }
      >
        <ShopContent />
      </Suspense>
    </div>
  );
}
