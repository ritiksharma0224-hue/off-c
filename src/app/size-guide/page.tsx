"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Ruler, CheckCircle2, HelpCircle } from "lucide-react";

interface SizeSpec {
  size: string;
  chestInches: string;
  lengthInches: string;
  shoulderInches: string;
  chestCm: string;
  lengthCm: string;
  shoulderCm: string;
  recommendedFit: string;
}

const sizeSpecs: SizeSpec[] = [
  {
    size: "S",
    chestInches: "42",
    lengthInches: "28",
    shoulderInches: "20.5",
    chestCm: "107",
    lengthCm: "71",
    shoulderCm: "52",
    recommendedFit: "Relaxed Boxy (Under 5'7\", 55–65 kg)"
  },
  {
    size: "M",
    chestInches: "44",
    lengthInches: "29",
    shoulderInches: "21.5",
    chestCm: "112",
    lengthCm: "74",
    shoulderCm: "55",
    recommendedFit: "Oversized Fit (5'7\"–5'10\", 65–75 kg)"
  },
  {
    size: "L",
    chestInches: "46",
    lengthInches: "30",
    shoulderInches: "22.5",
    chestCm: "117",
    lengthCm: "76",
    shoulderCm: "57",
    recommendedFit: "Signature Streetwear Box (5'10\"–6'1\", 75–85 kg)"
  },
  {
    size: "XL",
    chestInches: "48",
    lengthInches: "31",
    shoulderInches: "23.5",
    chestCm: "122",
    lengthCm: "79",
    shoulderCm: "60",
    recommendedFit: "Ultra-Relaxed Drape (6'0\"+, 85–95 kg)"
  },
  {
    size: "XXL",
    chestInches: "50",
    lengthInches: "32",
    shoulderInches: "24.5",
    chestCm: "127",
    lengthCm: "81",
    shoulderCm: "62",
    recommendedFit: "Maximum Architectural Silhouette (95+ kg)"
  }
];

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<"inches" | "cm">("inches");

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-12 md:py-20 select-none">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#111111]/70 hover:text-[#FF3B00] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK TO SHOP</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="h-4 w-4 text-[#FF3B00]" />
            <span className="font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
              FIT ENGINEERING & TOLERANCE
            </span>
          </div>
          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.92] text-[#111111]">
            SIZE GUIDE
          </h1>
          <p className="text-sm md:text-base font-medium text-[#111111]/75 mt-2 max-w-xl">
            Our tees are engineered with an intentional drop-shoulder box cut. If you prefer a traditional standard fit, consider sizing one step down.
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#111111]/15">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-[#111111]">
            OVERSIZED T-SHIRT DIMENSIONS (CONFIGURABLE SPEC)
          </span>

          <div className="flex items-center border-2 border-[#111111] bg-white shadow-[2px_2px_0px_#111111]">
            <button
              onClick={() => setUnit("inches")}
              className={`px-3 py-1 font-mono text-xs font-bold uppercase transition-colors cursor-pointer ${
                unit === "inches" ? "bg-[#111111] text-white" : "text-[#111111] hover:bg-gray-100"
              }`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 font-mono text-xs font-bold uppercase transition-colors cursor-pointer ${
                unit === "cm" ? "bg-[#111111] text-white" : "text-[#111111] hover:bg-gray-100"
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#111111] overflow-x-auto mb-12">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#111111] text-white border-b-2 border-[#111111] text-[11px] font-black uppercase tracking-wider">
                <th className="p-3.5 md:p-4">SIZE</th>
                <th className="p-3.5 md:p-4">CHEST ({unit === "inches" ? "IN" : "CM"})</th>
                <th className="p-3.5 md:p-4">LENGTH ({unit === "inches" ? "IN" : "CM"})</th>
                <th className="p-3.5 md:p-4">SHOULDER ({unit === "inches" ? "IN" : "CM"})</th>
                <th className="p-3.5 md:p-4">RECOMMENDED FIT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/15 font-semibold text-[#111111]">
              {sizeSpecs.map((spec) => (
                <tr key={spec.size} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="p-3.5 md:p-4 font-black text-sm bg-gray-50/50">{spec.size}</td>
                  <td className="p-3.5 md:p-4">
                    {unit === "inches" ? spec.chestInches : spec.chestCm}
                  </td>
                  <td className="p-3.5 md:p-4">
                    {unit === "inches" ? spec.lengthInches : spec.lengthCm}
                  </td>
                  <td className="p-3.5 md:p-4">
                    {unit === "inches" ? spec.shoulderInches : spec.shoulderCm}
                  </td>
                  <td className="p-3.5 md:p-4 text-[11px] font-sans font-medium text-[#111111]/80">
                    {spec.recommendedFit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure Guide */}
        <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-6">
          <h2 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
            HOW TO MEASURE YOUR BEST FIT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#111111]/80 leading-relaxed font-medium">
            <div className="p-4 bg-[#FAF7F2] border border-[#111111]/20 space-y-1.5">
              <span className="font-mono font-black text-[#FF3B00] block text-[10px] uppercase">
                01 // CHEST
              </span>
              <h3 className="font-black uppercase text-sm text-[#111111]">CHEST WIDTH</h3>
              <p>
                Measure across the fullest part of your chest, 1 inch below the armpits, with the garment laid flat. Double this measurement for total circumference.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#111111]/20 space-y-1.5">
              <span className="font-mono font-black text-[#FF3B00] block text-[10px] uppercase">
                02 // LENGTH
              </span>
              <h3 className="font-black uppercase text-sm text-[#111111]">GARMENT LENGTH</h3>
              <p>
                Measure from the highest point of the shoulder seam straight down to the bottom hemline of the T-shirt.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#111111]/20 space-y-1.5">
              <span className="font-mono font-black text-[#FF3B00] block text-[10px] uppercase">
                03 // SHOULDER
              </span>
              <h3 className="font-black uppercase text-sm text-[#111111]">SHOULDER DROP</h3>
              <p>
                Measure from one shoulder seam straight across the back to the opposite shoulder seam. Our shoulder drops are cut wide by design.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#111111]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-[#111111]/70 font-semibold">
              <HelpCircle className="h-4 w-4 text-[#FF3B00] shrink-0" />
              <span>Still unsure about your fit? DM @kapdology on Instagram for direct sizing recommendations.</span>
            </div>

            <Link
              href="/shop"
              className="px-6 py-2.5 bg-[#111111] text-white font-black uppercase tracking-wider text-xs border border-[#111111] hover:bg-[#FF3B00] transition-colors shrink-0"
            >
              SHOP THE DROP →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
