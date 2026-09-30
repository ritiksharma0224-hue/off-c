"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  RefreshCw,
  Crop as CropIcon,
  Move,
} from "lucide-react";

export type AspectRatioPreset = "4:5" | "1:1" | "3:4" | "16:9" | "free";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onApplyCrop: (croppedBlob: Blob, croppedPreviewUrl: string) => Promise<void> | void;
  title?: string;
  defaultPreset?: AspectRatioPreset;
}

const PRESETS: { id: AspectRatioPreset; label: string; ratio: number; desc: string }[] = [
  { id: "4:5", label: "4:5 PORTRAIT", ratio: 4 / 5, desc: "Storefront Card" },
  { id: "1:1", label: "1:1 SQUARE", ratio: 1 / 1, desc: "Feed & Gallery" },
  { id: "3:4", label: "3:4 EDITORIAL", ratio: 3 / 4, desc: "Lookbook" },
  { id: "16:9", label: "16:9 BANNER", ratio: 16 / 9, desc: "Hero Widescreen" },
  { id: "free", label: "FREE", ratio: 0, desc: "Unconstrained" },
];

export default function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onApplyCrop,
  title = "CROP PRODUCT IMAGE",
  defaultPreset = "4:5",
}: ImageCropModalProps) {
  const [preset, setPreset] = useState<AspectRatioPreset>(defaultPreset);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load image whenever imageSrc changes
  useEffect(() => {
    if (!isOpen || !imageSrc) {
      imgRef.current = null;
      setImageLoaded(false);
      return;
    }

    setErrorMessage(null);
    setImageLoaded(false);
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setPreset(defaultPreset);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Fallback without crossOrigin for local data URLs or stubborn servers
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        imgRef.current = fallbackImg;
        setImageLoaded(true);
      };
      fallbackImg.onerror = () => {
        setErrorMessage("Failed to load source image for cropping.");
      };
      fallbackImg.src = imageSrc;
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc, defaultPreset]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  // Redraw preview canvas whenever state changes
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#090B0E";
    ctx.fillRect(0, 0, width, height);

    // Calculate crop frame box based on selected preset
    let cropWidth = width * 0.85;
    let cropHeight = height * 0.85;

    const targetPreset = PRESETS.find((p) => p.id === preset);
    const targetRatio = targetPreset && targetPreset.ratio > 0 ? targetPreset.ratio : img.width / img.height;

    if (targetRatio >= 1) {
      cropWidth = width * 0.85;
      cropHeight = cropWidth / targetRatio;
      if (cropHeight > height * 0.85) {
        cropHeight = height * 0.85;
        cropWidth = cropHeight * targetRatio;
      }
    } else {
      cropHeight = height * 0.85;
      cropWidth = cropHeight * targetRatio;
      if (cropWidth > width * 0.85) {
        cropWidth = width * 0.85;
        cropHeight = cropWidth / targetRatio;
      }
    }

    const cropX = (width - cropWidth) / 2;
    const cropY = (height - cropHeight) / 2;

    // Draw the image transformed inside the canvas
    ctx.save();

    // Clip to the crop area so preview is strictly within crop frame
    ctx.beginPath();
    ctx.rect(cropX, cropY, cropWidth, cropHeight);
    ctx.clip();

    // Center transformation at the center of the crop frame
    ctx.translate(cropX + cropWidth / 2 + offset.x, cropY + cropHeight / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Base scale to cover crop frame
    const scaleToCover = Math.max(cropWidth / img.width, cropHeight / img.height);
    const drawW = img.width * scaleToCover;
    const drawH = img.height * scaleToCover;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Draw dark shaded mask outside the crop frame
    ctx.save();
    ctx.fillStyle = "rgba(10, 12, 16, 0.75)";
    // Top
    ctx.fillRect(0, 0, width, cropY);
    // Bottom
    ctx.fillRect(0, cropY + cropHeight, width, height - (cropY + cropHeight));
    // Left
    ctx.fillRect(0, cropY, cropX, cropHeight);
    // Right
    ctx.fillRect(cropX + cropWidth, cropY, width - (cropX + cropWidth), cropHeight);

    // Draw crop border
    ctx.strokeStyle = "#FF3B00";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);

    // Draw Rule of Thirds grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Vertical grid lines
    ctx.moveTo(cropX + cropWidth / 3, cropY);
    ctx.lineTo(cropX + cropWidth / 3, cropY + cropHeight);
    ctx.moveTo(cropX + (cropWidth * 2) / 3, cropY);
    ctx.lineTo(cropX + (cropWidth * 2) / 3, cropY + cropHeight);
    // Horizontal grid lines
    ctx.moveTo(cropX, cropY + cropHeight / 3);
    ctx.lineTo(cropX + cropWidth, cropY + cropHeight / 3);
    ctx.moveTo(cropX, cropY + (cropHeight * 2) / 3);
    ctx.lineTo(cropX + cropWidth, cropY + (cropHeight * 2) / 3);
    ctx.stroke();

    // Draw crop corner markers
    const cornerLen = 14;
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Top-left
    ctx.moveTo(cropX, cropY + cornerLen);
    ctx.lineTo(cropX, cropY);
    ctx.lineTo(cropX + cornerLen, cropY);
    // Top-right
    ctx.moveTo(cropX + cropWidth - cornerLen, cropY);
    ctx.lineTo(cropX + cropWidth, cropY);
    ctx.lineTo(cropX + cropWidth, cropY + cornerLen);
    // Bottom-left
    ctx.moveTo(cropX, cropY + cropHeight - cornerLen);
    ctx.lineTo(cropX, cropY + cropHeight);
    ctx.lineTo(cropX + cornerLen, cropY + cropHeight);
    // Bottom-right
    ctx.moveTo(cropX + cropWidth - cornerLen, cropY + cropHeight);
    ctx.lineTo(cropX + cropWidth, cropY + cropHeight);
    ctx.lineTo(cropX + cropWidth, cropY + cropHeight - cornerLen);
    ctx.stroke();

    ctx.restore();
  }, [preset, zoom, rotation, offset, imageLoaded]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Pointer / Mouse Drag interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(Math.max(1, prev + delta), 3.5));
  };

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset all adjustments
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  // Apply Crop & Export
  const handleApply = async () => {
    const img = imgRef.current;
    if (!img) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const targetPreset = PRESETS.find((p) => p.id === preset);
      const ratio = targetPreset && targetPreset.ratio > 0 ? targetPreset.ratio : img.width / img.height;

      // Target high-resolution output
      let exportWidth = 1400;
      let exportHeight = Math.round(exportWidth / ratio);

      if (ratio < 1) {
        exportHeight = 1600;
        exportWidth = Math.round(exportHeight * ratio);
      }

      const offscreen = document.createElement("canvas");
      offscreen.width = exportWidth;
      offscreen.height = exportHeight;
      const offCtx = offscreen.getContext("2d");

      if (!offCtx) {
        throw new Error("Unable to create export canvas context");
      }

      // Smooth bicubic resampling
      offCtx.imageSmoothingEnabled = true;
      offCtx.imageSmoothingQuality = "high";

      // Re-map the transform to export coordinates
      // The canvas preview had crop frame width & height:
      const previewCanvas = canvasRef.current;
      const pW = previewCanvas ? previewCanvas.width : 500;
      const pH = previewCanvas ? previewCanvas.height : 500;

      let pCropW = pW * 0.85;
      let pCropH = pH * 0.85;

      if (ratio >= 1) {
        pCropW = pW * 0.85;
        pCropH = pCropW / ratio;
        if (pCropH > pH * 0.85) {
          pCropH = pH * 0.85;
          pCropW = pCropH * ratio;
        }
      } else {
        pCropH = pH * 0.85;
        pCropW = pCropH * ratio;
        if (pCropW > pW * 0.85) {
          pCropW = pW * 0.85;
          pCropH = pCropW / ratio;
        }
      }

      // Scale multiplier between preview crop frame and export canvas
      const scaleMultiplier = exportWidth / pCropW;

      offCtx.translate(
        exportWidth / 2 + offset.x * scaleMultiplier,
        exportHeight / 2 + offset.y * scaleMultiplier
      );
      offCtx.rotate((rotation * Math.PI) / 180);
      offCtx.scale(zoom, zoom);

      const baseCoverScale = Math.max(pCropW / img.width, pCropH / img.height) * scaleMultiplier;
      const finalDrawW = img.width * baseCoverScale;
      const finalDrawH = img.height * baseCoverScale;

      offCtx.drawImage(img, -finalDrawW / 2, -finalDrawH / 2, finalDrawW, finalDrawH);

      // Convert to high-quality WebP / JPEG Blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        offscreen.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Canvas blob conversion failed"));
          },
          "image/jpeg",
          0.92
        );
      });

      const previewUrl = URL.createObjectURL(blob);
      await onApplyCrop(blob, previewUrl);
      onClose();
    } catch (err) {
      setErrorMessage((err as Error).message || "Failed to crop image.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none font-sans text-xs">
      <div className="bg-[#14171F] border border-[#262B36] rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262B36] bg-[#0E1015]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#FF3B00]/10 border border-[#FF3B00]/30 rounded text-[#FF3B00]">
              <CropIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-white uppercase text-sm tracking-wide">{title}</h2>
              <p className="text-[10px] text-[#7B828F] font-mono">
                Drag to reposition • Scroll to zoom • Select aspect ratio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-[#9AA0A6] hover:text-white rounded hover:bg-[#1E232E] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 rounded text-red-400 font-mono text-[11px]">
              {errorMessage}
            </div>
          )}

          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] font-bold text-[#7B828F] uppercase block">
              ASPECT RATIO PRESETS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRESETS.map((p) => {
                const active = preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPreset(p.id);
                      setOffset({ x: 0, y: 0 });
                    }}
                    className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                      active
                        ? "bg-[#FF3B00]/15 border-[#FF3B00] text-white"
                        : "bg-[#0E1015] border-[#262B36] text-[#9AA0A6] hover:border-[#383F4E] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[11px] block">{p.label}</span>
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B00]" />}
                    </div>
                    <span className="text-[9px] text-[#7B828F] font-mono mt-0.5 block">
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Crop Viewport */}
          <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] max-h-[460px] bg-[#090B0E] border border-[#262B36] rounded-lg overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheel}
              className="w-full h-full object-contain touch-none"
            />

            {!imageLoaded && !errorMessage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#090B0E]/80 text-[#9AA0A6]">
                <RefreshCw className="h-6 w-6 animate-spin text-[#FF3B00]" />
                <span className="font-mono text-xs">LOADING CANVAS ASSET...</span>
              </div>
            )}

            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur border border-[#262B36] px-2 py-1 rounded text-[10px] font-mono text-[#9AA0A6] flex items-center gap-1.5 pointer-events-none">
              <Move className="h-3 w-3 text-[#FF3B00]" />
              <span>DRAG TO PAN</span>
            </div>
          </div>

          {/* Controls Bar: Zoom Slider, Rotate, Reset */}
          <div className="bg-[#0E1015] border border-[#262B36] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
            
            {/* Zoom Slider */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <ZoomOut className="h-4 w-4 text-[#7B828F] shrink-0" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#262B36] rounded-lg appearance-none cursor-pointer accent-[#FF3B00]"
              />
              <ZoomIn className="h-4 w-4 text-[#7B828F] shrink-0" />
              <span className="font-mono text-[10px] text-[#9AA0A6] w-12 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                title="Rotate 90°"
                className="px-3 py-1.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white hover:border-[#383F4E] transition-colors flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase cursor-pointer"
              >
                <RotateCw className="h-3.5 w-3.5 text-[#FF3B00]" />
                <span>ROTATE 90° ({rotation}°)</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                title="Reset adjustments"
                className="px-3 py-1.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white hover:border-[#383F4E] transition-colors flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>RESET</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#262B36] bg-[#0E1015]">
          <span className="text-[10px] text-[#7B828F] font-mono">
            Aspect: {preset.toUpperCase()} • High-res WebP/JPEG
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white font-mono text-xs font-bold uppercase transition-colors cursor-pointer disabled:opacity-50"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isProcessing || !imageLoaded}
              className="px-5 py-2 bg-[#FF3B00] text-white font-mono text-xs font-bold uppercase rounded hover:bg-[#e03400] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-[1px_1px_0px_#000]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>PROCESSING & UPLOADING...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>APPLY CROP & SAVE</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
