"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [mounted, setMounted] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 300, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const cursorXSpringFast = useSpring(cursorX, { damping: 40, stiffness: 400 });
  const cursorYSpringFast = useSpring(cursorY, { damping: 40, stiffness: 400 });

  useEffect(() => {
    setMounted(true);
    
    // Disable on mobile/tablet devices
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("clickable")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!mounted || isMobile) return null;

  return (
    <>
      {/* Outer ring cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-text-black pointer-events-none z-9999 mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: hovered ? 1.8 : 1,
          borderColor: hovered ? "#0052FF" : "#111111",
          backgroundColor: hovered ? "rgba(0, 82, 255, 0.1)" : "rgba(0,0,0,0)",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />
      {/* Center dot cursor */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-text-black rounded-full pointer-events-none z-9999 mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpringFast,
          y: cursorYSpringFast,
          translateX: 12,
          translateY: 12,
        }}
        animate={{
          scale: hovered ? 0 : 1,
        }}
      />
    </>
  );
}
