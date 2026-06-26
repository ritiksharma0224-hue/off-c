"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { brandData } from "@/data/brand";
import { Instagram, Heart, MessageCircle, Play } from "lucide-react";

// Mock Instagram posts representing reels, fits, and storefront.
const instagramPosts = [
  {
    id: "post-1",
    type: "image",
    image: "/images/vintage-wash.jpg",
    likes: "1,248",
    comments: "42",
    tag: "STYLING FIT"
  },
  {
    id: "post-2",
    type: "reel",
    image: "/images/cyber-tee.jpg",
    likes: "3,890",
    comments: "156",
    tag: "NEW DROP"
  },
  {
    id: "post-3",
    type: "image",
    image: "/images/slate-boxy.jpg",
    likes: "892",
    comments: "28",
    tag: "RESTOCK IN"
  },
  {
    id: "post-4",
    type: "reel",
    image: "/images/cropped-shirt.jpg",
    likes: "2,410",
    comments: "91",
    tag: "LOOKBOOK"
  }
];

export default function InstagramFeed() {
  return (
    <section className="w-full py-20 bg-base-cream border-b-2 border-text-black relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <Instagram className="h-10 w-10 text-hot-pink mb-4 animate-spin-slow" />
          <h2 className="font-extrabold text-4xl md:text-5xl uppercase tracking-tight mb-4">
            Fresh Drops Live
          </h2>
          <p className="text-sm font-semibold text-text-black/60 mb-6">
            Follow Off Culture Jaipur for daily styling videos, fit reels, and instant release alerts.
          </p>
          <a
            href={brandData.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-wider text-xs border-2 border-text-black bg-white hover:bg-hot-pink hover:text-white transition-colors duration-300 shadow-[3px_3px_0px_#111111]"
          >
            <span>Follow @offculturejaipur</span>
          </a>
        </div>

        {/* Mock Post Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={brandData.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[300px] border-2 border-text-black bg-chrome-silver overflow-hidden shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#111111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
            >
              {/* Image */}
              <Image
                src={post.image}
                alt="Off Culture Instagram Look"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Type icon (reel play badge) */}
              {post.type === "reel" && (
                <div className="absolute top-3 right-3 bg-text-black/80 text-white p-1.5 rounded-full z-20">
                  <Play className="h-3.5 w-3.5 fill-white" />
                </div>
              )}

              {/* Tag sticker */}
              <div className="absolute bottom-3 left-3 bg-white text-text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-text-black z-20">
                {post.tag}
              </div>

              {/* Hover Interactions Mask (Like count & Comments) */}
              <div className="absolute inset-0 bg-text-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white z-10">
                <div className="flex items-center gap-1.5 font-bold uppercase text-sm">
                  <Heart className="h-5 w-5 fill-white" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold uppercase text-sm">
                  <MessageCircle className="h-5 w-5 fill-white" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
