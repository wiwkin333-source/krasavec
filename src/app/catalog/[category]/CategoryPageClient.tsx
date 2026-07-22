"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { categoryUrl, productUrl } from "@/lib/catalog-data";
import type { Category } from "@/lib/catalog-data";
import { useState } from "react";
import { SvoyButton } from "@/components/gravikot/SvoyButton";

export function CategoryPageClient({ cat, showBackButton }: { cat: Category; showBackButton?: boolean }) {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number; title: string } | null>(null);
  const router = useRouter();

  const gridCols = cat.products.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2";

  return (
    <>
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
      <div className={`grid gap-6 md:gap-8 ${gridCols}`}>
        {cat.products.map((p, idx) => {
          const images = [p.src, ...(p.gallery ?? [])].filter(Boolean) as string[];
          return (
            <div
              key={p.slug}
              className="relative rounded-2xl overflow-hidden glass text-left flex flex-col animate-in fade-in zoom-in-75 slide-in-from-bottom-8"
              style={{
                boxShadow: `0 20px 80px -10px ${cat.accent}cc, 0 0 0 1px ${cat.accent}55`,
                animationDelay: `${idx * 90}ms`,
                animationDuration: "600ms",
                animationFillMode: "both",
              }}
            >
              {/* Product image — fill container on desktop, contain on mobile */}
              <Link href={productUrl(cat, p)} className="relative aspect-[4/3] bg-transparent border-0 p-0 text-left block group overflow-hidden">
                <img
                  src={p.src}
                  alt={`${p.name} — ${p.desc} Коллекция ${cat.title}. Кружка, чашка, бокал, фужер, стакан со светящейся гравировкой на стекле ГРАВИКОТ, фото 1`}
                  title={`${p.name} — ${p.price}`}
                  className="absolute inset-0 w-full h-full object-contain md:object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(20,10,40,0.6) 0%, rgba(5,5,16,0.9) 100%)",
                  }}
                />
                {/* Zoom hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none">
                  <span className="text-white/70 text-sm font-tech uppercase tracking-wider">Подробнее</span>
                </div>
              </Link>

              {/* Product info */}
              <div className="px-4 sm:px-6 py-4 sm:py-5 bg-black/80 backdrop-blur-sm">
                <Link href={productUrl(cat, p)}>
                  <div className="text-sm sm:text-base md:text-lg font-tech uppercase tracking-[.1em] sm:tracking-[.14em] text-sky-200 break-words hover:text-sky-100 transition">
                    {p.name}
                  </div>
                </Link>
                <div className="text-sm sm:text-base text-foreground/70 leading-snug mt-1 break-words">
                  {p.desc}
                </div>
                <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
                  <div className="text-lg sm:text-xl md:text-2xl font-display text-foreground">
                    {p.price}
                  </div>
                  <SvoyButton />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <LightboxModal
          images={lightbox.images}
          startIndex={lightbox.index}
          accent={cat.accent}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>

    {/* Back button — navigate directly to homepage, skip preloader */}
    {showBackButton && (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center">
        <button
          type="button"
          onClick={() => {
            // Flag: skip preloader when returning from category page
            try { sessionStorage.setItem('gravikot_skip_preloader', '1'); } catch {}
            router.push('/');
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-sky-300 hover:text-white hover:scale-105 transition font-tech text-sm"
        >
          &larr; Вернуться на главную
        </button>
      </div>
    )}
    </>
  );
}

/** Simple lightbox for the category page */
function LightboxModal({
  images,
  startIndex,
  accent,
  title,
  onClose,
}: {
  images: string[];
  startIndex: number;
  accent: string;
  title: string;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-xl text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="font-tech uppercase tracking-[.18em] text-xs px-4 py-2 rounded-full glass hover:scale-105 transition"
          >
            Закрыть &times;
          </button>
        </div>
        <div className="relative aspect-square rounded-2xl overflow-hidden" style={{ boxShadow: `0 20px 80px -10px ${accent}88` }}>
          <img
            src={images[idx]}
            alt={`${title} — фото ${idx + 1} светящаяся гравировка на стекле ГРАВИКОТ`}
            title={`${title} — фото ${idx + 1} из ${images.length}`}
            className="absolute inset-0 w-full h-full object-contain"
            style={{ background: "radial-gradient(ellipse at center, rgba(20,10,40,0.6) 0%, rgba(5,5,16,0.9) 100%)" }}
          />
        </div>
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              className="px-4 py-2 rounded-full glass hover:scale-105 transition text-sm font-tech"
            >
              &larr;
            </button>
            <span className="text-foreground/50 font-tech text-sm">
              {idx + 1} / {images.length}
            </span>
            <button
              onClick={() => setIdx((i) => (i + 1) % images.length)}
              className="px-4 py-2 rounded-full glass hover:scale-105 transition text-sm font-tech"
            >
              &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
