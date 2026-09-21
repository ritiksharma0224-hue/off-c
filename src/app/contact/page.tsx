"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { brandData } from "@/data/brand";
import {
  Instagram,
  Send,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Mail,
  MapPin,
  Clock,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: initialProduct ? `Inquiry regarding: ${initialProduct}` : "Order / Drop Inquiry",
    message: initialProduct ? `Hello KAPDOLOGY Studio, I have a question regarding ${initialProduct}: ` : "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const contactFaqs = [
    {
      q: "What is the typical response turnaround?",
      a: "Our studio team reviews inquiries continuously. You can expect a response within 4 to 12 business hours on email, and even faster on Instagram DM (@kapdology).",
    },
    {
      q: "Can I place a bespoke or bulk order?",
      a: "Because all garments are manufactured in limited drop batches, we do not typically provide single-unit custom alterations. For editorial styling, collaborations, or corporate creative gifting, mention 'Collab Inquiry' in the subject line.",
    },
    {
      q: "Where is KAPDOLOGY based?",
      a: "We are proudly born and operated out of Jaipur, Rajasthan, India. We operate exclusively as a direct-to-consumer online fashion house with express pan-India dispatch.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 select-none">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
          <MessageSquare className="h-3.5 w-3.5 text-[#FF3B00]" />
          <span>STUDIO CONCIERGE & DIRECT INQUIRIES</span>
        </div>
        <h1 className="font-black text-4xl sm:text-5xl md:text-7xl uppercase tracking-tight text-[#111111] mb-4">
          CONNECT WITH US
        </h1>
        <p className="text-sm md:text-base font-semibold text-[#111111]/70 leading-relaxed">
          Questions regarding Drop 001, silhouette sizing, shipment tracking, or creative partnerships? Reach out directly to the studio team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info & Direct Channels */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Card 1: Direct Support Channels */}
          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[5px_5px_0px_#111111] space-y-6">
            <h2 className="font-black text-lg uppercase tracking-wider text-[#111111] flex items-center gap-2.5 pb-3 border-b border-[#111111]/15">
              <Sparkles className="h-5 w-5 text-[#FF3B00]" />
              <span>DIRECT CHANNELS</span>
            </h2>
            
            <div className="space-y-5 text-xs font-semibold text-[#111111]">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase font-black text-[#111111]/50 block">
                  BRAND ORIGIN & HQ
                </span>
                <p className="text-sm font-black uppercase text-[#111111] flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#FF3B00] shrink-0" />
                  <span>KAPDOLOGY® STUDIO</span>
                </p>
                <p className="text-[#111111]/70 font-medium pl-5.5">
                  Jaipur, Rajasthan, India
                </p>
                <span className="text-[11px] text-[#00875A] font-mono font-bold pl-5.5 block">
                  • Online Direct-to-Consumer Pan-India
                </span>
              </div>

              <div className="pt-4 border-t border-[#111111]/10 space-y-1">
                <span className="font-mono text-[10px] uppercase font-black text-[#111111]/50 block">
                  CLIENT SUPPORT DESK
                </span>
                <a
                  href={`mailto:${brandData.email}`}
                  className="text-sm font-black text-[#111111] hover:text-[#FF3B00] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="h-4 w-4 text-[#FF3B00] shrink-0" />
                  <span>{brandData.email}</span>
                </a>
                <p className="text-[11px] text-[#111111]/60 font-medium pl-5.5">
                  Mon – Sat, 10:00 AM – 7:00 PM IST
                </p>
              </div>

              <div className="pt-4 border-t border-[#111111]/10 space-y-1">
                <span className="font-mono text-[10px] uppercase font-black text-[#111111]/50 block">
                  COMMUNITY & INSTAGRAM DM
                </span>
                <a
                  href={brandData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-black text-[#111111] hover:text-[#FF3B00] transition-colors"
                >
                  <Instagram className="h-4 w-4 text-[#FF3B00] shrink-0" />
                  <span>@kapdology</span>
                </a>
                <p className="text-[11px] text-[#111111]/60 font-medium pl-5.5">
                  Fastest channel for quick fit consultation & drop alerts
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Drop Philosophy */}
          <div className="p-6 bg-[#111111] text-[#FAF7F2] border-2 border-[#111111] shadow-[5px_5px_0px_#FF3B00] space-y-3">
            <div className="flex items-center gap-2 text-[#FF3B00]">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-xs font-black uppercase tracking-wider">
                ENGINEERED WITH INTENT
              </span>
            </div>
            <p className="text-xs text-[#FAF7F2]/80 leading-relaxed font-medium">
              We are three young engineers from Jaipur who refuse to wear derivative clothing. When you reach out, you talk directly with the creators behind the patterns, fits, and graphics.
            </p>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 md:p-10 bg-white border-2 border-[#111111] shadow-[6px_6px_0px_#111111]">
            <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-[#111111] mb-2 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-[#FF3B00]" />
              <span>SEND A DISPATCH NOTE</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold text-[#111111]/70 mb-8">
              Submit your inquiry and our studio concierge will respond via email or WhatsApp within 24 business hours.
            </p>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border-2 border-[#00875A] text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#00875A]/10 border-2 border-[#00875A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7 text-[#00875A]" />
                </div>
                <h3 className="font-black text-xl uppercase tracking-wider text-[#111111]">
                  INQUIRY RECORDED
                </h3>
                <p className="text-xs text-[#111111]/80 font-medium max-w-md mx-auto">
                  Thank you for connecting with KAPDOLOGY®. Your message has been routed to our studio team in Jaipur. We will reach back to you shortly.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "Order / Drop Inquiry",
                        message: "",
                      });
                    }}
                    className="px-6 py-2.5 font-mono font-black uppercase text-xs border-2 border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                  >
                    SEND ANOTHER NOTE
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {initialProduct && (
                  <div className="p-3 bg-amber-50 border border-amber-300 font-mono text-xs font-bold uppercase text-[#111111] flex items-center gap-2">
                    <span className="text-[#FF3B00]">REFERENCED PRODUCT:</span>
                    <span>{initialProduct}</span>
                  </div>
                )}

                <div>
                  <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                      PHONE NUMBER (FOR WHATSAPP REPLY)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                    SUBJECT / INQUIRY TYPE *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00]"
                  >
                    <option value="Order / Drop Inquiry">Order / Drop 001 Reservation</option>
                    <option value="Size Consultation">Size & Fit Consultation</option>
                    <option value="Shipping & Delivery">Shipping & Dispatch Status</option>
                    <option value="Exchange or Return">Exchange or Return Request</option>
                    <option value="Collab / Press">Styling / Press / Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                    MESSAGE *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your query or order ID..."
                    className="w-full px-4 py-3 bg-[#FAF7F2] border-2 border-[#111111] font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#FF3B00] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full py-4 text-xs md:text-sm font-black uppercase tracking-wider border-2 border-[#111111] bg-[#111111] text-white shadow-[4px_4px_0px_#FF3B00] hover:shadow-[1px_1px_0px_#FF3B00] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#FF3B00] hover:border-[#FF3B00] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? "TRANSMITTING NOTE..." : "TRANSMIT MESSAGE"}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Support FAQ Grid */}
      <div className="mt-20">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-[#FF3B00]" />
          <h2 className="font-black uppercase text-xl md:text-2xl text-[#111111]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactFaqs.map((faq, index) => (
            <div
              key={index}
              className="p-6 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-2"
            >
              <h3 className="font-black text-sm uppercase text-[#111111]">
                {faq.q}
              </h3>
              <p className="text-xs text-[#111111]/80 leading-relaxed font-medium">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen">
      <Suspense
        fallback={
          <div className="w-full py-20 text-center font-mono text-xs font-bold uppercase tracking-widest text-[#111111]">
            LOADING STUDIO DESK...
          </div>
        }
      >
        <ContactFormContent />
      </Suspense>
    </div>
  );
}
