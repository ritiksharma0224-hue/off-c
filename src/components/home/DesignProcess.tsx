"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "IDEA",
    desc: "Every silhouette starts with a moodboard exploring subcultures, typography tension, and contemporary youth attitude."
  },
  {
    step: "02",
    title: "DESIGN",
    desc: "Digital prototyping of drop-shoulder dimensions, box cut proportions, and high-density artwork placement."
  },
  {
    step: "03",
    title: "SAMPLE",
    desc: "Physical sampling in Jaipur using 100% combed cotton jersey to test collar tension, drape weight, and wash shrinkage."
  },
  {
    step: "04",
    title: "PRINT",
    desc: "Multi-pass direct-to-fabric (DTF) and high-density screen application ensuring crisp resolution and fade resistance."
  },
  {
    step: "05",
    title: "QUALITY CHECK",
    desc: "Individual inspection of seam alignment, neckband elasticity, edge distresses, and fabric consistency."
  },
  {
    step: "06",
    title: "DROP",
    desc: "Numbered, small-batch launch released directly to our community without retail middlemen markups."
  }
];

export default function DesignProcess() {
  return (
    <section className="w-full py-20 md:py-28 bg-[#FAF7F2] border-b-2 border-[#111111] relative select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-[#FF3B00]" />
            <span className="font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
              PRODUCTION RIGOR
            </span>
          </div>

          <h2 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.92] text-[#111111] mb-4">
            FROM IDEA → GARMENT
          </h2>

          <p className="text-sm sm:text-base md:text-lg font-medium text-[#111111]/75 leading-relaxed">
            We don&apos;t drop-ship or re-tag blanks. Each Kapdology garment is engineered through a 6-stage development lifecycle to ensure uncompromising weight, drape, and visual clarity.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-black text-2xl text-[#FF3B00]">
                    {item.step}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#111111]/40">
                    STAGE {item.step}
                  </span>
                </div>

                <h3 className="font-black uppercase text-xl text-[#111111] mb-2 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#111111]/70 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="w-full h-1 bg-[#111111]/10 mt-6 rounded-full overflow-hidden">
                <div className="h-full bg-[#111111]" style={{ width: `${((index + 1) / 6) * 100}%` }} />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
