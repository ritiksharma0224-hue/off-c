"use client";

import Link from "next/link";
import { ArrowUp, Instagram, ArrowUpRight } from "lucide-react";
import { brandData } from "@/data/brand";
import KapdologyLogo from "./KapdologyLogo";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#111111] text-[#FAF7F2] border-t-4 border-[#111111] relative overflow-hidden mt-auto select-none">
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none streetwear-grid-dark" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-16">
          
          {/* LEFT: Brand Identity & Mood */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <Link href="/" className="inline-block select-none py-1">
              <KapdologyLogo variant="max" className="w-52 sm:w-60 md:w-72 h-auto invert brightness-200" />
            </Link>
            
            <div className="space-y-2 text-[#FAF7F2]/75">
              <h4 className="font-black text-base sm:text-lg tracking-tight uppercase text-white">
                NOT JUST CLOTHES. IT&apos;S A MOOD.
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed max-w-sm text-[#FAF7F2]/65">
                {brandData.description}
              </p>
              <div className="inline-flex items-center gap-2 pt-1 font-mono text-[10px] text-[#FF3B00] tracking-widest font-black uppercase">
                <span>{brandData.origin.regionNote}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={brandData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/20 hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors"
                aria-label="Kapdology Instagram"
              >
                <Instagram className="h-3.5 w-3.5" />
                <span>{brandData.instagramHandle}</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* CENTER: Navigation & Discovery */}
          <div className="md:col-span-4 flex flex-col gap-3.5">
            <h3 className="font-mono font-black uppercase tracking-widest text-[11px] text-[#FF3B00]">
              EXPLORE & SHOP
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 font-black uppercase tracking-tight text-xs md:text-sm">
              <li>
                <Link href="/shop" className="hover:text-[#FF3B00] transition-colors">
                  SHOP
                </Link>
              </li>
              <li>
                <Link href="/drop-001" className="hover:text-[#FF3B00] transition-colors">
                  DROP 001
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#FF3B00] transition-colors">
                  COLLECTIONS
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="hover:text-[#FF3B00] transition-colors">
                  LOOKBOOK
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF3B00] transition-colors">
                  ABOUT
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-[#FF3B00] transition-colors">
                  SIZE GUIDE
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#FF3B00] transition-colors">
                  BAG / CART
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-[#FF3B00] transition-colors">
                  CHECKOUT
                </Link>
              </li>
            </ul>
          </div>

          {/* RIGHT: Customer Support & Legal */}
          <div className="md:col-span-3 flex flex-col gap-3.5">
            <h3 className="font-mono font-black uppercase tracking-widest text-[11px] text-[#FF3B00]">
              CONCIERGE & POLICIES
            </h3>
            <ul className="flex flex-col gap-2 font-mono font-bold uppercase tracking-wider text-[11px] text-[#FAF7F2]/70">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  CONTACT CONCIERGE
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  SHIPPING INFORMATION
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  RETURNS & EXCHANGES
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  PRIVACY POLICY
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  TERMS OF SERVICE
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM: Geographic Identity & Copyright */}
        <div className="border-t border-white/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-[#FAF7F2]/50">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B00]" />
            <span>JAIPUR → INDIA</span>
            <span className="text-[#FAF7F2]/20">•</span>
            <span>{brandData.origin.coordinates}</span>
          </div>

          <div>
            <span>© 2026 {brandData.name}. ALL RIGHTS RESERVED.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#FAF7F2]/75 hover:text-[#FF3B00] transition-colors cursor-pointer"
            aria-label="Back to top"
          >
            <span>TOP</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
