"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { brandData } from "@/data/brand";
import { Instagram, Send, Sparkles, MessageSquare, CheckCircle2 } from "lucide-react";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") || "";

  const [productName] = useState(initialProduct);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: initialProduct ? `Inquiring about: ${initialProduct}` : "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-black uppercase tracking-widest text-electric-blue block mb-3">
          KAPDOLOGY® CONCIERGE & SUPPORT
        </span>
        <h1 className="font-black text-5xl md:text-7xl uppercase tracking-tight text-text-black mb-4">
          GET IN TOUCH
        </h1>
        <p className="text-base md:text-lg font-semibold text-text-black/70">
          Have a question about Drop 001, sizing, shipping, or orders? Drop us a line below or connect via Instagram.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Info & Details */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          <div className="p-8 bg-white border-3 border-text-black shadow-[6px_6px_0px_#111111] space-y-6">
            <h2 className="font-black text-2xl uppercase tracking-wider text-text-black flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-hot-pink" />
              <span>DIRECT CHANNELS</span>
            </h2>
            
            <div className="space-y-4 text-sm font-semibold text-text-black">
              <div>
                <span className="text-xs uppercase font-black text-text-black/50 block mb-1">BRAND HQ</span>
                <p className="text-base font-black uppercase">{brandData.name}</p>
                <p className="text-text-black/70">Jaipur, Rajasthan, India</p>
              </div>

              <div className="pt-4 border-t border-text-black/10">
                <span className="text-xs uppercase font-black text-text-black/50 block mb-1">SUPPORT EMAIL</span>
                <a href={`mailto:${brandData.email}`} className="text-base font-black text-electric-blue hover:underline">
                  {brandData.email}
                </a>
              </div>

              <div className="pt-4 border-t border-text-black/10">
                <span className="text-xs uppercase font-black text-text-black/50 block mb-1">INSTAGRAM DM</span>
                <a
                  href={brandData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-black text-hot-pink hover:underline"
                >
                  <Instagram className="h-4 w-4" />
                  <span>@kapdology</span>
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 bg-electric-blue text-white border-3 border-text-black shadow-[6px_6px_0px_#111111] space-y-2">
            <h3 className="font-black uppercase tracking-wider text-base">NOT JUST CLOTHES. IT&apos;S A MOOD.</h3>
            <p className="text-xs font-semibold text-white/80 leading-relaxed">
              Our support team operates online. Expect swift responses on Instagram DMs and email for drop updates, order tracking, and fit consultations.
            </p>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 md:p-10 bg-white border-3 border-text-black shadow-[8px_8px_0px_#111111]">
            <h2 className="font-black text-3xl uppercase tracking-tight text-text-black mb-2 flex items-center gap-3">
              <MessageSquare className="h-7 w-7 text-electric-blue" />
              <span>SEND A MESSAGE</span>
            </h2>
            <p className="text-sm font-semibold text-text-black/60 mb-8">
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            {submitted ? (
              <div className="p-8 bg-neon-green/20 border-2 border-text-black text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-text-black mx-auto" />
                <h3 className="font-black text-2xl uppercase tracking-wide text-text-black">MESSAGE RECEIVED</h3>
                <p className="text-sm font-bold text-text-black/80">
                  Thank you for reaching out! We will process your message shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 font-black uppercase text-xs border-2 border-text-black bg-white hover:bg-text-black hover:text-white transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {productName && (
                  <div className="p-3 bg-hot-pink/10 border-2 border-text-black text-xs font-bold uppercase tracking-wider text-text-black">
                    Inquiring about: <strong className="font-black text-hot-pink">{productName}</strong>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-text-black mb-2">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-base-cream border-2 border-text-black font-semibold text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-electric-blue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-text-black mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 bg-base-cream border-2 border-text-black font-semibold text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-electric-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-text-black mb-2">
                      PHONE NUMBER (OPTIONAL)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 90000 00000"
                      className="w-full px-4 py-3 bg-base-cream border-2 border-text-black font-semibold text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-electric-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-text-black mb-2">
                    MESSAGE *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need help with..."
                    className="w-full px-4 py-3 bg-base-cream border-2 border-text-black font-semibold text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-electric-blue resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-4 text-sm font-black uppercase tracking-wider border-3 border-text-black bg-electric-blue text-white shadow-[4px_4px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                  <span>SUBMIT MESSAGE</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="w-full bg-base-cream min-h-screen">
      <Suspense fallback={
        <div className="w-full py-20 text-center font-bold uppercase tracking-widest text-text-black/60">
          Loading contact form...
        </div>
      }>
        <ContactFormContent />
      </Suspense>
    </div>
  );
}
