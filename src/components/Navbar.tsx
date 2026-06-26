"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { brandData } from "@/data/brand";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "About Us", href: "/about" },
  { name: "Visit Store", href: "/contact" }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-text-black bg-base-cream/80 backdrop-blur-md">
      {/* Top Banner Ticker */}
      <div className="w-full bg-text-black text-base-cream py-1.5 px-4 overflow-hidden border-b-2 border-text-black text-xs font-bold uppercase tracking-wider flex items-center justify-between">
        <div className="flex items-center gap-1.5 animate-pulse">
          <span className="h-2 w-2 rounded-full bg-neon-green"></span>
          <span>Mansarovar Store Open (11am - 9:30pm)</span>
        </div>
        <div className="hidden sm:block">
          <span>Streetwear starting @ ₹599</span>
        </div>
        <div>
          <a
            href={brandData.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-hot-pink transition-colors"
          >
            <span>Instagram Drops</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Main Nav Container */}
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex flex-col justify-start select-none">
          <span className="font-extrabold text-2xl md:text-3xl tracking-tighter uppercase leading-none group-hover:text-electric-blue transition-colors">
            Off Culture
          </span>
          <span className="font-bold text-xs tracking-[0.25em] uppercase text-text-black/60 leading-none">
            Jaipur
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-bold uppercase tracking-wider text-sm py-1.5 group overflow-hidden"
              >
                <span className={`transition-colors duration-300 ${isActive ? 'text-electric-blue' : 'text-text-black hover:text-electric-blue'}`}>
                  {link.name}
                </span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-electric-blue transition-transform duration-300 origin-left ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={brandData.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide border-2 border-text-black bg-white hover:bg-electric-blue hover:text-white transition-colors duration-300 shadow-[3px_3px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <Instagram className="h-4 w-4" />
            <span>DM to Shop</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 border-2 border-text-black rounded-sm bg-white text-text-black hover:bg-chrome-silver transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t-2 border-text-black bg-base-cream"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-black text-3xl uppercase tracking-tight py-1 border-b border-text-black/10 transition-colors ${
                      isActive ? "text-electric-blue" : "text-text-black"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <a
                href={brandData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 flex items-center justify-center gap-3 w-full py-4 text-center text-lg font-bold uppercase border-2 border-text-black bg-text-black text-white hover:bg-electric-blue transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
                <span>Shop on Instagram DM</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
