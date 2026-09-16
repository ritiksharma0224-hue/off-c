"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KapdologyLogo from "./KapdologyLogo";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

interface KapdologyPreloaderProps {
  onComplete?: () => void;
  showControls?: boolean;
}

export default function KapdologyPreloader({
  onComplete,
  showControls = true,
}: KapdologyPreloaderProps) {
  const [elapsed, setElapsed] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  const TOTAL_DURATION = 7.0; // Total 7.0 Seconds

  useEffect(() => {
    // Check if previously completed in this session
    const hasSeenIntro = sessionStorage.getItem("kapdology_intro_seen");
    if (hasSeenIntro === "true") {
      // Allow instant skip or run if explicitly triggered
    }
  }, []);

  // Frame-accurate animation loop
  useEffect(() => {
    if (!isPlaying || isDismissed) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - pausedTimeRef.current * 1000;
      }
      const newElapsed = (timestamp - startTimeRef.current) / 1000;

      if (newElapsed >= TOTAL_DURATION) {
        setElapsed(TOTAL_DURATION);
        setIsPlaying(false);
        setTimeout(() => {
          setIsDismissed(true);
          sessionStorage.setItem("kapdology_intro_seen", "true");
          onComplete?.();
        }, 300);
      } else {
        setElapsed(newElapsed);
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, isDismissed, onComplete]);

  // Handle Play / Pause
  const togglePlay = () => {
    if (isPlaying) {
      pausedTimeRef.current = elapsed;
      setIsPlaying(false);
    } else {
      if (elapsed >= TOTAL_DURATION) {
        handleReplay();
      } else {
        startTimeRef.current = null;
        setIsPlaying(true);
      }
    }
  };

  // Handle Replay
  const handleReplay = () => {
    setIsDismissed(false);
    setElapsed(0);
    pausedTimeRef.current = 0;
    startTimeRef.current = null;
    setIsPlaying(true);
  };

  // Handle Skip
  const handleSkip = () => {
    setIsPlaying(false);
    setIsDismissed(true);
    sessionStorage.setItem("kapdology_intro_seen", "true");
    onComplete?.();
  };

  if (isDismissed) {
    return null;
  }

  // Calculate dynamic properties based on exact 7-second timeline:
  // 0.0 - 1.0s: Pure Black, opacity 0
  // 1.0 - 1.8s: Subtle fade in (0 -> 1) + tiny upward drift (6px -> 0px)
  // 1.8 - 3.5s: Static logo on black background
  // 3.5 - 5.0s: Editorial camera breathing (scale 0.96 -> 1.02)
  // 5.0 - 6.5s: Slow cinematic push (scale 1.02 -> 35.0)
  // 6.5 - 7.0s: Cream texture fills screen & match-cut fade to website

  let opacity = 0;
  let translateY = 6; // pixels
  let scale = 0.96;
  let overlayOpacity = 0; // Cream match-cut transition overlay opacity

  if (elapsed < 1.0) {
    opacity = 0;
    translateY = 6;
    scale = 0.96;
  } else if (elapsed >= 1.0 && elapsed < 1.8) {
    const t = (elapsed - 1.0) / 0.8; // 0 to 1
    // Smooth ease out cubic
    const easeOut = 1 - Math.pow(1 - t, 3);
    opacity = easeOut;
    translateY = 6 * (1 - easeOut);
    scale = 0.96;
  } else if (elapsed >= 1.8 && elapsed < 3.5) {
    opacity = 1;
    translateY = 0;
    scale = 0.96;
  } else if (elapsed >= 3.5 && elapsed < 5.0) {
    opacity = 1;
    translateY = 0;
    const t = (elapsed - 3.5) / 1.5; // 0 to 1
    const easeInOut = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    scale = 0.96 + (1.02 - 0.96) * easeInOut;
  } else if (elapsed >= 5.0 && elapsed < 6.5) {
    opacity = 1;
    translateY = 0;
    const t = (elapsed - 5.0) / 1.5; // 0 to 1
    // Controlled smooth exponential push toward logo texture
    const easeInExpo = Math.pow(t, 2.8);
    scale = 1.02 + (35.0 - 1.02) * easeInExpo;
  } else if (elapsed >= 6.5) {
    opacity = 1;
    scale = 35.0;
    const t = (elapsed - 6.5) / 0.5; // 0 to 1
    overlayOpacity = Math.min(1, t);
  }

  // Current phase text label for developer & user inspection
  let currentPhaseText = "0.0s - PITCH BLACK";
  if (elapsed >= 1.0 && elapsed < 1.8) currentPhaseText = "1.0s - ELEGANT REVEAL";
  else if (elapsed >= 1.8 && elapsed < 3.5) currentPhaseText = "1.8s - STILLNESS";
  else if (elapsed >= 3.5 && elapsed < 5.0) currentPhaseText = "3.5s - CAMERA BREATHING";
  else if (elapsed >= 5.0 && elapsed < 6.5) currentPhaseText = "5.0s - CINEMATIC PUSH";
  else if (elapsed >= 6.5) currentPhaseText = "6.5s - MATCH-CUT TRANSITION";

  return (
    <AnimatePresence>
      <motion.div
        key="kapdology-preloader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-[99999] bg-black text-[#F4F0E6] flex flex-col items-center justify-center overflow-hidden select-none"
      >
        {/* ===================================================
            SUBTLE FILM GRAIN OVERLAY (Steady, intentional noise)
           =================================================== */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* ===================================================
            MAIN LOGO CANVAS CONTAINER
           =================================================== */}
        <div className="relative w-full h-full flex items-center justify-center p-6 md:p-12 z-20">
          <div
            className="w-[82vw] sm:w-[68vw] md:w-[58vw] max-w-[800px] flex items-center justify-center transition-transform"
            style={{
              opacity: opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              transformOrigin: "50% 62%", // Zoom right into the cream logo artwork center
              willChange: "transform, opacity",
            }}
          >
            <KapdologyLogo variant="max" />
          </div>
        </div>

        {/* ===================================================
            MATCH-CUT CREAM OVERLAY LAYER (6.5s - 7.0s)
            LOGO → TEXTURE → WEBSITE
           =================================================== */}
        <div
          className="absolute inset-0 z-30 bg-[#F4F0E6] pointer-events-none transition-opacity duration-300"
          style={{
            opacity: overlayOpacity,
          }}
        />

        {/* ===================================================
            TIMELINE CONTROL BAR & OVERLAY (Minimal Luxury UI)
           =================================================== */}
        {showControls && (
          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-12 md:right-12 z-40 flex flex-col gap-3 pointer-events-auto max-w-4xl mx-auto">
            {/* Scrubber track */}
            <div className="relative w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF3B00] transition-all duration-75 ease-linear"
                style={{ width: `${(elapsed / TOTAL_DURATION) * 100}%` }}
              />
            </div>

            {/* Controls & Timestamp display */}
            <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#F4F0E6]/70 uppercase">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="hover:text-white transition-colors p-1 flex items-center gap-1.5 focus:outline-none"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isPlaying ? "PAUSE" : "PLAY"}</span>
                </button>

                <button
                  onClick={handleReplay}
                  className="hover:text-white transition-colors p-1 flex items-center gap-1.5 focus:outline-none"
                  title="Replay Preloader"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">REPLAY</span>
                </button>

                <span className="text-[#FF3B00] font-bold text-[10px] md:text-xs">
                  {currentPhaseText}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span>
                  {elapsed.toFixed(1)}s / {TOTAL_DURATION.toFixed(1)}s
                </span>

                <button
                  onClick={handleSkip}
                  className="hover:text-white border border-white/20 hover:border-white px-2.5 py-1 rounded text-[10px] tracking-widest transition-all flex items-center gap-1 bg-black/40 backdrop-blur-sm"
                >
                  <span>SKIP INTRO</span>
                  <SkipForward className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
