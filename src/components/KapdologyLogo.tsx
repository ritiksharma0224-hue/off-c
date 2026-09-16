"use client";

import React from "react";
import Image from "next/image";

interface KapdologyLogoProps {
  variant?: "minimal" | "max";
  className?: string;
  alt?: string;
  priority?: boolean;
}

export default function KapdologyLogo({
  variant = "minimal",
  className = "",
  alt = "KAPDOLOGY® Logo",
  priority = false,
}: KapdologyLogoProps) {
  const isMinimal = variant === "minimal";
  const imageSrc = isMinimal ? "/images/logo-minimal.png" : "/images/logo-max.png";
  const width = isMinimal ? 819 : 894;
  const height = isMinimal ? 189 : 335;

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="w-full h-auto object-contain max-h-full"
      />
    </div>
  );
}
