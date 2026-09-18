"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import KapdologyLogo from "./KapdologyLogo";

interface LookbookCardProps {
  isMobile?: boolean;
}

function LookbookCard({ isMobile = false }: LookbookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      className={`relative ${
        isMobile
          ? "w-[290px] sm:w-[340px] h-[390px] sm:h-[450px] mx-auto my-5"
          : "w-[300px] sm:w-[350px] md:w-[380px] lg:w-[410px] xl:w-[440px] h-[430px] sm:h-[480px] md:h-[520px] lg:h-[560px] xl:h-[590px]"
      } flex items-center justify-center select-none`}
    >
      {/* Layer 1: Back Underlay Card (KAPDOLOGY Orange-Red Accent Panel) */}
      <div className="absolute inset-0 bg-[#FF3B00] border-3 border-[#111111] rotate-[-4deg] translate-x-[-8px] sm:translate-x-[-10px] translate-y-[6px] sm:translate-y-[8px] shadow-[4px_4px_0px_#111111]" />

      {/* Layer 2: Mid Underlay Card (Crisp White / Technical Offset) */}
      <div className="absolute inset-0 bg-white border-3 border-[#111111] rotate-[2.5deg] translate-x-[6px] sm:translate-x-[8px] translate-y-[-3px] sm:translate-y-[-4px] shadow-[4px_4px_0px_#111111]" />

      {/* Layer 3: Foreground Main Editorial Card */}
      <motion.div
        whileHover={{ scale: 1.015, rotate: -0.5 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-white border-3 border-[#111111] overflow-hidden flex flex-col shadow-[8px_8px_0px_#111111] z-10"
      >
        {/* Image Container with Real Kapdology Campaign Lookbook */}
        <div className="relative w-full flex-grow bg-[#151515] overflow-hidden">
          <Image
            src="/images/hero.png"
            alt="KAPDOLOGY Streetwear Campaign Lookbook - Signature Oversized Tee"
            fill
            priority
            sizes="(max-width: 768px) 340px, 450px"
            className="object-cover object-center transition-transform duration-500 hover:scale-105"
          />

          {/* Top Badge: Campaign & Drop Identifier */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#111111] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border border-white/20">
            <span className="text-[#FF3B00]">●</span>
            <span>CAMPAIGN 01</span>
            <span className="opacity-40">/</span>
            <span>DROP 001</span>
          </div>

          {/* Subtle Kapdology Stencil Watermark Tag */}
          <div className="absolute bottom-3 right-3 z-10 bg-[#111111]/85 backdrop-blur-sm px-2.5 py-1 border border-white/20">
            <KapdologyLogo variant="minimal" className="w-14 sm:w-18 h-auto invert brightness-200" />
          </div>
        </div>

        {/* Editorial Product Footer Bar */}
        <div className="p-3 sm:p-3.5 border-t-3 border-[#111111] flex justify-between items-center bg-white z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#FF3B00]">DROP 001</span>
              <span className="text-[#111111]/30">•</span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#111111]/60">240 GSM</span>
            </div>
            <h3 className="font-black uppercase text-xs sm:text-sm tracking-wide text-[#111111] mt-0.5">
              Signature Oversized Tee
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-black text-base sm:text-lg text-[#FF3B00] tracking-tight">
              ₹599
            </span>
            <Link
              href="/collections?category=drop-001"
              className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#111111] hover:text-[#FF3B00] transition-colors group"
            >
              <span>SHOP</span>
              <ArrowRight className="h-3 w-3 text-[#FF3B00] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Floating Graphic Element 1: Angled Streetwear Spec Sticker */}
      <div className="absolute -top-3 -right-2 sm:-top-3.5 sm:-right-3.5 z-20 bg-white text-[#111111] border-2 border-[#111111] px-2.5 sm:px-3 py-0.5 sm:py-1 font-black text-[9px] sm:text-[10px] tracking-widest uppercase rotate-[6deg] shadow-[2px_2px_0px_#111111]">
        OVERSIZED BOX CUT
      </div>

      {/* Floating Graphic Element 2: Round Accent Seal Badge */}
      <div className={`${isMobile ? 'hidden sm:flex' : 'flex'} absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 z-20 w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#111111] text-[#FAF7F2] border-2 sm:border-3 border-[#111111] shadow-[3px_3px_0px_#FF3B00] flex-col items-center justify-center p-2 text-center rotate-[-10deg]`}>
        <span className="text-[7px] sm:text-[8px] font-mono tracking-widest text-[#FF3B00] font-black uppercase">DROP 001</span>
        <span className="text-xs sm:text-sm font-black leading-none text-white my-0.5">₹599</span>
        <span className="text-[6px] sm:text-[7px] font-extrabold uppercase tracking-tight text-white/75">KAPDOLOGY®</span>
      </div>
    </motion.div>
  );
}

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
            <LookbookCard isMobile={true} />
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
          <LookbookCard isMobile={false} />
        </div>

      </div>
    </section>
  );
}
