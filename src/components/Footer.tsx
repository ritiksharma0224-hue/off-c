"use client";

import Link from "next/link";
import { ArrowUp, Instagram } from "lucide-react";
import { brandData } from "@/data/brand";
import KapdologyLogo from "./KapdologyLogo";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-text-black text-base-cream border-t-4 border-text-black relative overflow-hidden mt-auto">
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none streetwear-grid-dark" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Logo and Brand Statement */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link href="/" className="inline-block select-none">
              <KapdologyLogo variant="max" className="w-64 md:w-80 h-auto invert brightness-200" />
            </Link>
            <div className="flex flex-col gap-1 text-gray-300">
              <span className="font-black text-lg tracking-wide uppercase text-white">NOT JUST CLOTHES. IT&apos;S A MOOD.</span>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {brandData.description}
              </p>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF3B00] mt-2">WEAR THE CULTURE.</span>
            </div>
            <div className="flex gap-4 mt-2">
              <a
                href={brandData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#FF3B00] hover:border-[#FF3B00] hover:text-white transition-all duration-300"
                aria-label="Kapdology Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h3 className="font-black uppercase tracking-wider text-xs text-white/50">Navigation</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 font-bold uppercase tracking-wide text-sm">
              <Link href="/collections" className="hover:text-[#FF3B00] transition-colors">SHOP</Link>
              <Link href="/collections" className="hover:text-[#FF3B00] transition-colors">DROP 001</Link>
              <Link href="/about" className="hover:text-[#FF3B00] transition-colors">ABOUT</Link>
              <Link href="/collections" className="hover:text-[#FF3B00] transition-colors">LOOKBOOK</Link>
              <Link href="/about" className="hover:text-[#FF3B00] transition-colors">SIZE GUIDE</Link>
              <Link href="/contact" className="hover:text-[#FF3B00] transition-colors">SHIPPING</Link>
              <Link href="/contact" className="hover:text-[#FF3B00] transition-colors">RETURNS</Link>
              <Link href="/contact" className="hover:text-[#FF3B00] transition-colors">CONTACT</Link>
            </div>
          </div>

          {/* Legal & Brand Info */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h3 className="font-black uppercase tracking-wider text-xs text-white/50">Legal & Policy</h3>
            <ul className="flex flex-col gap-2.5 font-bold uppercase tracking-wide text-sm text-gray-300">
              <li>
                <Link href="/contact" className="hover:text-[#FF3B00] transition-colors">PRIVACY POLICY</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF3B00] transition-colors">TERMS OF SERVICE</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF3B00] transition-colors">REFUND POLICY</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} KAPDOLOGY®. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4">
            <span>JAIPUR → INDIA</span>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

