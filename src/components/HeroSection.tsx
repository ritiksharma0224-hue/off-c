"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, Instagram } from "lucide-react";
import { brandData } from "@/data/brand";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  // Parallax scroll effect for hero background assets
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const imageY = useTransform(scrollY, [0, 500], [0, -40]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden streetwear-grid border-b-2 border-text-black"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Columns - Text content */}
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col justify-center text-left"
        >
          {/* Tag badge */}
          <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 mb-6 text-xs font-black uppercase tracking-widest bg-neon-green border-2 border-text-black shadow-[2px_2px_0px_#111111] animate-bounce">
            <Sparkles className="h-3.5 w-3.5" />
            <span>CLOTHING FOR THE UNAPOLOGETIC</span>
          </div>

          {/* Main Huge Typography Headline */}
          <h1 className="font-black text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.9] mb-6 text-text-black select-none">
            Streetwear <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-hot-pink">
              Made For
            </span>{" "}
            <br />
            Jaipur.
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg lg:text-xl font-medium text-text-black/80 max-w-xl mb-10 leading-relaxed">
            {brandData.description} Fits that speak before you do. Not basic. Not overpriced.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/collections"
              className="flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-wider text-base border-3 border-text-black bg-electric-blue text-white shadow-[4px_4px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
            >
              <span>Explore Collection</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-2 px-6 py-4 font-bold uppercase tracking-wider text-sm border-2 border-text-black bg-white text-text-black hover:bg-chrome-silver transition-all duration-200"
            >
              <MapPin className="h-4.5 w-4.5" />
              <span>Visit Store</span>
            </Link>

            <a
              href={brandData.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 font-bold uppercase tracking-wider text-sm border-2 border-text-black bg-transparent text-text-black hover:bg-hot-pink hover:text-white transition-all duration-200"
            >
              <Instagram className="h-4.5 w-4.5" />
              <span>DM on Instagram</span>
            </a>
          </div>
        </motion.div>

        {/* Right Columns - Animated Lookbook Stack with 3D feel */}
        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 relative w-full h-[450px] md:h-[550px] flex items-center justify-center mt-8 lg:mt-0"
        >
          {/* Decorative sticker background element */}
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-hot-pink/15 rounded-full blur-2xl pointer-events-none" />

          {/* Underlay Card (Pink tilt back) */}
          <div className="absolute w-[290px] h-[380px] md:w-[340px] md:h-[450px] bg-hot-pink border-3 border-text-black rotate-[-6deg] translate-x-[-12px] translate-y-[6px]" />

          {/* Mid Card (Blue tilt back) */}
          <div className="absolute w-[290px] h-[380px] md:w-[340px] md:h-[450px] bg-[#FFFFFF] border-3 border-text-black rotate-[4deg] translate-x-[8px] translate-y-[-4px] flex items-end p-4 shadow-[4px_4px_0px_#111111]" />

          {/* Foreground Card Stack (Main Model Campaign) */}
          <motion.div
            whileHover={{ scale: 1.03, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute w-[290px] h-[380px] md:w-[340px] md:h-[450px] bg-white border-3 border-text-black overflow-hidden flex flex-col shadow-[8px_8px_0px_#111111]"
          >
            {/* Model Image */}
            <div className="relative w-full flex-grow bg-chrome-silver">
              <Image
                src="/images/hero.png"
                alt="Off Culture Jaipur Campaign Lookbook"
                fill
                priority
                sizes="(max-width: 768px) 290px, 340px"
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-text-black text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                CAMPAIGN 01
              </div>
            </div>
            
            {/* Card info footer */}
            <div className="p-4 border-t-2 border-text-black flex justify-between items-center bg-white">
              <div>
                <h3 className="font-extrabold uppercase text-sm tracking-wide">Signature Oversized</h3>
                <p className="text-xs text-text-black/60 font-bold uppercase">Mansarovar, JP</p>
              </div>
              <span className="font-black text-lg text-electric-blue">₹599</span>
            </div>
          </motion.div>

          {/* Rotating Price Badge Sticker */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-8 right-0 md:right-4 w-28 h-28 cursor-pointer select-none z-20"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Sticker base */}
              <div className="absolute inset-0 bg-neon-green rounded-full border-2 border-text-black flex items-center justify-center shadow-[4px_4px_0px_#111111] hover:scale-105 transition-transform" />
              
              {/* Text around sticker */}
              <div className="absolute text-[8px] font-black uppercase tracking-wider text-text-black flex flex-col items-center">
                <span>NEW ARRIVALS</span>
                <span className="text-sm font-black tracking-normal">₹599</span>
                <span>OFF CULTURE</span>
              </div>
            </div>
          </motion.div>

          {/* Decorative Sticker badge */}
          <div className="absolute top-0 right-4 bg-white border-2 border-text-black py-1 px-3 text-xs font-black uppercase tracking-widest rotate-12 shadow-[2px_2px_0px_#111111]">
            OVERSIZED WIDE
          </div>
        </motion.div>
      </div>
    </section>
  );
}
