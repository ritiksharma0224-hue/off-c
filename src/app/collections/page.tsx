"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { useStorefront } from "@/context/StorefrontContext";

function CollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, designFamilies } = useStorefront();

  const [activeFamily, setActiveFamily] = useState<string>("all");

  useEffect(() => {
    const familyQuery = searchParams.get("family") || searchParams.get("category");
    if (familyQuery) {
      const exists = (designFamilies || []).some(
        (f) => f.slug.toLowerCase() === familyQuery.toLowerCase()
      );
      if (exists) {
        setActiveFamily(familyQuery.toLowerCase());
      }
    }
  }, [searchParams, designFamilies]);

  const handleFamilySelect = (slug: string) => {
    setActiveFamily(slug);
    if (slug === "all") {
      router.push("/collections");
    } else {
      router.push(`/collections?family=${slug}`);
    }
  };

  const activeProducts = useMemo(() => {
    return (products || []).filter((p) => p.status === "ACTIVE" || p.status === "PREORDER" || p.status === "RESERVATION OPEN");
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeFamily === "all") return activeProducts;
    return activeProducts.filter((p) => {
      const fam = p.designFamilyId || p.designFamilyName?.toLowerCase() || (p as unknown as { designFamily?: string }).designFamily?.toLowerCase();
      return fam === activeFamily.toLowerCase();
    });
  }, [activeFamily, activeProducts]);

  const activeFamilyData = (designFamilies || []).find(
    (f) => f.slug.toLowerCase() === activeFamily.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 select-none">
      
      {/* Page Header */}
      <div className="mb-12 text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-[#FF3B00]" />
          <span className="font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
            DESIGN ARCHITECTURE
          </span>
        </div>
        <h1 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.92] text-[#111111]">
          THE DESIGN FAMILIES
        </h1>
        <p className="text-sm md:text-base font-medium text-[#111111]/70 mt-2 max-w-xl leading-relaxed">
          Kapdology groups garments into six conceptual Design Families representing specific silhouettes, wash treatments, and visual attitudes.
        </p>
      </div>

      {/* Design Families Selector Bar */}
      <div className="mb-10 pb-6 border-b-2 border-[#111111]/15 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleFamilySelect("all")}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase border-2 border-[#111111] transition-all cursor-pointer ${
              activeFamily === "all"
                ? "bg-[#111111] text-[#FAF7F2] shadow-[2px_2px_0px_#FF3B00]"
                : "bg-white text-[#111111] hover:bg-gray-100"
            }`}
          >
            ALL FAMILIES ({activeProducts.length})
          </button>

          {(designFamilies || []).map((fam) => {
            const count = activeProducts.filter((p) => {
              const f = p.designFamilyId || p.designFamilyName?.toLowerCase() || (p as unknown as { designFamily?: string }).designFamily?.toLowerCase();
              return f === fam.slug.toLowerCase();
            }).length;

            return (
              <button
                key={fam.id}
                onClick={() => handleFamilySelect(fam.slug)}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase border-2 border-[#111111] transition-all cursor-pointer ${
                  activeFamily === fam.slug
                    ? "bg-[#111111] text-[#FAF7F2] shadow-[2px_2px_0px_#FF3B00]"
                    : "bg-white text-[#111111] hover:bg-gray-100"
                }`}
              >
                {fam.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Active Family Narrative Banner (if specific family selected) */}
        {activeFamilyData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#111111] text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5">
                  {activeFamilyData.tag}
                </span>
                <span className="font-mono text-xs text-[#FF3B00] font-bold">
                  {activeFamilyData.subtitle}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#111111]/80 max-w-2xl leading-relaxed">
                {activeFamilyData.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 shrink-0">
              {activeFamilyData.features.map((feat) => (
                <span
                  key={feat}
                  className="px-2 py-1 bg-[#FAF7F2] border border-[#111111]/30 font-mono text-[10px] uppercase font-bold text-[#111111]"
                >
                  {feat}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Garments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group relative flex flex-col bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[8px_8px_0px_#111111] hover:translate-x-[-3px] hover:translate-y-[-3px] transition-all duration-300"
          >
            <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#111111] text-white font-mono text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-white/20 z-10">
                {product.designFamilyName || (product as unknown as { designFamily?: string }).designFamily || "GLOBAL"}
              </div>
              <div className="absolute bottom-3 right-3 bg-white/95 text-[#111111] text-[9px] font-mono font-bold uppercase px-2 py-0.5 border border-[#111111]">
                {product.gsm}
              </div>
            </div>

            <div className="p-4 flex-grow flex flex-col justify-between border-t border-[#111111] bg-white">
              <div>
                <div className="text-[9px] font-mono uppercase text-[#111111]/50 mb-1">
                  {product.categoryName || (product as unknown as { category?: string }).category || "STREETWEAR"}
                </div>
                <h3 className="font-black uppercase text-xs md:text-sm tracking-tight text-[#111111] group-hover:text-[#FF3B00] transition-colors line-clamp-1 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-black text-sm text-[#111111]">
                    ₹{product.price}
                  </span>
                  {product.compareAtPrice && (
                    <span className="font-mono text-xs text-[#111111]/40 line-through">
                      ₹{product.compareAtPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-[#111111]/10 flex items-center justify-between text-xs font-black uppercase text-[#111111] group-hover:text-[#FF3B00]">
                <span>VIEW PIECE</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

export default function CollectionsPage() {
  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen">
      <Suspense
        fallback={
          <div className="w-full py-24 text-center font-mono text-xs font-black uppercase tracking-widest text-[#111111]/60">
            LOADING DESIGN FAMILIES...
          </div>
        }
      >
        <CollectionsContent />
      </Suspense>
    </div>
  );
}
