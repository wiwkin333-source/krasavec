"use client";

import Link from "next/link";
import { categoryUrl } from "@/lib/catalog-data";
import type { Category, Product } from "@/lib/catalog-data";
import { useState, useEffect, useCallback } from "react";

export function ProductPageClient({ cat, prod }: { cat: Category; prod: Product }) {
  const images = [prod.src, ...(prod.gallery ?? [])].filter(Boolean) as string[];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [orderOpen, setOrderOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const goNext = useCallback(() => setCurrentIdx((i) => (i + 1) % images.length), [images.length]);
  const goPrev = useCallback(() => setCurrentIdx((i) => (i - 1 + images.length) % images.length), [images.length]);

  // Keyboard navigation for gallery + zoom
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setZoomed(false); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // Lock body scroll when zoomed
  useEffect(() => {
    if (zoomed) {
      const y = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${y}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, y);
      };
    }
  }, [zoomed]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image gallery */}
        <div>
          {/* Main image with navigation + counter */}
          <div
            className="relative rounded-2xl overflow-hidden aspect-square group cursor-zoom-in"
            style={{ boxShadow: `0 20px 80px -10px ${cat.accent}88` }}
            onClick={() => setZoomed(true)}
          >
            <img
              src={images[currentIdx]}
              alt={`${prod.name} — фото ${currentIdx + 1}`}
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                background: "radial-gradient(ellipse at center, rgba(20,10,40,0.6) 0%, rgba(5,5,16,0.9) 100%)",
              }}
            />

            {/* Navigation arrows — visible on hover or always on mobile */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-foreground/60 hover:text-white hover:scale-110 transition opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Предыдущее фото"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-foreground/60 hover:text-white hover:scale-110 transition opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Следующее фото"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </>
            )}

            {/* Photo counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full glass text-xs font-tech tracking-wider text-foreground/60 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                {currentIdx + 1} / {images.length}
              </div>
            )}

            {/* Zoom hint icon */}
            <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full glass flex items-center justify-center text-foreground/40 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition ${
                    i === currentIdx ? "border-sky-400/60" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${prod.name} — миниатюра ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(20,10,40,0.6) 0%, rgba(5,5,16,0.9) 100%)",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
            <Link
              href={categoryUrl(cat)}
              className="text-xs font-tech uppercase tracking-[.14em] transition hover:opacity-80"
              style={{ color: cat.accent }}
            >
              {cat.title}
            </Link>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">
            {prod.name}
          </h1>

          <p className="text-foreground/60 text-base sm:text-lg leading-relaxed mb-6">
            {prod.desc}
          </p>

          <div className="flex items-end gap-4 mb-8">
            <div className="font-display text-3xl sm:text-4xl text-foreground">{prod.price}</div>
            <div className="text-foreground/30 text-sm font-tech mb-1">за изделие</div>
          </div>

          {/* Order button */}
          <button
            type="button"
            onClick={() => setOrderOpen(true)}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-tech uppercase tracking-[.12em] text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${cat.accent}33, ${cat.accent}11)`,
              border: `1px solid ${cat.accent}55`,
              color: cat.accent,
              boxShadow: `0 0 30px ${cat.accent}22`,
            }}
          >
            <img
              src="/assets/cart-button.webp"
              alt=""
              className="w-8 h-8"
              style={{ filter: "drop-shadow(0 0 8px rgba(139,92,246,.5))" }}
              draggable={false}
            />
            Заказать
          </button>

          {/* Separator */}
          <div
            className="mt-8 h-px w-full"
            style={{ background: `linear-gradient(90deg, ${cat.accent}44, transparent)` }}
          />

          {/* Other products in this category */}
          {cat.products.length > 1 && (
            <div className="mt-6">
              <h3 className="text-foreground/40 text-xs font-tech uppercase tracking-[.14em] mb-3">
                Другие изделия в коллекции
              </h3>
              <div className="flex flex-wrap gap-3">
                {cat.products
                  .filter((p) => p.slug !== prod.slug)
                  .map((p) => (
                    <Link
                      key={p.slug}
                      href={`/catalog/${cat.slug}/${p.slug}`}
                      className="px-4 py-2 rounded-lg glass text-sm font-tech text-foreground/70 hover:text-sky-300 transition"
                    >
                      {p.name} — {p.price}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zoom lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Header: title + counter + close */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <h2 className="font-display text-xl text-foreground">{prod.name}</h2>
                {images.length > 1 && (
                  <span className="text-foreground/40 font-tech text-sm tracking-wider">
                    {currentIdx + 1} / {images.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setZoomed(false)}
                className="font-tech uppercase tracking-[.18em] text-xs px-4 py-2 rounded-full glass hover:scale-105 transition"
              >
                Закрыть &times;
              </button>
            </div>

            {/* Main zoomed image */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden"
              style={{ boxShadow: `0 20px 80px -10px ${cat.accent}88` }}
            >
              <img
                src={images[currentIdx]}
                alt={`${prod.name} — фото ${currentIdx + 1}`}
                className="absolute inset-0 w-full h-full object-contain"
                style={{ background: "radial-gradient(ellipse at center, rgba(20,10,40,0.6) 0%, rgba(5,5,16,0.9) 100%)" }}
              />
            </div>

            {/* Lightbox navigation */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={goPrev}
                  className="px-4 py-2 rounded-full glass hover:scale-105 transition text-sm font-tech"
                  aria-label="Предыдущее фото"
                >
                  &larr;
                </button>
                <div className="flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`w-2.5 h-2.5 rounded-full transition ${
                        i === currentIdx ? "bg-white/80 scale-125" : "bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Фото ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={goNext}
                  className="px-4 py-2 rounded-full glass hover:scale-105 transition text-sm font-tech"
                  aria-label="Следующее фото"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order modal */}
      {orderOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setOrderOpen(false)}
        >
          <div
            className="max-w-md w-full rounded-2xl glass p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: `0 20px 80px -10px ${cat.accent}66` }}
          >
            <h2 className="font-display text-2xl text-foreground mb-2">Заказать {prod.name}</h2>
            <p className="text-foreground/50 text-sm mb-6">
              Выберите удобный способ связи:
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://t.me/gravikot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-xl glass text-sky-300 hover:text-white hover:scale-[1.02] transition font-tech text-sm"
              >
                <span className="text-lg">Telegram</span>
              </a>
              <a
                href="https://wa.me/79001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-xl glass text-green-300 hover:text-white hover:scale-[1.02] transition font-tech text-sm"
              >
                <span className="text-lg">WhatsApp</span>
              </a>
            </div>
            <button
              onClick={() => setOrderOpen(false)}
              className="mt-6 w-full px-4 py-2 rounded-xl glass text-foreground/50 hover:text-foreground transition font-tech text-sm"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
