"use client";

import { Reveal } from "./Reveal";
import { CatWizardButton } from "./CatWizardButton";

const items = [
  { title: "Заказ без лишних хлопот", color: "cyan", glow: "card-glow-cyan", text: "От идеи до готового изделия — сопровождаем на каждом этапе и помогаем с выбором решения." },
  { title: "Индивидуальный подход", color: "violet", glow: "card-glow-violet", text: "Разрабатываем уникальный макет для каждого клиента с учетом ваших пожеланий и задач." },
  { title: "Безупречный результат", color: "magenta", glow: "card-glow-magenta", text: "Каждое изделие проходит проверку качества и ручную финишную обработку перед отправкой." },
];

const colors: Record<string, string> = { cyan: "#29e3ff", violet: "#8b5cf6", magenta: "#ff2bd6" };

export function Advantages({ onOrder }: { onOrder: () => void }) {
  return (
    <section className="relative pt-14 pb-2 px-4" aria-label="Преимущества ГРАВИКОТ">
      <div className="max-w-6xl mx-auto text-center">
        <Reveal>
          <h2 className="luxe-title uppercase">Почему выбирают нас</h2>
          <p className="mt-4 text-sky-100/90 max-w-2xl mx-auto font-tech">
            Создаем персональную гравировку, которая превращает вещи в историю.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 120} className="h-full">
              <div className={`glass conic-border no-hover rounded-2xl p-6 transition w-full h-full flex flex-col`}>
                <h3 className="font-display font-bold uppercase text-lg mb-3" style={{ color: colors[it.color] }}>
                  {it.title}
                </h3>
                <p className="text-sky-100/90 text-sm leading-relaxed">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={400}>
          <div className="mt-8 flex justify-center">
            <CatWizardButton onClick={onOrder} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
