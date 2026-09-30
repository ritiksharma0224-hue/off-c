"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  Trash2,
  Check,
  Star,
  ArrowLeft,
  Save,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Plus,
  X,
  Layers,
  CalendarCheck,
  Clock,
  Boxes,
  Eye,
} from "lucide-react";
import {
  MasterProduct,
  ProductStatus,
  ProductVariant,
  ProductImageSlot,
  GarmentCategoryEntity,
  DesignFamilyEntity,
  CollectionEntity,
} from "@/lib/db/types";

interface ProductEditorProps {
  initialProduct?: MasterProduct | null;
  isNew?: boolean;
}

export default function ProductEditor({ initialProduct, isNew = false }: ProductEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories, Families, Collections options
  const [categories, setCategories] = useState<GarmentCategoryEntity[]>([]);
  const [designFamilies, setDesignFamilies] = useState<DesignFamilyEntity[]>([]);
  const [collections, setCollections] = useState<CollectionEntity[]>([]);

  // Form State
  const [activeTab, setActiveTab] = useState<"general" | "pricing" | "specs" | "variants" | "reservations" | "preorders">("general");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Product Fields
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [fullDescription, setFullDescription] = useState(initialProduct?.fullDescription || "");
  const [price, setPrice] = useState<number>(initialProduct?.price || 1299);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(initialProduct?.compareAtPrice);
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || "ACTIVE");
  const [badge, setBadge] = useState(initialProduct?.badge || "");
  const [isNewBadge, setIsNewBadge] = useState(initialProduct?.isNew ?? true);
  const [isPopular, setIsPopular] = useState(initialProduct?.isPopular ?? false);
  const [featured, setFeatured] = useState(initialProduct?.featured ?? false);

  // Classification
  const [categoryId, setCategoryId] = useState(initialProduct?.categorySlug || "oversized-tees");
  const [designFamilyId, setDesignFamilyId] = useState(initialProduct?.designFamilyId || "global");
  const [collectionId, setCollectionId] = useState(initialProduct?.collectionId || "drop-001");
  const [tagsInput, setTagsInput] = useState((initialProduct?.tags || ["streetwear"]).join(", "));

  // Garment Specs
  const [fabric, setFabric] = useState(initialProduct?.fabric || "100% Combed Heavyweight Cotton");
  const [gsm, setGsm] = useState(initialProduct?.gsm || "240 GSM");
  const [fit, setFit] = useState(initialProduct?.fit || "Signature Oversized Box Cut");
  const [printMethod, setPrintMethod] = useState(initialProduct?.printMethod || "High-Density Screenprint");
  const [care, setCare] = useState(initialProduct?.care || "Machine wash cold inside-out. Hang dry in shade.");
  const [detailsInput, setDetailsInput] = useState((initialProduct?.details || []).join("\n"));
  const [gender, setGender] = useState<"UNISEX" | "MEN" | "WOMEN">(initialProduct?.gender || "UNISEX");

  // Visual Assets
  const [images, setImages] = useState<string[]>(initialProduct?.images || [initialProduct?.image || "/images/hero.png"]);
  const [primaryImage, setPrimaryImage] = useState<string>(initialProduct?.image || images[0]);
  const [hoverImage, setHoverImage] = useState<string>(images[1] || images[0]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null);

  // Sizes & Variants
  const [availableSizes, setAvailableSizes] = useState<string[]>(
    initialProduct?.availableSizes || ["S", "M", "L", "XL"]
  );
  const [newSizeInput, setNewSizeInput] = useState("");
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialProduct?.variants || [
      {
        id: "var-1",
        productId: initialProduct?.id || "new",
        size: "S",
        color: "Standard",
        sku: "KPD-S",
        physicalStock: 10,
        reservedStock: 0,
        preorderedStock: 0,
        allocatedStock: 0,
        availableStock: 10,
      },
      {
        id: "var-2",
        productId: initialProduct?.id || "new",
        size: "M",
        color: "Standard",
        sku: "KPD-M",
        physicalStock: 15,
        reservedStock: 0,
        preorderedStock: 0,
        allocatedStock: 0,
        availableStock: 15,
      },
      {
        id: "var-3",
        productId: initialProduct?.id || "new",
        size: "L",
        color: "Standard",
        sku: "KPD-L",
        physicalStock: 15,
        reservedStock: 0,
        preorderedStock: 0,
        allocatedStock: 0,
        availableStock: 15,
      },
      {
        id: "var-4",
        productId: initialProduct?.id || "new",
        size: "XL",
        color: "Standard",
        sku: "KPD-XL",
        physicalStock: 10,
        reservedStock: 0,
        preorderedStock: 0,
        allocatedStock: 0,
        availableStock: 10,
      },
    ]
  );

  // Reservation Settings
  const [reservationEnabled, setReservationEnabled] = useState(initialProduct?.reservationEnabled || false);
  const [reservationStartDate, setReservationStartDate] = useState(initialProduct?.reservationStartDate || "");
  const [reservationEndDate, setReservationEndDate] = useState(initialProduct?.reservationEndDate || "");
  const [maxReservations, setMaxReservations] = useState<number | undefined>(initialProduct?.maxReservations);
  const [reservationLimitPerCustomer, setReservationLimitPerCustomer] = useState(initialProduct?.reservationLimitPerCustomer || 2);
  const [reservationCtaText, setReservationCtaText] = useState(initialProduct?.reservationCtaText || "RESERVE YOUR SIZE");
  const [reservationMessage, setReservationMessage] = useState(initialProduct?.reservationMessage || "");

  // Preorder Settings
  const [preorderEnabled, setPreorderEnabled] = useState(initialProduct?.preorderEnabled || false);
  const [preorderStartDate, setPreorderStartDate] = useState(initialProduct?.preorderStartDate || "");
  const [preorderEndDate, setPreorderEndDate] = useState(initialProduct?.preorderEndDate || "");
  const [expectedFulfillmentDate, setExpectedFulfillmentDate] = useState(initialProduct?.expectedFulfillmentDate || "");
  const [maxPreorders, setMaxPreorders] = useState<number | undefined>(initialProduct?.maxPreorders);
  const [preorderPrice, setPreorderPrice] = useState<number | undefined>(initialProduct?.preorderPrice);
  const [preorderCtaText, setPreorderCtaText] = useState(initialProduct?.preorderCtaText || "PREORDER NOW →");
  const [preorderMessage, setPreorderMessage] = useState(initialProduct?.preorderMessage || "");
  const [showPreorderCapacity, setShowPreorderCapacity] = useState(initialProduct?.showPreorderCapacity || false);

  // Fetch taxonomies on mount
  useEffect(() => {
    async function loadTaxonomies() {
      try {
        const [catRes, famRes, colRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/design-families"),
          fetch("/api/collections"),
        ]);
        const catData = await catRes.json();
        const famData = await famRes.json();
        const colData = await colRes.json();

        if (catData.categories) setCategories(catData.categories);
        if (famData.designFamilies) setDesignFamilies(famData.designFamilies);
        if (colData.collections) setCollections(colData.collections);
      } catch {
        // Fallback
      }
    }
    loadTaxonomies();
  }, []);

  // Track unsaved changes
  const markDirty = () => setHasUnsavedChanges(true);

  // Auto-generate slug from name if new
  const handleNameChange = (val: string) => {
    setName(val);
    markDirty();
    if (isNew) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  // Handle Multiple or Single Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const filesToUpload = Array.from(fileList);
    setUploadingImage(true);
    setSaveError(null);
    setUploadProgressText(
      filesToUpload.length > 1
        ? `UPLOADING (${filesToUpload.length})...`
        : "UPLOADING..."
    );

    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        const uploadedUrls: string[] = data.urls || (data.url ? [data.url] : []);
        if (uploadedUrls.length > 0) {
          const newImages = [...images, ...uploadedUrls];
          setImages(newImages);
          if (!primaryImage) {
            setPrimaryImage(uploadedUrls[0]);
          }
          if (!hoverImage && uploadedUrls.length > 1) {
            setHoverImage(uploadedUrls[1]);
          }
          markDirty();
        }
      } else {
        setSaveError(data.error || "Failed to upload images");
      }
    } catch {
      setSaveError("Error uploading images");
    } finally {
      setUploadingImage(false);
      setUploadProgressText(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSetPrimary = (url: string) => {
    setPrimaryImage(url);
    markDirty();
  };

  const handleSetHover = (url: string) => {
    setHoverImage(url);
    markDirty();
  };

  const handleDeleteImage = (url: string) => {
    const filtered = images.filter((img) => img !== url);
    setImages(filtered);
    if (primaryImage === url && filtered.length > 0) {
      setPrimaryImage(filtered[0]);
    }
    markDirty();
  };

  // Handle Dynamic Sizes
  const handleAddSize = () => {
    const trimmed = newSizeInput.trim().toUpperCase();
    if (trimmed && !availableSizes.includes(trimmed)) {
      const updatedSizes = [...availableSizes, trimmed];
      setAvailableSizes(updatedSizes);

      // Add variant for this size
      setVariants((prev) => [
        ...prev,
        {
          id: `var-${Date.now()}-${trimmed.toLowerCase()}`,
          productId: initialProduct?.id || "new",
          size: trimmed,
          color: "Standard",
          sku: `KPD-${(initialProduct?.id || "ITEM").toUpperCase()}-${trimmed}`,
          physicalStock: 10,
          reservedStock: 0,
          preorderedStock: 0,
          allocatedStock: 0,
          availableStock: 10,
        },
      ]);
      setNewSizeInput("");
      markDirty();
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    const updated = availableSizes.filter((s) => s !== sizeToRemove);
    setAvailableSizes(updated);
    setVariants((prev) => prev.filter((v) => v.size !== sizeToRemove));
    markDirty();
  };

  const handleVariantStockChange = (size: string, newPhysical: number) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.size === size
          ? {
              ...v,
              physicalStock: newPhysical,
              availableStock: Math.max(0, newPhysical - v.reservedStock - v.allocatedStock),
            }
          : v
      )
    );
    markDirty();
  };

  // Submit Handler
  const handleSave = async (andStay = false) => {
    if (!name || price === undefined) {
      setSaveError("Name and Price are mandatory.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const selectedCat = categories.find((c) => c.slug === categoryId);
    const selectedFam = designFamilies.find((f) => f.slug === designFamilyId);
    const selectedCol = collections.find((c) => c.slug === collectionId);

    const details = detailsInput
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload: Partial<MasterProduct> = {
      name,
      slug,
      shortDescription,
      fullDescription,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      status,
      badge: badge || undefined,
      isNew: isNewBadge,
      isPopular,
      featured,
      categoryId,
      categorySlug: categoryId,
      categoryName: selectedCat ? selectedCat.name : categoryId.toUpperCase(),
      designFamilyId,
      designFamilyName: selectedFam ? selectedFam.name : designFamilyId.toUpperCase(),
      collectionId,
      collectionName: selectedCol ? selectedCol.name : "DROP 001",
      drop: "DROP 001",
      tags,
      fabric,
      gsm,
      fit,
      printMethod,
      care,
      details,
      gender,
      image: primaryImage || images[0] || "/images/hero.png",
      images: [
        primaryImage,
        ...images.filter((img) => img !== primaryImage),
      ].filter(Boolean),
      availableSizes,
      variants,
      reservationEnabled,
      reservationStartDate: reservationStartDate || undefined,
      reservationEndDate: reservationEndDate || undefined,
      maxReservations: maxReservations ? Number(maxReservations) : undefined,
      reservationLimitPerCustomer: Number(reservationLimitPerCustomer),
      reservationCtaText,
      reservationMessage: reservationMessage || undefined,
      preorderEnabled,
      preorderStartDate: preorderStartDate || undefined,
      preorderEndDate: preorderEndDate || undefined,
      expectedFulfillmentDate: expectedFulfillmentDate || undefined,
      maxPreorders: maxPreorders ? Number(maxPreorders) : undefined,
      preorderPrice: preorderPrice ? Number(preorderPrice) : undefined,
      preorderCtaText,
      preorderMessage: preorderMessage || undefined,
      showPreorderCapacity,
    };

    try {
      const endpoint = isNew ? "/api/products" : `/api/products/${initialProduct?.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSaveError(data.error || "Failed to save product.");
        setIsSaving(false);
        return;
      }

      setHasUnsavedChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      if (!andStay) {
        router.push("/admin/products");
      } else if (isNew && data.product?.id) {
        router.push(`/admin/products/${data.product.id}/edit`);
      }
    } catch {
      setSaveError("Network error while persisting product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none font-sans text-xs">
      
      {/* Top Header & Save Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-[#FF3B00] uppercase tracking-widest">
                {isNew ? "NEW MASTER RECORD" : `EDITING ${initialProduct?.id}`}
              </span>
              {hasUnsavedChanges && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono text-[9px] font-bold border border-amber-500/30">
                  UNSAVED CHANGES
                </span>
              )}
            </div>
            <h1 className="font-black text-2xl uppercase tracking-tight text-white">
              {name || (isNew ? "Untitled Product" : initialProduct?.name)}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && initialProduct?.slug && (
            <Link
              href={`/product/${initialProduct.slug}`}
              target="_blank"
              className="px-3 py-2 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white font-mono text-[11px] font-bold uppercase flex items-center gap-1.5"
            >
              <span>PREVIEW</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-4 py-2 bg-[#1E232E] hover:bg-[#262B36] text-white font-bold uppercase rounded text-xs transition-colors cursor-pointer"
          >
            SAVE & CONTINUE
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-5 py-2 bg-[#FF3B00] hover:bg-[#e03400] text-white font-bold uppercase rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? "SAVING..." : "SAVE PRODUCT"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>Product master record successfully updated across all surfaces!</span>
        </div>
      )}

      {saveError && (
        <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Two-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Visual Assets & Image Management */}
        <div className="lg:col-span-4 bg-[#14171F] border border-[#262B36] rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#262B36]">
            <div>
              <h3 className="font-bold text-white uppercase text-xs">PRODUCT IMAGES</h3>
              <p className="text-[10px] text-[#7B828F] font-mono">Upload, reorder, assign primary & hover</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="px-3 py-1.5 bg-[#FF3B00] text-white font-bold text-[10px] uppercase rounded hover:bg-[#e03400] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Upload className="h-3 w-3" />
              <span>{uploadingImage ? uploadProgressText || "UPLOADING..." : "UPLOAD"}</span>
            </button>
          </div>

          {/* Primary Image Big Preview */}
          <div className="relative w-full aspect-[4/5] bg-[#0E1015] border border-[#262B36] rounded overflow-hidden">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt="Primary Preview"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full font-mono text-xs text-[#7B828F]">
                NO PRIMARY IMAGE
              </div>
            )}
            <div className="absolute top-2 left-2 bg-[#FF3B00] text-white font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded">
              PRIMARY (STOREFRONT CARD)
            </div>
          </div>

          {/* Thumbnail Slots Grid */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] font-bold text-[#7B828F] uppercase block">
              GALLERY ASSETS ({images.length})
            </span>
            <div className="grid grid-cols-3 gap-2">
              {images.map((imgUrl, idx) => {
                const isPrimary = primaryImage === imgUrl;
                const isHover = hoverImage === imgUrl;

                return (
                  <div
                    key={idx}
                    className={`group relative aspect-square bg-[#0E1015] border-2 rounded overflow-hidden ${
                      isPrimary ? "border-[#FF3B00]" : "border-[#262B36]"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Asset ${idx + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />

                    {/* Overlay Action Buttons */}
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(imgUrl)}
                          className="px-1.5 py-0.5 bg-[#FF3B00] text-white text-[8px] font-bold uppercase rounded w-full text-center hover:bg-white hover:text-[#111111]"
                        >
                          SET PRIMARY
                        </button>
                      )}
                      {!isHover && (
                        <button
                          type="button"
                          onClick={() => handleSetHover(imgUrl)}
                          className="px-1.5 py-0.5 bg-[#1E232E] text-white text-[8px] font-bold uppercase rounded w-full text-center hover:bg-white hover:text-[#111111]"
                        >
                          SET HOVER
                        </button>
                      )}
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(imgUrl)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {isPrimary && (
                      <div className="absolute bottom-1 left-1 bg-[#FF3B00] text-white text-[7px] font-black px-1 rounded uppercase">
                        PRIMARY
                      </div>
                    )}
                    {isHover && !isPrimary && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-[7px] font-black px-1 rounded uppercase">
                        HOVER
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Product Specifications */}
        <div className="lg:col-span-8 bg-[#14171F] border border-[#262B36] rounded-lg p-6 space-y-6">
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-[#262B36]">
            {[
              { id: "general", label: "GENERAL INFO" },
              { id: "pricing", label: "PRICING & STATUS" },
              { id: "specs", label: "SPECS & FABRIC" },
              { id: "variants", label: "SIZES & STOCK" },
              { id: "reservations", label: "RESERVATIONS" },
              { id: "preorders", label: "PREORDERS" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-2 rounded text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#FF3B00] text-white shadow-[1px_1px_0px_#000]"
                    : "text-[#9AA0A6] hover:bg-[#1E232E] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                  PRODUCT NAME *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Signature Oversized Box Tee"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-sm focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                  URL SLUG *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    markDirty();
                  }}
                  placeholder="signature-oversized-box-tee"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-mono focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                    GARMENT CATEGORY *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      markDirty();
                    }}
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                    DESIGN FAMILY *
                  </label>
                  <select
                    value={designFamilyId}
                    onChange={(e) => {
                      setDesignFamilyId(e.target.value);
                      markDirty();
                    }}
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                  >
                    {designFamilies.map((f) => (
                      <option key={f.slug} value={f.slug}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                    COLLECTION *
                  </label>
                  <select
                    value={collectionId}
                    onChange={(e) => {
                      setCollectionId(e.target.value);
                      markDirty();
                    }}
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                  >
                    {collections.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                  SHORT OVERVIEW / HOOK
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => {
                    setShortDescription(e.target.value);
                    markDirty();
                  }}
                  placeholder="Heavyweight drop-shoulder silhouette engineered for architectural box drape."
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                  FULL GARMENT NARRATIVE & DESCRIPTION
                </label>
                <textarea
                  rows={4}
                  value={fullDescription}
                  onChange={(e) => {
                    setFullDescription(e.target.value);
                    markDirty();
                  }}
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                  TAGS (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => {
                    setTagsInput(e.target.value);
                    markDirty();
                  }}
                  placeholder="streetwear, oversized, drop-001, terry cotton"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-mono focus:outline-none focus:border-[#FF3B00]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & STATUS */}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                    RETAIL PRICE (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => {
                      setPrice(Number(e.target.value));
                      markDirty();
                    }}
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-sm font-mono focus:outline-none focus:border-[#FF3B00]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                    COMPARE-AT PRICE (FOR STRIKETHROUGH)
                  </label>
                  <input
                    type="number"
                    value={compareAtPrice || ""}
                    onChange={(e) => {
                      setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined);
                      markDirty();
                    }}
                    placeholder="e.g. 1599"
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-sm font-mono focus:outline-none focus:border-[#FF3B00]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                  PRODUCT PUBLICATION STATUS *
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as ProductStatus);
                    markDirty();
                  }}
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-mono focus:outline-none focus:border-[#FF3B00]"
                >
                  <option value="ACTIVE">ACTIVE (Purchasable on storefront)</option>
                  <option value="DRAFT">DRAFT (Hidden from storefront)</option>
                  <option value="RESERVATION OPEN">RESERVATION OPEN (Customer reserve CTA)</option>
                  <option value="PREORDER">PREORDER (Preorder CTA & schedule)</option>
                  <option value="OUT OF STOCK">OUT OF STOCK (Visible, disabled purchase)</option>
                  <option value="SOLD OUT">SOLD OUT (Sold-out badge)</option>
                  <option value="HIDDEN">HIDDEN (Accessible by direct link only)</option>
                  <option value="ARCHIVED">ARCHIVED (Removed from catalog)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                    CORNER BADGE TEXT
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => {
                      setBadge(e.target.value);
                      markDirty();
                    }}
                    placeholder="e.g. BEST SELLER / DROP 001"
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-mono focus:outline-none focus:border-[#FF3B00]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewBadge}
                      onChange={(e) => {
                        setIsNewBadge(e.target.checked);
                        markDirty();
                      }}
                      className="accent-[#FF3B00]"
                    />
                    <span className="font-mono text-[11px] text-white">Mark as New</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => {
                        setFeatured(e.target.checked);
                        markDirty();
                      }}
                      className="accent-[#FF3B00]"
                    />
                    <span className="font-mono text-[11px] text-white">Featured on Home</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPECS & FABRIC */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                    FABRIC COMPOSITION *
                  </label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => {
                      setFabric(e.target.value);
                      markDirty();
                    }}
                    placeholder="100% Combed Heavy Cotton"
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                    FABRIC GSM WEIGHT *
                  </label>
                  <input
                    type="text"
                    value={gsm}
                    onChange={(e) => {
                      setGsm(e.target.value);
                      markDirty();
                    }}
                    placeholder="240 GSM"
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-mono focus:outline-none focus:border-[#FF3B00]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                    SILHOUETTE / FIT
                  </label>
                  <input
                    type="text"
                    value={fit}
                    onChange={(e) => {
                      setFit(e.target.value);
                      markDirty();
                    }}
                    placeholder="Signature Oversized Box Cut"
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                    PRINT / FINISH METHOD
                  </label>
                  <input
                    type="text"
                    value={printMethod}
                    onChange={(e) => {
                      setPrintMethod(e.target.value);
                      markDirty();
                    }}
                    placeholder="Direct-to-Fabric Minimal Stencil"
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                  CARE & WASH INSTRUCTIONS
                </label>
                <input
                  type="text"
                  value={care}
                  onChange={(e) => {
                    setCare(e.target.value);
                    markDirty();
                  }}
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                  BULLET SPECIFICATIONS (ONE PER LINE)
                </label>
                <textarea
                  rows={4}
                  value={detailsInput}
                  onChange={(e) => {
                    setDetailsInput(e.target.value);
                    markDirty();
                  }}
                  placeholder="240 GSM 100% Combed Heavyweight Cotton&#10;Signature Drop-Shoulder Box Cut&#10;Tailored In Jaipur, India"
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-mono focus:outline-none focus:border-[#FF3B00]"
                />
              </div>
            </div>
          )}

          {/* TAB 4: SIZES & VARIANTS */}
          {activeTab === "variants" && (
            <div className="space-y-5">
              {/* Dynamic Size Pill Selector */}
              <div>
                <span className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1.5">
                  AVAILABLE SIZES (CLICK TO REMOVE)
                </span>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleRemoveSize(s)}
                      className="px-3 py-1 bg-[#1E232E] hover:bg-red-500/20 hover:text-red-400 border border-[#262B36] rounded font-mono text-xs font-bold text-white flex items-center gap-1.5 group transition-colors"
                    >
                      <span>{s}</span>
                      <X className="h-3 w-3 text-[#7B828F] group-hover:text-red-400" />
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 max-w-xs">
                  <input
                    type="text"
                    placeholder="Add size (e.g. XXL, 38)"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSize())}
                    className="w-full px-3 py-1.5 bg-[#0E1015] border border-[#262B36] rounded text-xs text-white font-mono uppercase focus:outline-none focus:border-[#FF3B00]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-3 py-1.5 bg-[#FF3B00] text-white font-mono text-xs font-bold uppercase rounded hover:bg-[#e03400] transition-colors"
                  >
                    ADD
                  </button>
                </div>
              </div>

              {/* Variant Stock Matrix Table */}
              <div className="pt-2">
                <span className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-2">
                  VARIANT INVENTORY BREAKDOWN
                </span>
                <div className="overflow-x-auto border border-[#262B36] rounded bg-[#0E1015]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#262B36] bg-[#14171F] font-mono text-[10px] text-[#7B828F] uppercase">
                        <th className="py-2.5 px-3">SIZE</th>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3">PHYSICAL STOCK</th>
                        <th className="py-2.5 px-3">RESERVED</th>
                        <th className="py-2.5 px-3">AVAILABLE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262B36] font-mono">
                      {variants.map((v) => (
                        <tr key={v.size} className="hover:bg-[#1A1E27]">
                          <td className="py-2.5 px-3 font-bold text-white">{v.size}</td>
                          <td className="py-2.5 px-3 text-[#7B828F]">{v.sku}</td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min={0}
                              value={v.physicalStock}
                              onChange={(e) => handleVariantStockChange(v.size, Number(e.target.value))}
                              className="w-20 px-2 py-1 bg-[#14171F] border border-[#262B36] rounded text-white font-mono text-xs focus:outline-none focus:border-[#FF3B00]"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-[#FF3B00]">{v.reservedStock}</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-400">
                            {v.availableStock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RESERVATIONS */}
          {activeTab === "reservations" && (
            <div className="space-y-4">
              <div className="p-4 bg-[#0E1015] border border-[#262B36] rounded space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs">ENABLE SIZE RESERVATIONS</h4>
                    <p className="text-[10px] text-[#7B828F]">
                      Allows customers to reserve sizes before physical fulfillment or drop launch.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={reservationEnabled}
                    onChange={(e) => {
                      setReservationEnabled(e.target.checked);
                      markDirty();
                    }}
                    className="accent-[#FF3B00] h-4 w-4 cursor-pointer"
                  />
                </div>
              </div>

              {reservationEnabled && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                        RESERVATION CTA BUTTON TEXT
                      </label>
                      <input
                        type="text"
                        value={reservationCtaText}
                        onChange={(e) => {
                          setReservationCtaText(e.target.value);
                          markDirty();
                        }}
                        placeholder="RESERVE YOUR SIZE"
                        className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-mono focus:outline-none focus:border-[#FF3B00]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                        MAX RESERVATIONS PER CUSTOMER
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={reservationLimitPerCustomer}
                        onChange={(e) => {
                          setReservationLimitPerCustomer(Number(e.target.value));
                          markDirty();
                        }}
                        className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-mono focus:outline-none focus:border-[#FF3B00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                      RESERVATION NOTICE / POLICY MESSAGE
                    </label>
                    <textarea
                      rows={3}
                      value={reservationMessage}
                      onChange={(e) => {
                        setReservationMessage(e.target.value);
                        markDirty();
                      }}
                      placeholder="Drop 001 reservations lock your unit in queue. Our studio team confirms details prior to release."
                      className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs focus:outline-none focus:border-[#FF3B00]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PREORDERS */}
          {activeTab === "preorders" && (
            <div className="space-y-4">
              <div className="p-4 bg-[#0E1015] border border-[#262B36] rounded space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white uppercase text-xs">ENABLE PREORDERS</h4>
                    <p className="text-[10px] text-[#7B828F]">
                      Allows customer commitment for garments currently in production batching.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preorderEnabled}
                    onChange={(e) => {
                      setPreorderEnabled(e.target.checked);
                      markDirty();
                    }}
                    className="accent-[#FF3B00] h-4 w-4 cursor-pointer"
                  />
                </div>
              </div>

              {preorderEnabled && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                        PREORDER CTA TEXT
                      </label>
                      <input
                        type="text"
                        value={preorderCtaText}
                        onChange={(e) => {
                          setPreorderCtaText(e.target.value);
                          markDirty();
                        }}
                        placeholder="PREORDER NOW →"
                        className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-mono focus:outline-none focus:border-[#FF3B00]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase text-[#9AA0A6] mb-1">
                        EXPECTED FULFILLMENT / DISPATCH DATE
                      </label>
                      <input
                        type="text"
                        value={expectedFulfillmentDate}
                        onChange={(e) => {
                          setExpectedFulfillmentDate(e.target.value);
                          markDirty();
                        }}
                        placeholder="e.g. October 15, 2026"
                        className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-white text-xs font-mono focus:outline-none focus:border-[#FF3B00]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={showPreorderCapacity}
                      onChange={(e) => {
                        setShowPreorderCapacity(e.target.checked);
                        markDirty();
                      }}
                      className="accent-[#FF3B00] h-4 w-4 cursor-pointer"
                    />
                    <label className="text-xs text-white font-mono">
                      Show remaining preorder capacity counter on product page (only if slots configured)
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
