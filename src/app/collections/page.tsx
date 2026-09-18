"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { productsData } from "@/data/products";
import { collectionsData } from "@/data/collections";
import { ShoppingBag, SlidersHorizontal, Sparkles } from "lucide-react";

function CollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State for active collection selection
  const [activeCollection, setActiveCollection] = useState<string>("all");

  // Read initial filter from URL search params on mount
  useEffect(() => {
    const categoryQuery = searchParams.get("category");
    if (categoryQuery) {
      const isValid = collectionsData.some((c) => c.slug === categoryQuery);
      if (isValid) {
        setActiveCollection(categoryQuery);
      }
    }
  }, [searchParams]);

  // Handle collection button click
  const handleCollectionSelect = (slug: string) => {
    setActiveCollection(slug);
    if (slug === "all") {
      router.push("/collections");
    } else {
      router.push(`/collections?category=${slug}`);
    }
  };

  // Filter products based on active collection family
  const filteredProducts = productsData.filter((product) => {
    if (activeCollection === "all") return true;
    return product.collection.toLowerCase() === activeCollection.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      
      {/* Editorial Header */}
      <div className="mb-12 text-left">
        <span className="text-xs font-black uppercase tracking-widest text-electric-blue block mb-2">
          KAPDOLOGY® / DROP 001
        </span>
        <h1 className="font-black text-4xl md:text-6xl uppercase tracking-tight text-text-black">
          THE COLLECTIONS
        </h1>
        <p className="text-sm md:text-base font-semibold text-text-black/70 mt-2 max-w-xl leading-relaxed">
          Not just clothes. It&apos;s a mood. Explore our official Drop 001 heavy structured oversized fits.
        </p>
      </div>

      {/* Filter controls */}
      <div className="mb-10 pb-6 border-b-2 border-text-black/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Buttons List */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => handleCollectionSelect("all")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-text-black transition-all ${
              activeCollection === "all"
                ? "bg-text-black text-white shadow-[2px_2px_0px_#FF3B00]"
                : "bg-white text-text-black hover:bg-chrome-silver"
            }`}
          >
            ALL DROPS
          </button>
          {collectionsData.map((item) => (
            <button
              key={item.id}
              onClick={() => handleCollectionSelect(item.slug)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-text-black transition-all ${
                activeCollection === item.slug
                  ? "bg-text-black text-white shadow-[2px_2px_0px_#FF3B00]"
                  : "bg-white text-text-black hover:bg-chrome-silver"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Count indicators */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-black/60 shrink-0">
          <SlidersHorizontal className="h-4.5 w-4.5" />
          <span>Showing {filteredProducts.length} items</span>
        </div>
      </div>

      {/* Drop Alert Disclaimer */}
      <div className="w-full mb-10 bg-white border-2 border-text-black p-4 flex items-center justify-between gap-3 shadow-[3px_3px_0px_#111111]">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-hot-pink shrink-0" />
          <span className="text-xs md:text-sm font-black uppercase tracking-wide text-text-black">
            DROP 001 / 2026 — HEAVYWEIGHT 200–220 GSM OVERSIZED FITS
          </span>
        </div>
        <span className="hidden md:inline-block text-xs font-bold uppercase tracking-widest text-electric-blue">
          WEAR THE CULTURE
        </span>
      </div>

      {/* Products Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative flex flex-col bg-white border-2 border-text-black shadow-[4px_4px_0px_#111111] hover:shadow-[8px_8px_0px_#111111] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 overflow-hidden"
              >
                {/* Visual Cover */}
                <div className="relative w-full h-[320px] bg-chrome-silver overflow-hidden">
                  <Image
                    src={product.image}
                    alt={`${product.name} - KAPDOLOGY Drop 001`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                    <span className="bg-electric-blue text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-text-black shadow-[1px_1px_0px_#111111]">
                      {product.drop}
                    </span>
                    {product.featured && (
                      <span className="bg-hot-pink text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-text-black shadow-[1px_1px_0px_#111111]">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white text-text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-text-black">
                    {product.gsm} • {product.fit}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-grow flex flex-col justify-between border-t border-text-black bg-white">
                  <div className="mb-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-black/50 mb-1">
                      {product.collection} FAMILY
                    </div>
                    <h3 className="font-black uppercase text-sm tracking-wide text-text-black line-clamp-1 group-hover:text-electric-blue transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-text-black/60 font-medium line-clamp-2 mt-1 mb-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-base text-text-black">
                        ₹{product.price}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs font-semibold text-text-black/40 line-through">
                          ₹{product.compareAtPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-black uppercase tracking-wider border-2 border-text-black bg-electric-blue text-white hover:bg-text-black transition-colors duration-300 shadow-[2px_2px_0px_#111111]"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>VIEW PRODUCT</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="w-full py-20 border-2 border-dashed border-text-black/20 text-center bg-white flex flex-col items-center justify-center">
          <h3 className="font-extrabold uppercase text-lg mb-1">No items found</h3>
          <p className="text-sm font-semibold text-text-black/50">
            More items dropping soon under KAPDOLOGY® Drop 001.
          </p>
        </div>
      )}
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <div className="w-full bg-base-cream min-h-screen">
      <Suspense fallback={
        <div className="w-full py-20 text-center font-bold uppercase tracking-widest text-text-black/60">
          Loading catalog...
        </div>
      }>
        <CollectionsContent />
      </Suspense>
    </div>
  );
}
