"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productsData } from "@/data/products";
import { brandData } from "@/data/brand";
import { ArrowLeft, ShoppingBag, Zap, ShieldCheck, Sparkles, Check } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const product = productsData.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const [selectedSize, setSelectedSize] = useState<string>("L");
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="w-full bg-base-cream min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-text-black/70 hover:text-electric-blue transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Collections</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Product Image Column */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[4/5] bg-white border-3 border-text-black shadow-[8px_8px_0px_#111111] overflow-hidden">
              <Image
                src={product.image}
                alt={`${product.name} - KAPDOLOGY Drop 001`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                <span className="bg-electric-blue text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-text-black shadow-[2px_2px_0px_#111111]">
                  {product.drop}
                </span>
                <span className="bg-hot-pink text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-text-black shadow-[2px_2px_0px_#111111]">
                  {product.collection} FAMILY
                </span>
              </div>
            </div>
          </div>

          {/* Product Info Column */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-electric-blue block mb-2">
                KAPDOLOGY® STREETWEAR
              </span>
              <h1 className="font-black text-3xl md:text-5xl uppercase tracking-tight text-text-black mb-3">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl md:text-3xl font-black text-text-black">
                  ₹{product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base font-semibold text-text-black/40 line-through">
                    ₹{product.compareAtPrice}
                  </span>
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-[#00875A] bg-[#E3FCEF] px-2 py-0.5 border border-[#00875A]">
                  IN STOCK • READY TO SHIP
                </span>
              </div>

              <p className="text-sm md:text-base font-medium text-text-black/75 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Spec Highlights */}
            <div className="p-4 bg-white border-2 border-text-black shadow-[4px_4px_0px_#111111] grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider">
              <div>
                <span className="text-text-black/50 block text-[10px] font-black">FABRIC DENSITY</span>
                <span className="text-text-black font-black">{product.gsm} 100% COTTON</span>
              </div>
              <div>
                <span className="text-text-black/50 block text-[10px] font-black">FIT PROFILE</span>
                <span className="text-text-black font-black">{product.fit}</span>
              </div>
              <div>
                <span className="text-text-black/50 block text-[10px] font-black">GRAPHIC FINISH</span>
                <span className="text-text-black font-black">HIGH-DEFINITION DTF</span>
              </div>
              <div>
                <span className="text-text-black/50 block text-[10px] font-black">ORIGIN</span>
                <span className="text-text-black font-black">JAIPUR, INDIA</span>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-text-black">
                  SELECT SIZE
                </span>
                <Link href="/about" className="text-xs font-bold underline text-text-black/60 hover:text-text-black">
                  Size Guide
                </Link>
              </div>
              <div className="flex gap-3">
                {(product.sizes || ["S", "M", "L", "XL"]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-12 text-sm font-black uppercase border-2 border-text-black transition-all ${
                      selectedSize === size
                        ? "bg-text-black text-white shadow-[3px_3px_0px_#FF3B00]"
                        : "bg-white text-text-black hover:bg-chrome-silver"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-black uppercase tracking-wider border-3 border-text-black bg-electric-blue text-white shadow-[4px_4px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>ADDED TO CART</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>ADD TO CART</span>
                  </>
                )}
              </button>

              <Link
                href={`/contact?product=${encodeURIComponent(product.name + " (" + selectedSize + ")")}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-black uppercase tracking-wider border-3 border-text-black bg-text-black text-white hover:bg-hot-pink transition-colors shadow-[4px_4px_0px_#FF3B00]"
              >
                <Zap className="h-4 w-4" />
                <span>BUY NOW</span>
              </Link>
            </div>

            {/* Quality Statement */}
            <div className="flex items-center gap-3 pt-4 border-t border-text-black/10 text-xs font-semibold text-text-black/60">
              <ShieldCheck className="h-5 w-5 text-electric-blue shrink-0" />
              <span>
                100% Original KAPDOLOGY®. Reinforced collar, premium heavy drape, and durable stitching.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
