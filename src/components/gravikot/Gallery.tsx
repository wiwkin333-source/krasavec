"use client";

import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react";
import { getHeroVideoUrl, getClickVideoUrl, resolveVideoUrl } from "./Preloader";
import { GiftMaketButton } from "./GiftMaketButton";
import { createPortal } from "react-dom";

// Allow CSS custom properties in React style objects
type CustomCSS = CSSProperties & Record<`--${string}`, string | number>;

type VideoMode = "hero" | "click" | "poster";

// Product images map
const productImages: Record<number, string> = {
  2: "/assets/products/p2.webp",
  3: "/assets/products/p3.webp",
  5: "/assets/products/p5.webp",
  6: "/assets/products/p6.webp",
  7: "/assets/products/p7.webp",
  8: "/assets/products/p8.webp",
  9: "/assets/products/p9.webp",
  10: "/assets/products/p10.webp",
};
const img = (n: number) => productImages[n];

// Import product gallery images
const glass1 = "/assets/products/glass-1.webp";
const glass2 = "/assets/products/glass-2.webp";
const flute1 = "/assets/products/flute-1.webp";
const flute2 = "/assets/products/flute-2.webp";
const dresden1 = "/assets/products/dresden-1.webp";
const dresden2 = "/assets/products/dresden-2.webp";
const gramine1 = "/assets/products/gramine-1.webp";
const gramine2 = "/assets/products/gramine-2.webp";
const gramine3 = "/assets/products/gramine-3.webp";
const gramine4 = "/assets/products/gramine-4.webp";
const gramine5 = "/assets/products/gramine-5.webp";
const gramine6 = "/assets/products/gramine-6.webp";
const gramine7 = "/assets/products/gramine-7.webp";
const maag1 = "/assets/products/maag-1.webp";
const maag2 = "/assets/products/maag-2.webp";
const maag3 = "/assets/products/maag-3.webp";
const maag4 = "/assets/products/maag-4.webp";
const maag5 = "/assets/products/maag-5.webp";
const maag6 = "/assets/products/maag-6.webp";
const collins1 = "/assets/products/collins-1.webp";
const collins2 = "/assets/products/collins-2.webp";
const collins3 = "/assets/products/collins-3.webp";
const collins4 = "/assets/products/collins-4.webp";

type OrbPhase = "idle" | "entering-back" | "entering-front" | "front" | "leaving-front" | "leaving-back";

function OrbCard({
  o,
  onClick,
}: {
  o: (typeof orbits)[number];
  onClick: () => void;
}) {
  const [phase, setPhase] = useState<OrbPhase>("idle");
  const timers = useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const handleEnter = () => {
    clearTimers();
    setPhase("entering-back");
    timers.current.push(window.setTimeout(() => setPhase("entering-front"), 450));
    timers.current.push(window.setTimeout(() => setPhase("front"), 900));
  };
  const handleLeave = () => {
    clearTimers();
    setPhase("leaving-front");
    timers.current.push(window.setTimeout(() => setPhase("leaving-back"), 450));
    timers.current.push(window.setTimeout(() => setPhase("idle"), 900));
  };

  const isFrontLayer =
    phase === "entering-front" || phase === "front" || phase === "leaving-front";
  const isEntering = phase === "entering-back" || phase === "entering-front";
  const isLeaving = phase === "leaving-front" || phase === "leaving-back";
  const isFrontFinal = phase === "front";

  const isRight = o.corner.endsWith("r");
  const isBottom = o.corner.startsWith("b");
  const vOffset = "6%";
  const hOffset = "-3%";

  return (
    <div
      className={`orb-wrapper hidden md:block absolute w-[42%] h-[32%] ${isFrontLayer ? "is-front" : ""}`}
      style={{
        top: isBottom ? "auto" : vOffset,
        bottom: isBottom ? vOffset : "auto",
        left: isRight ? "auto" : hOffset,
        right: isRight ? hOffset : "auto",
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        onClick={onClick}
        className={`card-emerge-orb relative block w-full h-full rounded-2xl glass conic-border overflow-hidden text-left ${
          isEntering ? "is-entering" : ""
        } ${isLeaving ? "is-leaving" : ""} ${isFrontFinal ? "is-front-final" : ""}`}
        style={{
          ["--orb-rot"]: o.tilt,
          ["--orb-shadow"]: o.color,
          ["--tilt"]: o.tilt,
          animation:
            phase === "idle"
              ? `float-slow ${o.dur} ease-in-out ${o.delay} infinite`
              : undefined,
          boxShadow: `0 12px 60px -20px ${o.color}`,
        } as CustomCSS}
      >
        {o.image && (
          <img
            src={o.image}
            alt={`Коллекция ${o.label.replace(/[\u200B-\u200D\uFEFF]/g, "")} — кружки со светящейся гравировкой`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${o.color}22, transparent 70%)` }}
        />
      </button>
    </div>
  );
}

export interface Product { name?: string; desc: string; price: string; src?: string; gallery?: string[] }

const categories: Record<string, { title: string; accent: string; products: Product[] }> = {
  vision: {
    title: "ВИЖН",
    accent: "#29e3ff",
    products: [
      { name: "Грамине", desc: "Теплый свет для теплых напитков.", price: "2499 ₽", src: img(5), gallery: [gramine1, gramine2, gramine3, gramine4, gramine5, gramine6, gramine7] },
      { name: "МААГ", desc: "Когда твой вайб получает подсветку.", price: "2599 ₽", src: img(6), gallery: [maag1, maag2, maag3, maag4, maag5, maag6] },
      { name: "Коллинз", desc: "Ваш коктейль. Ваш стиль. Ваш стакан.", price: "2399 ₽", src: img(7), gallery: [collins1, collins2, collins3, collins4] },
    ],
  },
  clear: {
    title: "КЛИАР",
    accent: "#ff2bd6",
    products: [
      { name: "Гласс", desc: "Для тех, кто любит быть в центре внимания.", price: "2599 ₽", src: img(8), gallery: [glass1, glass2] },
      { name: "ФЛЮТЕ", desc: "Превращает каждый тост в событие.", price: "2399 ₽", src: img(9), gallery: [flute1, flute2] },
      { name: "ДРЕЗДЕН", desc: "Для хорошего пива и отличных историй.", price: "2999 ₽", src: img(10), gallery: [dresden1, dresden2] },
    ],
  },
};

const orbits = [
  { key: "vision", label: "ВИЖН", color: "#29e3ff", corner: "tl", tilt: "-6deg", delay: "0s", dur: "9s", image: img(2) },
  { key: "clear", label: "КЛИАР", color: "#ff2bd6", corner: "tr", tilt: "5deg", delay: "1.2s", dur: "10s", image: img(3) },
] as const;

// ===== Lightbox =====
function Lightbox({
  images, startIndex, accent, title, onClose,
}: { images: string[]; startIndex: number; accent: string; title: string; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [dragY, setDragY] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swipeAxis = useRef<"x" | "y" | null>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const go = useCallback((delta: number) => {
    setZoom(1);
    setIdx((i) => (i + delta + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); return; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swipeAxis.current = null;
    if (zoom > 1) {
      isPanning.current = true;
      panStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, panX: pan.x, panY: pan.y };
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Panning when zoomed
    if (zoom > 1 && isPanning.current) {
      setPan({
        x: panStart.current.panX + (e.touches[0].clientX - panStart.current.x),
        y: panStart.current.panY + (e.touches[0].clientY - panStart.current.y),
      });
      return;
    }
    if (zoom !== 1) return;
    if (swipeAxis.current == null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      swipeAxis.current = Math.abs(dy) > Math.abs(dx) ? "y" : "x";
    }
    if (swipeAxis.current === "y" && dy > 0) setDragY(dy);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (zoom > 1 && isPanning.current) {
      isPanning.current = false;
      touchStartX.current = null; touchStartY.current = null; return;
    }
    if (touchStartX.current == null || touchStartY.current == null || zoom !== 1) {
      touchStartX.current = null; touchStartY.current = null; swipeAxis.current = null; setDragY(0); return;
    }
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (swipeAxis.current === "y") {
      if (dy > 100) onClose();
      setDragY(0);
    } else if (swipeAxis.current === "x" && images.length > 1 && Math.abs(dx) > 40) {
      go(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null; touchStartY.current = null; swipeAxis.current = null;
  };

  // Mouse panning when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    const handleMove = (ev: MouseEvent) => {
      if (!isPanning.current) return;
      setPan({
        x: panStart.current.panX + (ev.clientX - panStart.current.x),
        y: panStart.current.panY + (ev.clientY - panStart.current.y),
      });
    };
    const handleUp = () => {
      isPanning.current = false;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  // Reset pan when zoom changes to 1
  useEffect(() => {
    if (zoom <= 1) setPan({ x: 0, y: 0 });
  }, [zoom]);

  // Reset pan when image changes
  useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [idx]);

  const hasMany = images.length > 1;

  return createPortal(
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Просмотр: ${title}`}
      tabIndex={-1}
      className="fixed inset-0 z-[80] flex flex-col animate-in fade-in duration-200 outline-none"
      onClick={(e) => { e.stopPropagation(); if (zoom > 1) { setZoom(1); } else { onClose(); } }}
      style={{
        backgroundColor: `rgba(0,0,0,${Math.max(0.4, 0.95 - dragY / 600)})`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        // Critical: disable the browser's default touch handling (scroll,
        // pinch-zoom) so touch events go to our JS pan/swipe handlers and
        // not to the underlying CategoryOverlay that has overflow-y-auto.
        // Without this, after zoom-in the page underneath scrolls instead
        // of the image panning.
        touchAction: "none",
      }}
    >
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-center px-2 pointer-events-none" onClick={(e) => e.stopPropagation()}>
        <div className="pointer-events-auto mt-3 md:mt-4 flex items-center gap-1.5 sm:gap-2 md:gap-3 pl-2.5 sm:pl-4 md:pl-5 pr-1 sm:pr-1.5 md:pr-2 py-1.5 md:py-2 rounded-xl max-w-full"
          style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(10,4,24,0.82) 100%)", backdropFilter: "blur(24px) saturate(1.6)", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 8px 40px -4px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
          <div className="flex items-baseline gap-1.5 sm:gap-2 min-w-0">
            <span className="font-display text-xs sm:text-sm md:text-base text-white truncate max-w-[32vw] sm:max-w-[46vw] md:max-w-[280px] leading-tight">{title}</span>
            {hasMany && <span className="font-tech text-[10px] sm:text-[11px] md:text-xs tracking-[.12em] sm:tracking-[.16em] text-sky-300/80 shrink-0">{idx + 1}<span className="mx-0.5 sm:mx-1 text-white/20">/</span>{images.length}</span>}
          </div>
          <div className="w-px h-5 sm:h-6 bg-white/10 mx-0.5 shrink-0" />
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 shrink-0">
            <button type="button" aria-label="Уменьшить" onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(1, z - 0.5)); }}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg text-white/80 hover:text-white transition-all text-base sm:text-lg md:text-xl font-light"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>-</button>
            <button type="button" aria-label="Увеличить" onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(4, z + 0.5)); }}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg text-white/80 hover:text-white transition-all text-base sm:text-lg md:text-xl font-light"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>+</button>
            <div className="w-px h-4 sm:h-5 bg-white/10 mx-0.5 shrink-0" />
            <button type="button" aria-label="Закрыть" onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white transition-all text-base sm:text-lg md:text-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>&times;</button>
          </div>
        </div>
      </div>

      <div className="relative flex-1 min-h-0 overflow-hidden pt-14 md:pt-16"
        onClick={(e) => { e.stopPropagation(); if (zoom > 1) setZoom(1); }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ transform: `translateY(${dragY}px)`, transition: dragY === 0 ? "transform 250ms ease-out" : "none", opacity: Math.max(0.3, 1 - dragY / 500) }}>
        {images.map((src, i) => {
          const active = i === idx;
          return (
            <div key={i} className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out overflow-hidden"
              style={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none" }}>
              <img src={src} alt={`${title} ${i + 1}`} className="max-w-full max-h-full object-contain select-none" loading="lazy" decoding="async"
                onClick={(e) => { e.stopPropagation(); if (zoom > 1) setZoom(1); else setZoom((z) => (z === 1 ? 2 : 1)); }}
                onMouseDown={handleMouseDown}
                style={{ transform: `scale(${active ? zoom : 1}) translate(${active && zoom > 1 ? `${pan.x / zoom}px` : "0px"}, ${active && zoom > 1 ? `${pan.y / zoom}px` : "0px"})`, transition: isPanning.current ? "none" : "transform 300ms ease", cursor: zoom > 1 ? (isPanning.current ? "grabbing" : "grab") : "zoom-in" }}
                draggable={false} />
            </div>
          );
        })}
        {/* Side navigation arrows */}
        {hasMany && zoom === 1 && (
          <>
            <button
              type="button"
              aria-label="Предыдущее фото"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 0 16px rgba(255,255,255,0.05)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Следующее фото"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 0 16px rgba(255,255,255,0.05)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
        <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
          <span className="font-tech text-[10px] md:text-xs tracking-[.12em] text-white/25">Каждое изделие уникально, поэтому может слегка отличаться от фото</span>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ===== CategoryOverlay =====
function CategoryOverlay({
  open, onClose, title, products, accent, onOrder,
}: { open: boolean; onClose: () => void; title: string; products: Product[]; accent: string; onOrder?: () => void }) {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number; title: string } | null>(null);
  const lightboxRef = useRef<{ images: string[]; index: number; title: string } | null>(null);

  useEffect(() => {
    lightboxRef.current = lightbox;
  }, [lightbox]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !lightboxRef.current) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const gridCols = products.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2";

  return createPortal(
    <div className="fixed inset-0 z-[60] bg-background/85 backdrop-blur-xl animate-in fade-in duration-300 flex flex-col p-3 sm:p-6 md:p-12 overflow-y-auto overflow-x-clip"
      onClick={onClose}>
      <div className="flex items-center justify-between mb-6 md:mb-10" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-2xl sm:text-3xl md:text-5xl text-foreground break-words">{title}</h2>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="font-tech uppercase tracking-[.18em] text-xs px-4 py-2 rounded-full glass hover:scale-105 transition">
          Закрыть &times;
        </button>
      </div>
      <div className={`flex-1 grid gap-6 md:gap-10 ${gridCols}`} onClick={(e) => e.stopPropagation()}>
        {products.map((p, idx) => {
          const images = [p.src, ...(p.gallery ?? [])].filter(Boolean) as string[];
          return (
            <div key={idx}
              className="relative rounded-2xl overflow-hidden glass text-left flex flex-col animate-in fade-in zoom-in-75 slide-in-from-bottom-8 min-h-[40vh] sm:min-h-[60vh]"
              style={{ boxShadow: `0 20px 80px -10px ${accent}cc, 0 0 0 1px ${accent}55`, animationDelay: `${idx * 90}ms`, animationDuration: "600ms", animationFillMode: "both" }}>
              <button type="button"
                onClick={(e) => { e.stopPropagation(); setLightbox({ images, index: 0, title: p.name ?? "" }); }}
                className="relative flex-1 min-h-0 bg-transparent border-0 p-0 cursor-zoom-in text-left"
                aria-label={`Открыть ${p.name}`}>
                <img src={p.src} alt={`Гравировка на стекле — ${p.name}, ${p.desc}`}
                  className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
              </button>
              <div className="px-4 sm:px-6 py-4 sm:py-5 bg-black/80 backdrop-blur-sm">
                <div className="text-sm sm:text-base md:text-lg font-tech uppercase tracking-[.1em] sm:tracking-[.14em] text-sky-200 break-words">{p.name}</div>
                <div className="text-sm sm:text-base text-foreground/70 leading-snug mt-1 break-words">{p.desc}</div>
                <div className="flex items-center justify-between gap-3 mt-2">
                  <div className="text-lg sm:text-xl md:text-2xl font-display text-foreground">{p.price}</div>
                  {onOrder && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); onOrder(); }} aria-label="Заказать"
                      className="shrink-0 bg-transparent border-0 p-0 cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none rounded-xl">
                      <img src="/assets/cart-button.webp" alt="Заказать" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 select-none"
                        style={{ filter: "drop-shadow(0 0 12px rgba(139,92,246,.55)) drop-shadow(0 0 20px rgba(41,227,255,.35))" }}
                        draggable={false} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {lightbox && (
        <Lightbox images={lightbox.images} startIndex={lightbox.index} accent={accent} title={lightbox.title} onClose={() => setLightbox(null)} />
      )}
    </div>,
    document.body
  );
}

// ===== Gallery =====
export function Gallery({ onOrder, canPlay }: { onOrder: () => void; canPlay?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modeRef = useRef<VideoMode>("hero");
  const [showPoster, setShowPoster] = useState(false);

  const waitForReady = (v: HTMLVideoElement, timeoutMs = 4000): Promise<void> => {
    return new Promise((resolve) => {
      if (v.readyState >= 3) { resolve(); return; }
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        v.removeEventListener("canplay", finish);
        v.removeEventListener("canplaythrough", finish);
        v.removeEventListener("loadeddata", finish);
        resolve();
      };
      v.addEventListener("canplay", finish);
      v.addEventListener("canplaythrough", finish);
      v.addEventListener("loadeddata", finish);
      window.setTimeout(finish, timeoutMs);
    });
  };

  const playMode = async (mode: VideoMode) => {
    const v = videoRef.current;
    if (!v) return;
    modeRef.current = mode;
    setShowPoster(false);

    const playbackUrl = mode === "hero" ? getHeroVideoUrl() : getClickVideoUrl();

    if (v.currentSrc !== playbackUrl && v.src !== playbackUrl) {
      v.src = playbackUrl;
      v.load();
    }

    await waitForReady(v);
    try { await v.play(); } catch { /* autoplay may be blocked */ }
  };

  const handleCapsuleClick = () => {
    const mode = modeRef.current;
    if (mode === "hero" || mode === "poster") {
      playMode("click");
    } else if (mode === "click") {
      playMode("click");
    }
  };

  const handleVideoEnded = () => {
    if (modeRef.current === "click") {
      modeRef.current = "poster";
      setShowPoster(true);
    } else if (modeRef.current === "hero") {
      // Hero plays once, then fade to poster
      modeRef.current = "poster";
      setShowPoster(true);
    }
  };

  const handleVideoError = () => {
    const v = videoRef.current;
    if (!v) return;
    // Fallback: try alternate format
    const fmt = v.src.includes(".webm") ? "mp4" : "webm";
    const fallbackUrl = modeRef.current === "click"
      ? `/assets/click.${fmt}`
      : `/assets/hero.${fmt}`;
    v.src = fallbackUrl;
    v.load();
    waitForReady(v).then(() => v.play().catch(() => {}));
  };

  // Start video only after preloader completes (canPlay becomes true)
  useEffect(() => {
    if (!canPlay) return;
    const v = videoRef.current;
    if (!v) return;

    let isVisible = true;

    // Initial play after preloader
    const timer = setTimeout(() => playMode("hero"), 0);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!isVisible) {
              // Re-entering viewport: restart hero from the beginning
              isVisible = true;
              playMode("hero");
            }
          } else {
            // Leaving viewport: pause video
            isVisible = false;
            v.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => { clearTimeout(timer); io.disconnect(); };
  }, [canPlay]);

  // Block pinch-zoom
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", prevent, { passive: false });
    document.addEventListener("gesturechange", prevent, { passive: false });
    document.addEventListener("gestureend", prevent, { passive: false });
    const onWheel = (e: WheelEvent) => { if (e.ctrlKey) e.preventDefault(); };
    document.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.removeEventListener("gesturestart", prevent);
      document.removeEventListener("gesturechange", prevent);
      document.removeEventListener("gestureend", prevent);
      document.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <>
      <section className="relative py-6 sm:py-10 px-4 overflow-hidden" aria-label="Каталог гравировки">
        <h2 className="sr-only">Каталог коллекций</h2>
        <div className="relative mx-auto max-w-full" style={{ width: "min(820px, 100%)", aspectRatio: "1 / 1" }}>
          {/* glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] max-w-[90vw] max-h-[90vw] rounded-full animate-pulse-glow pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,.4), rgba(255,43,214,.3) 40%, transparent 70%)" }} />

          {orbits.map((o) => (
            <OrbCard key={o.key} o={o} onClick={() => setOpen(o.key)} />
          ))}

          {/* central window wrapper */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] h-[92%] md:w-[58%] md:h-[58%] aspect-square" style={{ zIndex: 20 }}>
            <div className="relative w-full h-full animate-float-slow">
              <div className="hero-sonar" aria-hidden="true">
                <span /><span /><span />
              </div>
              <div className="absolute overflow-hidden glass cursor-pointer"
                onClick={handleCapsuleClick}
                style={{
                  inset: "1px",
                  zIndex: 2,
                  borderRadius: 0,
                  boxShadow: "inset 0 0 40px rgba(41,227,255,.12), inset 0 0 60px rgba(139,92,246,.08), 0 0 40px rgba(41,227,255,.15), 0 0 80px rgba(255,43,214,.1)",
                }}>
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  preload="none"
                  poster="/assets/gravikot-poster.webp"
                  disablePictureInPicture
                  disableRemotePlayback
                  controlsList="nodownload"
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                />
                <img
                  src="/assets/gravikot-poster.webp"
                  alt="Логотип мастерской ГРАВИКОТ"
                  aria-hidden={!showPoster}
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover bg-black pointer-events-none"
                  style={{ opacity: showPoster ? 1 : 0, transition: "opacity 1.5s ease-in-out" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* mobile: gift button */}
      <section className="md:hidden px-4 py-0 flex justify-center">
        <GiftMaketButton onClick={onOrder} />
      </section>

      {/* mobile: vertical stack of category cards */}
      <section className="md:hidden px-4 pb-6 -mt-2">
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {orbits.map((o) => (
            <button
              key={o.key}
              onClick={() => setOpen(o.key)}
              className="relative block w-full rounded-2xl glass conic-border text-left aspect-[4/3]"
              style={{ boxShadow: `0 12px 60px -20px ${o.color}` }}>
              <span className="absolute inset-0 block rounded-2xl overflow-hidden">
                {o.image && (
                  <img src={o.image} alt={`Коллекция ${o.label}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                )}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${o.color}33, transparent 70%)` }} />
              </span>
              {(o.key === "vision" || o.key === "clear") && (
                <span aria-hidden="true" className={`sparkle-trace ${o.key === "clear" ? "reverse" : ""}`} />
              )}
            </button>
          ))}
        </div>
      </section>

      {Object.entries(categories).map(([key, c]) => (
        <CategoryOverlay
          key={key}
          open={open === key}
          onClose={() => setOpen(null)}
          title={c.title}
          products={c.products}
          accent={c.accent}
          onOrder={onOrder}
        />
      ))}
    </>
  );
}
