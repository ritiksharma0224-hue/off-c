"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStorefront } from "@/context/StorefrontContext";

export default function DropIntro() {
  const { products } = useStorefront();
  const dropProducts = (products || []).filter(
    (p) => (p.drop === "DROP 001" || p.collectionId === "drop-001") && p.status === "ACTIVE"
  );
  const totalCount = dropProducts.length;

  return (
    <section className="w-full py-16 md:py-24 bg-white border-b-2 border-[#111111] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Editorial Subheader Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Headline & Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF3B00]" />
              <span className="font-mono text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
                CHAPTER 01 / 2026
              </span>
            </div>

            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.92] text-[#111111]">
              DROP 001<br />
              <span className="text-[#111111]/40">THE FIRST CHAPTER.</span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg font-medium text-[#111111]/75 leading-relaxed max-w-xl">
              The inaugural release of Kapdology. Designed from scratch around heavy 200–240 GSM cotton, structured box drapes, and subculture graphic prints. Every silhouette is cut to stand away from the body with intentional architectural presence.
            </p>

            {/* Technical Specs Pill Bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#FAF7F2] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] text-left">
              <div>
                <span className="block text-[9px] font-mono text-[#111111]/50 uppercase font-black">CURATION</span>
                <span className="font-black text-xs sm:text-sm uppercase text-[#111111]">{totalCount} DESIGNS</span>
              </div>
              <div>
                <span className="block text-[9px] font-mono text-[#111111]/50 uppercase font-black">WEIGHT</span>
                <span className="font-black text-xs sm:text-sm uppercase text-[#111111]">240 GSM HEAVY</span>
              </div>
              <div>
                <span className="block text-[9px] font-mono text-[#111111]/50 uppercase font-black">BATCH</span>
                <span className="font-black text-xs sm:text-sm uppercase text-[#FF3B00]">LIMITED 2026</span>
              </div>
            </div>

            <div>
              <Link
                href="/drop-001"
                className="group inline-flex items-center gap-3 px-8 py-4 text-xs md:text-sm font-black uppercase tracking-wider border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[4px_4px_0px_#FF3B00] hover:shadow-[2px_2px_0px_#FF3B00] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#FF3B00] hover:border-[#FF3B00] hover:text-white transition-all"
              >
                <span>EXPLORE DROP 001</span>
                <ArrowRight className="h-4 w-4 text-[#FF3B00] group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {/* Right: Editorial Campaign Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#151515] border-3 border-[#111111] shadow-[8px_8px_0px_#111111] overflow-hidden group">
              <Image
                src="/images/hero.png"
                alt="Kapdology Drop 001 Campaign Overview"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Monospace Tag */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-[#111111] text-white border border-white/20 font-mono text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="h-3 w-3 text-[#FF3B00]" />
                <span>DROP 001 / CAMPAIGN 01</span>
              </div>

              {/* Bottom Details Watermark */}
              <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm border border-[#111111] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#111111]">
                <span>JAIPUR ORIGIN • 100% COTTON</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
