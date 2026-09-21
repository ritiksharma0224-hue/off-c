"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { productsData } from "@/data/products";

export default function Drop001Page() {
  const dropProducts = productsData.filter((p) => p.drop === "DROP 001");

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen pb-24 select-none">
      
      {/* Campaign Editorial Header */}
      <section className="relative py-16 md:py-24 border-b-2 border-[#111111] bg-white streetwear-grid">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white border-2 border-[#111111] shadow-[2px_2px_0px_#FF3B00] font-mono text-[10px] md:text-xs font-black uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5 text-[#FF3B00]" />
                <span>INAUGURAL RELEASE / 2026</span>
              </div>

              <h1 className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.88] text-[#111111]">
                DROP 001<br />
                <span className="text-[#FF3B00]">THE FIRST CHAPTER.</span>
              </h1>

              <p className="text-base sm:text-lg font-medium text-[#111111]/80 max-w-xl leading-relaxed">
                The inaugural release from Kapdology. Designed and curated in Jaipur, India around heavyweight 200–240 GSM organic cotton, architectural box cuts, and raw subcultural graphic integrity.
              </p>

              {/* Release Metadata */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-[#FAF7F2] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] font-mono text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#111111]/50 block">RELEASE STATUS</span>
                  <span className="font-black text-[#00875A] uppercase">LIVE DROP</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#111111]/50 block">CURATED PIECES</span>
                  <span className="font-black uppercase text-[#111111]">{dropProducts.length} DESIGNS</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#111111]/50 block">COTTON WEIGHT</span>
                  <span className="font-black uppercase text-[#FF3B00]">200–240 GSM</span>
                </div>
              </div>
            </div>

            {/* Campaign Visual Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-[4/5] bg-[#151515] border-3 border-[#111111] shadow-[8px_8px_0px_#111111] overflow-hidden group">
                <Image
                  src="/images/hero.png"
                  alt="Kapdology Drop 001 Lookbook"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-10 bg-[#111111] text-white px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest border border-white/20">
                  CAMPAIGN 01
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Garments Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex items-center justify-between mb-10 pb-4 border-b-2 border-[#111111]/15">
          <div>
            <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-[#111111]">
              DROP 001 GARMENTS
            </h2>
            <span className="font-mono text-xs text-[#111111]/60 uppercase">
              ALL PIECES CURRENTLY AVAILABLE FOR SECURED ORDER
            </span>
          </div>
          <span className="font-mono font-black text-xs text-[#FF3B00] uppercase">
            {dropProducts.length} DESIGNS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dropProducts.map((product) => (
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
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-[#111111] text-white font-mono text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-white/20 z-10">
                    {product.badge}
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-white/95 text-[#111111] text-[9px] font-mono font-bold uppercase px-2 py-0.5 border border-[#111111]">
                  {product.gsm}
                </div>
              </div>

              <div className="p-4 flex-grow flex flex-col justify-between border-t border-[#111111] bg-white">
                <div>
                  <div className="text-[9px] font-mono uppercase text-[#111111]/50 mb-1">
                    {product.category}
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
      </section>

    </div>
  );
}
