"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, ArrowRight, Search, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { brandData } from "@/data/brand";
import KapdologyLogo from "./KapdologyLogo";

const navLinks = [
  { name: "Shop", href: "/collections" },
  { name: "Drop 001", href: "/collections?category=new-drops" },
  { name: "About", href: "/about" },
  { name: "Lookbook", href: "/collections#lookbook" }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#111111]/20 bg-[#FAF7F2]/95 backdrop-blur-md">
      {/* Top Banner Ticker - Minimal Technical Streetwear Utility Bar */}
      <div className="w-full bg-[#111111] text-[#FAF7F2] py-1.5 px-4 md:px-8 border-b border-[#111111] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B00] animate-pulse"></span>
          <span className="tracking-widest">KAPDOLOGY® — NOT JUST CLOTHES. IT&apos;S A MOOD.</span>
        </div>
        
        {/* Center */}
        <div className="hidden sm:flex items-center gap-2 text-[#FAF7F2]/75 font-mono text-[10px] tracking-widest">
          <span>DROP 001</span>
          <span className="text-[#FF3B00]">•</span>
          <span>STREETWEAR</span>
        </div>

        {/* Right */}
        <div>
          <a
            href={brandData.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#FAF7F2]/80 hover:text-[#FF3B00] transition-colors tracking-widest text-[10px] sm:text-[11px]"
          >
            <span>INSTAGRAM</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Main Nav Container - Clean Cream / Off-White */}
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between">
        {/* Brand Logo - Official Kapdology Minimal Geometric Stencil */}
        <Link href="/" className="group flex items-center select-none py-0.5">
          <KapdologyLogo
            variant="minimal"
            priority
            className="w-36 sm:w-44 md:w-48 lg:w-52 h-auto transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative font-extrabold uppercase tracking-wider text-xs py-1 group"
              >
                <span className={`transition-colors duration-200 ${isActive ? 'text-[#111111]' : 'text-[#111111]/70 hover:text-[#111111]'}`}>
                  {link.name}
                </span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#FF3B00] transition-transform duration-200 origin-left ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Search, Cart & Primary Shopping Action */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/collections"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111]/80 hover:text-[#111111] transition-colors p-1"
            title="Search Products"
          >
            <Search className="h-4 w-4" />
            <span className="text-[11px] hidden lg:inline">Search</span>
          </Link>

          <Link
            href="/collections"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111]/80 hover:text-[#111111] transition-colors p-1"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-1.5 -right-2 bg-[#FF3B00] text-white text-[9px] font-mono font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                0
              </span>
            </div>
            <span className="text-[11px] hidden lg:inline">Cart</span>
          </Link>

          <Link
            href="/collections?category=new-drops"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] hover:bg-[#FF3B00] hover:border-[#FF3B00] transition-all shadow-[2px_2px_0px_#111111]"
          >
            <span>SHOP DROP 001</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Actions: Cart + Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2.5">
          <Link
            href="/collections"
            className="p-1.5 text-[#111111] relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute 0 top-0.5 right-0.5 bg-[#FF3B00] text-white text-[8px] font-mono font-bold h-3 w-3 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 border-2 border-[#111111] rounded-sm bg-white text-[#111111]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#111111]/20 bg-[#FAF7F2]"
          >
            <div className="px-6 py-5 flex flex-col gap-3.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-black text-lg uppercase tracking-tight py-1 border-b border-[#111111]/10 transition-colors ${
                      isActive ? "text-[#FF3B00]" : "text-[#111111]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <Link
                href="/collections?category=new-drops"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 w-full py-3 text-center text-xs font-black uppercase border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] hover:bg-[#FF3B00] hover:border-[#FF3B00] transition-colors"
              >
                <span>SHOP DROP 001</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
