"use client";

import Link from "next/link";
import { ArrowUp, Instagram, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import { brandData } from "@/data/brand";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-text-black text-base-cream border-t-4 border-text-black relative overflow-hidden mt-auto">
      {/* Decorative dot grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none streetwear-grid-dark" />

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Logo and Brand Statement */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link href="/" className="inline-block select-none">
              <span className="font-black text-4xl tracking-tighter uppercase leading-none text-white block">
                OFF CULTURE
              </span>
              <span className="font-extrabold text-sm tracking-[0.3em] uppercase text-neon-green block">
                JAIPUR / MANASAROVAR
              </span>
            </Link>
            <p className="text-gray-400 max-w-sm text-sm md:text-base">
              A fashion-forward Gen-Z streetwear outlet bringing premium oversized fits, boxy cuts, cropped shirts, and original graphic tees at honest prices.
            </p>
            <div className="flex gap-4">
              <a
                href={brandData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-hot-pink hover:border-hot-pink hover:text-white transition-all duration-300"
                aria-label="Instagram Profile"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={brandData.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-electric-blue hover:border-electric-blue hover:text-white transition-all duration-300"
                aria-label="Google Maps Location"
              >
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h3 className="font-black uppercase tracking-wider text-xs text-white/50">Explore</h3>
            <ul className="flex flex-col gap-2 font-bold uppercase tracking-wide text-sm">
              <li>
                <Link href="/" className="hover:text-electric-blue transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-electric-blue transition-colors">All Collections</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-electric-blue transition-colors">Our Manifesto</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-electric-blue transition-colors">Visit Store / Contact</Link>
              </li>
            </ul>
          </div>

          {/* Location details */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h3 className="font-black uppercase tracking-wider text-xs text-white/50">Store Experience</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <p className="font-semibold text-white flex items-start gap-1.5">
                <MapPin className="h-4.5 w-4.5 shrink-0 text-neon-green" />
                <span>{brandData.address}</span>
              </p>
              <p className="mt-2 text-xs">
                <strong className="text-white block uppercase mb-0.5">Hours:</strong>
                {brandData.openingHours}
              </p>
              <a
                href={brandData.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 self-start text-xs font-bold uppercase tracking-wider text-neon-green hover:underline"
              >
                <span>Navigate in Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Massive Typography Backdrop Section */}
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} OFF CULTURE JAIPUR. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4">
            <span>NOT BASIC. NOT OVERPRICED.</span>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
