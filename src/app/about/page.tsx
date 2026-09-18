"use client";

import Link from "next/link";
import Image from "next/image";
import { brandData } from "@/data/brand";
import { Sparkles, ShieldCheck, Heart, Instagram } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full bg-base-cream min-h-screen pb-20">
      
      {/* Editorial Header */}
      <section className="relative py-20 border-b-2 border-text-black streetwear-grid">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-electric-blue block mb-3">
            WHAT IS KAPDOLOGY?
          </span>
          <h1 className="font-black text-5xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-none text-text-black mb-6">
            NOT JUST CLOTHES.<br />IT&apos;S A MOOD.
          </h1>
          <p className="text-lg md:text-xl font-semibold text-text-black/70 max-w-2xl mx-auto">
            Kapdology combines &quot;Kapda&quot; and &quot;ology&quot; — the culture and study of clothing.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Card */}
          <div className="lg:col-span-5 relative h-[450px] border-3 border-text-black shadow-[8px_8px_0px_#111111] bg-white overflow-hidden">
            <Image
              src="/images/hero.png"
              alt="KAPDOLOGY Drop 001 oversized tee campaign"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />
            <div className="absolute top-4 left-4 bg-hot-pink text-white text-xs font-black uppercase tracking-widest px-3 py-1 shadow-[2px_2px_0px_#111111]">
              DROP 001 / 2026
            </div>
          </div>

          {/* Right Column: Brand Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-text-black mb-6">
              WHAT IS KAPDOLOGY?
            </h2>
            <div className="space-y-6 text-base md:text-lg text-text-black/80 font-medium leading-relaxed">
              <p>
                <strong>Kapdology</strong> combines <strong>&quot;Kapda&quot;</strong> and <strong>&quot;ology&quot;</strong> — the culture and study of clothing.
              </p>
              <p>
                We don&apos;t see clothing as just fabric.
              </p>
              <div className="p-6 bg-white border-2 border-text-black shadow-[4px_4px_0px_#111111] space-y-2">
                <p className="font-black text-xl uppercase tracking-wider text-electric-blue">• IT&apos;S IDENTITY.</p>
                <p className="font-black text-xl uppercase tracking-wider text-hot-pink">• IT&apos;S ATTITUDE.</p>
                <p className="font-black text-xl uppercase tracking-wider text-neon-green text-shadow-sm">• IT&apos;S CULTURE.</p>
                <p className="font-black text-xl uppercase tracking-wider text-text-black">• IT&apos;S SELF-EXPRESSION.</p>
              </div>
              <p>
                Kapdology exists to turn those things into something you can wear.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Brand Values / Quality Specs */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 border-t-2 border-b-2 border-text-black bg-white my-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Quality 1 */}
          <div className="p-6 border-2 border-text-black bg-base-cream shadow-[3px_3px_0px_#111111]">
            <div className="w-10 h-10 bg-electric-blue text-white flex items-center justify-center border border-text-black mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold uppercase text-lg mb-2">200–220 GSM Cotton</h3>
            <p className="text-sm font-semibold text-text-black/70 leading-relaxed">
              Crafted with 100% premium cotton delivering a heavy, structured drape that maintains shape wash after wash.
            </p>
          </div>

          {/* Quality 2 */}
          <div className="p-6 border-2 border-text-black bg-base-cream shadow-[3px_3px_0px_#111111]">
            <div className="w-10 h-10 bg-hot-pink text-white flex items-center justify-center border border-text-black mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold uppercase text-lg mb-2">Structured Fits</h3>
            <p className="text-sm font-semibold text-text-black/70 leading-relaxed">
              Designed around heavy oversized silhouettes with reinforced collar construction and precision stitching.
            </p>
          </div>

          {/* Quality 3 */}
          <div className="p-6 border-2 border-text-black bg-base-cream shadow-[3px_3px_0px_#111111]">
            <div className="w-10 h-10 bg-neon-green text-text-black flex items-center justify-center border border-text-black mb-4">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold uppercase text-lg mb-2">Graphic DTF Production</h3>
            <p className="text-sm font-semibold text-text-black/70 leading-relaxed">
              High-definition graphic-driven DTF printing for crisp details, high color depth, and lasting wear.
            </p>
          </div>

        </div>
      </section>

      {/* Call to Actions */}
      <section className="max-w-4xl mx-auto px-4 text-center mt-16">
        <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight text-text-black mb-6">
          WEAR THE CULTURE.
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/collections"
            className="px-8 py-4 font-black uppercase tracking-wider text-sm border-2 border-text-black bg-electric-blue text-white hover:bg-text-black transition-colors duration-200 shadow-[3px_3px_0px_#111111]"
          >
            SHOP DROP 001
          </Link>
          <Link
            href="/collections"
            className="px-8 py-4 font-black uppercase tracking-wider text-sm border-2 border-text-black bg-white text-text-black hover:bg-chrome-silver transition-all duration-200 shadow-[3px_3px_0px_#111111]"
          >
            EXPLORE LOOKBOOK
          </Link>
          <a
            href={brandData.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 font-black uppercase tracking-wider text-sm border-2 border-text-black bg-transparent text-text-black hover:bg-hot-pink hover:text-white transition-all duration-200 shadow-[3px_3px_0px_#111111] flex items-center gap-2"
          >
            <Instagram className="h-4.5 w-4.5" />
            <span>INSTAGRAM</span>
          </a>
        </div>
      </section>

    </div>
  );
}
