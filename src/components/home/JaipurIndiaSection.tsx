"use client";

import React from "react";
import { Compass, MapPin, Globe, Sparkles } from "lucide-react";
import { brandData } from "@/data/brand";

export default function JaipurIndiaSection() {
  return (
    <section className="w-full py-20 md:py-28 bg-[#111111] text-[#FAF7F2] border-b-2 border-[#111111] relative overflow-hidden select-none">
      {/* Background Grids */}
      <div className="absolute inset-0 opacity-5 pointer-events-none streetwear-grid-dark" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Origin Statement */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF3B00] animate-pulse" />
              <span className="font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
                ORIGIN & AMBITION
              </span>
            </div>

            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.92] text-white">
              JAIPUR → INDIA
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[#FAF7F2]/80 leading-relaxed font-medium max-w-xl">
              Jaipur has always been synonymous with legendary textile heritage. We are reinterpreting that historic DNA through the rebellious, graphic-driven lens of contemporary Gen-Z streetwear.
            </p>

            <p className="text-xs sm:text-sm text-[#FAF7F2]/60 leading-relaxed max-w-xl">
              Crafted in Rajasthan with premium cottons and high-definition DTF prints, Kapdology ships directly to streetwear communities across Delhi, Mumbai, Bengaluru, and every corner of India.
            </p>
          </div>

          {/* Right: Technical Coordinate & Telemetry Card */}
          <div className="lg:col-span-5">
            <div className="p-6 md:p-8 bg-white/5 border-2 border-white/20 shadow-[6px_6px_0px_#FF3B00] backdrop-blur-sm space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#FF3B00]" />
                  <span className="font-mono text-xs font-bold uppercase text-white">STUDIO TELEMETRY</span>
                </div>
                <span className="font-mono text-[10px] text-[#A3E635] uppercase font-bold">ONLINE DROP</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-[#FAF7F2]/70">
                  <span>BASE ORIGIN:</span>
                  <span className="font-bold text-white uppercase">{brandData.origin.city}, {brandData.origin.state}</span>
                </div>
                <div className="flex justify-between text-[#FAF7F2]/70">
                  <span>GPS COORDINATES:</span>
                  <span className="font-bold text-[#FF3B00]">{brandData.origin.coordinates}</span>
                </div>
                <div className="flex justify-between text-[#FAF7F2]/70">
                  <span>LOGISTICS:</span>
                  <span className="font-bold text-white uppercase">{brandData.shipping.coverage}</span>
                </div>
                <div className="flex justify-between text-[#FAF7F2]/70">
                  <span>TRANSIT WINDOW:</span>
                  <span className="font-bold text-white uppercase">{brandData.shipping.standardTime}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#FAF7F2]/50">
                <span>ESTABLISHED 2026</span>
                <span className="text-[#FF3B00]">KAPDOLOGY® SYSTEM</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
