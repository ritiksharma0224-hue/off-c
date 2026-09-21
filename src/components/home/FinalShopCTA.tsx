"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalShopCTA() {
  return (
    <section className="w-full py-24 md:py-32 bg-white relative overflow-hidden select-none">
      
      {/* Decorative Blur Circles */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#FF3B00]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#111111]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10 space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white border-2 border-[#111111] shadow-[2px_2px_0px_#FF3B00] font-mono text-[10px] md:text-xs font-black uppercase tracking-widest">
          <Sparkles className="h-3 w-3 text-[#FF3B00]" />
          <span>DROP 001 IS LIVE</span>
        </div>

        <h2 className="font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-[0.9] text-[#111111]">
          WEAR THE CULTURE.<br />
          <span className="text-[#FF3B00]">SECURE YOUR DROP.</span>
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-[#111111]/70 font-medium max-w-lg mx-auto leading-relaxed">
          Limited small-batch production. Heavy 200–240 GSM organic cotton, architectural box drapes, and high-definition subculture graphics.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/drop-001"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[4px_4px_0px_#FF3B00] hover:shadow-[2px_2px_0px_#FF3B00] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#FF3B00] hover:border-[#FF3B00] hover:text-white transition-all text-center"
          >
            <span>SHOP DROP 001</span>
            <ArrowRight className="h-4 w-4 text-[#FF3B00] group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-white transition-colors text-center shadow-[3px_3px_0px_#111111]"
          >
            <span>EXPLORE ALL CATEGORIES</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
