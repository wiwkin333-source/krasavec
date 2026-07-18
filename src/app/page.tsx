"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

export default function Home() {
  const PRELOADER_KEY = "__gravikot_preloaded_session__";
  const [preloading, setPreloading] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const done = sessionStorage.getItem(PRELOADER_KEY) === "1";
      if (!done) return true;
      return document.readyState !== "complete";
    } catch {
      return true;
    }
  });

  const [siteVisible, setSiteVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(PRELOADER_KEY) === "1" && document.readyState === "complete";
    } catch {
      return false;
    }
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
    try {
      sessionStorage.setItem(PRELOADER_KEY, "1");
    } catch {}
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
        className="min-h-screen relative"
        suppressHydrationWarning
        style={{
          background: "transparent",
          opacity: siteVisible ? 1 : 0,
          transition: "opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <section className="relative flex items-center justify-center overflow-hidden pt-8 pb-2 px-4">
          <HeroBackground />
          <HeartBurst />
          <div className="relative z-10 w-full text-center mx-auto">
            <div className="font-tech uppercase tracking-[.4em] text-sky-300/80 text-[10px] md:text-xs leading-none">
              ГРАВИКОТ — ЛАЗЕРНОЕ АТЕЛЬЕ
            </div>
            <h1 className="luxe-title mt-1 uppercase leading-tight text-[clamp(1rem,3.8vw,2.25rem)]">Глоу-арт гравировка</h1>
            <p className="text-sky-200 text-luxury-glow mt-1 max-w-2xl mx-auto font-tech text-sm md:text-base leading-snug">
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
      </main>
    </>
  );
}
