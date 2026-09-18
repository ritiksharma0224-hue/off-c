"use client";

import { motion } from "framer-motion";
import { Sparkles, Flame, ShieldCheck } from "lucide-react";
import KapdologyLogo from "./KapdologyLogo";

export default function WhyKapdology() {
  return (
    <section className="w-full py-20 md:py-24 bg-base-cream border-b-2 border-[#111111] relative overflow-hidden streetwear-grid select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Brand Story */}
          <div className="lg:col-span-7">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF3B00] block mb-3 animate-pulse">
              BRAND STORY
            </span>
            <h2 className="font-black text-4xl md:text-6xl uppercase tracking-tighter leading-tight mb-8 text-[#111111]">
              WHAT IS <br />
              <span className="text-[#FF3B00]">KAPDOLOGY?</span>
            </h2>
            <div className="space-y-5 text-base md:text-lg text-[#111111]/85 font-medium leading-relaxed max-w-2xl">
              <p className="text-lg md:text-xl font-bold text-[#111111]">
                Kapdology combines <span className="underline decoration-[#FF3B00] decoration-2">&quot;Kapda&quot;</span> and <span className="underline decoration-[#FF3B00] decoration-2">&quot;ology&quot;</span> — the culture and study of clothing.
              </p>
              <p>
                We don&apos;t see clothing as just fabric.
              </p>
              <ul className="space-y-2 font-black uppercase text-sm md:text-base tracking-wider text-[#111111] border-l-4 border-[#FF3B00] pl-4 py-1">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B00]" />
                  <span>IT&apos;S IDENTITY.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B00]" />
                  <span>IT&apos;S ATTITUDE.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B00]" />
                  <span>IT&apos;S CULTURE.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B00]" />
                  <span>IT&apos;S SELF-EXPRESSION.</span>
                </li>
              </ul>
              <p className="font-black text-xl md:text-2xl text-[#111111] uppercase tracking-tight pt-2">
                NOT JUST CLOTHES. <span className="text-[#FF3B00]">IT&apos;S A MOOD.</span>
              </p>
            </div>
          </div>

          {/* Right Column: Creative Sticker Layout / Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[350px]">
            {/* Sticker 1 */}
            <motion.div
              initial={{ rotate: -5, scale: 0.95 }}
              whileInView={{ rotate: -6, scale: 1 }}
              whileHover={{ rotate: -10, scale: 1.05 }}
              viewport={{ once: true }}
              className="absolute w-[240px] bg-white border-3 border-[#111111] p-5 shadow-[4px_4px_0px_#111111] z-30"
            >
              <div className="flex items-center gap-2 mb-2 text-[#FF3B00]">
                <Flame className="h-5 w-5 fill-[#FF3B00]" />
                <span className="font-black text-xs uppercase tracking-widest">DROP 001</span>
              </div>
              <p className="text-xs font-extrabold uppercase text-[#111111]">
                Heavyweight organic cotton cut for structured oversized drapes.
              </p>
            </motion.div>

            {/* Sticker 2 */}
            <motion.div
              initial={{ rotate: 8, scale: 0.95 }}
              whileInView={{ rotate: 6, scale: 1 }}
              whileHover={{ rotate: 10, scale: 1.05 }}
              viewport={{ once: true }}
              className="absolute w-[220px] bg-[#111111] text-[#FAF7F2] border-3 border-[#111111] p-5 shadow-[4px_4px_0px_#FF3B00] translate-x-20 translate-y-16 z-20"
            >
              <div className="flex items-center gap-2 mb-2 text-[#FF3B00]">
                <Sparkles className="h-5 w-5" />
                <span className="font-black text-xs uppercase tracking-widest text-[#FF3B00]">WEAR CULTURE</span>
              </div>
              <p className="text-xs font-extrabold uppercase text-[#FAF7F2]">
                Subculture graphic prints built around identity and attitude.
              </p>
            </motion.div>

            {/* Sticker 3 */}
            <motion.div
              initial={{ rotate: -12, scale: 0.95 }}
              whileInView={{ rotate: -14, scale: 1 }}
              whileHover={{ rotate: -18, scale: 1.05 }}
              viewport={{ once: true }}
              className="absolute w-[200px] bg-[#FF3B00] text-white border-3 border-[#111111] p-5 shadow-[4px_4px_0px_#111111] translate-x-[-110px] translate-y-16 z-10"
            >
              <div className="flex items-center gap-2 mb-2 text-white">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-black text-xs uppercase tracking-widest">KAPDOLOGY®</span>
              </div>
              <KapdologyLogo variant="minimal" className="w-28 h-auto invert brightness-200" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
