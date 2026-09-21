"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FolderTree, Plus, Check, RefreshCw } from "lucide-react";
import { CollectionEntity } from "@/lib/db/types";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<(CollectionEntity & { itemCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCol, setNewCol] = useState({
    name: "",
    slug: "",
    description: "",
    coverImage: "/images/hero.png",
    startDate: "2026-10-01",
    featured: true,
  });
  const [notice, setNotice] = useState<string | null>(null);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/collections");
      const data = await res.json();
      if (data.success) setCollections(data.collections);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCol),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Created collection ${data.collection.name}`);
        setTimeout(() => setNotice(null), 3000);
        setShowAddModal(false);
        fetchCollections();
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
            DROP CADENCE
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            COLLECTIONS & DROPS
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Numbered capsule release drops (DROP 001, upcoming seasonal capsules).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCollections}
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
            <span>ADD COLLECTION / DROP</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Grid of Collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden flex flex-col justify-between"
          >
            <div className="relative w-full h-44 bg-[#0E1015] overflow-hidden">
              <Image src={col.coverImage} alt={col.name} fill sizes="400px" className="object-cover" />
              <div className="absolute top-3 left-3 bg-[#FF3B00] text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                {col.status}
              </div>
              <div className="absolute top-3 right-3 bg-[#111111] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {col.itemCount} DESIGNS
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-black text-sm uppercase text-white tracking-wider">{col.name}</h3>
              <p className="font-mono text-[10px] text-[#FF3B00]">SLUG: {col.slug}</p>
              <p className="text-xs text-[#7B828F] leading-relaxed">{col.description}</p>
              {col.startDate && (
                <div className="pt-2 border-t border-[#262B36] font-mono text-[10px] text-[#7B828F]">
                  LAUNCH: {col.startDate}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#14171F] border border-[#262B36] rounded-lg p-6 space-y-4">
            <h3 className="font-black text-lg text-white uppercase pb-2 border-b border-[#262B36]">
              CREATE NEW DROP / COLLECTION
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 font-mono">
              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">COLLECTION NAME *</label>
                <input
                  type="text"
                  required
                  value={newCol.name}
                  onChange={(e) =>
                    setNewCol({
                      ...newCol,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    })
                  }
                  placeholder="e.g. DROP 002"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs uppercase focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">SLUG *</label>
                <input
                  type="text"
                  required
                  value={newCol.slug}
                  onChange={(e) => setNewCol({ ...newCol, slug: e.target.value })}
                  placeholder="drop-002"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  value={newCol.description}
                  onChange={(e) => setNewCol({ ...newCol, description: e.target.value })}
                  placeholder="Second chapter release..."
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-sans focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#9AA0A6] uppercase mb-1">START DATE</label>
                <input
                  type="date"
                  value={newCol.startDate}
                  onChange={(e) => setNewCol({ ...newCol, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
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
