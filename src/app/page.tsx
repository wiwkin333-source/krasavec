"use client";

import { useState, useEffect, useCallback } from "react";
import { Preloader } from "@/components/gravikot/Preloader";
import { StarrySky } from "@/components/gravikot/StarrySky";
import { HeroBackground } from "@/components/gravikot/HeroBackground";
import { HeartBurst } from "@/components/gravikot/HeartBurst";
import { Gallery } from "@/components/gravikot/Gallery";
import { GiftMaketButton } from "@/components/gravikot/GiftMaketButton";
import { Advantages } from "@/components/gravikot/Advantages";
import { Faq } from "@/components/gravikot/Faq";
import { SvoyakPromo } from "@/components/gravikot/SvoyakPromo";
import { CtaSocial } from "@/components/gravikot/CtaSocial";
import { SiteFooter } from "@/components/gravikot/SiteFooter";
import { OrderForm } from "@/components/gravikot/OrderForm";

/**
 * Module-level flag: persists across client-side navigations (router.back()),
 * but resets on full page reload (F5 / Ctrl+R) because the JS bundle is
 * re-evaluated. This is exactly the behaviour we need:
 *   - First visit: false → show preloader
 *   - Preloader done: true → skip on soft nav back
 *   - F5 reload: JS re-evaluated → false → show preloader again
 */
let _preloaderCompleted = false;

export default function Home() {
  const [preloading, setPreloading] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    // If preloader already completed in this JS session, skip it
    if (_preloaderCompleted) return false;
    // If returning from category page (sessionStorage flag), skip preloader
    try { if (sessionStorage.getItem('gravikot_skip_preloader') === '1') { sessionStorage.removeItem('gravikot_skip_preloader'); _preloaderCompleted = true; return false; } } catch {}
    return true;
  });

  const [siteVisible, setSiteVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    // Site visible immediately if preloader was already completed or skipped via sessionStorage
    return _preloaderCompleted;
  });
  const [orderOpen, setOrderOpen] = useState(false);

  // Lock scroll while preloader is visible
  useEffect(() => {
    if (!preloading) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [preloading]);

  const handlePreloaderComplete = useCallback(() => {
    _preloaderCompleted = true;
    setPreloading(false);
    // Double rAF to let DOM settle before starting the fade-in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSiteVisible(true);
      });
    });
  }, []);

  return (
    <>
      {preloading && <Preloader onComplete={handlePreloaderComplete} />}
      <StarrySky />
      <main
        className="min-h-screen relative overflow-x-clip max-w-full"
        suppressHydrationWarning
        style={{
          background: "transparent",
          opacity: siteVisible ? 1 : 0,
          transition: "opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <section className="relative flex items-center justify-center overflow-hidden pt-6 sm:pt-8 pb-2 px-4 max-w-full">
          <HeroBackground />
          <HeartBurst />
          <div className="relative z-10 w-full text-center mx-auto">
            <div className="font-tech uppercase tracking-[.15em] sm:tracking-[.4em] text-sky-300/80 text-[9px] sm:text-[10px] md:text-xs leading-none">
              ГРАВИКОТ — ЛАЗЕРНОЕ АТЕЛЬЕ
            </div>
            <h1 className="luxe-title neon-title-soft mt-1 uppercase leading-tight whitespace-nowrap text-[clamp(.7rem,3.2vw,2.25rem)]">Глоу-арт гравировка</h1>
            <p className="text-sky-200 text-luxury-glow mt-1 max-w-2xl mx-auto font-tech text-xs sm:text-sm md:text-base leading-snug px-2">
              Создаём стильные светящиеся сувениры и подарки по вашим фото и любимым изображениям — для близких людей, брендов и особых событий.
            </p>
            <div className="divider-beam mx-auto mt-2" style={{ width: 120 }} />
          </div>
        </section>

        <Gallery onOrder={() => setOrderOpen(true)} canPlay={siteVisible} />
        <section className="hidden md:flex justify-center px-4 py-0">
          <GiftMaketButton onClick={() => setOrderOpen(true)} />
        </section>
        <Advantages onOrder={() => setOrderOpen(true)} />
        <Faq />
        <SvoyakPromo />
        <CtaSocial />
        <SiteFooter />
        {orderOpen && <OrderForm open={orderOpen} onClose={() => setOrderOpen(false)} />}
        {/* SEO: hidden text block for search engines — not visible to users */}
        <div className="sr-only" aria-hidden="true">
          Лазерное ателье ГРАВИКОТ предлагает кружки, чашки, бокалы, фужеры и стаканы со светящейся гравировкой по фото.
          Кружка с гравировкой, чашка с гравировкой, фужер с гравировкой, стакан с гравировкой — уникальные светящиеся сувениры и подарки на заказ.
          Лазерная гравировка на кружках, чашках, бокалах, фужерах и стаканах. Глоу-арт гравировка Самара.
          Светящаяся гравировка по вашему фото на стекле. Купить кружку с гравировкой, купить чашку с гравировкой, купить фужер с гравировкой, купить стакан с гравировкой.
        </div>
      </main>
    </>
  );
}
