"use client";

import React, { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
  Info,
  Ruler
} from "lucide-react";
import { productsData, Product } from "@/data/products";
import { brandData } from "@/data/brand";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, openCart } = useCart();

  const product = productsData.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "L");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  const toggleAccordion = (name: string) => {
    setOpenAccordion((prev) => (prev === name ? null : name));
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    router.push("/checkout");
  };

  // Related products from same family or category
  const relatedProducts = productsData
    .filter((p) => p.id !== product.id && (p.category === product.category || p.designFamily === product.designFamily))
    .slice(0, 4);

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-8 md:py-16 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#111111]/70 hover:text-[#FF3B00] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK TO SHOP</span>
          </Link>

          <span className="font-mono text-[10px] uppercase text-[#111111]/40">
            {product.drop} • {product.designFamily} FAMILY
          </span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Thumbnail switcher (if multiple images exist) */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative w-16 h-20 md:w-20 md:h-24 bg-gray-100 border-2 transition-all cursor-pointer overflow-hidden shrink-0 ${
                      activeImageIndex === i
                        ? "border-[#FF3B00] shadow-[2px_2px_0px_#111111]"
                        : "border-[#111111]/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Primary Large Image Frame */}
            <div className="relative flex-1 aspect-[4/5] bg-[#151515] border-3 border-[#111111] shadow-[8px_8px_0px_#111111] overflow-hidden group">
              <Image
                src={product.images[activeImageIndex] || product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
                <span className="bg-[#111111] text-white font-mono text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-white/20">
                  {product.drop}
                </span>
                {product.badge && (
                  <span className="bg-[#FF3B00] text-white font-mono text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-black shadow-[2px_2px_0px_#111111]">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Specifications Pill */}
              <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-sm text-[#111111] font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 border border-[#111111] shadow-[2px_2px_0px_#111111]">
                {product.gsm} • {product.fabric}
              </div>
            </div>

          </div>

          {/* RIGHT: Product Information & Purchase Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#FF3B00]">
                <span>KAPDOLOGY® STREETWEAR</span>
                <span>•</span>
                <span>{product.category}</span>
              </div>

              <h1 className="font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-[#111111] mb-3">
                {product.name}
              </h1>

              {/* Price & Stock status */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#111111]">
                  ₹{product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="font-mono text-base font-semibold text-[#111111]/40 line-through">
                    ₹{product.compareAtPrice}
                  </span>
                )}
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00875A] bg-[#E3FCEF] px-2 py-0.5 border border-[#00875A]">
                  READY TO SHIP
                </span>
              </div>

              <p className="text-sm font-medium text-[#111111]/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#111111]/50 block text-[9px] font-mono font-bold uppercase">
                  FABRIC WEIGHT
                </span>
                <span className="font-black text-[#111111] uppercase">{product.gsm}</span>
              </div>
              <div>
                <span className="text-[#111111]/50 block text-[9px] font-mono font-bold uppercase">
                  FIT PROFILE
                </span>
                <span className="font-black text-[#111111] uppercase">{product.fit}</span>
              </div>
              <div>
                <span className="text-[#111111]/50 block text-[9px] font-mono font-bold uppercase">
                  PRINT TECHNIQUE
                </span>
                <span className="font-black text-[#111111] uppercase">{product.printMethod}</span>
              </div>
              <div>
                <span className="text-[#111111]/50 block text-[9px] font-mono font-bold uppercase">
                  STUDIO ORIGIN
                </span>
                <span className="font-black text-[#111111] uppercase">JAIPUR, INDIA</span>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-[#111111]">
                  SELECT SIZE ({selectedSize})
                </span>
                <Link
                  href="/size-guide"
                  className="inline-flex items-center gap-1 text-xs font-mono font-bold underline text-[#FF3B00] hover:text-[#111111]"
                >
                  <Ruler className="h-3 w-3" />
                  <span>SIZE GUIDE</span>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-11 text-xs font-mono font-black uppercase border-2 transition-all cursor-pointer ${
                      selectedSize === size
                        ? "bg-[#111111] text-white border-[#111111] shadow-[3px_3px_0px_#FF3B00]"
                        : "bg-white text-[#111111] border-[#111111]/40 hover:border-[#111111]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-[#111111]">
                QUANTITY:
              </span>
              <div className="flex items-center border-2 border-[#111111] bg-white shadow-[2px_2px_0px_#111111]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 font-mono font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 font-mono font-black text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 font-mono font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons: ADD TO CART & BUY NOW */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 flex items-center justify-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-white text-[#111111] shadow-[4px_4px_0px_#111111] hover:bg-[#111111] hover:text-white transition-all cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4 text-[#00875A]" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>ADD TO BAG</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 px-6 flex items-center justify-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[4px_4px_0px_#FF3B00] hover:shadow-[2px_2px_0px_#FF3B00] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#FF3B00] hover:border-[#FF3B00] hover:text-white transition-all cursor-pointer"
              >
                <Zap className="h-4 w-4" />
                <span>BUY NOW</span>
              </button>
            </div>

            {/* Risk Reduction & Trust Reassurance */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#111111]/10 text-xs font-bold text-[#111111]/70">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#FF3B00] shrink-0" />
                <span>3–5 DAYS DELIVERY</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-[#FF3B00] shrink-0" />
                <span>7-DAY EXCHANGE</span>
              </div>
            </div>

            {/* Informational Accordions */}
            <div className="border-t-2 border-[#111111] divide-y divide-[#111111]/15">
              
              {/* Accordion 1: Details */}
              <div>
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full py-3.5 flex items-center justify-between text-xs font-mono font-black uppercase text-[#111111] text-left cursor-pointer"
                >
                  <span>PRODUCT SPECIFICATIONS & CONSTRUCTION</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openAccordion === "details" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "details" && (
                  <div className="pb-4 text-xs text-[#111111]/80 space-y-2">
                    <ul className="list-disc pl-4 space-y-1">
                      {product.details.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Care */}
              <div>
                <button
                  onClick={() => toggleAccordion("care")}
                  className="w-full py-3.5 flex items-center justify-between text-xs font-mono font-black uppercase text-[#111111] text-left cursor-pointer"
                >
                  <span>GARMENT CARE INSTRUCTIONS</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openAccordion === "care" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "care" && (
                  <div className="pb-4 text-xs text-[#111111]/80">
                    <p>{product.care}</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Returns */}
              <div>
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full py-3.5 flex items-center justify-between text-xs font-mono font-black uppercase text-[#111111] text-left cursor-pointer"
                >
                  <span>SHIPPING & RETURNS POLICY</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openAccordion === "shipping" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "shipping" && (
                  <div className="pb-4 text-xs text-[#111111]/80 space-y-2">
                    <p>
                      Orders dispatched within 24–48 hours from Jaipur studio. Standard pan-India delivery takes 3–5 business days. Free shipping on orders above ₹{brandData.shipping.freeThreshold}.
                    </p>
                    <p>
                      We accept size exchanges and returns within {brandData.returns.windowDays} days of delivery provided garments remain unworn with original tags attached.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Genuine Community Reviews State (NO FAKE REVIEWS) */}
            <div className="p-4 bg-white border border-[#111111]/25 text-xs text-[#111111]/70 space-y-1">
              <span className="font-mono text-[9px] font-black uppercase text-[#FF3B00] block">
                COMMUNITY FEEDBACK
              </span>
              <p className="font-semibold">
                Customer reviews will unlock for verified buyers following fulfillment of Drop 001 dispatches.
              </p>
            </div>

          </div>

        </div>

        {/* Complete the Look / Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t-2 border-[#111111]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FF3B00] block mb-1">
                  CURATED RECOMMENDATION
                </span>
                <h3 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
                  COMPLETE THE LOOK
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs font-mono font-bold uppercase text-[#111111] hover:text-[#FF3B00] underline"
              >
                VIEW FULL CATALOG →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/product/${rel.slug}`}
                  className="group p-3 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[6px_6px_0px_#111111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex flex-col"
                >
                  <div className="relative w-full aspect-[4/5] bg-gray-100 border border-[#111111]/20 mb-3 overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[9px] font-mono uppercase text-[#111111]/50 mb-0.5">
                    {rel.category}
                  </span>
                  <h4 className="font-black uppercase text-xs text-[#111111] group-hover:text-[#FF3B00] transition-colors line-clamp-1 mb-1">
                    {rel.name}
                  </h4>
                  <span className="font-mono font-bold text-xs text-[#111111]">
                    ₹{rel.price}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
