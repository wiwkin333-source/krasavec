"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@/lib/catalog-data";

/**
 * Full-screen product gallery — exact replica of the original Lightbox
 * from CategoryOverlay.tsx in neon-gravikot.
 *
 * Features:
 *  - Click to zoom (1x ↔ 2x), pan when zoomed (pointer capture)
 *  - Horizontal swipe → navigate images, vertical swipe down → close
 *  - Drag-to-close animation (opacity + translateY fade)
 *  - Top pill: title + counter + zoom −/+ + close ✕
 *  - Side arrows: ‹ › with glass + accent glow
 *  - Dot indicators at bottom
 *  - Keyboard: ← → navigate, +/- zoom, Escape close
 *  - Disclaimer text: "Каждое изделие уникально..."
 */

export function ProductPageClient({ cat, prod }: { cat: Category; prod: Product }) {
  const images = [prod.src, ...(prod.gallery ?? [])].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragY, setDragY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swipeAxis = useRef<"x" | "y" | null>(null);
  const panDrag = useRef<{ startX: number; startY: number; baseX: number; baseY: number; pointerId: number } | null>(null);
  const isPanning = useRef(false);
  const router = useRouter();

  const setZoomReset = useCallback((updater: number | ((z: number) => number)) => {
    setZoom((z) => {
      const next = typeof updater === "function" ? (updater as (z: number) => number)(z) : updater;
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const go = useCallback((delta: number) => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIdx((i) => (i + delta + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    containerRef.current?.focus?.();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); router.back(); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); return; }
      if (e.key === "+" || e.key === "=") { e.preventDefault(); setZoomReset((z) => Math.min(4, z + 0.5)); return; }
      if (e.key === "-") { e.preventDefault(); setZoomReset((z) => Math.max(1, z - 0.5)); return; }
      if (e.key === "Tab") {
        const root = containerRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) { e.preventDefault(); return; }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      panDrag.current = null;
      isPanning.current = false;
    };
  }, [go, router, setZoomReset]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swipeAxis.current = null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null || zoom !== 1) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (swipeAxis.current == null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      swipeAxis.current = Math.abs(dy) > Math.abs(dx) ? "y" : "x";
    }
    if (swipeAxis.current === "y" && dy > 0) setDragY(dy);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null || zoom !== 1) {
      touchStartX.current = null; touchStartY.current = null; swipeAxis.current = null; setDragY(0); return;
    }
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (swipeAxis.current === "y") {
      if (dy > 100) { router.back(); }
      setDragY(0);
    } else if (swipeAxis.current === "x" && images.length > 1 && Math.abs(dx) > 40) {
      go(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null; touchStartY.current = null; swipeAxis.current = null;
  };

  const hasMany = images.length > 1;
  const handleClose = () => router.back();

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Просмотр: ${prod.name}`}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col outline-none"
      style={{
        backgroundColor: `rgba(0,0,0,${Math.max(0.4, 0.95 - dragY / 600)})`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Top pill: title + counter + zoom + close */}
      <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none z-10">
        <div className="pointer-events-auto flex items-center gap-4 md:gap-5 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.04] backdrop-blur-md shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]">
          <div className="font-tech text-[11px] tracking-[.14em] text-foreground/40 truncate max-w-[42vw] md:max-w-[280px]">
            {prod.name}
            {hasMany && <span className="ml-2 text-foreground/25">{idx + 1} / {images.length}</span>}
          </div>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label="Уменьшить"
              onClick={(e) => { e.stopPropagation(); setZoomReset((z) => Math.max(1, z - 0.5)); }}
              className="w-7 h-7 flex items-center justify-center rounded-full text-foreground/40 hover:text-foreground/75 hover:bg-white/[0.06] transition text-xs"
            >−</button>
            <button
              type="button"
              aria-label="Увеличить"
              onClick={(e) => { e.stopPropagation(); setZoomReset((z) => Math.min(4, z + 0.5)); }}
              className="w-7 h-7 flex items-center justify-center rounded-full text-foreground/40 hover:text-foreground/75 hover:bg-white/[0.06] transition text-xs"
            >+</button>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              className="w-7 h-7 flex items-center justify-center rounded-full text-foreground/40 hover:text-foreground/75 hover:bg-white/[0.06] transition text-xs"
            >✕</button>
          </div>
        </div>
      </div>

      {/* Main image area */}
      <div
        className="relative flex-1 min-h-0 overflow-hidden pt-14 md:pt-16"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragY === 0 ? "transform 250ms ease-out" : "none",
          opacity: Math.max(0.3, 1 - dragY / 500),
        }}
      >
        {images.map((src, i) => {
          const active = i === idx;
          const zoomed = active && zoom > 1;
          return (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out overflow-hidden"
              style={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none", touchAction: zoomed ? "none" : "auto" }}
            >
              <img
                src={src}
                alt={`${prod.name} ${i + 1}`}
                onClick={(e) => {
                  if (isPanning.current) { isPanning.current = false; return; }
                  e.stopPropagation();
                  setZoomReset((z) => (z === 1 ? 2 : 1));
                }}
                onPointerDown={(e) => {
                  if (!active || zoom <= 1) return;
                  e.stopPropagation();
                  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                  panDrag.current = { startX: e.clientX, startY: e.clientY, baseX: pan.x, baseY: pan.y, pointerId: e.pointerId };
                  isPanning.current = false;
                }}
                onPointerMove={(e) => {
                  const d = panDrag.current;
                  if (!d || d.pointerId !== e.pointerId) return;
                  const dx = e.clientX - d.startX;
                  const dy = e.clientY - d.startY;
                  if (!isPanning.current && Math.abs(dx) + Math.abs(dy) > 4) isPanning.current = true;
                  setPan({ x: d.baseX + dx, y: d.baseY + dy });
                }}
                onPointerUp={(e) => {
                  if (panDrag.current?.pointerId === e.pointerId) {
                    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
                    panDrag.current = null;
                  }
                }}
                onPointerCancel={() => { panDrag.current = null; }}
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  transform: `translate3d(${active ? pan.x : 0}px, ${active ? pan.y : 0}px, 0) scale(${active ? zoom : 1})`,
                  transition: panDrag.current ? "none" : "transform 300ms ease",
                  cursor: zoomed ? (panDrag.current ? "grabbing" : "grab") : "zoom-in",
                  touchAction: zoomed ? "none" : "auto",
                }}
                draggable={false}
              />
            </div>
          );
        })}

        {/* Navigation arrows */}
        {hasMany && (
          <>
            <button
              type="button"
              aria-label="Предыдущее"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 w-12 h-12 rounded-full glass flex items-center justify-center text-2xl text-foreground hover:scale-110 transition"
              style={{ boxShadow: `0 0 20px ${cat.accent}aa` }}
            >‹</button>
            <button
              type="button"
              aria-label="Следующее"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 w-12 h-12 rounded-full glass flex items-center justify-center text-2xl text-foreground hover:scale-110 transition"
              style={{ boxShadow: `0 0 20px ${cat.accent}aa` }}
            >›</button>
            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Слайд ${i + 1}`}
                  onClick={(e) => { e.stopPropagation(); setZoom(1); setPan({ x: 0, y: 0 }); setIdx(i); }}
                  className={`w-2 h-2 rounded-full transition ${i === idx ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none z-10 w-[90%] md:w-[70%]">
          <span className="text-[13px] font-tech text-foreground/60 px-2">
            Каждое изделие уникально, поэтому может слегка отличаться от фото
          </span>
        </div>
      </div>
    </div>
  );
}
