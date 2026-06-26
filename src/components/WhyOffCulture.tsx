"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Flame, ShieldAlert } from "lucide-react";

export default function WhyOffCulture() {
  return (
    <section className="w-full py-24 bg-base-cream border-b-2 border-text-black relative overflow-hidden streetwear-grid select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Brand Manifesto Statement */}
          <div className="lg:col-span-7">
            <span className="text-xs font-black uppercase tracking-widest text-electric-blue block mb-3 animate-pulse">
              BRAND MANIFESTO
            </span>
            <h2 className="font-extrabold text-4xl md:text-6xl uppercase tracking-tighter leading-[0.95] mb-8 text-text-black">
              WE ARE NOT FOR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-hot-pink to-electric-blue">
                THE ORDINARY.
              </span>
            </h2>
            <div className="space-y-6 text-base md:text-lg text-text-black/85 font-medium leading-relaxed max-w-2xl">
              <p>
                <strong className="text-text-black text-xl font-bold block mb-2 uppercase">Your clothes say it first.</strong>
                Off Culture is built for people who reject basic, cookie-cutter fashion. It is for the ones who dress with confidence, experiment with modern boxy proportions, and wear what feels uniquely like them.
              </p>
              <p>
                We do not do drop-shipping. We do not do cheap polyester margins. Every tee in our Mansarovar basement is crafted, curated, and fit-tested so you get heavy-weight, street-ready drops starting at ₹599.
              </p>
              <p className="border-l-4 border-electric-blue pl-4 font-black uppercase text-electric-blue text-sm md:text-base tracking-wider mt-6">
                “Jaipur streetwear has arrived. No gatekeeping. Just premium silhouettes.”
              </p>
            </div>
          </div>

          {/* Right Column: Creative Sticker Layout / Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[350px]">
            {/* Sticker 1 */}
            <motion.div
              initial={{ rotate: -5, scale: 0.95 }}
              whileInView={{ rotate: -8, scale: 1 }}
              whileHover={{ rotate: -12, scale: 1.05 }}
              viewport={{ once: true }}
              className="absolute w-[220px] bg-white border-2 border-text-black p-4 shadow-[4px_4px_0px_#111111] z-30"
            >
              <div className="flex items-center gap-2 mb-2 text-hot-pink">
                <Flame className="h-5 w-5 fill-hot-pink" />
                <span className="font-black text-xs uppercase tracking-widest">STREET CORE</span>
              </div>
              <p className="text-xs font-extrabold uppercase text-text-black">
                Oversized drop shoulders designed for maximum comfort and style.
              </p>
            </motion.div>

            {/* Sticker 2 */}
            <motion.div
              initial={{ rotate: 10, scale: 0.95 }}
              whileInView={{ rotate: 6, scale: 1 }}
              whileHover={{ rotate: 12, scale: 1.05 }}
              viewport={{ once: true }}
              className="absolute w-[200px] bg-neon-green border-2 border-text-black p-4 shadow-[4px_4px_0px_#111111] translate-x-24 translate-y-16 z-20"
            >
              <div className="flex items-center gap-2 mb-2 text-text-black">
                <Sparkles className="h-5 w-5" />
                <span className="font-black text-xs uppercase tracking-widest">AFFORDABLE</span>
              </div>
              <p className="text-xs font-extrabold uppercase text-text-black">
                Premium streetwear without the corporate markup. Standard price around ₹599.
              </p>
            </motion.div>

            {/* Sticker 3 */}
            <motion.div
              initial={{ rotate: -15, scale: 0.95 }}
              whileInView={{ rotate: -18, scale: 1 }}
              whileHover={{ rotate: -22, scale: 1.05 }}
              viewport={{ once: true }}
              className="absolute w-[180px] bg-electric-blue text-white border-2 border-text-black p-4 shadow-[4px_4px_0px_#111111] translate-x-[-120px] translate-y-16 z-10"
            >
              <div className="flex items-center gap-2 mb-2 text-neon-green">
                <Heart className="h-5 w-5 fill-neon-green" />
                <span className="font-black text-xs uppercase tracking-widest">JAIPUR MADE</span>
              </div>
              <p className="text-xs font-extrabold uppercase text-white/90">
                VT Road circle shop. Rooted in the local fashion movement.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
