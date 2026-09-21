import Link from "next/link";
import { brandData } from "@/data/brand";
import { ShieldCheck, Lock, Eye, Server, UserCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | KAPDOLOGY® Streetwear India",
  description:
    "Learn how KAPDOLOGY® protects, processes, and respects your personal data. Transparent privacy and data protection standards.",
};

export default function PrivacyPage() {
  const lastUpdated = "September 2026";

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-12 md:py-20 select-none">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-12 pb-6 border-b-2 border-[#111111]/15 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-[#FF3B00]" />
            <span>DATA INTEGRITY & SECURITY PROTOCOL</span>
          </div>
          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#111111]">
            PRIVACY POLICY
          </h1>
          <p className="text-xs font-mono font-bold text-[#111111]/60 mt-2">
            LAST REVISED: {lastUpdated} • JURISDICTION: JAIPUR, RAJASTHAN, INDIA
          </p>
          <p className="text-sm md:text-base font-semibold text-[#111111]/70 mt-4">
            At KAPDOLOGY® (operated under kapdology.store), we respect your privacy and are committed to complete transparency regarding how your personal information is gathered, utilized, and safeguarded.
          </p>
        </div>

        {/* Quick Privacy Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
            <Lock className="h-4 w-4 text-[#FF3B00]" />
            <h4 className="font-black text-xs uppercase text-[#111111]">ZERO PAYMENT STORAGE</h4>
            <p className="text-[11px] text-[#111111]/70 font-medium">
              We never store your credit card numbers, CVVs, or bank netbanking pins.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
            <Eye className="h-4 w-4 text-[#FF3B00]" />
            <h4 className="font-black text-xs uppercase text-[#111111]">NO DATA BROKERAGE</h4>
            <p className="text-[11px] text-[#111111]/70 font-medium">
              We never sell or rent your personal data to ad networks or third parties.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
            <UserCheck className="h-4 w-4 text-[#FF3B00]" />
            <h4 className="font-black text-xs uppercase text-[#111111]">YOUR DATA RIGHTS</h4>
            <p className="text-[11px] text-[#111111]/70 font-medium">
              Request full export or permanent deletion of your customer profile anytime.
            </p>
          </div>
        </div>

        {/* Detailed Clauses */}
        <div className="space-y-8 text-xs md:text-sm text-[#111111]/80 leading-relaxed font-medium">
          
          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              1. INFORMATION WE COLLECT
            </h3>
            <p>
              When you browse our storefront, place a drop pre-order, or communicate with our studio concierge, we collect information necessary to fulfill our service:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#111111]/80">
              <li><strong>Contact Information:</strong> Full name, shipping destination, billing address, phone number, and email address.</li>
              <li><strong>Order History:</strong> Specific drop garments selected, sizes, quantities, and order timestamps.</li>
              <li><strong>Technical Metadata:</strong> IP address, device type, and browser parameters to ensure responsive performance and prevent bot traffic during high-velocity drops.</li>
            </ul>
          </div>

          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              2. HOW WE USE YOUR INFORMATION
            </h3>
            <p>
              Your data is collected strictly for operational and commerce purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#111111]/80">
              <li>Processing, packing, and dispatching your streetwear order from our Jaipur facility.</li>
              <li>Transmitting transactional notifications, including order confirmations, dispatch updates, and AWB tracking numbers.</li>
              <li>Handling size exchanges, returns, and customer care inquiries via WhatsApp or email.</li>
              <li>Alerting you to future limited capsule drops and lookbooks only if you opt-in.</li>
            </ul>
          </div>

          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              3. PAYMENT GATEWAY & FINANCIAL SECURITY
            </h3>
            <p>
              KAPDOLOGY® uses a decoupled checkout architecture. All financial transactions are conducted through RBI-compliant, PCI-DSS Level 1 certified payment gateways. 
            </p>
            <p>
              At no point do our servers collect, view, or record credit card numbers, CVVs, or UPI PINs. In pre-order mode, our team communicates directly to coordinate delivery confirmation before payment capture.
            </p>
          </div>

          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              4. SHARING WITH LOGISTICS PARTNERS
            </h3>
            <p>
              We disclose necessary delivery details (name, delivery address, contact number) solely to our contracted pan-India courier partners (such as BlueDart, Delhivery, DTDC) to ensure timely doorstep transit. These partners are legally prohibited from utilizing your details for any purpose other than executing delivery.
            </p>
          </div>

          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              5. COOKIES & LOCAL STORAGE
            </h3>
            <p>
              Our web application utilizes client-side local storage and essential session cookies to remember your bag contents, active size selections, and preference parameters across visits. You can configure your browser to reject cookies, though doing so may disrupt your shopping bag functionality.
            </p>
          </div>

          <div className="p-6 md:p-8 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
            <h3 className="font-black uppercase text-base text-[#111111] tracking-wider">
              6. DATA RETENTION & USER RIGHTS
            </h3>
            <p>
              You maintain full dominion over your personal information. Under Indian Information Technology rules and global best practices, you may at any time request:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#111111]/80">
              <li>A digital copy of all customer records retained under your email.</li>
              <li>Correction or updating of any inaccurate contact details.</li>
              <li>Permanent erasure of your customer account and contact records.</li>
            </ul>
            <p className="pt-2">
              To exercise any of these rights, simply email our data privacy desk at{" "}
              <a href={`mailto:${brandData.email}`} className="text-[#FF3B00] font-bold underline">
                {brandData.email}
              </a>.
            </p>
          </div>

        </div>

        {/* Contact Footer */}
        <div className="mt-12 p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-black uppercase text-sm text-[#111111]">HAVE PRIVACY INQUIRIES?</h4>
            <p className="text-xs text-[#111111]/70 mt-0.5">
              Contact our compliance team in Jaipur directly at {brandData.email}
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
