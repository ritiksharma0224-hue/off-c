"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { collectionsData } from "@/data/collections";
import { ArrowUpRight } from "lucide-react";

export default function CollectionGrid() {
  // Map category slugs to specific placeholder images
  const getCategoryImage = (slug: string) => {
    switch (slug) {
      case "drop-001":
        return "/images/hero.png";
      case "restricted":
        return "/images/vintage-wash.jpg";
      case "identity":
        return "/images/cyber-tee.jpg";
      case "global":
        return "/images/chrome-tee.jpg";
      case "chaos":
        return "/images/slate-boxy.jpg";
      case "minimal":
        return "/images/cropped-shirt.jpg";
      case "technical":
        return "/images/cargos.jpg";
      default:
        return "/images/hero.png";
    }
  };

  return (
    <section className="w-full py-20 bg-base-cream border-b-2 border-text-black relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-electric-blue block mb-2">
              KAPDOLOGY® FAMILIES
            </span>
            <h2 className="font-black text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase leading-none">
              DESIGN FAMILIES
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-sm border-b-2 border-text-black pb-0.5 hover:text-electric-blue hover:border-electric-blue transition-colors self-start"
          >
            <span>EXPLORE ALL DROPS</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Collection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionsData.map((item, index) => {
            const cardImage = getCategoryImage(item.slug);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative flex flex-col bg-white border-3 border-text-black shadow-[6px_6px_0px_#111111] hover:shadow-[10px_10px_0px_#111111] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 overflow-hidden"
              >
                {/* Visual Category Label */}
                <div className="absolute top-4 left-4 z-20 bg-text-black text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                  {item.tag}
                </div>

                {/* Category Image Cover */}
                <div className="relative w-full h-[280px] bg-chrome-silver overflow-hidden">
                  <Image
                    src={cardImage}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle color mask */}
                  <div className="absolute inset-0 bg-electric-blue/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-300" />
                </div>

                {/* Info Content */}
                <div className="p-6 flex-grow flex flex-col justify-between border-t-2 border-text-black bg-white">
                  <div>
                    <h3 className="font-extrabold uppercase text-xl mb-2 tracking-wide text-text-black group-hover:text-electric-blue transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-text-black/75 font-medium leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Card Bottom CTA */}
                  <Link
                    href={`/collections?category=${item.slug}`}
                    className="mt-auto inline-flex items-center justify-between w-full py-2.5 px-4 font-bold uppercase tracking-wider text-xs border-2 border-text-black bg-base-cream group-hover:bg-text-black group-hover:text-white transition-all duration-300"
                  >
                    <span>Explore {item.name}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
