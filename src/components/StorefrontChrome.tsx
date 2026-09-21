"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CustomCursor from "@/components/ui/CustomCursor";
import KapdologyVideoPreloader from "@/components/KapdologyVideoPreloader";

interface StorefrontChromeProps {
  children: React.ReactNode;
}

export default function StorefrontChrome({ children }: StorefrontChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Return clean children for Admin Panel without storefront navigation, footers, or overlays
    return <>{children}</>;
  }

  return (
    <>
      {/* KAPDOLOGY Full-screen Video Preloader */}
      <KapdologyVideoPreloader />

      {/* Streetwear Grain Overlay */}
      <div className="noise-overlay" />

      {/* Custom Precision Cursor */}
      <CustomCursor />

      {/* Storefront Navigation Header */}
      <Navbar />

      {/* Global Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Main Storefront Content Area */}
      <main className="flex-grow flex flex-col relative z-10">
        {children}
      </main>

      {/* Storefront Editorial Footer */}
      <Footer />
    </>
  );
}
