"use client";

import { useRouter } from "next/navigation";
import { categoryUrl } from "@/lib/catalog-data";
import type { Category, Product } from "@/lib/catalog-data";
import { useState, useEffect, useCallback } from "react";

export function ProductPageClient({ cat, prod }: { cat: Category; prod: Product }) {
  const images = [prod.src, ...(prod.gallery ?? [])].filter(Boolean) as string[];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const router = useRouter();

  const goNext = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIdx((i) => (i - 1 + images.length) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  const zoomIn = useCallback(() => setZoomLevel((z) => Math.min(z + 0.5, 3)), []);
  const zoomOut = useCallback(() => setZoomLevel((z) => Math.max(z - 0.5, 1)), []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { router.back(); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomIn(); }
      if (e.key === "-") { e.preventDefault(); zoomOut(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, zoomIn, zoomOut, router]);

  const handleClose = () => router.back();

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a18] flex flex-col">
      {/* Top bar: name + counter + zoom controls + close */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-display text-lg text-foreground">{prod.name}</span>
          {images.length > 1 && (
            <span className="text-foreground/40 font-tech text-sm tracking-wider">
              {currentIdx + 1} / {images.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom out */}
          <button
            onClick={zoomOut}
            disabled={zoomLevel <= 1}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-foreground/60 hover:text-foreground transition disabled:opacity-30 disabled:cursor-default"
            aria-label="Уменьшить"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
          {/* Zoom in */}
          <button
            onClick={zoomIn}
            disabled={zoomLevel >= 3}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-foreground/60 hover:text-foreground transition disabled:opacity-30 disabled:cursor-default"
            aria-label="Увеличить"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
          {/* Close */}
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-foreground/60 hover:text-foreground transition"
            aria-label="Закрыть"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden min-h-0">
        {/* Left arrow */}
        {images.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-3 sm:left-6 z-10 w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-foreground/50 hover:text-foreground transition"
            aria-label="Предыдущее фото"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}

        {/* Image */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center"
          style={{
            width: zoomLevel > 1 ? "auto" : "90%",
            height: zoomLevel > 1 ? "auto" : "90%",
          }}
        >
          <img
            src={images[currentIdx]}
            alt={`${prod.name} — фото ${currentIdx + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-300"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
            }}
            draggable={false}
          />
        </div>

        {/* Right arrow */}
        {images.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-3 sm:right-6 z-10 w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-foreground/50 hover:text-foreground transition"
            aria-label="Следующее фото"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
      </div>

      {/* Bottom disclaimer */}
      <div className="shrink-0 text-center py-3 px-4">
        <p className="text-foreground/25 text-xs font-tech tracking-wide">
          Каждое изделие уникально, поэтому может слегка отличаться от фото
        </p>
      </div>
    </div>
  );
}
