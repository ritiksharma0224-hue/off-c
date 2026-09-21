"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const PRELOADER_STORAGE_KEY = "kapdology_preloader_seen_at";
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function KapdologyVideoPreloader() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // Real-time video playback time & percentage
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(7.0);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const markAsSeen = useCallback(() => {
    try {
      localStorage.setItem(PRELOADER_STORAGE_KEY, Date.now().toString());
    } catch {
      // Storage unavailable or disabled
    }
  }, []);

  const handleCompleteImmediately = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    document.body.style.overflow = "";
    setIsVisible(false);
    markAsSeen();
  }, [markAsSeen]);

  const handleComplete = useCallback(() => {
    if (isFading) return;
    setProgress(100);
    setIsFading(true);
    markAsSeen();

    // Smooth opacity dissolve into storefront
    setTimeout(() => {
      handleCompleteImmediately();
    }, 500);
  }, [isFading, markAsSeen, handleCompleteImmediately]);

  // Fast skip triggered by user clicking the button or pressing ESC / Space
  const handleSkip = useCallback(() => {
    if (isFading) return;
    markAsSeen();
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {
        // Safe catch if video is already unloading
      }
    }
    setIsFading(true);
    setTimeout(() => {
      handleCompleteImmediately();
    }, 250);
  }, [isFading, markAsSeen, handleCompleteImmediately]);

  useEffect(() => {
    setIsMounted(true);

    // Support force preview via URL parameter (e.g., ?intro=1 or ?preloader=1)
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const forceIntro = urlParams?.get("intro") === "1" || urlParams?.get("preloader") === "1";

    // Frequency check: only show once in 24 hours for each user
    if (!forceIntro) {
      try {
        const lastSeen = localStorage.getItem(PRELOADER_STORAGE_KEY);
        if (lastSeen) {
          const lastTimestamp = parseInt(lastSeen, 10);
          if (!isNaN(lastTimestamp) && Date.now() - lastTimestamp < TWENTY_FOUR_HOURS_MS) {
            // Already seen within 24 hours; do not display preloader
            return;
          }
        }
      } catch {
        // Fallback gracefully
      }
    }

    // Reduced motion preference check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    // Activate preloader & lock document scroll
    setIsVisible(true);
    markAsSeen();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Safety fallback timeout (max 10s)
    timeoutRef.current = setTimeout(() => {
      handleComplete();
    }, 10000);

    return () => {
      document.body.style.overflow = originalOverflow;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [markAsSeen, handleComplete]);

  // Keyboard shortcut listener: ESC or Space to skip animation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleSkip]);

  // Programmatically trigger video playback once visible
  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(() => {
        handleCompleteImmediately();
      });
    }
  }, [isVisible, handleCompleteImmediately]);

  // Synchronize playback timestamp & progress percentage
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 7.0;
      setCurrentTime(cur);
      setDuration(dur);
      const pct = Math.min(100, Math.floor((cur / dur) * 100));
      setProgress(pct);
    }
  };

  if (!isMounted || !isVisible) {
    return null;
  }

  // Calculate technical process message based on current timestamp
  let processMessage = "> initializing kapdology...";
  let isReadyState = false;

  if (currentTime >= 0.5 && currentTime < 1.5) {
    processMessage = "> loading visual_identity...";
  } else if (currentTime >= 1.5 && currentTime < 2.5) {
    processMessage = "> compiling drop_001...";
  } else if (currentTime >= 2.5 && currentTime < 3.5) {
    processMessage = "> loading garments...";
  } else if (currentTime >= 3.5 && currentTime < 4.5) {
    processMessage = "> syncing culture...";
  } else if (currentTime >= 4.5 && currentTime < 5.5) {
    processMessage = "> preparing experience...";
  } else if (currentTime >= 5.5) {
    processMessage = "> system_ready";
    isReadyState = true;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] bg-black text-[#FAF7F2] flex flex-col justify-between overflow-hidden select-none transition-opacity duration-500 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        transitionDuration: isFading ? "300ms" : "500ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Seamless Full-Screen Edge-to-Edge Video Asset */}
      <video
        ref={videoRef}
        src="/images/1080p.non-logo.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleComplete}
        onError={handleCompleteImmediately}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none border-none outline-none"
      />

      {/* Subtle Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* TOP-RIGHT: Skip Animation Interactive Button */}
      <div className="absolute top-5 right-5 md:top-8 md:right-10 z-40 pointer-events-auto">
        <button
          onClick={handleSkip}
          type="button"
          className="group flex items-center gap-2.5 px-4 py-2 bg-black/75 hover:bg-[#FF3B00] text-[#FAF7F2] border-2 border-white/20 hover:border-[#FF3B00] backdrop-blur-md font-mono text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-200 shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:shadow-[3px_3px_0px_#111111] hover:text-white cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          aria-label="Skip intro animation"
        >
          <span>SKIP ANIMATION</span>
          <span className="font-mono text-[9px] text-[#FAF7F2]/50 group-hover:text-white/80 font-bold">
            [ESC]
          </span>
          <span className="text-[#FF3B00] group-hover:text-white group-hover:translate-x-0.5 transition-transform duration-150">
            →
          </span>
        </button>
      </div>

      {/* BOTTOM PROCESSING AREA: Technical Readout Interface */}
      <div className="absolute bottom-6 left-6 right-6 md:bottom-9 md:left-12 md:right-12 z-30 pointer-events-none flex flex-col gap-2 max-w-5xl mx-auto font-mono text-[10px] md:text-[11px] tracking-wider uppercase">
        
        {/* Top Status Line: Monospace Process Message + Percentage */}
        <div className="flex items-center justify-between text-[#FAF7F2]/80">
          <div className="flex items-center gap-2">
            <span className={isReadyState ? "text-[#FF3B00] font-bold" : "text-[#FAF7F2]/80"}>
              {processMessage}
            </span>
            {/* Blinking Cursor */}
            <span className="w-1.5 h-3 bg-[#FF3B00] inline-block animate-pulse" />
          </div>

          <div className="flex items-center gap-1 font-bold text-[#FAF7F2]/90">
            <span>{String(progress).padStart(2, "0")}%</span>
          </div>
        </div>

        {/* Minimal 1.5px Horizontal Progress Indicator */}
        <div className="w-full h-[1.5px] bg-[#FAF7F2]/10 rounded-full overflow-hidden my-0.5">
          <div
            className="h-full bg-[#FF3B00] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Micro Metadata Line */}
        <div className="flex items-center justify-between text-[9px] md:text-[10px] text-[#FAF7F2]/40 tracking-widest">
          <div className="flex items-center gap-3">
            <span>KPD/001</span>
            <span>•</span>
            <span>BUILD 01</span>
            <span>•</span>
            <span>DROP 001</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#FF3B00]" />
            <span>JAIPUR → INDIA</span>
          </div>
        </div>

      </div>
    </div>
  );
}
