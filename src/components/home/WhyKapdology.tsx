"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Flame, Sparkles, Layers } from "lucide-react";
import { brandData } from "@/data/brand";

const pillars = [
  {
    icon: Flame,
    title: "IDENTITY",
    desc: "Clothing that speaks before you do. We build silhouettes that represent an aesthetic, not just a label.",
    badge: "PILLAR 01"
  },
  {
    icon: Sparkles,
    title: "ATTITUDE",
    desc: "Unapologetic confidence in proportions. Wide drop shoulders and clean box drapes that demand attention.",
    badge: "PILLAR 02"
  },
  {
    icon: Layers,
    title: "CULTURE",
    desc: "Rooted in contemporary Indian youth culture and subcultural graphics, straight out of Jaipur.",
    badge: "PILLAR 03"
  },
  {
    icon: ShieldCheck,
    title: "CONSTRUCTION",
    desc: "200–240 GSM heavyweight combed cotton. Thick collars and reinforced hems that hold form wash after wash.",
    badge: "PILLAR 04"
  }
];

export default function WhyKapdology() {
  return (
    <section className="w-full py-20 md:py-28 bg-[#FAF7F2] border-b-2 border-[#111111] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-[#FF3B00]" />
            <span className="font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
              CORE PHILOSOPHY
            </span>
          </div>

          <h2 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.92] text-[#111111] mb-5">
            WE ARE NOT BUILT FOR <br />
            <span className="text-[#111111]/40">THE ORDINARY.</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg font-medium text-[#111111]/75 leading-relaxed">
            Off-the-rack fashion has made clothing disposable, thin, and devoid of personality. Kapdology was created to reject basic compromises. We design heavy, structured streetwear for those who wear their point of view.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#FF3B00] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center border border-[#111111]">
                      <Icon className="h-5 w-5 text-[#FF3B00]" />
                    </div>
                    <span className="font-mono text-[9px] font-bold uppercase text-[#111111]/50">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-black uppercase text-xl text-[#111111] mb-2 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#111111]/70 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[#111111]/10 font-mono text-[9px] font-bold uppercase tracking-widest text-[#FF3B00]">
                  KAPDOLOGY® STANDARD
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
