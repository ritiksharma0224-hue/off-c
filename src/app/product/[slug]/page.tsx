"use client";

import React, { use, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  Ruler,
  Clock,
  Sparkles,
  X,
  AlertCircle,
  BookmarkCheck,
} from "lucide-react";
import { productsData } from "@/data/products";
import { brandData } from "@/data/brand";
import { useCart } from "@/context/CartContext";
import { useStorefront } from "@/context/StorefrontContext";
import { MasterProduct } from "@/lib/db/types";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { getProductBySlug, products, isLoading } = useStorefront();

  // Find product from single source of truth, fallback to initial productsData
  const liveProduct = getProductBySlug(resolvedParams.slug);
  const fallbackProduct = productsData.find((p) => p.slug === resolvedParams.slug);
  const product = liveProduct || fallbackProduct;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  // Reservation Modal State
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveForm, setReserveForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    preferredSize: "",
    notes: "",
  });
  const [reserveSubmitting, setReserveSubmitting] = useState(false);
  const [reserveSuccess, setReserveSuccess] = useState<{
    reservationNumber: string;
    message: string;
  } | null>(null);
  const [reserveError, setReserveError] = useState("");

  // Preorder Modal State
  const [isPreorderModalOpen, setIsPreorderModalOpen] = useState(false);
  const [preorderForm, setPreorderForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    size: "",
    quantity: 1,
    notes: "",
  });
  const [preorderSubmitting, setPreorderSubmitting] = useState(false);
  const [preorderSuccess, setPreorderSuccess] = useState<{
    preorderNumber: string;
    message: string;
  } | null>(null);
  const [preorderError, setPreorderError] = useState("");

  const availableSizes = useMemo(() => {
    if (!product) return ["S", "M", "L", "XL"];
    const sizes = (product as MasterProduct).availableSizes || (product as unknown as { sizes?: string[] }).sizes;
    return sizes && sizes.length > 0 ? sizes : ["S", "M", "L", "XL"];
  }, [product]);

  // Set default size once sizes are resolved
  React.useEffect(() => {
    if (!selectedSize && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
      setReserveForm((prev) => ({ ...prev, preferredSize: availableSizes[0] }));
      setPreorderForm((prev) => ({ ...prev, size: availableSizes[0] }));
    }
  }, [availableSizes, selectedSize]);

  if (!product && !isLoading) {
    notFound();
  }

  if (!product) {
    return (
      <div className="w-full bg-[#FAF7F2] min-h-screen py-24 flex items-center justify-center font-mono text-xs font-black uppercase tracking-widest text-[#111111]/60">
        LOADING GARMENT SPECS...
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];
  const isSoldOut = product.status === "SOLD OUT" || product.status === "OUT OF STOCK";
  const isReservation = (product as MasterProduct).reservationEnabled || product.status === "RESERVATION OPEN";
  const isPreorder = (product as MasterProduct).preorderEnabled || product.status === "PREORDER";

  const toggleAccordion = (name: string) => {
    setOpenAccordion((prev) => (prev === name ? null : name));
  };

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(product, selectedSize || availableSizes[0], quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    addToCart(product, selectedSize || availableSizes[0], quantity);
    router.push("/checkout");
  };

  // Submit Customer Reservation
  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReserveError("");

    if (!reserveForm.customerName.trim() || !reserveForm.email.trim() || !reserveForm.phone.trim()) {
      setReserveError("Please provide your name, email, and phone number.");
      return;
    }

    setReserveSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: reserveForm.customerName,
          email: reserveForm.email,
          phone: reserveForm.phone,
          size: reserveForm.preferredSize || selectedSize || availableSizes[0],
          color: (product as MasterProduct).colors?.[0] || "Standard",
          notes: reserveForm.notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReserveSuccess({
          reservationNumber: data.reservation.reservationNumber,
          message: "Reservation confirmed! Your size is held in the production queue.",
        });
      } else {
        setReserveError(data.error || "Failed to submit reservation.");
      }
    } catch {
      setReserveError("Network error. Please try again.");
    } finally {
      setReserveSubmitting(false);
    }
  };

  // Submit Customer Preorder
  const handlePreorderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreorderError("");

    if (!preorderForm.customerName.trim() || !preorderForm.email.trim() || !preorderForm.phone.trim()) {
      setPreorderError("Please provide your name, email, and phone number.");
      return;
    }

    setPreorderSubmitting(true);
    try {
      const res = await fetch("/api/preorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: preorderForm.customerName,
          email: preorderForm.email,
          phone: preorderForm.phone,
          size: preorderForm.size || selectedSize || availableSizes[0],
          color: (product as MasterProduct).colors?.[0] || "Standard",
          quantity: preorderForm.quantity,
          notes: preorderForm.notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPreorderSuccess({
          preorderNumber: data.preorder.preorderNumber,
          message: "Preorder registered! We will notify you when dispatch begins.",
        });
      } else {
        setPreorderError(data.error || "Failed to submit preorder.");
      }
    } catch {
      setPreorderError("Network error. Please try again.");
    } finally {
      setPreorderSubmitting(false);
    }
  };

  // Related products from live master database
  const relatedProducts = (products || [])
    .filter((p) => p.id !== product.id && p.status === "ACTIVE")
    .slice(0, 4);

  const categoryLabel = (product as MasterProduct).categoryName || (product as unknown as { category?: string }).category || "OVERSIZED TEES";
  const familyLabel = (product as MasterProduct).designFamilyName || (product as unknown as { designFamily?: string }).designFamily || "GLOBAL";

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-8 md:py-16 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#111111]/70 hover:text-[#FF3B00] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK TO SHOP</span>
          </Link>

          <span className="font-mono text-[10px] uppercase text-[#111111]/40">
            {product.drop || "DROP 001"} • {familyLabel} FAMILY
          </span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Thumbnail switcher (if multiple images exist) */}
            {imagesList.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible shrink-0">
                {imagesList.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative w-16 h-20 md:w-20 md:h-24 bg-gray-100 border-2 transition-all cursor-pointer overflow-hidden shrink-0 ${
                      activeImageIndex === i
                        ? "border-[#FF3B00] shadow-[2px_2px_0px_#111111]"
                        : "border-[#111111]/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Primary Large Image Frame */}
            <div className="relative flex-1 aspect-[4/5] bg-[#151515] border-3 border-[#111111] shadow-[8px_8px_0px_#111111] overflow-hidden group">
              <Image
                src={imagesList[activeImageIndex] || product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
                <span className="bg-[#111111] text-white font-mono text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-white/20">
                  {product.drop || "DROP 001"}
                </span>

                {isReservation && (
                  <span className="bg-[#D97706] text-white font-mono text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-black shadow-[2px_2px_0px_#111111]">
                    RESERVATION OPEN
                  </span>
                )}

                {isPreorder && (
                  <span className="bg-[#2563EB] text-white font-mono text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-black shadow-[2px_2px_0px_#111111]">
                    PREORDER DROP
                  </span>
                )}

                {isSoldOut && (
                  <span className="bg-[#DC2626] text-white font-mono text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-black shadow-[2px_2px_0px_#111111]">
                    SOLD OUT
                  </span>
                )}

                {product.badge && !isReservation && !isPreorder && !isSoldOut && (
                  <span className="bg-[#FF3B00] text-white font-mono text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-black shadow-[2px_2px_0px_#111111]">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Specifications Pill */}
              <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-sm text-[#111111] font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 border border-[#111111] shadow-[2px_2px_0px_#111111]">
                {product.gsm} • {product.fabric}
              </div>
            </div>

          </div>

          {/* RIGHT: Product Information & Purchase Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#FF3B00]">
                <span>KAPDOLOGY® STREETWEAR</span>
                <span>•</span>
                <span>{categoryLabel}</span>
              </div>

              <h1 className="font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-[#111111] mb-3">
                {product.name}
              </h1>

              {/* Price & Stock status */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#111111]">
                  ₹{product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="font-mono text-base font-semibold text-[#111111]/40 line-through">
                    ₹{product.compareAtPrice}
                  </span>
                )}
                {isReservation ? (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 border border-[#D97706]">
                    ZERO UPFRONT PAYMENT
                  </span>
                ) : isPreorder ? (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 border border-[#2563EB]">
                    ADVANCE ALLOCATION
                  </span>
                ) : isSoldOut ? (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DC2626] bg-[#FEE2E2] px-2.5 py-0.5 border border-[#DC2626]">
                    ARCHIVED / SOLD OUT
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00875A] bg-[#E3FCEF] px-2 py-0.5 border border-[#00875A]">
                    READY TO SHIP
                  </span>
                )}
              </div>

              {/* Special Preorder / Reservation Note Banner */}
              {isReservation && (
                <div className="p-3.5 mb-4 bg-[#FFFBEB] border-2 border-[#D97706] text-xs space-y-1">
                  <div className="font-mono font-black text-[10px] uppercase text-[#B45309] flex items-center gap-1.5">
                    <BookmarkCheck className="h-3.5 w-3.5" />
                    <span>PRIORITY RESERVATION OPEN</span>
                  </div>
                  <p className="text-[#92400E] font-medium leading-relaxed">
                    {(product as MasterProduct).reservationMessage ||
                      "Lock in your garment size before production closes. No payment required today. Our team will contact you for dispatch confirmation."}
                  </p>
                </div>
              )}

              {isPreorder && (
                <div className="p-3.5 mb-4 bg-[#EFF6FF] border-2 border-[#2563EB] text-xs space-y-1">
                  <div className="font-mono font-black text-[10px] uppercase text-[#1D4ED8] flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>PREORDER BATCH ALLOCATION</span>
                  </div>
                  <p className="text-[#1E40AF] font-medium leading-relaxed">
                    {(product as MasterProduct).preorderMessage ||
                      "Securing a preorder guarantees fulfillment from our upcoming atelier run."}
                  </p>
                  {(product as MasterProduct).expectedFulfillmentDate && (
                    <span className="font-mono text-[10px] font-black text-[#1D4ED8] block pt-1">
                      EXPECTED DISPATCH: {(product as MasterProduct).expectedFulfillmentDate}
                    </span>
                  )}
                </div>
              )}

              <p className="text-sm font-medium text-[#111111]/80 leading-relaxed">
                {(product as MasterProduct).shortDescription ||
                  (product as MasterProduct).fullDescription ||
                  (product as unknown as { description?: string }).description}
              </p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#111111]/50 block text-[9px] font-mono font-bold uppercase">
                  FABRIC WEIGHT
                </span>
                <span className="font-black text-[#111111] uppercase">{product.gsm}</span>
              </div>
              <div>
                <span className="text-[#111111]/50 block text-[9px] font-mono font-bold uppercase">
                  FIT PROFILE
                </span>
                <span className="font-black text-[#111111] uppercase">{product.fit}</span>
              </div>
              <div>
                <span className="text-[#111111]/50 block text-[9px] font-mono font-bold uppercase">
                  PRINT TECHNIQUE
                </span>
                <span className="font-black text-[#111111] uppercase">{product.printMethod}</span>
              </div>
              <div>
                <span className="text-[#111111]/50 block text-[9px] font-mono font-bold uppercase">
                  STUDIO ORIGIN
                </span>
                <span className="font-black text-[#111111] uppercase">JAIPUR, INDIA</span>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-[#111111]">
                  SELECT SIZE ({selectedSize})
                </span>
                <Link
                  href="/size-guide"
                  className="inline-flex items-center gap-1 text-xs font-mono font-bold underline text-[#FF3B00] hover:text-[#111111]"
                >
                  <Ruler className="h-3 w-3" />
                  <span>SIZE GUIDE</span>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-11 text-xs font-mono font-black uppercase border-2 transition-all cursor-pointer ${
                      selectedSize === size
                        ? "bg-[#111111] text-white border-[#111111] shadow-[3px_3px_0px_#FF3B00]"
                        : "bg-white text-[#111111] border-[#111111]/40 hover:border-[#111111]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector (for standard or preorder items) */}
            {!isSoldOut && !isReservation && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-[#111111]">
                  QUANTITY:
                </span>
                <div className="flex items-center border-2 border-[#111111] bg-white shadow-[2px_2px_0px_#111111]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 font-mono font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 font-mono font-black text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 font-mono font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* PRIMARY ACTION CTAs ACCORDING TO ARCHITECTURE STATUS */}
            {isReservation ? (
              /* Custom Reservation CTA Button */
              <div className="pt-2">
                <button
                  onClick={() => setIsReserveModalOpen(true)}
                  className="w-full py-4 px-6 flex items-center justify-center gap-2.5 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-[#D97706] text-white shadow-[4px_4px_0px_#111111] hover:bg-[#B45309] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
                >
                  <BookmarkCheck className="h-4 w-4" />
                  <span>
                    {(product as MasterProduct).reservationCtaText || `RESERVE SIZE ${selectedSize || "L"} — ZERO PAYMENT`}
                  </span>
                </button>
                <span className="block text-center font-mono text-[10px] text-[#111111]/50 uppercase mt-2">
                  Locks piece until production batch completes. Concierge will verify before shipment.
                </span>
              </div>
            ) : isPreorder ? (
              /* Custom Preorder CTA Button */
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setIsPreorderModalOpen(true)}
                  className="flex-1 py-4 px-6 flex items-center justify-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-[#2563EB] text-white shadow-[4px_4px_0px_#111111] hover:bg-[#1D4ED8] transition-all cursor-pointer"
                >
                  <Clock className="h-4 w-4" />
                  <span>
                    {(product as MasterProduct).preorderCtaText || "PREORDER COMMITMENT →"}
                  </span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 flex items-center justify-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-white text-[#111111] shadow-[4px_4px_0px_#111111] hover:bg-[#111111] hover:text-white transition-all cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4 text-[#00875A]" />
                      <span>ADDED PREORDER</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>ADD TO BAG (PREORDER)</span>
                    </>
                  )}
                </button>
              </div>
            ) : isSoldOut ? (
              /* Sold Out State */
              <div className="pt-2">
                <button
                  disabled
                  className="w-full py-4 px-6 flex items-center justify-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111]/40 bg-[#E5E7EB] text-[#111111]/40 cursor-not-allowed"
                >
                  <span>SOLD OUT — ARCHIVED FROM DROP</span>
                </button>
              </div>
            ) : (
              /* Regular Active Purchase Buttons: ADD TO CART & BUY NOW */
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 flex items-center justify-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-white text-[#111111] shadow-[4px_4px_0px_#111111] hover:bg-[#111111] hover:text-white transition-all cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4 text-[#00875A]" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>ADD TO BAG</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 px-6 flex items-center justify-center gap-2 font-black uppercase tracking-wider text-xs md:text-sm border-2 border-[#111111] bg-[#111111] text-[#FAF7F2] shadow-[4px_4px_0px_#FF3B00] hover:shadow-[2px_2px_0px_#FF3B00] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#FF3B00] hover:border-[#FF3B00] hover:text-white transition-all cursor-pointer"
                >
                  <Zap className="h-4 w-4" />
                  <span>BUY NOW</span>
                </button>
              </div>
            )}

            {/* Risk Reduction & Trust Reassurance */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#111111]/10 text-xs font-bold text-[#111111]/70">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#FF3B00] shrink-0" />
                <span>3–5 DAYS DELIVERY</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-[#FF3B00] shrink-0" />
                <span>7-DAY EXCHANGE</span>
              </div>
            </div>

            {/* Informational Accordions */}
            <div className="border-t-2 border-[#111111] divide-y divide-[#111111]/15">
              
              {/* Accordion 1: Details */}
              <div>
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full py-3.5 flex items-center justify-between text-xs font-mono font-black uppercase text-[#111111] text-left cursor-pointer"
                >
                  <span>PRODUCT SPECIFICATIONS & CONSTRUCTION</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openAccordion === "details" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "details" && (
                  <div className="pb-4 text-xs text-[#111111]/80 space-y-2">
                    <ul className="list-disc pl-4 space-y-1">
                      {(product.details || []).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Care */}
              <div>
                <button
                  onClick={() => toggleAccordion("care")}
                  className="w-full py-3.5 flex items-center justify-between text-xs font-mono font-black uppercase text-[#111111] text-left cursor-pointer"
                >
                  <span>GARMENT CARE INSTRUCTIONS</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openAccordion === "care" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "care" && (
                  <div className="pb-4 text-xs text-[#111111]/80">
                    <p>{product.care}</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Returns */}
              <div>
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full py-3.5 flex items-center justify-between text-xs font-mono font-black uppercase text-[#111111] text-left cursor-pointer"
                >
                  <span>SHIPPING & RETURNS POLICY</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openAccordion === "shipping" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "shipping" && (
                  <div className="pb-4 text-xs text-[#111111]/80 space-y-2">
                    <p>
                      Orders dispatched within 24–48 hours from Jaipur studio. Standard pan-India delivery takes 3–5 business days. Free shipping on orders above ₹{brandData.shipping.freeThreshold}.
                    </p>
                    <p>
                      We accept size exchanges and returns within {brandData.returns.windowDays} days of delivery provided garments remain unworn with original tags attached.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Genuine Community Reviews State (NO FAKE REVIEWS) */}
            <div className="p-4 bg-white border border-[#111111]/25 text-xs text-[#111111]/70 space-y-1">
              <span className="font-mono text-[9px] font-black uppercase text-[#FF3B00] block">
                COMMUNITY FEEDBACK
              </span>
              <p className="font-semibold">
                Customer reviews will unlock for verified buyers following fulfillment of Drop 001 dispatches.
              </p>
            </div>

          </div>

        </div>

        {/* Complete the Look / Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t-2 border-[#111111]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#FF3B00] block mb-1">
                  CURATED RECOMMENDATION
                </span>
                <h3 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
                  COMPLETE THE LOOK
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs font-mono font-bold uppercase text-[#111111] hover:text-[#FF3B00] underline"
              >
                VIEW FULL CATALOG →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/product/${rel.slug}`}
                  className="group p-3 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[6px_6px_0px_#111111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex flex-col"
                >
                  <div className="relative w-full aspect-[4/5] bg-gray-100 border border-[#111111]/20 mb-3 overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[9px] font-mono uppercase text-[#111111]/50 mb-0.5">
                    {(rel as MasterProduct).categoryName || (rel as unknown as { category?: string }).category || "STREETWEAR"}
                  </span>
                  <h4 className="font-black uppercase text-xs text-[#111111] group-hover:text-[#FF3B00] transition-colors line-clamp-1 mb-1">
                    {rel.name}
                  </h4>
                  <span className="font-mono font-bold text-xs text-[#111111]">
                    ₹{rel.price}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ==================== RESERVATION MODAL ==================== */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] border-3 border-[#111111] shadow-[10px_10px_0px_#111111] max-w-lg w-full p-6 relative">
            <button
              onClick={() => {
                setIsReserveModalOpen(false);
                setReserveSuccess(null);
                setReserveError("");
              }}
              className="absolute top-4 right-4 p-1.5 border border-[#111111] hover:bg-[#FF3B00] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {reserveSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-[#D97706]/10 border-2 border-[#D97706] rounded-full flex items-center justify-center mx-auto text-[#D97706]">
                  <BookmarkCheck className="w-7 h-7" />
                </div>
                <h3 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
                  RESERVATION CONFIRMED
                </h3>
                <p className="text-xs text-[#111111]/70 max-w-xs mx-auto">
                  {reserveSuccess.message}
                </p>
                <div className="p-3 bg-white border border-[#111111] font-mono text-xs font-bold text-[#111111] inline-block">
                  RESERVATION REF: #{reserveSuccess.reservationNumber}
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsReserveModalOpen(false);
                      setReserveSuccess(null);
                    }}
                    className="px-6 py-2.5 bg-[#111111] text-white font-mono text-xs uppercase font-bold hover:bg-[#FF3B00] transition-colors"
                  >
                    CONTINUE BROWSING
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReserveSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#D97706]">
                      ATELIER RESERVATION
                    </span>
                  </div>
                  <h3 className="font-black text-xl uppercase tracking-tight text-[#111111]">
                    RESERVE: {product.name}
                  </h3>
                  <p className="text-xs text-[#111111]/60">
                    No payment required now. Lock your piece in the upcoming production release.
                  </p>
                </div>

                {reserveError && (
                  <div className="p-3 bg-[#FEE2E2] border border-[#DC2626] text-xs text-[#DC2626] flex items-center gap-2 font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{reserveError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-[#111111]/60 mb-1">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={reserveForm.customerName}
                      onChange={(e) => setReserveForm({ ...reserveForm, customerName: e.target.value })}
                      placeholder="e.g. Arjun Sharma"
                      className="w-full px-3 py-2 bg-white border-2 border-[#111111] text-xs font-mono focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#111111]/60 mb-1">
                        EMAIL *
                      </label>
                      <input
                        type="email"
                        required
                        value={reserveForm.email}
                        onChange={(e) => setReserveForm({ ...reserveForm, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full px-3 py-2 bg-white border-2 border-[#111111] text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#111111]/60 mb-1">
                        PHONE / WHATSAPP *
                      </label>
                      <input
                        type="tel"
                        required
                        value={reserveForm.phone}
                        onChange={(e) => setReserveForm({ ...reserveForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 bg-white border-2 border-[#111111] text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-[#111111]/60 mb-1">
                      RESERVE SIZE *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((sz) => (
                        <button
                          type="button"
                          key={sz}
                          onClick={() => setReserveForm({ ...reserveForm, preferredSize: sz })}
                          className={`w-10 h-9 font-mono text-xs font-bold border-2 ${
                            (reserveForm.preferredSize || selectedSize) === sz
                              ? "bg-[#D97706] text-white border-[#D97706]"
                              : "bg-white text-[#111111] border-[#111111]/30"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-[#111111]/60 mb-1">
                      SPECIAL SIZING OR DELIVERY NOTES (OPTIONAL)
                    </label>
                    <textarea
                      rows={2}
                      value={reserveForm.notes}
                      onChange={(e) => setReserveForm({ ...reserveForm, notes: e.target.value })}
                      placeholder="e.g. Prefer relaxed sleeve drape"
                      className="w-full px-3 py-2 bg-white border-2 border-[#111111] text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={reserveSubmitting}
                    className="w-full py-3.5 bg-[#D97706] text-white font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:bg-[#B45309] transition-all disabled:opacity-50"
                  >
                    {reserveSubmitting ? "REGISTERING RESERVATION..." : "CONFIRM FREE RESERVATION →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==================== PREORDER COMMITMENT MODAL ==================== */}
      {isPreorderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] border-3 border-[#111111] shadow-[10px_10px_0px_#111111] max-w-lg w-full p-6 relative">
            <button
              onClick={() => {
                setIsPreorderModalOpen(false);
                setPreorderSuccess(null);
                setPreorderError("");
              }}
              className="absolute top-4 right-4 p-1.5 border border-[#111111] hover:bg-[#FF3B00] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {preorderSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-[#2563EB]/10 border-2 border-[#2563EB] rounded-full flex items-center justify-center mx-auto text-[#2563EB]">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="font-black text-2xl uppercase tracking-tight text-[#111111]">
                  PREORDER ALLOCATED
                </h3>
                <p className="text-xs text-[#111111]/70 max-w-xs mx-auto">
                  {preorderSuccess.message}
                </p>
                <div className="p-3 bg-white border border-[#111111] font-mono text-xs font-bold text-[#111111] inline-block">
                  PREORDER REF: #{preorderSuccess.preorderNumber}
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsPreorderModalOpen(false);
                      setPreorderSuccess(null);
                    }}
                    className="px-6 py-2.5 bg-[#111111] text-white font-mono text-xs uppercase font-bold hover:bg-[#FF3B00] transition-colors"
                  >
                    CONTINUE BROWSING
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePreorderSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                      PREORDER BATCH ALLOCATION
                    </span>
                  </div>
                  <h3 className="font-black text-xl uppercase tracking-tight text-[#111111]">
                    PREORDER: {product.name}
                  </h3>
                  <p className="text-xs text-[#111111]/60">
                    Guaranteed allocation from atelier release. Expected dispatch: {(product as MasterProduct).expectedFulfillmentDate || "Next Production Run"}.
                  </p>
                </div>

                {preorderError && (
                  <div className="p-3 bg-[#FEE2E2] border border-[#DC2626] text-xs text-[#DC2626] flex items-center gap-2 font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{preorderError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-[#111111]/60 mb-1">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={preorderForm.customerName}
                      onChange={(e) => setPreorderForm({ ...preorderForm, customerName: e.target.value })}
                      placeholder="e.g. Rohit Meena"
                      className="w-full px-3 py-2 bg-white border-2 border-[#111111] text-xs font-mono focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#111111]/60 mb-1">
                        EMAIL *
                      </label>
                      <input
                        type="email"
                        required
                        value={preorderForm.email}
                        onChange={(e) => setPreorderForm({ ...preorderForm, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full px-3 py-2 bg-white border-2 border-[#111111] text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#111111]/60 mb-1">
                        PHONE / WHATSAPP *
                      </label>
                      <input
                        type="tel"
                        required
                        value={preorderForm.phone}
                        onChange={(e) => setPreorderForm({ ...preorderForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 bg-white border-2 border-[#111111] text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#111111]/60 mb-1">
                        PREORDER SIZE *
                      </label>
                      <select
                        value={preorderForm.size || selectedSize}
                        onChange={(e) => setPreorderForm({ ...preorderForm, size: e.target.value })}
                        className="w-full px-3 py-2 bg-white border-2 border-[#111111] text-xs font-mono focus:outline-none"
                      >
                        {availableSizes.map((sz) => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#111111]/60 mb-1">
                        UNITS *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={preorderForm.quantity}
                        onChange={(e) => setPreorderForm({ ...preorderForm, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 bg-white border-2 border-[#111111] text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-[#111111]/60 mb-1">
                      ORDER NOTES (OPTIONAL)
                    </label>
                    <textarea
                      rows={2}
                      value={preorderForm.notes}
                      onChange={(e) => setPreorderForm({ ...preorderForm, notes: e.target.value })}
                      placeholder="Special delivery instructions or requirements"
                      className="w-full px-3 py-2 bg-white border-2 border-[#111111] text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={preorderSubmitting}
                    className="w-full py-3.5 bg-[#2563EB] text-white font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:bg-[#1D4ED8] transition-all disabled:opacity-50"
                  >
                    {preorderSubmitting ? "LOCKING ALLOCATION..." : "CONFIRM PREORDER ALLOCATION →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
