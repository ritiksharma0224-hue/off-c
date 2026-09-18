"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { brandData } from "@/data/brand";
import { Instagram, Heart, MessageCircle, Play } from "lucide-react";

const instagramPosts = [
  {
    id: "post-1",
    type: "image",
    image: "/images/vintage-wash.jpg",
    likes: "1,420",
    comments: "58",
    tag: "CHAOS COLLECTION"
  },
  {
    id: "post-2",
    type: "reel",
    image: "/images/cyber-tee.jpg",
    likes: "4,120",
    comments: "189",
    tag: "DROP 001"
  },
  {
    id: "post-3",
    type: "image",
    image: "/images/slate-boxy.jpg",
    likes: "940",
    comments: "34",
    tag: "MINIMAL BOX"
  },
  {
    id: "post-4",
    type: "reel",
    image: "/images/cropped-shirt.jpg",
    likes: "2,840",
    comments: "112",
    tag: "TECHNICAL CUT"
  }
];

export default function InstagramFeed() {
  return (
    <section className="w-full py-20 bg-base-cream border-b-2 border-[#111111] relative select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <Instagram className="h-10 w-10 text-[#FF3B00] mb-4" />
          <h2 className="font-black text-4xl md:text-5xl uppercase tracking-tight mb-4 text-[#111111]">
            WEAR THE CULTURE
          </h2>
          <p className="text-sm font-semibold text-[#111111]/70 mb-6">
            Follow @kapdology for Drop 001 styling, editorial features, and subculture release alerts.
          </p>
          <a
            href={brandData.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 font-black uppercase tracking-wider text-xs border-2 border-[#111111] bg-white text-[#111111] hover:bg-[#FF3B00] hover:text-[#111111] transition-colors duration-200 shadow-[3px_3px_0px_#111111]"
          >
            <span>FOLLOW @KAPDOLOGY</span>
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
              className="group relative h-[300px] border-2 border-[#111111] bg-[#111111] overflow-hidden shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#111111] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
            >
              {/* Image */}
              <Image
                src={post.image}
                alt="KAPDOLOGY Drop 001 oversized tee campaign"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-95"
              />
              
              {/* Type icon (reel play badge) */}
              {post.type === "reel" && (
                <div className="absolute top-3 right-3 bg-[#111111]/90 text-[#FF3B00] p-1.5 rounded-full z-20">
                  <Play className="h-3.5 w-3.5 fill-[#FF3B00]" />
                </div>
              )}

              {/* Tag sticker */}
              <div className="absolute bottom-3 left-3 bg-[#111111] text-[#FAF7F2] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-[#111111] z-20">
                {post.tag}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#111111]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white z-10">
                <div className="flex items-center gap-1.5 font-bold uppercase text-sm">
                  <Heart className="h-5 w-5 fill-[#FF3B00] text-[#FF3B00]" />
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
