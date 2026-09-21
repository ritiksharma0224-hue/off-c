"use client";

import React from "react";
import Image from "next/image";
import { Instagram, ArrowUpRight } from "lucide-react";
import { brandData } from "@/data/brand";

const communityTiles = [
  { id: "ugc-1", image: "/images/hero.png", tag: "#KAPDOLOGY" },
  { id: "ugc-2", image: "/images/cyber-tee.jpg", tag: "DROP 001" },
  { id: "ugc-3", image: "/images/vintage-wash.jpg", tag: "STREET DRAPE" },
  { id: "ugc-4", image: "/images/slate-boxy.jpg", tag: "BOXY CUT" }
];

export default function CommunitySection() {
  return (
    <section className="w-full py-20 md:py-28 bg-[#FAF7F2] border-b-2 border-[#111111] relative select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Instagram className="h-4 w-4 text-[#FF3B00]" />
              <span className="font-mono text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#FF3B00]">
                COMMUNITY ARCHIVE
              </span>
            </div>
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.92] text-[#111111]">
              WEAR THE CULTURE
            </h2>
          </div>

          <a
            href={brandData.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-white hover:bg-[#FF3B00] hover:text-white transition-all shadow-[3px_3px_0px_#111111] self-start"
          >
            <span>FOLLOW {brandData.instagramHandle}</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* 4 Community Visual Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {communityTiles.map((tile) => (
            <a
              key={tile.id}
              href={brandData.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[4/5] bg-[#151515] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:shadow-[7px_7px_0px_#111111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden block"
            >
              <Image
                src={tile.image}
                alt={`Kapdology Community ${tile.tag}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Minimal Tag Overlay */}
              <div className="absolute bottom-3 left-3 z-10 bg-[#111111]/85 backdrop-blur-sm text-white px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-wider border border-white/20">
                {tile.tag}
              </div>

              {/* Hover Tint */}
              <div className="absolute inset-0 bg-[#FF3B00]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center border border-white/30">
                  <Instagram className="h-5 w-5" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Caption */}
        <div className="mt-8 text-center">
          <p className="text-xs font-mono text-[#111111]/60 uppercase tracking-widest">
            TAG @KAPDOLOGY ON INSTAGRAM TO BE FEATURED IN OUR DROP 001 ARCHIVE.
          </p>
        </div>

      </div>
    </section>
  );
}
