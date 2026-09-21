"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ArrowUpRight } from "lucide-react";
import { useStorefront } from "@/context/StorefrontContext";

export default function LookbookSection() {
  const { getProductBySlug } = useStorefront();

  const look1 = getProductBySlug("signature-oversized-box-tee");
  const look2 = getProductBySlug("vintage-distressed-acid-wash-tee");
  const look3 = getProductBySlug("cyber-culture-oversized-graphic-tee");

  return (
    <section className="w-full py-20 md:py-28 bg-white border-b-2 border-[#111111] relative select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#FF3B00]" />
              <span className="font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
                VISUAL EDITORIAL
              </span>
            </div>
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.92] text-[#111111]">
              CAMPAIGN 01 / LOOKBOOK
            </h2>
          </div>

          <Link
            href="/lookbook"
            className="inline-flex items-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm border-b-2 border-[#111111] pb-1 hover:text-[#FF3B00] hover:border-[#FF3B00] transition-colors self-start"
          >
            <span>FULL CAMPAIGN LOOKBOOK</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Asymmetric High-Fashion Editorial Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Hero Shot */}
          <div className="lg:col-span-7 relative h-[420px] sm:h-[500px] lg:h-[580px] bg-[#151515] border-3 border-[#111111] shadow-[6px_6px_0px_#111111] overflow-hidden group">
            <Image
              src={look1?.image || "/images/hero.png"}
              alt="Kapdology Campaign 01 Hero Look"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            
            <div className="absolute top-4 left-4 z-10 bg-[#111111] text-white px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest border border-white/20">
              FRAME 01 — SIGNATURE DRAPE
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-10 p-4 bg-[#111111]/85 backdrop-blur-md border border-white/20 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-[9px] text-[#FF3B00] font-black uppercase tracking-widest block">LOOK 01</span>
                <h3 className="font-black uppercase text-sm sm:text-base">{look1?.name || "Signature Oversized Box Cut"}</h3>
                <span className="font-mono text-[10px] text-white/60">
                  {look1?.gsm || "240 GSM"} Cotton • ₹{look1?.price ?? 599}
                </span>
              </div>
              <Link
                href={`/product/${look1?.slug || "signature-oversized-box-tee"}`}
                className="px-4 py-2 bg-white text-[#111111] font-black text-xs uppercase tracking-wider hover:bg-[#FF3B00] hover:text-white transition-colors shrink-0 text-center"
              >
                VIEW PIECE →
              </Link>
            </div>
          </div>

          {/* Side Editorial Duo */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {/* Top Side Shot: Acid Wash */}
            <div className="relative h-[280px] bg-[#151515] border-3 border-[#111111] shadow-[4px_4px_0px_#111111] overflow-hidden group">
              <Image
                src={look2?.image || "/images/vintage-wash.jpg"}
                alt="Vintage Acid Wash Look"
                fill
                sizes="(max-width: 1024px) 50vw, 40vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 z-10 bg-[#111111] text-white px-2.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest border border-white/20">
                FRAME 02 — DISTRESSED TEXTURE
              </div>
              <div className="absolute bottom-3 left-3 right-3 z-10 p-3 bg-white/95 border border-[#111111] flex items-center justify-between">
                <div>
                  <h4 className="font-black uppercase text-xs text-[#111111]">{look2?.name || "Acid Distressed Wash"}</h4>
                  <span className="font-mono text-[10px] text-[#FF3B00] font-bold">₹{look2?.price ?? 799} • CHAOS FAMILY</span>
                </div>
                <Link
                  href={`/product/${look2?.slug || "vintage-distressed-acid-wash-tee"}`}
                  className="text-xs font-black uppercase text-[#111111] hover:text-[#FF3B00] transition-colors"
                >
                  SHOP →
                </Link>
              </div>
            </div>

            {/* Bottom Side Shot: Cyber Graphic */}
            <div className="relative h-[280px] bg-[#151515] border-3 border-[#111111] shadow-[4px_4px_0px_#111111] overflow-hidden group">
              <Image
                src={look3?.image || "/images/cyber-tee.jpg"}
                alt="Cyber Culture Graphic Look"
                fill
                sizes="(max-width: 1024px) 50vw, 40vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 z-10 bg-[#111111] text-white px-2.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest border border-white/20">
                FRAME 03 — DTF ARTWORK
              </div>
              <div className="absolute bottom-3 left-3 right-3 z-10 p-3 bg-white/95 border border-[#111111] flex items-center justify-between">
                <div>
                  <h4 className="font-black uppercase text-xs text-[#111111]">{look3?.name || "Cyber Culture Graphic"}</h4>
                  <span className="font-mono text-[10px] text-[#FF3B00] font-bold">₹{look3?.price ?? 649} • IDENTITY FAMILY</span>
                </div>
                <Link
                  href={`/product/${look3?.slug || "cyber-culture-oversized-graphic-tee"}`}
                  className="text-xs font-black uppercase text-[#111111] hover:text-[#FF3B00] transition-colors"
                >
                  SHOP →
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
