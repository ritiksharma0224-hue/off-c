"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { brandData } from "@/data/brand";
import { Sparkles, MapPin, Instagram, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full bg-base-cream min-h-screen pb-20">
      
      {/* Editorial Header */}
      <section className="relative py-20 border-b-2 border-text-black streetwear-grid">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-electric-blue block mb-3">
            WHO WE ARE
          </span>
          <h1 className="font-black text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-none text-text-black mb-6">
            The Manifesto
          </h1>
          <p className="text-lg md:text-xl font-semibold text-text-black/70 max-w-xl mx-auto">
            Bringing boxy proportions, heavyweight oversized tees, and authentic streetwear style to Mansarovar, Jaipur.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Stack */}
          <div className="lg:col-span-5 relative h-[450px] border-3 border-text-black shadow-[8px_8px_0px_#111111] bg-white overflow-hidden">
            <Image
              src="/images/slate-boxy.jpg"
              alt="Off Culture Clothing Store Vibe"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />
            <div className="absolute top-4 left-4 bg-neon-green text-text-black text-xs font-black uppercase tracking-widest px-3 py-1 shadow-[2px_2px_0px_#111111]">
              MANSAROVAR BASEMENT
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-extrabold text-3xl md:text-4xl uppercase tracking-tight text-text-black mb-6">
              Our Story / No Gatekeeping
            </h2>
            <div className="space-y-6 text-base md:text-lg text-text-black/80 font-medium leading-relaxed">
              <p>
                <strong>Off Culture Jaipur</strong> was born out of frustration. The frustration of seeing basic, generic designs, sub-par thin fabrics, and corporate markups dominating local streetwear options in Jaipur.
              </p>
              <p>
                We wanted fits that look premium. We wanted shirts with a heavy drape that hang perfectly on your frame. We wanted cropped shirts that complement high-waist styling. And we wanted to make them accessible to everyone without paying luxury markups.
              </p>
              <p>
                Located near VT Road Circle, our basement outlet is a direct reflection of this vision. It is not just a place to buy clothing; it is a spot where you can browse custom drops, check out new fits, and vibe with the growing Jaipur fashion subculture.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Brand Values / Pillars */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 border-t-2 border-b-2 border-text-black bg-white my-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="p-6 border-2 border-text-black bg-base-cream shadow-[3px_3px_0px_#111111]">
            <div className="w-10 h-10 bg-electric-blue text-white flex items-center justify-center border border-text-black mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold uppercase text-lg mb-2">Tailored Silhouettes</h3>
            <p className="text-sm font-semibold text-text-black/70 leading-relaxed">
              We focus entirely on custom Gen-Z patterns: drop shoulders, wide boxy body dimensions, tight rib necklines, and clean hem edges.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 border-2 border-text-black bg-base-cream shadow-[3px_3px_0px_#111111]">
            <div className="w-10 h-10 bg-hot-pink text-white flex items-center justify-center border border-text-black mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold uppercase text-lg mb-2">Heavyweight Materials</h3>
            <p className="text-sm font-semibold text-text-black/70 leading-relaxed">
              Standard shirts are thin and lose form. We source durable 220-260 GSM combed cotton fabrics that hold their structure wash after wash.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 border-2 border-text-black bg-base-cream shadow-[3px_3px_0px_#111111]">
            <div className="w-10 h-10 bg-neon-green text-text-black flex items-center justify-center border border-text-black mb-4">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold uppercase text-lg mb-2">Affordable Drops</h3>
            <p className="text-sm font-semibold text-text-black/70 leading-relaxed">
              We produce in controlled drops to keep quality high and waste low, letting us price our graphics and crop lines starting around ₹599.
            </p>
          </div>

        </div>
      </section>

      {/* Call to Actions */}
      <section className="max-w-4xl mx-auto px-4 text-center mt-16">
        <h2 className="font-extrabold text-3xl uppercase tracking-tight text-text-black mb-6">
          VIBE WITH THE CULTURE
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/collections"
            className="px-6 py-3 font-bold uppercase tracking-wider text-xs border-2 border-text-black bg-text-black text-white hover:bg-electric-blue transition-colors duration-200 shadow-[3px_3px_0px_#0052FF]"
          >
            Explore Collections
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 font-bold uppercase tracking-wider text-xs border-2 border-text-black bg-white text-text-black hover:bg-chrome-silver transition-all duration-200"
          >
            Visit Our Store
          </Link>
          <a
            href={brandData.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 font-bold uppercase tracking-wider text-xs border-2 border-text-black bg-transparent text-text-black hover:bg-hot-pink hover:text-white transition-all duration-200"
          >
            Follow on Instagram
          </a>
        </div>
      </section>

    </div>
  );
}
