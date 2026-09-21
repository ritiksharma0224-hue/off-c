"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, ArrowRight, Search, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { brandData } from "@/data/brand";
import { useCart } from "@/context/CartContext";
import KapdologyLogo from "./KapdologyLogo";
import SearchModal from "./SearchModal";

const navLinks = [
  { name: "SHOP", href: "/shop" },
  { name: "DROP 001", href: "/drop-001" },
  { name: "COLLECTIONS", href: "/collections" },
  { name: "LOOKBOOK", href: "/lookbook" },
  { name: "ABOUT", href: "/about" }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#111111]/15 bg-[#FAF7F2]/95 backdrop-blur-md">
        {/* Top Banner Ticker - Minimal Utility Bar */}
        <div className="w-full bg-[#111111] text-[#FAF7F2] py-1 px-4 md:px-8 border-b border-[#111111] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B00] animate-pulse"></span>
            <span className="tracking-widest">KAPDOLOGY® — NOT JUST CLOTHES. IT&apos;S A MOOD.</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] text-[#FAF7F2]/75 tracking-widest">
            <span>DROP 001 LIVE</span>
            <span className="text-[#FF3B00]">•</span>
            <span>FREE SHIPPING OVER ₹1999</span>
          </div>

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

        {/* Main Nav Container */}
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between relative">
          
          {/* Left: Official Kapdology Minimal Logo */}
          <Link href="/" className="group flex items-center select-none py-0.5 shrink-0">
            <KapdologyLogo
              variant="minimal"
              priority
              className="h-7 sm:h-8 md:h-9 w-auto"
            />
          </Link>

          {/* Center: Cohesive Navigation Group */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative py-1 group overflow-visible select-none"
                >
                  <span
                    className={`inline-block font-black uppercase tracking-tight text-[13px] md:text-sm transition-all duration-200 ease-out group-hover:-translate-y-[1.5px] ${
                      isActive
                        ? "text-[#FF3B00]"
                        : "text-[#111111] group-hover:text-[#FF3B00]"
                    }`}
                  >
                    {link.name}
                  </span>

                  <span
                    className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#FF3B00] transition-transform duration-200 ease-out origin-center ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Actions: Search, Cart & SHOP DROP 001 Button */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-1.5 py-1 text-[#111111] hover:text-[#FF3B00] transition-colors duration-200 cursor-pointer select-none"
              aria-label="Search"
            >
              <Search className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-[1px]" />
              <span className="font-black uppercase tracking-tight text-[12px] md:text-[13px] inline-block transition-transform duration-200 group-hover:-translate-y-[1px]">
                SEARCH
              </span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="group flex items-center gap-1.5 py-1 text-[#111111] hover:text-[#FF3B00] transition-colors duration-200 select-none cursor-pointer"
              aria-label="Open cart"
            >
              <div className="relative">
                <ShoppingBag className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-[1px]" />
                <span className="absolute -top-1.5 -right-2 bg-[#FF3B00] text-white text-[9px] font-mono font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              </div>
              <span className="font-black uppercase tracking-tight text-[12px] md:text-[13px] inline-block transition-transform duration-200 group-hover:-translate-y-[1px]">
                CART
              </span>
            </button>

            {/* SHOP DROP 001 → Button */}
            <Link
              href="/drop-001"
              className="group flex items-center gap-1.5 px-4 py-1.5 text-[12px] md:text-[13px] font-black uppercase tracking-tight border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] hover:bg-[#FF3B00] hover:border-[#FF3B00] hover:text-white transition-all duration-200 shadow-[2px_2px_0px_#111111]"
            >
              <span>SHOP DROP 001</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#FF3B00] group-hover:text-white transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Controls: Search + Cart + Menu Toggle */}
          <div className="flex md:hidden items-center gap-2.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 text-[#111111] hover:text-[#FF3B00] transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={openCart}
              className="p-1 text-[#111111] relative cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1.5 bg-[#FF3B00] text-white text-[8px] font-mono font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </button>

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
              className="md:hidden border-t border-[#111111]/15 bg-[#FAF7F2]"
            >
              <div className="px-6 py-5 flex flex-col gap-3.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-black text-lg uppercase tracking-tight py-1.5 border-b border-[#111111]/10 flex items-center justify-between transition-colors ${
                        isActive ? "text-[#FF3B00]" : "text-[#111111] hover:text-[#FF3B00]"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-4 w-4 text-[#FF3B00]" />
                    </Link>
                  );
                })}

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/drop-001"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 text-center text-xs font-black uppercase border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] hover:bg-[#FF3B00] hover:text-white transition-colors shadow-[2px_2px_0px_#FF3B00]"
                  >
                    <span>SHOP DROP 001</span>
                    <ArrowRight className="h-4 w-4 text-[#FF3B00]" />
                  </Link>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#111111]/60 pt-2">
                    <span>JAIPUR → INDIA</span>
                    <span>26.9124° N, 75.7873° E</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
