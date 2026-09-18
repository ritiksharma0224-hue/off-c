"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Layers, Flame } from "lucide-react";

const badges = [
  { text: "220+ GSM Heavy Cotton", icon: Layers, color: "bg-[#111111] text-[#FAF7F2]" },
  { text: "Graphic-Driven DTF Prints", icon: Sparkles, color: "bg-[#FF3B00] text-white" },
  { text: "Drop 001 Release", icon: Flame, color: "bg-white text-[#111111]" },
  { text: "Wear The Culture", icon: ShieldCheck, color: "bg-[#111111] text-[#FAF7F2]" }
];

export default function BrandSnapshot() {
  return (
    <section className="w-full py-6 border-b-2 border-[#111111] bg-white overflow-hidden relative select-none">
      {/* Moving text banner background (Marquee effect) */}
      <div className="flex w-full items-center">
        <div className="marquee-container w-full whitespace-nowrap flex overflow-hidden border-y border-[#111111]/10 py-1">
          <div className="marquee-content flex gap-8 py-2 animate-marquee shrink-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-8 items-center text-xs md:text-sm font-black uppercase tracking-widest text-[#111111]/30 font-mono">
                <span>KAPDOLOGY®</span>
                <span className="text-[#FF3B00]">•</span>
                <span>NOT JUST CLOTHES. IT&apos;S A MOOD.</span>
                <span className="text-[#FF3B00]">•</span>
                <span>WEAR THE CULTURE</span>
                <span className="text-[#FF3B00]">•</span>
                <span>DROP 001</span>
                <span className="text-[#FF3B00]">•</span>
                <span>JAIPUR → INDIA</span>
                <span className="text-[#FF3B00]">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Snapshots Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`flex items-center gap-3 px-4 py-3 border-2 border-[#111111] shadow-[3px_3px_0px_#111111] transition-all duration-200 ${badge.color}`}
              >
                <div className="p-1 bg-[#111111]/10 rounded-sm">
                  <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <span className="font-extrabold uppercase tracking-wide text-xs md:text-sm">
                  {badge.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
