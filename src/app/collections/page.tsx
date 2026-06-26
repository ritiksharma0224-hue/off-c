"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { productsData } from "@/data/products";
import { collectionsData } from "@/data/collections";
import { ShoppingBag, SlidersHorizontal, AlertCircle, HelpCircle } from "lucide-react";

function CollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State for active filter selection
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Read initial filter from URL search params on mount
  useEffect(() => {
    const categoryQuery = searchParams.get("category");
    if (categoryQuery) {
      // Confirm the category exists
      const isValid = collectionsData.some((c) => c.slug === categoryQuery);
      if (isValid) {
        setActiveCategory(categoryQuery);
      }
    }
  }, [searchParams]);

  // Handle category button click
  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
    // Update URL query parameters without page reload
    if (slug === "all") {
      router.push("/collections");
    } else {
      router.push(`/collections?category=${slug}`);
    }
  };

  // Filter products based on active category
  const filteredProducts = productsData.filter((product) => {
    if (activeCategory === "all") return true;
    
    // Custom mapping for categories
    if (activeCategory === "oversized-tees") return product.category === "oversized-tees";
    if (activeCategory === "boxy-fits") return product.category === "boxy-fits";
    if (activeCategory === "cropped-shirts") return product.category === "cropped-shirts";
    if (activeCategory === "graphic-tees") return product.category === "graphic-tees";
    if (activeCategory === "casual-fits") return product.category === "casual-fits";
    if (activeCategory === "new-drops") return product.category === "new-drops";
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      
      {/* Editorial Header */}
      <div className="mb-12 text-left">
        <span className="text-xs font-black uppercase tracking-widest text-electric-blue block mb-2">
          OFF CULTURE CATALOG
        </span>
        <h1 className="font-black text-4xl md:text-6xl uppercase tracking-tight text-text-black">
          The Collections
        </h1>
        <p className="text-sm font-semibold text-text-black/60 mt-2 max-w-lg">
          Browse our streetwear drops. All items are locally designed in Mansarovar, Jaipur. Select a fit profile below to filter.
        </p>
      </div>

      {/* Filter controls */}
      <div className="mb-10 pb-6 border-b-2 border-text-black/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Buttons List */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => handleCategorySelect("all")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-text-black transition-all ${
              activeCategory === "all"
                ? "bg-text-black text-white shadow-[2px_2px_0px_#0052FF]"
                : "bg-white text-text-black hover:bg-chrome-silver"
            }`}
          >
            All Items
          </button>
          {collectionsData.map((item) => (
            <button
              key={item.id}
              onClick={() => handleCategorySelect(item.slug)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-text-black transition-all ${
                activeCategory === item.slug
                  ? "bg-text-black text-white shadow-[2px_2px_0px_#0052FF]"
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
      <div className="w-full mb-10 bg-yellow-50 border-2 border-text-black p-4 flex items-center gap-3 shadow-[3px_3px_0px_#111111]">
        <AlertCircle className="h-5 w-5 text-hot-pink shrink-0" />
        <span className="text-xs md:text-sm font-bold uppercase tracking-wide text-text-black">
          To buy or confirm stock status, click &apos;Check Availability&apos; to contact our VT Road Circle store directly.
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
                <div className="relative w-full h-[300px] bg-chrome-silver overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                    {product.isNew && (
                      <span className="bg-neon-green text-text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-text-black shadow-[1px_1px_0px_#111111]">
                        NEW DROP
                      </span>
                    )}
                    {product.isPopular && (
                      <span className="bg-hot-pink text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-text-black shadow-[1px_1px_0px_#111111]">
                        HOT ITEM
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white text-text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-text-black">
                    {product.fit}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-grow flex flex-col justify-between border-t border-text-black bg-white">
                  <div className="mb-4">
                    <h3 className="font-extrabold uppercase text-sm tracking-wide text-text-black line-clamp-1 group-hover:text-electric-blue transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-text-black/60 font-medium line-clamp-2 mt-1 mb-2 leading-relaxed">
                      {product.description}
                    </p>
                    <span className="font-black text-base text-text-black block">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* CTA Availability Action */}
                  <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold uppercase tracking-wider border-2 border-text-black bg-white hover:bg-text-black hover:text-white transition-colors duration-300"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Check Availability</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="w-full py-20 border-2 border-dashed border-text-black/20 text-center bg-white flex flex-col items-center justify-center">
          <HelpCircle className="h-12 w-12 text-text-black/40 mb-3" />
          <h3 className="font-extrabold uppercase text-lg mb-1">No items found</h3>
          <p className="text-sm font-semibold text-text-black/50">
            We haven&apos;t loaded items for this segment yet. Please check back soon or ask on Instagram.
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
