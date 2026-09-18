"use client";

import Link from "next/link";
import { brandData } from "@/data/brand";
import { ArrowRight, Instagram, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="w-full py-24 bg-white border-b-2 border-text-black relative overflow-hidden select-none">
      
      {/* Decorative colored blur balls */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-72 h-72 bg-electric-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 bg-hot-pink/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        
        {/* Sparkle Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 text-xs font-black uppercase tracking-widest bg-hot-pink text-white border-2 border-text-black shadow-[2px_2px_0px_#111111]">
          <Sparkles className="h-3.5 w-3.5 fill-white" />
          <span>WEAR THE CULTURE</span>
        </div>

        {/* Headline */}
        <h2 className="font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none text-text-black mb-6">
          NOT JUST CLOTHES. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-hot-pink to-neon-green">
            IT&apos;S A MOOD.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-base md:text-lg font-medium text-text-black/70 max-w-lg mx-auto mb-12">
          {brandData.tagline} — {brandData.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <Link
            href="/collections"
            className="flex items-center gap-2 px-8 py-4 font-black uppercase tracking-wider text-base border-3 border-text-black bg-electric-blue text-white shadow-[4px_4px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
          >
            <span>SHOP DROP 001</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/collections"
            className="flex items-center gap-2 px-6 py-4 font-black uppercase tracking-wider text-sm border-2 border-text-black bg-white text-text-black hover:bg-chrome-silver transition-all duration-200 shadow-[3px_3px_0px_#111111]"
          >
            <span>EXPLORE LOOKBOOK</span>
          </Link>

          <a
            href={brandData.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-4 font-black uppercase tracking-wider text-sm border-2 border-text-black bg-transparent text-text-black hover:bg-hot-pink hover:text-white transition-all duration-200 shadow-[3px_3px_0px_#111111]"
          >
            <Instagram className="h-4.5 w-4.5" />
            <span>INSTAGRAM</span>
          </a>
        </div>

      </div>
    </section>
  );
}

