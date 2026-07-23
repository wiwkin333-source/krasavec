"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "./Reveal";

const items: { q: string; a: string }[] = [
  {
    q: "Возможна ли гравировка используя мое фото или любую картинку ?",
    a: "Да, мы работаем практически с любыми изображениями: ваши фото, картинки из интернета, логотипы, детские рисунки, надписи — всё, что вы пришлете. Наш дизайнер адаптирует картинку под технологию гравировки. Готовый рисунок получается контрастным, в двух цветах. Именно так гравировка получается четкой, глубокой и не теряет детали со временем.\n\nВажный нюанс по градиентам и полутонам: Если вам важно максимальное сходство с оригинальным фото или акварельным рисунком — напишите нам отдельно. Мы посмотрим, что можно сделать.",
  },
  {
    q: "Бесплатный макет за 3 простых шага",
    a: "Шаг 1 — Отправьте фотографию: Пришлите изображение в любом формате через мессенджер.\nШаг 2 — Расскажите о пожеланиях: Уточним детали и ответим на ваши вопросы.\nШаг 3 — Получите макет: Бесплатно подготовим предварительный макет и отправим его вам на согласование.",
  },
  {
    q: "Сколько занимает изготовление?",
    a: "Ориентировочно 1–7 дня. Срок изготовления сложных и необычных заказов может немного увеличиться, все обговаривается индивидуально.",
  },
  {
    q: "По оплате, доставке, возврату",
    a: "Перед оплатой вы бесплатно получаете макет и утверждаете его. Изделие изготавливается ровно по согласованному макету. Если ошиблись мы (брак, не тот рисунок) — переделаем бесплатно за свой счёт.\n\nМожно ли увидеть изделие до оплаты? — Да, мы пришлём фото готовой работы перед отправкой.\n\nПовредили при доставке? — Составим акт и поможем с претензией к транспортной компании.",
  },
  {
    q: "Конфиденциальность",
    a: "Все присланные фото видим только мы (дизайнер и мастер). Не публикуем, не выкладываем в портфолио, не показываем другим клиентам. Не храним дольше, чем нужно для выполнения заказа — удаляем через 3 дня после сдачи работы. По умолчанию — полная приватность!",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  // SEO: FAQPage structured data for Google rich results
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };

  return (
    <section className="relative pt-2 pb-14 px-4" aria-label="Частые вопросы о гравировке">
      {/* SEO: FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <div className="font-tech uppercase tracking-[.3em] text-sm" style={{ color: "var(--neon-magenta)" }}>FAQ</div>
            <h2 className="luxe-title mt-2">Частые вопросы</h2>
          </div>
        </Reveal>
        <div className="space-y-4">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="glass conic-border rounded-2xl overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 text-left">
                  <span className="flex-1 font-display font-semibold text-sm sm:text-base pr-2">{it.q}</span>
                  <span className="neon-border rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center flex-shrink-0 transition-transform"
                    style={{ transform: open === i ? "rotate(135deg)" : "none" }}>
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                </button>
                {open === i && (
                  <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 text-sky-100/95 text-xs sm:text-sm leading-relaxed whitespace-pre-line animate-in fade-in slide-in-from-top-2 duration-300">
                    {it.a}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
