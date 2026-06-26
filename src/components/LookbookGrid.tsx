"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { productsData } from "@/data/products";
import { brandData } from "@/data/brand";
import { ShoppingBag, Instagram, AlertCircle, ArrowRight } from "lucide-react";

export default function LookbookGrid() {
  // Show only the featured or first 4 items on the landing page lookbook
  const featuredProducts = productsData.filter((p) => p.isPopular || p.isNew).slice(0, 4);

  return (
    <section className="w-full py-20 bg-white border-b-2 border-text-black relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-hot-pink block mb-2">
              LOOKBOOK SHOWCASE
            </span>
            <h2 className="font-black text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase leading-none">
              Featured Fits
            </h2>
          </div>
          <p className="text-sm font-semibold max-w-sm text-text-black/60">
            Premium oversized fits, drop shoulders, and customized silhouettes. Fresh drops live here.
          </p>
        </div>

        {/* Drop Alert Disclaimer */}
        <div className="w-full mb-10 bg-base-cream border-2 border-text-black p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_#111111]">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-electric-blue shrink-0 animate-pulse" />
            <span className="text-xs md:text-sm font-bold uppercase tracking-wide text-text-black">
              Product availability changes rapidly. DM on Instagram or visit our store in Mansarovar for the latest drops!
            </span>
          </div>
          <a
            href={brandData.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-hot-pink hover:underline shrink-0"
          >
            <span>Instagram Drops</span>
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>

        {/* Lookbook Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col bg-white border-2 border-text-black shadow-[4px_4px_0px_#111111] hover:shadow-[8px_8px_0px_#111111] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative w-full h-[320px] bg-chrome-silver overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Visual Indicators */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                  {product.isNew && (
                    <span className="bg-neon-green text-text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-text-black shadow-[1px_1px_0px_#111111]">
                      NEW DROP
                    </span>
                  )}
                  {product.isPopular && (
                    <span className="bg-hot-pink text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-text-black shadow-[1px_1px_0px_#111111]">
                      BEST SELLER
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-white text-text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-text-black shadow-[1px_1px_0px_#111111]">
                  {product.fit}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-grow flex flex-col justify-between border-t border-text-black bg-white">
                <div className="mb-4">
                  <h3 className="font-extrabold uppercase text-sm tracking-wide text-text-black line-clamp-1 group-hover:text-electric-blue transition-colors">
                    {product.name}
                  </h3>
                  <span className="font-black text-base text-text-black block mt-1">
                    ₹{product.price}
                  </span>
                </div>

                {/* Inquiry Link */}
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold uppercase tracking-wider border-2 border-text-black bg-white hover:bg-text-black hover:text-white transition-colors duration-300"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Check Availability</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTAs */}
        <div className="mt-16 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase tracking-widest text-sm border-2 border-text-black bg-text-black text-white hover:bg-electric-blue transition-colors duration-300 shadow-[4px_4px_0px_#A3E635]"
          >
            <span>Explore All Products</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
