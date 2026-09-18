"use client";

import { motion } from "framer-motion";
import { brandData } from "@/data/brand";
import { Mail, Instagram, Sparkles, MessageSquare, Send } from "lucide-react";

export default function KapdologyConcierge() {
  return (
    <section className="w-full py-20 bg-white border-b-2 border-[#111111] relative select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF3B00] block mb-2">
            ONLINE CONCIERGE & SUPPORT
          </span>
          <h2 className="font-black text-4xl md:text-5xl uppercase tracking-tight mb-4 text-[#111111]">
            GET IN TOUCH WITH KAPDOLOGY®
          </h2>
          <p className="text-sm font-semibold text-[#111111]/70">
            Have questions about Drop 001 sizing, fabric specifications, or upcoming releases? Reach out to our concierge team.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 bg-base-cream border-3 border-[#111111] shadow-[6px_6px_0px_#111111] relative overflow-hidden">
            <div className="space-y-8 relative z-10">
              
              {/* Instagram */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-[#111111] text-[#FAF7F2] flex items-center justify-center border-2 border-[#111111] shrink-0 shadow-[2px_2px_0px_#FF3B00]">
                  <Instagram className="h-5 w-5 text-[#FF3B00]" />
                </div>
                <div>
                  <h3 className="font-black uppercase text-xs tracking-wider text-[#111111]/50 mb-1">Instagram DMs</h3>
                  <p className="font-extrabold text-sm text-[#111111] mb-1">
                    @kapdology
                  </p>
                  <p className="text-xs text-[#111111]/70">
                    Direct styling advice, fit questions, and release inquiries.
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-white text-[#111111] flex items-center justify-center border-2 border-[#111111] shrink-0 shadow-[2px_2px_0px_#111111]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black uppercase text-xs tracking-wider text-[#111111]/50 mb-1">Email Concierge</h3>
                  <p className="font-extrabold text-sm text-[#111111]">
                    {brandData.email}
                  </p>
                  <p className="text-xs text-[#111111]/70 mt-1">
                    Order support, collaboration, and press inquiries.
                  </p>
                </div>
              </div>

              {/* Drop Alerts */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-[#FF3B00] text-white flex items-center justify-center border-2 border-[#111111] shrink-0 shadow-[2px_2px_0px_#111111]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black uppercase text-xs tracking-wider text-[#111111]/50 mb-1">Drop Access</h3>
                  <p className="font-extrabold text-sm text-[#111111]">
                    KAPDOLOGY® Drop 001
                  </p>
                  <p className="text-xs text-[#111111]/70 mt-1">
                    Limited edition releases. First come, first served.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 relative z-10">
              <a
                href={brandData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 font-black uppercase tracking-wider text-xs border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] hover:bg-[#FF3B00] hover:text-[#111111] transition-all duration-200 shadow-[3px_3px_0px_#FF3B00]"
              >
                <Instagram className="h-4 w-4" />
                <span>DM ON INSTAGRAM</span>
              </a>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7 p-8 bg-white border-3 border-[#111111] shadow-[6px_6px_0px_#111111] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-[#FF3B00]" />
                <h3 className="font-black uppercase text-xl text-[#111111]">Send Quick Inquiry</h3>
              </div>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for reaching out to KAPDOLOGY® Concierge.");
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="NAME"
                      className="w-full p-3 text-xs font-bold uppercase border-2 border-[#111111] bg-[#FAF7F2] focus:outline-none focus:border-[#FF3B00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1">
                      Instagram Handle / Email
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="@HANDLE OR EMAIL"
                      className="w-full p-3 text-xs font-bold uppercase border-2 border-[#111111] bg-[#FAF7F2] focus:outline-none focus:border-[#FF3B00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#111111] mb-1">
                    Message / Size Inquiry
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="E.G. I HAVE QUESTIONS ABOUT SIZE L FIT ON THE DROP 001 OVERSIZED TEE..."
                    className="w-full p-3 text-xs font-bold uppercase border-2 border-[#111111] bg-[#FAF7F2] focus:outline-none focus:border-[#FF3B00]"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3.5 text-xs font-black uppercase tracking-wider border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] hover:bg-[#FF3B00] hover:text-[#111111] transition-all duration-200 shadow-[3px_3px_0px_#111111] cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>SEND INQUIRY</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
