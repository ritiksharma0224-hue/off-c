"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Copy,
  Archive,
  Trash2,
  ExternalLink,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Package,
} from "lucide-react";
import { MasterProduct, ProductStatus } from "@/lib/db/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<MasterProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [familyFilter, setFamilyFilter] = useState<string>("ALL");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?admin=true&includeArchived=true");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}?action=duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setActionNotice(`Duplicated product as draft: ${data.product.name}`);
        setTimeout(() => setActionNotice(null), 3000);
        fetchProducts();
      }
    } catch {
      // Error
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}?action=archive`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setActionNotice("Product archived successfully.");
        setTimeout(() => setActionNotice(null), 3000);
        fetchProducts();
      }
    } catch {
      // Error
    }
  };

  const handleDeletePermanent = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}?action=permanent`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirmId(null);
        setActionNotice("Product permanently removed.");
        setTimeout(() => setActionNotice(null), 3000);
        fetchProducts();
      }
    } catch {
      // Error
    }
  };

  // Filter products
  const filtered = products.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variants.some((v) => v.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesCat = categoryFilter === "ALL" || p.categorySlug === categoryFilter;
    const matchesFam = familyFilter === "ALL" || p.designFamilyId === familyFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCat && matchesFam;
  });

  // Extract unique categories and design families for filter dropdowns
  const categories = Array.from(new Set(products.map((p) => p.categorySlug)));
  const designFamilies = Array.from(new Set(products.map((p) => p.designFamilyId)));

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">ACTIVE</span>;
      case "DRAFT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-500/15 text-gray-300 border border-gray-500/30">DRAFT</span>;
      case "HIDDEN":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">HIDDEN</span>;
      case "RESERVATION OPEN":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF3B00]/15 text-[#FF3B00] border border-[#FF3B00]/30">RESERVATIONS OPEN</span>;
      case "PREORDER":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">PREORDER</span>;
      case "OUT OF STOCK":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">OUT OF STOCK</span>;
      case "SOLD OUT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">SOLD OUT</span>;
      case "ARCHIVED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30">ARCHIVED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-500/15 text-gray-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest block mb-1">
            CATALOG ARCHITECTURE
          </span>
          <h1 className="font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
            MASTER PRODUCTS
          </h1>
          <p className="text-xs text-[#7B828F] mt-1 font-medium">
            The single source of truth powering every storefront card, lookbook, and cart.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            title="Refresh Products"
            className="p-2.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-[#FF3B00] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e03400] transition-colors flex items-center gap-2 shadow-[2px_2px_0px_#000]"
          >
            <Plus className="h-4 w-4" />
            <span>ADD PRODUCT</span>
          </Link>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="p-4 bg-[#14171F] border border-[#262B36] rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7B828F]" />
          <input
            type="text"
            placeholder="Search by name, slug, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white placeholder-[#7B828F] focus:outline-none focus:border-[#FF3B00]"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white focus:outline-none focus:border-[#FF3B00]"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
            <option value="RESERVATION OPEN">RESERVATION OPEN</option>
            <option value="PREORDER">PREORDER</option>
            <option value="OUT OF STOCK">OUT OF STOCK</option>
            <option value="HIDDEN">HIDDEN</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white focus:outline-none focus:border-[#FF3B00]"
          >
            <option value="ALL">ALL CATEGORIES</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Design Family Filter */}
        <div>
          <select
            value={familyFilter}
            onChange={(e) => setFamilyFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white focus:outline-none focus:border-[#FF3B00]"
          >
            <option value="ALL">ALL DESIGN FAMILIES</option>
            {designFamilies.map((f) => (
              <option key={f} value={f}>
                {f.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table (Desktop) & Cards (Mobile) */}
      <div className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden">
        
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-[#7B828F] uppercase tracking-widest">
            LOADING MASTER PRODUCT CATALOG...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Package className="h-8 w-8 text-[#7B828F] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">NO PRODUCTS MATCHING CRITERIA</h3>
            <p className="text-xs text-[#7B828F]">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#262B36] bg-[#10131A] text-[10px] font-mono text-[#7B828F] uppercase tracking-wider">
                  <th className="py-3 px-4">ITEM</th>
                  <th className="py-3 px-4">CATEGORY / FAMILY</th>
                  <th className="py-3 px-4">PRICE</th>
                  <th className="py-3 px-4">STOCK (PHYS/AVAIL)</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">UPDATED</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262B36]">
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#1A1E27] transition-colors group"
                  >
                    {/* Item Thumbnail & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 bg-black border border-[#262B36] rounded overflow-hidden shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="font-bold text-white hover:text-[#FF3B00] transition-colors truncate block text-sm"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#7B828F] mt-0.5">
                            <span>ID: {product.id}</span>
                            <span>•</span>
                            <span className="text-[#FF3B00]">{product.gsm}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Design Family */}
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className="block text-white font-medium">{product.categoryName}</span>
                      <span className="text-[#FF3B00] font-bold text-[10px] uppercase">
                        {product.designFamilyName}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-3 px-4 font-mono">
                      <span className="text-white font-bold text-sm">₹{product.price}</span>
                      {product.compareAtPrice && (
                        <span className="text-[10px] text-[#7B828F] line-through block">
                          ₹{product.compareAtPrice}
                        </span>
                      )}
                    </td>

                    {/* Stock Overview */}
                    <td className="py-3 px-4 font-mono">
                      <div className="text-xs">
                        <span className="text-white font-bold">{product.totalPhysicalStock}</span>
                        <span className="text-[#7B828F]"> / </span>
                        <span className={`font-bold ${product.totalAvailableStock <= 5 ? "text-amber-400" : "text-emerald-400"}`}>
                          {product.totalAvailableStock} avail
                        </span>
                      </div>
                      <div className="text-[10px] text-[#7B828F] mt-0.5">
                        {product.variants.length} variant(s)
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {getStatusBadge(product.status)}
                    </td>

                    {/* Updated Timestamp */}
                    <td className="py-3 px-4 font-mono text-[10px] text-[#7B828F]">
                      {new Date(product.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          title="Edit Product"
                          className="p-1.5 bg-[#0E1015] hover:bg-[#FF3B00] text-[#9AA0A6] hover:text-white rounded transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(product.id)}
                          title="Duplicate Product"
                          className="p-1.5 bg-[#0E1015] hover:bg-[#1E232E] text-[#9AA0A6] hover:text-white rounded transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          title="View on Storefront"
                          className="p-1.5 bg-[#0E1015] hover:bg-[#1E232E] text-[#9AA0A6] hover:text-white rounded transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        {product.status !== "ARCHIVED" ? (
                          <button
                            onClick={() => handleArchive(product.id)}
                            title="Archive Product"
                            className="p-1.5 bg-[#0E1015] hover:bg-zinc-700 text-[#9AA0A6] hover:text-white rounded transition-colors"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            title="Permanent Delete"
                            className="p-1.5 bg-[#0E1015] hover:bg-red-600 text-red-400 hover:text-white rounded transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#14171F] border border-[#262B36] rounded-lg p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-bold text-white uppercase text-base">PERMANENT DELETION</h3>
            <p className="text-xs text-[#7B828F] leading-relaxed">
              Are you sure you want to permanently delete this product? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-[#1E232E] text-white text-xs font-bold uppercase rounded hover:bg-[#262B36]"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleDeletePermanent(deleteConfirmId)}
                className="flex-1 py-2 bg-red-600 text-white text-xs font-bold uppercase rounded hover:bg-red-700"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
