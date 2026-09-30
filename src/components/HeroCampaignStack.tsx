"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Transition } from "framer-motion";
import KapdologyLogo from "./KapdologyLogo";

export interface CampaignCardData {
  id: string;
  badge: string;
  subBadge?: string;
  title: string;
  price: string;
  gsm: string;
  specTag: string;
  image: string;
  imageStyle?: string;
  link: string;
  code: string;
  origin: string;
}

const CAMPAIGN_CARDS: CampaignCardData[] = [
  {
    id: "card-01",
    badge: "CAMPAIGN 01 / DROP 001",
    subBadge: "UNIFORM",
    title: "SIGNATURE OVERSIZED TEE",
    price: "₹599",
    gsm: "240 GSM",
    specTag: "OVERSIZED BOX CUT",
    image: "/images/hero.png",
    link: "/collections?category=drop-001",
    code: "KPD/001-A",
    origin: "JAIPUR → INDIA",
  },
  {
    id: "card-02",
    badge: "CAMPAIGN 02 / DROP 001",
    subBadge: "IDENTITY",
    title: "GRAPHIC OVERSIZED TEE",
    price: "₹599",
    gsm: "220 GSM",
    specTag: "LIQUID CHROME",
    image: "/images/chrome-tee.jpg",
    link: "/product/signature-oversized-box-tee",
    code: "KPD/002-B",
    origin: "JAIPUR → INDIA",
  },
  {
    id: "card-03",
    badge: "CAMPAIGN 03 / DROP 001",
    subBadge: "CHAOS",
    title: "GRAPHIC STREETWEAR",
    price: "₹599",
    gsm: "240 GSM TERRY",
    specTag: "VINTAGE WASH",
    image: "/images/hero.png",
    imageStyle: "contrast-115 grayscale",
    link: "/product/vintage-distressed-acid-wash-tee",
    code: "KPD/003-C",
    origin: "JAIPUR → INDIA",
  },
  {
    id: "card-04",
    badge: "CAMPAIGN 04 / DROP 001",
    subBadge: "GLOBAL",
    title: "KAPDOLOGY® GLOBAL TEE",
    price: "₹599",
    gsm: "240 GSM LUXE",
    specTag: "GLOBAL EDITION",
    image: "/images/chrome-tee.jpg",
    imageStyle: "contrast-120 saturate-125",
    link: "/product/retro-future-graphic-boxy-tee",
    code: "KPD/004-D",
    origin: "NOT JUST CLOTHES. IT'S A MOOD.",
  },
];

interface SlotConfig {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  zIndex: number;
  opacity: number;
  shadow: string;
}

const DESKTOP_SLOTS: SlotConfig[] = [
  // Slot 0: Front Card
  { x: 0, y: 0, rotate: 0.5, scale: 1.0, zIndex: 40, opacity: 1.0, shadow: "8px 8px 0px #111111" },
  // Slot 1: Mid-right offset
  { x: 22, y: -6, rotate: 2.2, scale: 0.97, zIndex: 30, opacity: 0.94, shadow: "5px 5px 0px #111111" },
  // Slot 2: Mid-left offset
  { x: -18, y: 7, rotate: -2.6, scale: 0.94, zIndex: 20, opacity: 0.88, shadow: "4px 4px 0px #111111" },
  // Slot 3: Deep Back
  { x: -6, y: 14, rotate: -1.0, scale: 0.91, zIndex: 10, opacity: 0.80, shadow: "3px 3px 0px #111111" },
];

const MOBILE_SLOTS: SlotConfig[] = [
  // Slot 0: Front Card
  { x: 0, y: 0, rotate: 0.3, scale: 1.0, zIndex: 40, opacity: 1.0, shadow: "6px 6px 0px #111111" },
  // Slot 1: Mid-right offset
  { x: 12, y: -3, rotate: 1.5, scale: 0.97, zIndex: 30, opacity: 0.92, shadow: "4px 4px 0px #111111" },
  // Slot 2: Mid-left offset
  { x: -10, y: 5, rotate: -1.6, scale: 0.94, zIndex: 20, opacity: 0.84, shadow: "3px 3px 0px #111111" },
  // Slot 3: Deep Back
  { x: -3, y: 8, rotate: -0.8, scale: 0.91, zIndex: 10, opacity: 0.76, shadow: "2px 2px 0px #111111" },
];

// Per-card subtle organic floating motion cycles
const FLOATING_VARIANTS = [
  { y: [-3, 3, -3], x: [-1.2, 1.5, -1.2], rotate: [-0.3, 0.4, -0.3], duration: 4.8 },
  { y: [3, -3, 3], x: [1.2, -1.5, 1.2], rotate: [0.3, -0.4, 0.3], duration: 5.4 },
  { y: [-3.5, 2.5, -3.5], x: [1.5, -1.2, 1.5], rotate: [-0.4, 0.3, -0.4], duration: 4.4 },
  { y: [3.5, -2.5, 3.5], x: [-1.5, 1.2, -1.5], rotate: [0.4, -0.3, 0.4], duration: 5.8 },
];

interface HeroCampaignStackProps {
  isMobile?: boolean;
}

export default function HeroCampaignStack({ isMobile = false }: HeroCampaignStackProps) {
  // Ordered array of card indices [front, mid-right, mid-left, back]
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [exitParams, setExitParams] = useState({ x: 50, y: -30, rotate: 6 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Parallax shift from mouse position (Desktop only)
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const isShufflingRef = useRef(false);

  // Check accessibility preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const slots = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;

  // Execute one organic card shuffle
  const triggerShuffle = useCallback(() => {
    if (isReducedMotion || isShufflingRef.current) return;
    isShufflingRef.current = true;

    // Controlled randomization: alternate exit direction (right or left peel)
    const dir = Math.random() > 0.4 ? 1 : -1;
    const randomizedExit = isMobile
      ? {
          x: dir * (32 + Math.random() * 12),
          y: -24 - Math.random() * 8,
          rotate: dir * (4 + Math.random() * 2),
        }
      : {
          x: dir * (55 + Math.random() * 18),
          y: -36 - Math.random() * 12,
          rotate: dir * (6 + Math.random() * 3),
        };
    setExitParams(randomizedExit);
    setIsShuffling(true);

    // After the 950ms transition completes, commit the new order state
    setTimeout(() => {
      setOrder((prev) => [prev[1], prev[2], prev[3], prev[0]]);
      setIsShuffling(false);
      isShufflingRef.current = false;
    }, 950);
  }, [isReducedMotion, isMobile]);

  // Stable callback ref so the interval timer never gets torn down by changing state
  const triggerShuffleRef = useRef(triggerShuffle);
  triggerShuffleRef.current = triggerShuffle;

  // Continuous Auto-Shuffle Timer: fires every 3.8 seconds automatically
  useEffect(() => {
    if (isReducedMotion) return;

    const timer = setInterval(() => {
      triggerShuffleRef.current();
    }, 3800);

    return () => clearInterval(timer);
  }, [isReducedMotion]);

  // Manual click to shuffle immediately
  const handleCardClick = (cardIndex: number, slotIndex: number) => {
    if (isShufflingRef.current) return;

    if (slotIndex === 0) {
      // Clicking front card triggers a manual shuffle to next
      triggerShuffle();
    } else {
      // Clicking a back card pulls it to the front
      setOrder((prev) => {
        const remaining = prev.filter((idx) => idx !== cardIndex);
        return [cardIndex, ...remaining];
      });
    }
  };

  // Subtle mouse parallax (desktop only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || isReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseParallax({ x: nx * 6, y: ny * 5 });
  };

  const handleMouseLeave = () => {
    setMouseParallax({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${
        isMobile
          ? "w-[290px] sm:w-[335px] h-[390px] sm:h-[445px] mx-auto my-4"
          : "w-[310px] sm:w-[350px] md:w-[375px] lg:w-[400px] xl:w-[425px] h-[415px] sm:h-[460px] md:h-[490px] lg:h-[515px] xl:h-[540px]"
      } flex items-center justify-center select-none`}
    >
      {/* Background Accent Layer 1: Slanted Red-Orange Panel (Tilted back-left, exactly matching reference) */}
      <div className="absolute inset-0 bg-[#FF3B00] border-[3px] border-[#111111] rotate-[-4.5deg] translate-x-[-12px] sm:translate-x-[-15px] translate-y-[8px] sm:translate-y-[12px] shadow-[4px_4px_0px_#111111] pointer-events-none z-0" />

      {/* Background Accent Layer 2: White Offset Technical Panel (Tilted back-right) */}
      <div className="absolute inset-0 bg-white border-[3px] border-[#111111] rotate-[2.5deg] translate-x-[8px] sm:translate-x-[12px] translate-y-[-4px] sm:translate-y-[-6px] shadow-[4px_4px_0px_#111111] pointer-events-none z-5" />

      {/* Dynamic Stacked Campaign Cards */}
      {order.map((cardIndex, slotIndex) => {
        const card = CAMPAIGN_CARDS[cardIndex];
        const slot = slots[slotIndex];
        const isFront = slotIndex === 0;
        const floatVariant = FLOATING_VARIANTS[cardIndex % FLOATING_VARIANTS.length];

        // Base slot transform
        const targetX = slot.x + (isFront ? mouseParallax.x : mouseParallax.x * 0.4);
        const targetY = slot.y + (isFront ? mouseParallax.y : mouseParallax.y * 0.4);
        const targetRotate = slot.rotate;
        const targetScale = slot.scale;
        const targetZIndex = slot.zIndex;
        const targetOpacity = slot.opacity;

        // Shuffle animation handling
        let shuffleAnimation;
        let shuffleTransition: Transition;

        if (isShuffling) {
          if (slotIndex === 0) {
            // Front card lifts, peels away, then tucks behind into slot 3
            shuffleAnimation = {
              x: [0, exitParams.x, slots[3].x],
              y: [0, exitParams.y, slots[3].y],
              rotate: [0.5, exitParams.rotate, slots[3].rotate],
              scale: [1.0, 1.03, slots[3].scale],
              zIndex: [45, 45, 10, 10],
              opacity: [1.0, 1.0, slots[3].opacity, slots[3].opacity],
            };
            shuffleTransition = {
              duration: 0.95,
              times: [0, 0.48, 0.58, 1.0],
              ease: ["easeInOut", "easeInOut", "easeInOut"],
            };
          } else if (slotIndex === 1) {
            // 2nd card rises to front slot 0
            shuffleAnimation = {
              x: [slots[1].x, slots[0].x],
              y: [slots[1].y, slots[0].y],
              rotate: [slots[1].rotate, slots[0].rotate],
              scale: [slots[1].scale, slots[0].scale],
              zIndex: [30, 40],
              opacity: [slots[1].opacity, slots[0].opacity],
            };
            shuffleTransition = { duration: 0.9, ease: [0.25, 1, 0.35, 1] as const };
          } else if (slotIndex === 2) {
            // 3rd card advances to slot 1
            shuffleAnimation = {
              x: [slots[2].x, slots[1].x],
              y: [slots[2].y, slots[1].y],
              rotate: [slots[2].rotate, slots[1].rotate],
              scale: [slots[2].scale, slots[1].scale],
              zIndex: [20, 30],
              opacity: [slots[2].opacity, slots[1].opacity],
            };
            shuffleTransition = { duration: 0.9, ease: [0.25, 1, 0.35, 1] as const };
          } else {
            // 4th card advances to slot 2
            shuffleAnimation = {
              x: [slots[3].x, slots[2].x],
              y: [slots[3].y, slots[2].y],
              rotate: [slots[3].rotate, slots[2].rotate],
              scale: [slots[3].scale, slots[2].scale],
              zIndex: [10, 20],
              opacity: [slots[3].opacity, slots[2].opacity],
            };
            shuffleTransition = { duration: 0.9, ease: [0.25, 1, 0.35, 1] as const };
          }
        } else {
          // Static resting slot position
          shuffleAnimation = {
            x: targetX,
            y: targetY,
            rotate: targetRotate,
            scale: targetScale,
            zIndex: targetZIndex,
            opacity: targetOpacity,
          };
          shuffleTransition = { duration: 0.4, ease: [0.25, 1, 0.35, 1] as const };
        }

        return (
          <motion.div
            key={card.id}
            animate={shuffleAnimation}
            transition={shuffleTransition}
            onClick={() => handleCardClick(cardIndex, slotIndex)}
            className={`absolute inset-0 origin-center ${
              isFront ? "cursor-pointer" : "cursor-pointer hover:brightness-105"
            }`}
            style={{ zIndex: targetZIndex }}
          >
            {/* Inner Floating Bobbing Motion (Gentle continuous organic hover movement) */}
            <motion.div
              animate={
                isReducedMotion
                  ? { y: 0, x: 0, rotate: 0 }
                  : {
                      y: floatVariant.y,
                      x: floatVariant.x,
                      rotate: floatVariant.rotate,
                    }
              }
              transition={
                isReducedMotion
                  ? { duration: 0.3 }
                  : {
                      duration: floatVariant.duration,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }
              }
              whileHover={
                isFront && !isReducedMotion
                  ? {
                      scale: 1.015,
                      y: -2,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }
                  : undefined
              }
              className="w-full h-full relative"
            >
              {/* Main Card Shell (Physical paper card styling) */}
              <div
                className="absolute inset-0 bg-white border-[3px] border-[#111111] overflow-hidden flex flex-col"
                style={{
                  boxShadow: slot.shadow,
                }}
              >
                {/* Visual Imagery Area */}
                <div className="relative w-full flex-1 min-h-0 bg-[#151515] overflow-hidden">
                  <Image
                    src={card.image}
                    alt={`${card.title} - KAPDOLOGY Drop 001`}
                    fill
                    priority={isFront}
                    sizes="(max-width: 768px) 340px, 450px"
                    className={`object-cover object-center transition-transform duration-700 hover:scale-105 ${
                      card.imageStyle || ""
                    }`}
                  />

                  {/* Top-Left Campaign Identifier Pill */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex items-center gap-1.5 bg-[#111111] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border border-white/20 shadow-[1px_1px_0px_#111111]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B00] inline-block" />
                    <span>{card.badge}</span>
                  </div>

                  {/* Top-Right Technical Registration Mark */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 text-[8px] font-mono tracking-widest text-white/70 bg-[#111111]/80 px-1.5 py-0.5 border border-white/10 hidden sm:block">
                    {card.code}
                  </div>

                  {/* Bottom-Right Stencil Watermark Tag */}
                  <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-10 bg-[#111111]/90 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 border border-white/20 flex items-center gap-1.5">
                    <KapdologyLogo variant="minimal" className="w-12 sm:w-16 h-auto invert brightness-200" />
                  </div>

                  {/* Subtle Subculture Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Editorial Product Spec Footer Bar */}
                <div className="p-2.5 sm:p-3 md:p-3.5 border-t-[3px] border-[#111111] flex justify-between items-center bg-white z-10">
                  <div className="flex flex-col pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#FF3B00]">
                        DROP 001
                      </span>
                      <span className="text-[#111111]/30">•</span>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#111111]/60">
                        {card.gsm}
                      </span>
                    </div>
                    <h3 className="font-black uppercase text-xs sm:text-sm tracking-tight text-[#111111] mt-0.5 truncate max-w-[170px] sm:max-w-[220px]">
                      {card.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    <span className="font-black text-base sm:text-lg text-[#FF3B00] tracking-tight">
                      {card.price}
                    </span>
                    <Link
                      href={card.link}
                      onClick={(e) => e.stopPropagation()}
                      className="hidden xs:inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#111111] hover:text-[#FF3B00] transition-colors p-1"
                    >
                      <span>SHOP</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Tilted Streetwear Spec Sticker (Floats on the top-right corner, outside overflow-hidden) */}
              <div className="absolute -top-3 -right-2 sm:-top-3.5 sm:-right-3.5 z-30 bg-white text-[#111111] border-2 border-[#111111] px-2.5 sm:px-3 py-0.5 sm:py-1 font-black text-[9px] sm:text-[10px] tracking-widest uppercase rotate-[5deg] shadow-[2px_2px_0px_#111111] pointer-events-none">
                {card.specTag}
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Floating Graphic Element: Circular Drop 001 Seal Badge (Overlapping Bottom-Right Corner) */}
      <div
        className={`${
          isMobile ? "hidden sm:flex" : "flex"
        } absolute -bottom-3.5 -right-3.5 sm:-bottom-4 sm:-right-4 z-40 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#111111] text-[#FAF7F2] border-2 sm:border-[3px] border-[#111111] shadow-[3px_3px_0px_#FF3B00] flex-col items-center justify-center p-1.5 text-center rotate-[-10deg] pointer-events-none`}
      >
        <span className="text-[7px] sm:text-[8px] font-mono tracking-widest text-[#FF3B00] font-black uppercase">
          DROP 001
        </span>
        <span className="text-xs sm:text-sm font-black leading-none text-white my-0.5">₹599</span>
        <span className="text-[6px] sm:text-[7px] font-extrabold uppercase tracking-tight text-white/75">
          KAPDOLOGY®
        </span>
      </div>
    </div>
  );
}
