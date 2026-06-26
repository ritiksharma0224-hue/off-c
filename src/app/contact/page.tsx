"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { brandData } from "@/data/brand";
import { collectionsData } from "@/data/collections";
import { MapPin, Phone, Clock, Navigation, CheckCircle, Send } from "lucide-react";

function ContactContent() {
  const searchParams = useSearchParams();
  
  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [productSelection, setProductSelection] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Pre-fill the product selection if passed in the URL parameters
  useEffect(() => {
    const productQuery = searchParams.get("product");
    if (productQuery) {
      setProductSelection(productQuery);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    // Prepare message string for WhatsApp integration redirect
    const whatsappText = encodeURIComponent(
      `*New Inquiry - Off Culture Jaipur*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Interested In:* ${productSelection || "General Catalog"}\n` +
      `*Message:* ${message}`
    );

    // Set submitted state to show success message
    setSubmitted(true);

    // Open WhatsApp link in new window with the formatted text
    // Replace with real phone number link
    setTimeout(() => {
      window.open(`https://wa.me/919999999999?text=${whatsappText}`, "_blank");
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      
      {/* Editorial Header */}
      <div className="mb-12 text-left">
        <span className="text-xs font-black uppercase tracking-widest text-electric-blue block mb-2">
          GET IN TOUCH
        </span>
        <h1 className="font-black text-4xl md:text-6xl uppercase tracking-tight text-text-black">
          Visit / Contact Us
        </h1>
        <p className="text-sm font-semibold text-text-black/60 mt-2 max-w-lg">
          Find us at VT Road Circle, Mansarovar or send us an instant catalog inquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Info & Maps */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Info pill list */}
          <div className="p-6 bg-white border-2 border-text-black shadow-[4px_4px_0px_#111111] space-y-6">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-electric-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold uppercase text-xs text-text-black/50 mb-0.5">Address</h3>
                <p className="font-bold text-sm text-text-black uppercase leading-tight">
                  {brandData.address}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-hot-pink shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold uppercase text-xs text-text-black/50 mb-0.5">Store Hours</h3>
                <p className="font-bold text-sm text-text-black uppercase">
                  {brandData.openingHours}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="h-5 w-5 text-neon-green shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold uppercase text-xs text-text-black/50 mb-0.5">Instagram Inquiry</h3>
                <p className="font-bold text-sm text-text-black">
                  Direct Messages: @offculturejaipur
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="h-[300px] border-2 border-text-black shadow-[4px_4px_0px_#111111] overflow-hidden relative">
            <iframe
              title="Store Location Map"
              src={brandData.mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="absolute inset-0 grayscale contrast-125 opacity-95"
            />
            {/* Maps directional absolute label */}
            <a
              href={brandData.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 flex items-center gap-1 bg-text-black text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-white hover:bg-electric-blue hover:text-white transition-colors"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Get Directions</span>
            </a>
          </div>

        </div>

        {/* Right Column: Inquiry Form Card */}
        <div className="lg:col-span-7 p-8 bg-white border-2 border-text-black shadow-[6px_6px_0px_#111111]">
          {submitted ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <CheckCircle className="h-16 w-16 text-neon-green mb-4" />
              <h2 className="font-extrabold text-2xl uppercase tracking-tight text-text-black mb-2">
                Inquiry Submitted!
              </h2>
              <p className="text-sm font-semibold text-text-black/70 max-w-sm mb-6">
                Thank you, we are redirecting you to WhatsApp to complete your checkout check with the team.
              </p>
              <div className="h-1.5 w-24 bg-chrome-silver overflow-hidden">
                <div className="h-full bg-electric-blue animate-pulse w-full" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-extrabold text-2xl uppercase tracking-tight text-text-black mb-2">
                Stock & Fitting Inquiry
              </h2>
              <p className="text-xs font-semibold text-text-black/60 mb-6">
                Tell us which fits or items you are interested in. Once submitted, this prepares your chat details for WhatsApp support.
              </p>

              {errorMsg && (
                <div className="bg-red-55 border border-red-200 text-red-700 text-xs font-bold p-3 uppercase">
                  {errorMsg}
                </div>
              )}

              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-text-black">
                  Your Name <span className="text-hot-pink">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-semibold bg-base-cream border-2 border-text-black focus:outline-none focus:border-electric-blue transition-colors"
                />
              </div>

              {/* Phone Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-text-black">
                  Phone Number (WhatsApp) <span className="text-hot-pink">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-semibold bg-base-cream border-2 border-text-black focus:outline-none focus:border-electric-blue transition-colors"
                />
              </div>

              {/* Product Selection field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-text-black">
                  Interested Product / Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cyber Culture Oversized Tee"
                  value={productSelection}
                  onChange={(e) => setProductSelection(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-semibold bg-base-cream border-2 border-text-black focus:outline-none focus:border-electric-blue transition-colors"
                />
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-text-black">
                  Inquiry Details / Message <span className="text-hot-pink">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. I need this oversized tee in Size XL. Is it available in the Mansarovar store?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-semibold bg-base-cream border-2 border-text-black focus:outline-none focus:border-electric-blue transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-text-black text-white font-black uppercase tracking-widest text-sm border-2 border-text-black hover:bg-electric-blue transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_#A3E635] hover:shadow-[2px_2px_0px_#111111]"
              >
                <Send className="h-4 w-4" />
                <span>Submit & Chat on WhatsApp</span>
              </button>
            </form>
          )}
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
        <ContactContent />
      </Suspense>
    </div>
  );
}
