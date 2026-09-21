"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { garmentCategories } from "@/data/categories";

export default function CategorySection() {
  return (
    <section className="w-full py-20 md:py-28 bg-[#FAF7F2] border-b-2 border-[#111111] relative select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#FF3B00]" />
              <span className="font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
                GARMENT ARCHITECTURE
              </span>
            </div>
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.92] text-[#111111]">
              SHOP BY CATEGORY
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm border-b-2 border-[#111111] pb-1 hover:text-[#FF3B00] hover:border-[#FF3B00] transition-colors self-start"
          >
            <span>VIEW ALL DESIGNS</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 5-6 Garment Categories Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {garmentCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative flex flex-col bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#111111] hover:shadow-[10px_10px_0px_#111111] hover:translate-x-[-3px] hover:translate-y-[-3px] transition-all duration-300 overflow-hidden"
            >
              {/* Category Number Badge */}
              <div className="absolute top-4 left-4 z-20 bg-[#111111] text-white font-mono text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border border-white/20">
                {category.displayNumber}
              </div>

              {/* Item Count Sticker */}
              <div className="absolute top-4 right-4 z-20 bg-white text-[#111111] font-mono text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border border-[#111111] shadow-[2px_2px_0px_#111111]">
                {category.itemCount} {category.itemCount === 1 ? "DESIGN" : "DESIGNS"}
              </div>

              {/* Editorial Visual Image Cover */}
              <div className="relative w-full h-[300px] sm:h-[320px] bg-[#151515] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#111111]/15 group-hover:opacity-0 transition-opacity duration-300" />
              </div>

              {/* Category Info Body */}
              <div className="p-6 flex-grow flex flex-col justify-between border-t-2 border-[#111111] bg-white">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF3B00] mb-1">
                    {category.fitNote}
                  </div>
                  <h3 className="font-black uppercase text-xl md:text-2xl tracking-tight text-[#111111] group-hover:text-[#FF3B00] transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#111111]/75 font-medium leading-relaxed mb-6">
                    {category.shortDescription}
                  </p>
                </div>

                {/* Direct Action Link */}
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="mt-auto inline-flex items-center justify-between w-full py-3 px-4 font-black uppercase tracking-wider text-xs border-2 border-[#111111] bg-[#FAF7F2] group-hover:bg-[#111111] group-hover:text-white transition-all duration-200"
                >
                  <span>SHOP CATEGORY</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
