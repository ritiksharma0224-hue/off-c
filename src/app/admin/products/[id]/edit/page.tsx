"use client";

import React, { use, useState, useEffect } from "react";
import ProductEditor from "@/components/admin/ProductEditor";
import { MasterProduct } from "@/lib/db/types";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<MasterProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setError(data.error || "Product not found");
        }
      } catch {
        setError("Error loading product");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-[#7B828F] uppercase tracking-widest">
        FETCHING MASTER PRODUCT DETAILS...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-24 text-center space-y-2">
        <h3 className="font-bold text-red-400 text-sm uppercase font-mono">PRODUCT NOT FOUND</h3>
        <p className="text-xs text-[#7B828F]">{error || `Product with ID ${resolvedParams.id} could not be loaded.`}</p>
      </div>
    );
  }

  return <ProductEditor initialProduct={product} isNew={false} />;
}
