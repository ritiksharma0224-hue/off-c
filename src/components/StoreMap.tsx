"use client";

import { motion } from "framer-motion";
import { brandData } from "@/data/brand";
import { MapPin, Navigation, Phone, Clock, Instagram } from "lucide-react";

export default function StoreMap() {
  return (
    <section className="w-full py-20 bg-white border-b-2 border-text-black relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-electric-blue block mb-2">
            PHYSICAL OUTLET
          </span>
          <h2 className="font-extrabold text-4xl md:text-5xl uppercase tracking-tight mb-4">
            Visit The Basement
          </h2>
          <p className="text-sm font-semibold text-text-black/60">
            Come try on our boxy fits, check materials, and shop the fresh drops in person.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Contact & Visit Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 bg-base-cream border-2 border-text-black shadow-[4px_4px_0px_#111111] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/5 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-8 relative z-10">
              {/* Address detail */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-text-black text-white flex items-center justify-center border-2 border-text-black shrink-0 shadow-[2px_2px_0px_#A3E635]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black uppercase text-xs tracking-wider text-text-black/50 mb-1">Address</h3>
                  <p className="font-extrabold text-base uppercase text-text-black leading-snug">
                    {brandData.address}
                  </p>
                </div>
              </div>

              {/* Timing detail */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white text-text-black flex items-center justify-center border-2 border-text-black shrink-0 shadow-[2px_2px_0px_#111111]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black uppercase text-xs tracking-wider text-text-black/50 mb-1">Hours</h3>
                  <p className="font-extrabold text-sm uppercase text-text-black">
                    {brandData.openingHours}
                  </p>
                </div>
              </div>

              {/* Contact/Support detail */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white text-text-black flex items-center justify-center border-2 border-text-black shrink-0 shadow-[2px_2px_0px_#111111]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black uppercase text-xs tracking-wider text-text-black/50 mb-1">Get in Touch</h3>
                  <p className="font-extrabold text-sm text-text-black">
                    DM on Instagram for rapid stock inquiries.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 relative z-10">
              <a
                href={brandData.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 font-bold uppercase tracking-wider text-xs border-2 border-text-black bg-text-black text-white hover:bg-electric-blue transition-colors duration-200 shadow-[3px_3px_0px_#0052FF]"
              >
                <Navigation className="h-4.5 w-4.5" />
                <span>Navigate Maps</span>
              </a>

              <a
                href={brandData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 font-bold uppercase tracking-wider text-xs border-2 border-text-black bg-white text-text-black hover:bg-hot-pink hover:text-white transition-all duration-200 shadow-[3px_3px_0px_#111111]"
              >
                <Instagram className="h-4.5 w-4.5" />
                <span>Follow Instagram</span>
              </a>
            </div>

          </div>

          {/* Right Column: Google Maps Embed Iframe */}
          <div className="lg:col-span-7 h-[350px] lg:h-auto min-h-[380px] border-2 border-text-black shadow-[4px_4px_0px_#111111] overflow-hidden relative">
            <iframe
              title="Off Culture Jaipur Store Google Maps Location"
              src={brandData.mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
