"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { brandData } from "@/data/brand";

export default function BrandStorySection() {
  return (
    <section className="w-full py-20 md:py-28 bg-white border-b-2 border-[#111111] relative select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Story Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] bg-[#151515] border-3 border-[#111111] shadow-[8px_8px_0px_#111111] overflow-hidden">
              <Image
                src="/images/slate-boxy.jpg"
                alt="Kapdology Founders Vision"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />

              <div className="absolute top-4 left-4 z-10 bg-[#111111] text-white px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest border border-white/20">
                THE FOUNDERS MANIFESTO
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10 p-4 bg-[#FAF7F2] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF3B00] font-black block mb-0.5">
                  JAIPUR • 2026
                </span>
                <p className="font-black uppercase text-xs text-[#111111]">
                  Three young engineers. Building something people genuinely love.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Honest, Ambitious Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF3B00]" />
              <span className="font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
                ORIGIN STORY
              </span>
            </div>

            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase leading-[0.95] text-[#111111]">
              WHAT IS KAPDOLOGY?<br />
              <span className="text-[#111111]/40">AND WHY WE STARTED.</span>
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#111111]/80 font-medium leading-relaxed">
              <p>
                We started Kapdology as three young engineers from Jaipur who were tired of seeing the same repetitive, low-effort designs dominating everyday fashion. We didn&apos;t want to enter the market just to sell another printed T-shirt.
              </p>
              <p>
                We wanted to build something we would wear ourselves with genuine pride—garments constructed with heavy drape, architectural box cuts, and raw graphic integrity that refuses to compromise on quality.
              </p>
              <p>
                More than that, we wanted to build something meaningful in our careers: to create a recognized streetwear brand born in Rajasthan that proves young builders can engineer world-class products and inspire others to create, experiment, and push boundaries.
              </p>
            </div>

            {/* Blockquote Tag */}
            <div className="p-5 bg-[#FAF7F2] border-l-4 border-[#FF3B00] border-y border-r border-[#111111]/20 my-4">
              <Quote className="h-5 w-5 text-[#FF3B00] mb-2" />
              <p className="font-black uppercase text-sm sm:text-base tracking-tight text-[#111111]">
                &ldquo;We are not trying to become another clothing brand. We are trying to build something people remember.&rdquo;
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs md:text-sm font-black uppercase tracking-wider border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[3px_3px_0px_#FF3B00] hover:bg-[#FF3B00] hover:text-white transition-all"
              >
                <span>READ THE FULL MANIFESTO</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
