"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Layers, Plus, Check, RefreshCw } from "lucide-react";
import { GarmentCategoryEntity } from "@/lib/db/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<(GarmentCategoryEntity & { itemCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    image: "/images/hero.png",
    fitNote: "Signature Oversized Cut",
  });
  const [notice, setNotice] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Created category ${data.category.name}`);
        setTimeout(() => setNotice(null), 3000);
        setShowAddModal(false);
        setNewCat({
          name: "",
          slug: "",
          shortDescription: "",
          fullDescription: "",
          image: "/images/hero.png",
          fitNote: "Signature Oversized Cut",
        });
        fetchCategories();
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
            GARMENT TAXONOMY
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            CATEGORIES
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Physical garment types (Oversized Tees, Boxy Tees, Graphic Tees, Shirts, Bottoms, Hoodies).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
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
            <span>ADD CATEGORY</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden flex flex-col justify-between"
          >
            <div className="relative w-full h-44 bg-[#0E1015] overflow-hidden">
              <Image src={cat.image} alt={cat.name} fill sizes="400px" className="object-cover" />
              <div className="absolute top-3 left-3 bg-[#111111] text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                {cat.displayNumber}
              </div>
              <div className="absolute top-3 right-3 bg-[#FF3B00] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {cat.itemCount} DESIGNS
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-black text-sm uppercase text-white tracking-wider">{cat.name}</h3>
              <p className="font-mono text-[10px] text-[#FF3B00]">SLUG: {cat.slug}</p>
              <p className="text-xs text-[#7B828F] leading-relaxed">{cat.shortDescription}</p>
              <div className="pt-2 border-t border-[#262B36] flex items-center justify-between font-mono text-[10px] text-[#7B828F]">
                <span>FIT: {cat.fitNote}</span>
                <span className="text-emerald-400 font-bold">{cat.status}</span>
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
              CREATE GARMENT CATEGORY
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 font-mono">
              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">CATEGORY NAME *</label>
                <input
                  type="text"
                  required
                  value={newCat.name}
                  onChange={(e) =>
                    setNewCat({
                      ...newCat,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    })
                  }
                  placeholder="e.g. KNITWEAR"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">SLUG *</label>
                <input
                  type="text"
                  required
                  value={newCat.slug}
                  onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                  placeholder="knitwear"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">SHORT DESCRIPTION</label>
                <input
                  type="text"
                  value={newCat.shortDescription}
                  onChange={(e) => setNewCat({ ...newCat, shortDescription: e.target.value })}
                  placeholder="Heavyweight cotton knitwear essentials"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-sans focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">FIT NOTE</label>
                <input
                  type="text"
                  value={newCat.fitNote}
                  onChange={(e) => setNewCat({ ...newCat, fitNote: e.target.value })}
                  placeholder="Boxy Drop Shoulder"
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
