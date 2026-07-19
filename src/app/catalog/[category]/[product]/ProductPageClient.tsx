"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@/lib/catalog-data";

/**
 * Full-screen product gallery.
 *
 * Features:
 *  - Click to zoom (1x ↔ 2x), pan when zoomed (pointer capture on wrapper)
 *  - Horizontal swipe → navigate, vertical swipe down → close with drag animation
 *  - Top bar: title + zoom −/+ + close ✕
 *  - Side arrows: round, dark translucent, white chevrons
 *  - Dot indicators at bottom
 *  - Keyboard: ← → navigate, +/- zoom, Escape close
 *  - Disclaimer: very dim text
 */

export function ProductPageClient({ cat, prod }: { cat: Category; prod: Product }) {
  const images = [prod.src, ...(prod.gallery ?? [])].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragY, setDragY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
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

  const goBack = useCallback(() => {
    sessionStorage.setItem("__gravikot_skip_preload__", "1");
    router.back();
  }, [router]);

  useEffect(() => {
    containerRef.current?.focus?.();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); goBack(); return; }
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
  }, [go, goBack, setZoomReset]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Touch handlers for swipe — only when NOT zoomed
  const onTouchStart = (e: React.TouchEvent) => {
    if (zoom !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swipeAxis.current = null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null || zoom !== 1) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Determine swipe axis after minimal movement (3px threshold for instant axis detection)
    if (swipeAxis.current == null && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      swipeAxis.current = Math.abs(dy) > Math.abs(dx) ? "y" : "x";
    }
    // Vertical drag-to-close: apply 1:1 instantly — no amplification lag
    if (swipeAxis.current === "y" && dy > 0) {
      setDragY(dy);
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null || zoom !== 1) {
      touchStartX.current = null; touchStartY.current = null; swipeAxis.current = null; setDragY(0); return;
    }
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (swipeAxis.current === "y") {
      // Close on downward swipe — 20px threshold for instant reaction
      if (dy > 20) { goBack(); }
      setDragY(0);
    } else if (swipeAxis.current === "x" && images.length > 1 && Math.abs(dx) > 30) {
      go(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null; touchStartY.current = null; swipeAxis.current = null;
  };

  // Pointer handlers for panning when zoomed — attached to the WRAPPER div
  // so the entire image area is draggable, not just the img element
  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    (imageWrapperRef.current as HTMLElement).setPointerCapture(e.pointerId);
    panDrag.current = { startX: e.clientX, startY: e.clientY, baseX: pan.x, baseY: pan.y, pointerId: e.pointerId };
    isPanning.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = panDrag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!isPanning.current && Math.abs(dx) + Math.abs(dy) > 2) isPanning.current = true;
    setPan({ x: d.baseX + dx, y: d.baseY + dy });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (panDrag.current?.pointerId === e.pointerId) {
      try { (imageWrapperRef.current as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
      panDrag.current = null;
    }
  };

  const hasMany = images.length > 1;
  const handleClose = () => goBack();

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Просмотр: ${prod.name}`}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col outline-none"
      style={{
        backgroundColor: `rgba(0,0,0,${Math.max(0.4, 0.95 - dragY / 400)})`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Top bar: title + zoom + close — dark translucent, visible on any background */}
      <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none z-10">
        <div
          className="pointer-events-auto flex items-center gap-4 md:gap-5 px-5 py-2.5 rounded-full"
          style={{
            background: "rgba(0,0,0,0.55)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <div className="font-tech text-[11px] tracking-[.14em] text-white/80 truncate max-w-[42vw] md:max-w-[280px]">
            {prod.name}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Уменьшить"
              onClick={(e) => { e.stopPropagation(); setZoomReset((z) => Math.max(1, z - 0.5)); }}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition text-sm"
            >−</button>
            <button
              type="button"
              aria-label="Увеличить"
              onClick={(e) => { e.stopPropagation(); setZoomReset((z) => Math.min(4, z + 0.5)); }}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition text-sm"
            >+</button>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition text-sm"
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
          opacity: Math.max(0.2, 1 - dragY / 300),
        }}
      >
        {/* Wrapper captures pointer for panning — covers entire image area */}
        <div
          ref={imageWrapperRef}
          className="absolute inset-0"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { panDrag.current = null; }}
          style={{ touchAction: zoom > 1 ? "none" : "auto", cursor: zoom > 1 ? (panDrag.current ? "grabbing" : "grab") : "zoom-in" }}
        >
          {images.map((src, i) => {
            const active = i === idx;
            return (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out overflow-hidden"
                style={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none" }}
              >
                <img
                  src={src}
                  alt={`${prod.name} ${i + 1}`}
                  onClick={(e) => {
                    if (isPanning.current) { isPanning.current = false; return; }
                    e.stopPropagation();
                    setZoomReset((z) => (z === 1 ? 2 : 1));
                  }}
                  className="max-w-full max-h-full object-contain select-none"
                  style={{
                    transform: `translate3d(${active ? pan.x : 0}px, ${active ? pan.y : 0}px, 0) scale(${active ? zoom : 1})`,
                    transition: panDrag.current ? "none" : "transform 300ms ease",
                  }}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* Navigation arrows — round, dark translucent, visible on any background */}
        {hasMany && (
          <>
            <button
              type="button"
              aria-label="Предыдущее"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute top-1/2 -translate-y-1/2 left-3 md:left-6 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition hover:scale-110 z-10"
              style={{
                background: "rgba(0,0,0,0.5)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              type="button"
              aria-label="Следующее"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute top-1/2 -translate-y-1/2 right-3 md:right-6 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition hover:scale-110 z-10"
              style={{
                background: "rgba(0,0,0,0.5)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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

        {/* Disclaimer — very dim */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none z-10 w-[90%] md:w-[70%]">
          <span className="text-[13px] font-tech text-white/20 px-2">
            Каждое изделие уникально, поэтому может слегка отличаться от фото
          </span>
        </div>
      </div>
    </div>
  );
}
