"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Plus, Check, RefreshCw } from "lucide-react";
import { DesignFamilyEntity } from "@/lib/db/types";

export default function AdminDesignFamiliesPage() {
  const [families, setFamilies] = useState<(DesignFamilyEntity & { itemCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFamily, setNewFamily] = useState({
    name: "",
    slug: "",
    subtitle: "",
    description: "",
    featuresInput: "",
    tag: "CORE LINE",
    coverImage: "/images/hero.png",
  });
  const [notice, setNotice] = useState<string | null>(null);

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/design-families");
      const data = await res.json();
      if (data.success) setFamilies(data.designFamilies);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const features = newFamily.featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch("/api/design-families", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFamily.name.toUpperCase(),
          slug: newFamily.slug.toLowerCase(),
          subtitle: newFamily.subtitle.toUpperCase(),
          description: newFamily.description,
          features,
          tag: newFamily.tag,
          coverImage: newFamily.coverImage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Created design family ${data.designFamily.name}`);
        setTimeout(() => setNotice(null), 3000);
        setShowAddModal(false);
        setNewFamily({
          name: "",
          slug: "",
          subtitle: "",
          description: "",
          featuresInput: "",
          tag: "CORE LINE",
          coverImage: "/images/hero.png",
        });
        fetchFamilies();
      }
    } catch {
      // Error
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest block mb-1">
            CREATIVE DESIGN ESSENCE
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            DESIGN FAMILIES
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Stylistic DNA families (IDENTITY, CHAOS, MINIMAL, TECHNICAL, RESTRICTED, GLOBAL).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFamilies}
            title="Refresh"
            className="p-2.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#FF3B00] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e03400] transition-colors flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <Plus className="h-4 w-4" />
            <span>ADD DESIGN FAMILY</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Grid of Design Families */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {families.map((fam) => (
          <div
            key={fam.id}
            className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden flex flex-col justify-between"
          >
            <div className="relative w-full h-44 bg-[#0E1015] overflow-hidden">
              <Image src={fam.coverImage} alt={fam.name} fill sizes="400px" className="object-cover" />
              <div className="absolute top-3 left-3 bg-[#111111] text-[#FF3B00] font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                {fam.tag}
              </div>
              <div className="absolute top-3 right-3 bg-[#FF3B00] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {fam.itemCount} DESIGNS
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-black text-sm uppercase text-white tracking-wider">{fam.name}</h3>
              <p className="font-mono text-[10px] text-[#FF3B00] truncate">{fam.subtitle}</p>
              <p className="text-xs text-[#7B828F] leading-relaxed">{fam.description}</p>
              <div className="flex flex-wrap gap-1 pt-2">
                {fam.features.map((f, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 bg-[#0E1015] border border-[#262B36] rounded text-[9px] font-mono text-[#7B828F]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#14171F] border border-[#262B36] rounded-lg p-6 space-y-4">
            <h3 className="font-black text-lg text-white uppercase pb-2 border-b border-[#262B36]">
              CREATE DESIGN FAMILY
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 font-mono">
              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">FAMILY NAME *</label>
                <input
                  type="text"
                  required
                  value={newFamily.name}
                  onChange={(e) =>
                    setNewFamily({
                      ...newFamily,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    })
                  }
                  placeholder="e.g. MONOLITH"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs uppercase focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">SUBTITLE *</label>
                <input
                  type="text"
                  required
                  value={newFamily.subtitle}
                  onChange={(e) => setNewFamily({ ...newFamily, subtitle: e.target.value })}
                  placeholder="HEAVY TERRY SILHOUETTES & RAW CUTS"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs uppercase focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  value={newFamily.description}
                  onChange={(e) => setNewFamily({ ...newFamily, description: e.target.value })}
                  placeholder="Atmospheric streetwear silhouettes..."
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-sans focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">FEATURES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={newFamily.featuresInput}
                  onChange={(e) => setNewFamily({ ...newFamily, featuresInput: e.target.value })}
                  placeholder="Terry Weave, Raw Hem, Acid Patina"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-sans focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-[#1E232E] text-white font-bold uppercase rounded text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#FF3B00] text-white font-bold uppercase rounded text-xs hover:bg-[#e03400]"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
