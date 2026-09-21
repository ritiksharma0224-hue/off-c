"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote, Sparkles, ShieldCheck, Heart, Terminal } from "lucide-react";
import { brandData } from "@/data/brand";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen pb-24 select-none">
      
      {/* Editorial Header */}
      <section className="relative py-20 md:py-28 border-b-2 border-[#111111] bg-white streetwear-grid">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white border-2 border-[#111111] shadow-[2px_2px_0px_#FF3B00] font-mono text-[10px] md:text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles className="h-3 w-3 text-[#FF3B00]" />
            <span>THE FOUNDERS STORY</span>
          </div>

          <h1 className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.88] text-[#111111] mb-6">
            THREE YOUNG ENGINEERS.<br />
            <span className="text-[#FF3B00]">ONE VISION.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-medium text-[#111111]/75 max-w-2xl mx-auto leading-relaxed">
            We didn&apos;t come from a fashion conglomerate or a corporate legacy house. We came from engineering benches in Jaipur with a hunger to build something people genuinely love.
          </p>
        </div>
      </section>

      {/* Narrative Section 1: The Beginning */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 border-b-2 border-[#111111]/15">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] bg-[#151515] border-3 border-[#111111] shadow-[8px_8px_0px_#111111] overflow-hidden">
              <Image
                src="/images/slate-boxy.jpg"
                alt="Kapdology Founders Studio Vision"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4 z-10 bg-[#111111] text-white px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest border border-white/20">
                JAIPUR STUDIO • 2026
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#FF3B00] block">
              THE BEGINNING
            </span>

            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#111111] leading-[0.95]">
              BUILDING SOMETHING REAL.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#111111]/80 font-medium leading-relaxed">
              <p>
                {brandData.foundersNarrative.paragraph1}
              </p>
              <p>
                {brandData.foundersNarrative.paragraph2}
              </p>
              <p>
                {brandData.foundersNarrative.paragraph3}
              </p>
            </div>

            <div className="p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111]">
              <p className="font-black uppercase text-sm sm:text-base text-[#111111]">
                &ldquo;{brandData.foundersNarrative.statement}&rdquo;
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Narrative Section 2: Why Clothing? */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 border-b-2 border-[#111111]/15">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 lg:order-1">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#FF3B00] block">
              WHY CLOTHING?
            </span>

            <h2 className="font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#111111] leading-[0.95]">
              THE CANVAS OF ATTITUDE.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#111111]/80 font-medium leading-relaxed">
              <p>
                As engineers, we look at structures, tolerances, and mechanics. When we turned our attention to streetwear, we realized clothing is the most direct physical interface between a person and the world.
              </p>
              <p>
                It is the first thing people see. It communicates your taste, your subculture, your confidence, and your mood without saying a single word.
              </p>
              <p>
                That is why Kapdology combines <strong>&quot;Kapda&quot;</strong> (fabric) with <strong>&quot;ology&quot;</strong> (the study of). To treat streetwear not as disposable merchandise, but as an engineered canvas of visual identity.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 relative lg:order-2">
            <div className="relative w-full aspect-[4/5] bg-[#151515] border-3 border-[#111111] shadow-[8px_8px_0px_#111111] overflow-hidden">
              <Image
                src="/images/hero.png"
                alt="Kapdology Garment Canvas"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 right-4 z-10 p-3 bg-white/95 border border-[#111111] font-mono text-[10px] uppercase font-bold text-[#111111]">
                ARCHITECTURAL BOX CUT • 240 GSM
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Narrative Section 3: What We Believe */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 border-b-2 border-[#111111]/15">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-mono text-xs font-black uppercase tracking-widest text-[#FF3B00] block mb-2">
            OUR CORE CODE
          </span>
          <h2 className="font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#111111]">
            WHAT WE BELIEVE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brandData.brandMeaning.pillars.map((item, idx) => (
            <div
              key={item.word}
              className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-[#FF3B00] block mb-2">
                  0{idx + 1} //
                </span>
                <h3 className="font-black uppercase text-xl text-[#111111] mb-2 tracking-tight">
                  {item.word}
                </h3>
                <p className="text-xs sm:text-sm text-[#111111]/70 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#111111]/10 font-mono text-[9px] uppercase text-[#111111]/40">
                KAPDOLOGY® CODE
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative Section 4: What Makes Us Different & The Future */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-20">
        <div className="p-8 md:p-12 bg-white border-3 border-[#111111] shadow-[8px_8px_0px_#111111] space-y-6">
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-[#FF3B00]">
            <Terminal className="h-4 w-4" />
            <span>THE ROAD AHEAD</span>
          </div>

          <h2 className="font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#111111] leading-[0.95]">
            BUILT ONE DROP AT A TIME.
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#111111]/80 font-medium leading-relaxed max-w-3xl">
            <p>
              We don&apos;t churn out fast fashion or chase every fleeting algorithm trend. Every single drop we launch is a calculated capsule: sampled rigorously in Jaipur, fit-tested across real body shapes, and produced in small, controlled runs.
            </p>
            <p>
              Our ultimate dream is not just to build a lasting brand, but to inspire other young creators, programmers, designers, and students in India to build things of their own. If three young engineers from Jaipur can create something people genuinely wear and respect nationwide, you can build your vision too.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/drop-001"
              className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[3px_3px_0px_#FF3B00] hover:bg-[#FF3B00] hover:text-white transition-all"
            >
              <span>EXPLORE DROP 001</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-4 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
            >
              <span>VIEW CATALOG</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
