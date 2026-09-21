"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { MediaAsset } from "@/lib/db/types";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<MediaAsset | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success) setMediaList(data.media);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorNotice(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Uploaded ${data.asset.filename}`);
        setTimeout(() => setNotice(null), 3000);
        fetchMedia();
      } else {
        setErrorNotice(data.error || "Failed to upload asset");
      }
    } catch {
      setErrorNotice("Network error uploading file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (asset: MediaAsset, force = false) => {
    try {
      const res = await fetch(`/api/media?id=${asset.id}&force=${force}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirmTarget(null);
        setNotice(`Deleted ${asset.filename}`);
        setTimeout(() => setNotice(null), 3000);
        fetchMedia();
      } else {
        setErrorNotice(data.error);
      }
    } catch {
      setErrorNotice("Error deleting asset");
    }
  };

  const filtered = mediaList.filter(
    (m) =>
      searchQuery === "" ||
      m.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.usedBy.some((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest block mb-1">
            DIGITAL ASSET MANAGEMENT
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            MEDIA LIBRARY
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            Centralized lookbook photography, garment photos, and used-by cross-referencing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            title="Refresh"
            className="p-2.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-[#FF3B00] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e03400] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-[2px_2px_0px_#000]"
          >
            <Upload className="h-4 w-4" />
            <span>{uploading ? "UPLOADING..." : "UPLOAD ASSET"}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="p-4 bg-[#14171F] border border-[#262B36] rounded-lg">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7B828F]" />
          <input
            type="text"
            placeholder="Search by filename or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white placeholder-[#7B828F] focus:outline-none focus:border-[#FF3B00]"
          />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center font-mono text-xs text-[#7B828F] uppercase">
            LOADING MEDIA ASSETS...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center font-mono text-xs text-[#7B828F] uppercase">
            NO ASSETS FOUND
          </div>
        ) : (
          filtered.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden flex flex-col justify-between group hover:border-[#FF3B00] transition-colors"
            >
              <div className="relative aspect-square bg-[#0E1015] overflow-hidden">
                <Image src={asset.url} alt={asset.filename} fill sizes="250px" className="object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(asset.url)}
                    className="p-2 bg-[#0E1015] text-white rounded hover:bg-[#FF3B00] transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === asset.url ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#0E1015] text-white rounded hover:bg-[#FF3B00] transition-colors"
                    title="View Fullsize"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmTarget(asset)}
                    className="p-2 bg-[#0E1015] text-red-400 rounded hover:bg-red-600 hover:text-white transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-1.5 font-mono">
                <span className="text-white font-bold block truncate text-xs" title={asset.filename}>
                  {asset.filename}
                </span>

                {/* Used By Badge */}
                <div className="text-[10px] text-[#7B828F]">
                  {asset.usedBy.length > 0 ? (
                    <span className="text-emerald-400 font-bold block truncate" title={asset.usedBy.map((u) => u.name).join(", ")}>
                      • USED BY: {asset.usedBy[0].name} {asset.usedBy.length > 1 ? `(+${asset.usedBy.length - 1})` : ""}
                    </span>
                  ) : (
                    <span className="text-zinc-500 block">• UNASSIGNED</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#7B828F] pt-1 border-t border-[#262B36]">
                  <span>{(asset.sizeBytes / 1024).toFixed(0)} KB</span>
                  <span>{asset.mimeType.replace("image/", "").toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#14171F] border border-[#262B36] rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-red-500/10 text-red-500 border border-red-500/30">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase text-sm">DELETE MEDIA ASSET?</h3>
                <p className="font-mono text-xs text-[#7B828F] truncate max-w-xs">
                  {deleteConfirmTarget.filename}
                </p>
              </div>
            </div>

            {deleteConfirmTarget.usedBy.length > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded space-y-1">
                <span className="font-mono text-[10px] font-bold text-amber-400 uppercase block">
                  WARNING: ASSET IN ACTIVE USE
                </span>
                <p className="text-xs text-amber-200/80">
                  This image is currently assigned to:{" "}
                  <strong>{deleteConfirmTarget.usedBy.map((u) => u.name).join(", ")}</strong>. Deleting it will result in broken storefront card images!
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="flex-1 py-2 bg-[#1E232E] text-white font-bold uppercase rounded hover:bg-[#262B36]"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmTarget, true)}
                className="flex-1 py-2 bg-red-600 text-white font-bold uppercase rounded hover:bg-red-700"
              >
                CONFIRM DELETE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
