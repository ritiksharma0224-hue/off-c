import Link from "next/link";
import { brandData } from "@/data/brand";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Shipping Policy | KAPDOLOGY® Streetwear India",
  description:
    "Pan-India dispatch timelines, free shipping thresholds, express courier partners, and tracking procedures for KAPDOLOGY® garments.",
};

export default function ShippingPage() {
  const faqs = [
    {
      q: "How long does dispatch and delivery take?",
      a: "Orders are prepared, quality inspected, and handed over to our express courier partners within 24 to 48 business hours from our Jaipur studio. Transit takes 3 to 5 business days for metro and tier-1/tier-2 cities across India.",
    },
    {
      q: "What are the shipping charges?",
      a: "We offer FREE express shipping on all orders over ₹1,999. For orders under ₹1,999, a flat shipping fee of ₹99 applies nationwide.",
    },
    {
      q: "How do I track my shipment?",
      a: "As soon as your package is dispatched from our fulfillment facility, you will receive an SMS and email notification containing your AWB tracking number and direct live-tracking link.",
    },
    {
      q: "Can I modify my shipping address after placing an order?",
      a: "If your order has not yet been dispatched, contact our concierge desk immediately via Instagram DM (@kapdology) or email (contact@kapdology.store) with your order ID to update the address.",
    },
    {
      q: "Do you ship internationally?",
      a: "Currently, KAPDOLOGY® operates pan-India across all valid postal pin codes. International shipping across North America, Europe, and UAE will launch with Drop 002.",
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-12 md:py-20 select-none">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-12 pb-6 border-b-2 border-[#111111]/15 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
            <Truck className="h-3.5 w-3.5 text-[#FF3B00]" />
            <span>DISPATCH ARCHITECTURE & LOGISTICS</span>
          </div>
          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#111111]">
            SHIPPING POLICY
          </h1>
          <p className="text-sm md:text-base font-semibold text-[#111111]/70 max-w-2xl mt-3">
            Engineered garments delivered nationwide. Every KAPDOLOGY® piece is dispatched from our Jaipur studio in custom tamper-proof collector packaging.
          </p>
        </div>

        {/* 4 Key Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          <div className="p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-2">
            <span className="font-mono text-[10px] font-black text-[#FF3B00] uppercase block">FREE THRESHOLD</span>
            <h3 className="font-black text-lg uppercase text-[#111111]">ORDERS &gt; ₹1,999</h3>
            <p className="text-xs text-[#111111]/70 font-medium">
              Enjoy 100% free priority courier delivery on all orders above ₹1,999.
            </p>
          </div>

          <div className="p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-2">
            <span className="font-mono text-[10px] font-black text-[#FF3B00] uppercase block">DISPATCH VELOCITY</span>
            <h3 className="font-black text-lg uppercase text-[#111111]">24–48 HOURS</h3>
            <p className="text-xs text-[#111111]/70 font-medium">
              Hand-checked, steam finished, and handed over within 1-2 business days.
            </p>
          </div>

          <div className="p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-2">
            <span className="font-mono text-[10px] font-black text-[#FF3B00] uppercase block">TRANSIT TIME</span>
            <h3 className="font-black text-lg uppercase text-[#111111]">3–5 DAYS</h3>
            <p className="text-xs text-[#111111]/70 font-medium">
              Express pan-India air & surface network covering over 26,000 pincodes.
            </p>
          </div>

          <div className="p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-2">
            <span className="font-mono text-[10px] font-black text-[#FF3B00] uppercase block">COLLECTOR SPEC</span>
            <h3 className="font-black text-lg uppercase text-[#111111]">TAMPER PACK</h3>
            <p className="text-xs text-[#111111]/70 font-medium">
              Heavyweight technical mailer bag with authenticity tags and stickers.
            </p>
          </div>
        </div>

        {/* Detailed Shipping Sections */}
        <div className="space-y-8 mb-16">
          
          {/* Section 1 */}
          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#111111]/10">
              <Clock className="h-5 w-5 text-[#FF3B00]" />
              <h2 className="font-black uppercase text-base md:text-lg tracking-wider text-[#111111]">
                1. ORDER PROCESSING & DISPATCH
              </h2>
            </div>
            <p className="text-xs md:text-sm text-[#111111]/80 leading-relaxed font-medium">
              All orders are processed Monday through Saturday, excluding public holidays. Because Drop 001 pieces are limited-run garments, each unit passes a 3-point manual quality check (seam tension, print clarity, and GSM verification) prior to being packed.
            </p>
            <p className="text-xs md:text-sm text-[#111111]/80 leading-relaxed font-medium">
              Once handed over to our logistics partner, dispatch confirmation containing your AWB code will be transmitted instantly.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#111111]/10">
              <MapPin className="h-5 w-5 text-[#FF3B00]" />
              <h2 className="font-black uppercase text-base md:text-lg tracking-wider text-[#111111]">
                2. DOMESTIC COVERAGE & LOGISTICS PARTNERS
              </h2>
            </div>
            <p className="text-xs md:text-sm text-[#111111]/80 leading-relaxed font-medium">
              We partner with India’s most reliable express logistics networks—including BlueDart, Delhivery, and DTDC—to ensure rapid, tracked delivery to every corner of India, from tier-1 capitals (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai) to tier-2 and tier-3 regional hubs.
            </p>
            <div className="p-4 bg-[#FAF7F2] border border-[#111111]/20 font-mono text-xs text-[#111111] space-y-1">
              <span className="font-bold text-[#FF3B00] block">RATES SUMMARY:</span>
              <p>• Orders ₹1,999 and above: <strong>FREE SHIPPING</strong></p>
              <p>• Orders under ₹1,999: <strong>₹99 Standard Flat Fee</strong></p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#111111]/10">
              <ShieldCheck className="h-5 w-5 text-[#FF3B00]" />
              <h2 className="font-black uppercase text-base md:text-lg tracking-wider text-[#111111]">
                3. TAMPER-PROOF UNBOXING POLICY
              </h2>
            </div>
            <p className="text-xs md:text-sm text-[#111111]/80 leading-relaxed font-medium">
              Your garments are sealed in specialized industrial-strength polythene mailer pouches designed to resist moisture, tearing, and unauthorized opening in transit. If you receive a package that appears visibly compromised or open upon courier handover, we advise you to record a short unboxing video and immediately reach out to our concierge desk.
            </p>
          </div>

        </div>

        {/* FAQs */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-[#FF3B00]" />
            <h2 className="font-black uppercase text-xl md:text-2xl text-[#111111]">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-2"
              >
                <h3 className="font-black text-sm uppercase text-[#111111]">
                  {faq.q}
                </h3>
                <p className="text-xs md:text-sm text-[#111111]/80 leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <div className="p-8 bg-[#111111] text-[#FAF7F2] border-3 border-[#111111] shadow-[6px_6px_0px_#FF3B00] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#FF3B00] block mb-1">
              NEED HELP WITH AN ACTIVE SHIPMENT?
            </span>
            <h3 className="font-black text-2xl uppercase tracking-tight text-white">
              CONTACT OUR CONCIERGE DESK
            </h3>
            <p className="text-xs text-[#FAF7F2]/70 mt-1 max-w-md">
              Send your order number and inquiry to our customer care team on Instagram or email.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#FF3B00] text-white font-black uppercase text-xs border border-[#FF3B00] hover:bg-white hover:text-[#111111] hover:border-white transition-colors flex items-center gap-2"
            >
              <span>SUPPORT DESK</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
