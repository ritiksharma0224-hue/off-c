import Link from "next/link";
import { brandData } from "@/data/brand";
import { FileText, ShieldAlert, Scale, AlertCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | KAPDOLOGY® Streetwear India",
  description:
    "Terms of service, drop reservation conditions, intellectual property rules, and governing jurisdiction for KAPDOLOGY® garments.",
};

export default function TermsPage() {
  const lastUpdated = "September 2026";

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-12 md:py-20 select-none">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-12 pb-6 border-b-2 border-[#111111]/15 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
            <FileText className="h-3.5 w-3.5 text-[#FF3B00]" />
            <span>LEGAL ARCHITECTURE & DROP PROTOCOL</span>
          </div>
          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#111111]">
            TERMS OF SERVICE
          </h1>
          <p className="text-xs font-mono font-bold text-[#111111]/60 mt-2">
            LAST REVISED: {lastUpdated} • JURISDICTION: JAIPUR, RAJASTHAN, INDIA
          </p>
          <p className="text-sm md:text-base font-semibold text-[#111111]/70 mt-4">
            Welcome to KAPDOLOGY® (kapdology.store). By accessing our website, placing an order, or participating in Drop 001, you agree to be bound by the following terms, conditions, and policies.
          </p>
        </div>

        {/* 3 Notice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
            <ShieldAlert className="h-4 w-4 text-[#FF3B00]" />
            <h4 className="font-black text-xs uppercase text-[#111111]">LIMITED DROPS</h4>
            <p className="text-[11px] text-[#111111]/70 font-medium">
              Pieces are manufactured in numbered runs; items in cart are not held indefinitely.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
            <Scale className="h-4 w-4 text-[#FF3B00]" />
            <h4 className="font-black text-xs uppercase text-[#111111]">GOVERNING LAW</h4>
            <p className="text-[11px] text-[#111111]/70 font-medium">
              Governed by the laws of India, subject to the jurisdiction of Jaipur courts.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
            <AlertCircle className="h-4 w-4 text-[#FF3B00]" />
            <h4 className="font-black text-xs uppercase text-[#111111]">IP PROTECTION</h4>
            <p className="text-[11px] text-[#111111]/70 font-medium">
              All silhouettes, designs, and typography are registered proprietary marks.
            </p>
          </div>
        </div>

        {/* Detailed Terms Clauses */}
        <div className="space-y-8 text-xs md:text-sm text-[#111111]/80 leading-relaxed font-medium">
          
          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              1. GENERAL CONDITIONS & ELIGIBILITY
            </h3>
            <p>
              By utilizing this site, you affirm that you are at least the age of majority in your jurisdiction, or that you have given parental consent to any minor dependents to use this site under your supervision. We reserve the right to refuse service or cancel reservations to anyone for violation of these terms at any time.
            </p>
          </div>

          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              2. DROP RESERVATIONS & INVENTORY ALLOCATION
            </h3>
            <p>
              KAPDOLOGY® operates on an intentional limited-batch release cadence (Drops). Placing an item in your shopping bag does not permanently guarantee inventory reservation until the order or pre-order reservation has been completed.
            </p>
            <p>
              In rare circumstances where inventory mismatch or quality control defects are discovered prior to dispatch, KAPDOLOGY® reserves the right to cancel the order and provide an immediate full refund or exchange option.
            </p>
          </div>

          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              3. PRICING & ACCURACY OF INFORMATION
            </h3>
            <p>
              All prices displayed on kapdology.store are in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST). While we strive for absolute accuracy in garment measurements, GSM specs, and color representations, slight variations may arise depending on monitor calibrations or the artisanal wash techniques utilized.
            </p>
            <p>
              Prices for our products are subject to modification without notice. We reserve the right to modify or discontinue any drop garment at any time.
            </p>
          </div>

          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              4. INTELLECTUAL PROPERTY RIGHTS
            </h3>
            <p>
              The KAPDOLOGY® name, wordmark, logo, custom garment silhouettes, graphic illustrations, lookbook editorial imagery, audio-visual materials, and digital UI components are the exclusive proprietary property of KAPDOLOGY®.
            </p>
            <p>
              You agree not to reproduce, duplicate, copy, sell, trade, or exploit any portion of the brand assets, garment artwork, or digital storefront without express written authorization from the founders.
            </p>
          </div>

          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              5. PROHIBITED USES
            </h3>
            <p>
              You are expressly prohibited from using this platform:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#111111]/80">
              <li>To deploy automated checkout bots, scrapers, or scripts designed to exhaust drop inventory unfairly.</li>
              <li>To transmit malicious computer code, viruses, or disruptive malware.</li>
              <li>To solicit unauthorized commercial transactions or misrepresent affiliation with KAPDOLOGY®.</li>
            </ul>
          </div>

          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              6. GOVERNING LAW & ARBITRATION
            </h3>
            <p>
              These Terms of Service and any separate agreements whereby we provide you services or garments shall be governed by and construed in accordance with the substantive laws of India.
            </p>
            <p>
              Any disputes, controversies, or claims arising out of or relating to these terms or transactions on this website shall be subject to the exclusive jurisdiction of the competent courts situated in Jaipur, Rajasthan, India.
            </p>
          </div>

        </div>

        {/* Contact Footer */}
        <div className="mt-12 p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-black uppercase text-sm text-[#111111]">LEGAL INQUIRIES?</h4>
            <p className="text-xs text-[#111111]/70 mt-0.5">
              Address legal or compliance inquiries to {brandData.email}
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-[#111111] text-white font-mono text-xs font-bold uppercase hover:bg-[#FF3B00] transition-colors"
          >
            CONTACT DESK
          </Link>
        </div>

      </div>
    </div>
  );
}
