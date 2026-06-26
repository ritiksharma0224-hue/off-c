"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Tag, MapPin, Eye } from "lucide-react";

const badges = [
  { text: "Gen-Z Streetwear", icon: Eye, color: "bg-electric-blue text-white" },
  { text: "Oversized & Boxy Fits", icon: ShieldCheck, color: "bg-hot-pink text-white" },
  { text: "Starting Around ₹599", icon: Tag, color: "bg-neon-green text-text-black" },
  { text: "Located in Mansarovar, Jaipur", icon: MapPin, color: "bg-white text-text-black" }
];

export default function BrandSnapshot() {
  return (
    <section className="w-full py-8 border-b-2 border-text-black bg-white overflow-hidden relative select-none">
      {/* Moving text banner background (Marquee effect) */}
      <div className="flex w-full items-center">
        {/* Infinite CSS marquee loop using our Tailwind v4 animate-marquee */}
        <div className="marquee-container w-full whitespace-nowrap flex overflow-hidden border-y border-text-black/5 py-1">
          <div className="marquee-content flex gap-8 py-2 animate-marquee shrink-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-8 items-center text-sm font-black uppercase tracking-widest text-text-black/20">
                <span>OFF CULTURE JAIPUR</span>
                <span>•</span>
                <span>NOT BASIC. NOT OVERPRICED.</span>
                <span>•</span>
                <span>FITS THAT SPEAK</span>
                <span>•</span>
                <span>MANSAROVAR OUTLET</span>
                <span>•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Snapshots Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`flex items-center gap-3 px-4 py-3 border-2 border-text-black shadow-[3px_3px_0px_#111111] hover:shadow-[5px_5px_0px_#111111] transition-all duration-200 ${badge.color}`}
              >
                <div className="p-1 bg-text-black/10 rounded-sm">
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="font-extrabold uppercase tracking-wide text-xs md:text-sm">
                  {badge.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
