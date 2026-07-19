"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Sparkles, X } from "lucide-react";
import { Reveal } from "./Reveal";

const steps = [
  { t: "Оформите первый заказ", d: "Любое изделие из каталога." },
  { t: "Получите КВАНТ в подарок", d: "Фирменный аксессуар вкладывается в посылку бесплатно и действует сразу и только после заказа нашего изделия." },
  { t: "Сфотографируйте КВАНТ", d: "Сделайте фото в любой обстановке — в руке, на ключах, в интерьере. Но обязательно рядом должна быть дата текущего дня — на листке бумаги, на экране гаджета и т.д. (без фотошопа и нейронок!)" },
  { t: "Покажите фото", d: "И получите −20% на последующий заказ. Скидка действует бессрочно." },
];

export function SvoyakPromo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  return (
    <section className="relative py-14 px-4">
      <div className="mx-auto" style={{ maxWidth: 780 }}>
        <Reveal>
          <div className="relative aspect-square mx-auto" style={{ maxWidth: 780 }}>
            <div className="absolute inset-0 pointer-events-none select-none"
              style={{ background: "radial-gradient(circle at 50% 55%, rgba(139,92,246,.35) 0%, rgba(41,227,255,.18) 35%, rgba(255,43,214,.12) 60%, transparent 75%)", filter: "blur(40px)", transform: "scale(1.15)", zIndex: 0 }} />
            <img src="/assets/shar.webp" alt="" aria-hidden
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none scale-[1.15] md:scale-75"
              loading="lazy" decoding="async"
              draggable={false} style={{ zIndex: 1 }} />
            <div className="absolute top-[18%] right-[20%] text-purple-200" style={{ animation: "sparkle 2.5s ease-in-out infinite", zIndex: 2 }}>
              <Sparkles className="w-10 h-10" style={{ filter: "drop-shadow(0 0 12px #c084fc)" }} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[18%]" style={{ zIndex: 2 }}>
              <div className="font-display text-4xl md:text-[3.375rem] lg:text-7xl tracking-tight"
                style={{ color: "#f5e6c8", textShadow: "0 2px 12px rgba(0,0,0,.7)", letterSpacing: "0.06em" }}>
                КВАНТ
              </div>
              <div className="font-display font-black text-3xl md:text-5xl lg:text-6xl mt-3"
                style={{ background: "linear-gradient(135deg, #c084fc, #f0abfc)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                20% скидка
              </div>
              <div className="font-tech uppercase tracking-[.28em] text-xs md:text-sm mt-3" style={{ color: "#f5e6c8" }}>
                на последующие заказы
              </div>
              <button onClick={() => setOpen(true)}
                className="btn-fw-mobile mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-tech uppercase tracking-[.18em] text-xs md:text-sm hover:scale-105 transition-transform"
                style={{ background: "linear-gradient(135deg, #6b21a8, #3d2310)", boxShadow: "0 4px 24px rgba(139, 92, 246, .5)" }}>
                Подробнее
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200"
          style={{ background: "rgba(8, 4, 20, .85)", backdropFilter: "blur(8px)" }}
          onClick={() => setOpen(false)}>
          <div className="relative max-w-4xl w-full glass rounded-2xl p-5 md:p-7 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} aria-label="Закрыть"
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition">
              <X className="w-4 h-4" />
            </button>
            <div className="font-display font-black text-xl md:text-2xl mb-1"
              style={{ background: "linear-gradient(135deg, #c084fc, #f0abfc)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              Как получить 20% скидку
            </div>
            <div className="font-tech uppercase tracking-[.2em] text-[10px] md:text-xs text-sky-100/60 mb-4">
              КВАНТ — фирменный аксессуар в подарок
            </div>
            <div className="space-y-2 md:space-y-3">
              {steps.map((s, i) => (
                <div key={i} className="rounded-xl p-3 md:p-4 flex gap-3 items-start bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #f5e6c8, #d8a96a)", color: "#3d2310", boxShadow: "0 0 12px rgba(245, 200, 120, .5)" }}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm md:text-base">{s.t}</div>
                    <div className="text-sky-100/70 text-xs md:text-sm mt-0.5 leading-snug">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
