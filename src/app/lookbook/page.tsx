"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { productsData } from "@/data/products";

const lookbookStories = [
  {
    frame: "01",
    title: "SIGNATURE OVERSIZED DRAPE",
    description: "Drop shoulder silhouette cut from 240 GSM organic combed cotton. Architectural volume designed to hang cleanly without clinging to the body.",
    image: "/images/hero.png",
    productSlug: "signature-oversized-box-tee",
    productName: "Signature Oversized Box Tee",
    price: "₹599",
    specs: "240 GSM • DROP 001"
  },
  {
    frame: "02",
    title: "MINERAL ACID DISTRESSING",
    description: "Individually hand-washed heavy terry cotton. Each piece exhibits subtle tonal variations across seams and neck ribbing, creating genuine vintage streetwear character.",
    image: "/images/vintage-wash.jpg",
    productSlug: "vintage-distressed-acid-wash-tee",
    productName: "Vintage Distressed Acid Wash Tee",
    price: "₹1399",
    specs: "240 GSM TERRY • CHAOS FAMILY"
  },
  {
    frame: "03",
    title: "HIGH-DENSITY SUBCULTURE ARTWORK",
    description: "Intricate cyber and typography artwork cured via multi-pass direct-to-fabric printing. Built to withstand continuous wash cycles while retaining crisp ink tension.",
    image: "/images/cyber-tee.jpg",
    productSlug: "cyber-culture-oversized-graphic-tee",
    productName: "Cyber Culture Oversized Graphic Tee",
    price: "₹1299",
    specs: "240 GSM • IDENTITY FAMILY"
  },
  {
    frame: "04",
    title: "SLATE ARCHITECTURAL BOXY FIT",
    description: "Expanded chest width balanced with a calculated cropped length. High mock rib collar delivers a clean neckline that frames outerwear effortlessly.",
    image: "/images/slate-boxy.jpg",
    productSlug: "minimalist-slate-boxy-tee",
    productName: "Minimalist Slate Boxy Tee",
    price: "₹1199",
    specs: "220 GSM • MINIMAL FAMILY"
  },
  {
    frame: "05",
    title: "TECHNICAL UTILITY SILHOUETTE",
    description: "Functional streetwear button-down constructed from 200 GSM cotton twill. Dual cargo pockets with industrial snap closures and a sharp horizontal square hem.",
    image: "/images/cropped-shirt.jpg",
    productSlug: "urban-utility-cropped-shirt",
    productName: "Urban Utility Cropped Shirt",
    price: "₹1499",
    specs: "200 GSM TWILL • TECHNICAL"
  }
];

export default function LookbookPage() {
  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen pb-24 select-none">
      
      {/* Header */}
      <section className="py-16 md:py-24 border-b-2 border-[#111111] bg-white streetwear-grid">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white border-2 border-[#111111] shadow-[2px_2px_0px_#FF3B00] font-mono text-[10px] md:text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#FF3B00]" />
            <span>KAPDOLOGY® VISUAL ARCHIVE</span>
          </div>

          <h1 className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.88] text-[#111111] mb-6">
            CAMPAIGN 01<br />
            <span className="text-[#FF3B00]">DROP 001 LOOKBOOK</span>
          </h1>

          <p className="text-base sm:text-lg font-medium text-[#111111]/75 leading-relaxed max-w-xl mx-auto">
            A visual documentation of silhouettes, fabrics, and graphic treatments curated in Jaipur, India.
          </p>
        </div>
      </section>

      {/* Editorial Frames Flow */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-24">
        {lookbookStories.map((story, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={story.frame}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                isEven ? "" : "lg:flex-row-reverse"
              }`}
            >
              {/* Image Frame */}
              <div
                className={`lg:col-span-7 relative ${
                  isEven ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="relative w-full aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] bg-[#151515] border-3 border-[#111111] shadow-[8px_8px_0px_#111111] overflow-hidden group">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-10 bg-[#111111] text-white px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest border border-white/20">
                    FRAME {story.frame}
                  </div>
                  <div className="absolute bottom-4 right-4 z-10 bg-white/95 px-3 py-1 font-mono text-[10px] font-bold text-[#111111] uppercase border border-[#111111]">
                    {story.specs}
                  </div>
                </div>
              </div>

              {/* Story Narrative & Shop Action */}
              <div
                className={`lg:col-span-5 space-y-6 ${
                  isEven ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <span className="font-mono text-xs font-black uppercase tracking-widest text-[#FF3B00] block">
                  LOOKBOOK FRAME {story.frame} / DROP 001
                </span>

                <h2 className="font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-[#111111] leading-[0.95]">
                  {story.title}
                </h2>

                <p className="text-sm sm:text-base font-medium text-[#111111]/80 leading-relaxed">
                  {story.description}
                </p>

                {/* Garment Card Anchor */}
                <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-[9px] uppercase text-[#111111]/50 block">GARMENT SPEC</span>
                    <h3 className="font-black uppercase text-xs sm:text-sm text-[#111111]">{story.productName}</h3>
                    <span className="font-mono font-black text-sm text-[#FF3B00]">{story.price}</span>
                  </div>

                  <Link
                    href={`/product/${story.productSlug}`}
                    className="px-4 py-2.5 font-black uppercase text-xs border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] hover:bg-[#FF3B00] hover:text-white transition-colors shrink-0"
                  >
                    SHOP THIS PIECE →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center pt-12">
        <h2 className="font-black text-3xl md:text-4xl uppercase text-[#111111] mb-4">
          END OF CAMPAIGN 01
        </h2>
        <p className="text-sm font-semibold text-[#111111]/60 mb-6">
          Ready to experience the garments in person? Explore the full catalog now.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[4px_4px_0px_#FF3B00] hover:bg-[#FF3B00] hover:text-white transition-all"
        >
          <span>VIEW ALL GARMENTS</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

    </div>
  );
}
