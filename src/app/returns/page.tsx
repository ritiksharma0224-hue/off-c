import Link from "next/link";
import { brandData } from "@/data/brand";
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export const metadata = {
  title: "Returns & Exchanges | KAPDOLOGY® Streetwear India",
  description:
    "7-day return and hassle-free size exchange policy for all KAPDOLOGY® streetwear garments. Clear steps, conditions, and FAQs.",
};

export default function ReturnsPage() {
  const steps = [
    {
      num: "01",
      title: "SUBMIT REQUEST",
      desc: "Reach out via Instagram DM (@kapdology) or email (contact@kapdology.store) within 7 days of delivery. State your Order ID (#KPD-XXXX) and whether you require a size exchange or return.",
    },
    {
      num: "02",
      title: "REVERSE PICKUP",
      desc: "Our logistics team will schedule a doorstep reverse pickup within 24 to 48 hours. Simply keep the garment safely folded in its original bag with all tags attached.",
    },
    {
      num: "03",
      title: "QC & REPLACEMENT",
      desc: "Once received at our Jaipur studio, our team verifies the garment's pristine condition. Your replacement size is dispatched within 24 hours, or a direct refund is processed.",
    },
  ];

  const faqs = [
    {
      q: "What is the return and exchange window?",
      a: "You have 7 full calendar days from the day your shipment is marked delivered by the courier partner to initiate a return or exchange request.",
    },
    {
      q: "Are size exchanges free?",
      a: "Yes. We offer one complimentary size exchange per order. If the required replacement size is sold out due to limited drop capacity, you may choose an alternate piece or receive a full refund.",
    },
    {
      q: "What conditions must the garment meet?",
      a: "The piece must be completely unworn, unwashed, free of stains/fragrances, with all exterior tags and woven labels untouched in the original packaging.",
    },
    {
      q: "How long does the refund take to reflect?",
      a: "Refunds are processed within 3 to 5 business days after the product passes inspection at our Jaipur studio. Funds are remitted to your original payment method or designated bank UPI account.",
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-12 md:py-20 select-none">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-12 pb-6 border-b-2 border-[#111111]/15 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
            <RotateCcw className="h-3.5 w-3.5 text-[#FF3B00]" />
            <span>EXCHANGE & SATISFACTION PROTOCOL</span>
          </div>
          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#111111]">
            RETURNS & EXCHANGES
          </h1>
          <p className="text-sm md:text-base font-semibold text-[#111111]/70 max-w-2xl mt-3">
            We want you to wear clothes that fit your exact silhouette. If the fit isn’t perfect, we make exchanges effortless.
          </p>
        </div>

        {/* 3 Metric Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-2">
            <span className="font-mono text-[10px] font-black text-[#FF3B00] uppercase">TIMELINE</span>
            <h3 className="font-black text-2xl uppercase text-[#111111]">7-DAY WINDOW</h3>
            <p className="text-xs text-[#111111]/70 font-medium leading-relaxed">
              Initiate your exchange or return request within 7 calendar days of delivery.
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-2">
            <span className="font-mono text-[10px] font-black text-[#FF3B00] uppercase">SIZE REPLACEMENT</span>
            <h3 className="font-black text-2xl uppercase text-[#111111]">FREE EXCHANGES</h3>
            <p className="text-xs text-[#111111]/70 font-medium leading-relaxed">
              Zero reverse courier charges on your first size exchange across India.
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-2">
            <span className="font-mono text-[10px] font-black text-[#FF3B00] uppercase">CONCIERGE BACKED</span>
            <h3 className="font-black text-2xl uppercase text-[#111111]">DOORSTEP PICKUP</h3>
            <p className="text-xs text-[#111111]/70 font-medium leading-relaxed">
              Hassle-free reverse collection coordinated directly at your delivery address.
            </p>
          </div>
        </div>

        {/* 3-Step Process Flow */}
        <div className="mb-16">
          <div className="mb-8">
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#FF3B00] block mb-1">
              HOW IT WORKS
            </span>
            <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-[#111111]">
              THE 3-STEP RETURN / EXCHANGE FLOW
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] relative flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-3xl font-black text-[#FF3B00] block mb-2">
                    {step.num}
                  </span>
                  <h3 className="font-black uppercase text-base text-[#111111] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#111111]/80 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conditions Checklist */}
        <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] mb-14 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#111111]/10">
            <ShieldCheck className="h-5 w-5 text-[#FF3B00]" />
            <h2 className="font-black uppercase text-base md:text-lg tracking-wider text-[#111111]">
              ELIGIBILITY CRITERIA
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-[#FAF7F2] border border-[#111111]/10">
              <CheckCircle2 className="h-4 w-4 text-[#00875A] shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-[#111111]">
                <strong>Original Tags Attached:</strong> All neck labels, hang tags, and technical tags must remain undamaged.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#FAF7F2] border border-[#111111]/10">
              <CheckCircle2 className="h-4 w-4 text-[#00875A] shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-[#111111]">
                <strong>Unworn & Unwashed:</strong> Garment must show zero evidence of wear, perfume scents, makeup, or detergent wash.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#FAF7F2] border border-[#111111]/10">
              <CheckCircle2 className="h-4 w-4 text-[#00875A] shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-[#111111]">
                <strong>Collector Packaging:</strong> Piece must be re-packed inside the branded ziplock pouch provided.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#FAF7F2] border border-[#111111]/10">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-[#111111]">
                <strong>Damaged Upon Arrival:</strong> Any transit-related damage must be reported within 24 hours with an unboxing photo or clip.
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-[#FF3B00]" />
            <h2 className="font-black uppercase text-xl md:text-2xl text-[#111111]">
              EXCHANGE & RETURN QUESTIONS
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

        {/* Action Link */}
        <div className="p-8 bg-[#111111] text-[#FAF7F2] border-3 border-[#111111] shadow-[6px_6px_0px_#FF3B00] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#FF3B00] block mb-1">
              READY TO INITIATE AN EXCHANGE?
            </span>
            <h3 className="font-black text-2xl uppercase tracking-tight text-white">
              CONTACT OUR CARE DESK
            </h3>
            <p className="text-xs text-[#FAF7F2]/70 mt-1 max-w-md">
              Message us your order number on Instagram or submit via our contact form.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#FF3B00] text-white font-black uppercase text-xs border border-[#FF3B00] hover:bg-white hover:text-[#111111] hover:border-white transition-colors flex items-center gap-2"
            >
              <span>SUBMIT REQUEST</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
