"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kapdology.store");
  const [password, setPassword] = useState("kapdology2026");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid credentials. Please verify email and password.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("Network error while connecting to authorization gateway.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1015] text-[#E4E6EB] flex flex-col items-center justify-center p-4 select-none font-sans">
      <div className="w-full max-w-md bg-[#14171F] border border-[#262B36] shadow-2xl p-8 rounded-lg relative overflow-hidden">
        
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF3B00]" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#FF3B00]/10 border border-[#FF3B00]/30 flex items-center justify-center mx-auto mb-3">
            <Lock className="h-6 w-6 text-[#FF3B00]" />
          </div>
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#FF3B00] block mb-1">
            PROTECTED SYSTEM
          </span>
          <h1 className="font-black text-2xl uppercase tracking-tight text-white">
            KAPDOLOGY® ADMIN
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Single Source of Truth Management Cockpit
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-[#9AA0A6] mb-1.5">
              ADMIN EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0E1015] border border-[#262B36] rounded text-sm text-white focus:outline-none focus:border-[#FF3B00] font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-[#9AA0A6] mb-1.5">
              SECURE ACCESS KEY / PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0E1015] border border-[#262B36] rounded text-sm text-white focus:outline-none focus:border-[#FF3B00] font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FF3B00] text-white font-bold uppercase tracking-wider text-xs rounded hover:bg-[#e03400] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
          >
            <span>{loading ? "AUTHENTICATING..." : "ACCESS ADMIN DASHBOARD"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Developer / Demo Default Credentials Callout */}
        <div className="mt-8 p-3 bg-[#1A1E27] border border-[#262B36] rounded text-[11px] font-mono text-[#7B828F] space-y-1">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>DEFAULT CREDENTIALS:</span>
          </div>
          <p>Email: <strong className="text-[#FF3B00]">admin@kapdology.store</strong></p>
          <p>Password: <strong className="text-white">kapdology2026</strong></p>
        </div>

      </div>
    </div>
  );
}
