"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroCampaignStack from "./HeroCampaignStack";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[calc(100vh-76px)] flex items-center justify-center py-6 sm:py-8 md:py-10 lg:py-12 overflow-hidden streetwear-grid border-b border-[#111111]/20 bg-[#FAF7F2]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Typographic & Editorial Brand Message */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left py-2 sm:py-3">
          
          {/* Technical Drop Label & Coordinates */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2.5 mb-3 sm:mb-4 select-none"
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest bg-[#111111] text-[#FAF7F2] border-2 border-[#111111] shadow-[2px_2px_0px_#FF3B00]">
              <Sparkles className="h-3 w-3 text-[#FF3B00]" />
              <span>KAPDOLOGY® — DROP 001 / 2026</span>
            </div>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#111111]/70 border border-[#111111]/25 bg-white/60">
              <span>26.9124° N, 75.7873° E</span>
            </div>
          </motion.div>

          {/* Primary High-Impact Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-[74px] xl:text-[84px] tracking-tight uppercase leading-[0.88] text-[#111111] select-none mb-3 sm:mb-5"
          >
            NOT JUST<br />
            CLOTHES.<br />
            <span className="text-[#FF3B00] relative inline-block">
              IT&apos;S A MOOD.
            </span>
          </motion.h1>

          {/* MOBILE ONLY: Campaign Lookbook Visual Anchor (Appears immediately after Headline on Mobile) */}
          <div className="block lg:hidden my-2">
            <HeroCampaignStack isMobile={true} />
          </div>

          {/* Editorial Narrative Supporting Copy (Strictly 2 lines on desktop) */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg font-medium text-[#111111]/80 max-w-xl mb-5 sm:mb-7 leading-relaxed"
          >
            Kapdology is a Jaipur-born Gen-Z streetwear brand built around identity, graphics, attitude and culture.
          </motion.p>

          {/* CTA Group: Dominant Primary + Clean Outline Secondary */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4 mb-5 sm:mb-7"
          >
            <Link
              href="/collections?category=drop-001"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 font-black uppercase tracking-wider text-xs sm:text-sm border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[4px_4px_0px_#FF3B00] hover:shadow-[2px_2px_0px_#FF3B00] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 text-center"
            >
              <span>SHOP DROP 001</span>
              <ArrowRight className="h-4 w-4 text-[#FF3B00] transition-transform duration-150 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/collections"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-black uppercase tracking-wider text-xs sm:text-sm border-2 border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-[#FAF7F2] transition-colors duration-150 text-center"
            >
              <span>EXPLORE LOOKBOOK</span>
            </Link>
          </motion.div>

          {/* Technical Micro-Metadata Specification */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-4 border-t border-[#111111]/15 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#111111]/70"
          >
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B00]"></span>
              <span className="font-bold text-[#111111]">240 GSM HEAVYWEIGHT</span>
            </div>
            <span>•</span>
            <span>100% COMBED COTTON</span>
            <span>•</span>
            <span>SIGNATURE BOX FIT</span>
          </motion.div>
        </div>

        {/* DESKTOP ONLY: Right Column Commanding Editorial Lookbook Card Stack */}
        <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center pt-2 sm:pt-4 lg:pt-0">
          <HeroCampaignStack isMobile={false} />
        </div>

      </div>
    </section>
  );
}
