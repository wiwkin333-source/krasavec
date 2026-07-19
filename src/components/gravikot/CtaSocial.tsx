"use client";

import { MessageCircle, Send } from "lucide-react";
import { Reveal } from "./Reveal";
import type { CSSProperties } from "react";

type CustomCSS = CSSProperties & Record<`--${string}`, string | number>;

const VkIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12.78 16.5c-5.39 0-8.47-3.7-8.6-9.86h2.7c.09 4.52 2.08 6.43 3.66 6.82V6.64h2.55v3.91c1.56-.17 3.2-1.95 3.75-3.91h2.55c-.42 2.42-2.2 4.2-3.46 4.93 1.26.59 3.29 2.14 4.06 4.93h-2.81c-.6-1.86-2.1-3.3-4.09-3.5v3.5h-.31z"/></svg>
);

const links = [
  { name: "Max", url: "https://max.ru/u/f9LHodD0cOLK18QCsfIszzSgyxb-hXR-hb_1AwW4xmnZpq4wc7xUfIZVV-8", color: "#bf00ff", Icon: MessageCircle },
  { name: "Telegram", url: "https://t.me/gravikot_avto_bot", color: "#29e3ff", Icon: Send },
  { name: "Вконтакте", url: "https://vk.com/club239806069", color: "#4C75A3", Icon: VkIcon },
];

export function CtaSocial() {
  return (
    <section className="relative py-14 px-4" aria-label="Контакты и заказ">
      <nav aria-label="Социальные сети ГРАВИКОТ">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="relative glass rounded-[1.5rem] sm:rounded-[2rem] pt-[0.5rem] pb-5 sm:pb-7 md:pt-[0.5rem] md:pb-10 text-center overflow-hidden"
              style={{ backgroundImage: "url(/assets/cta-pyramid-bg.webp)", backgroundSize: "cover", backgroundPosition: "center" }}>
              <p className="relative mt-[2rem] sm:mt-[3rem] mb-8 sm:mb-16 px-3 sm:px-4 text-center uppercase tracking-[.12em] sm:tracking-[.18em] text-lg sm:text-2xl md:text-4xl font-black leading-snug"
                style={{ fontFamily: '"Unbounded", sans-serif', color: "#0a2472", animation: "slogan-glow-cycle 6s ease-in-out infinite" }}>
                точность в деталях, характер в результате.
              </p>
              <div className="relative flex flex-wrap items-center justify-center gap-3 sm:gap-12 md:gap-20 px-4 pb-2">
                {links.map(({ name, url, color, Icon }) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                    className="social-icon social-icon-neon w-12 h-12 sm:w-16 sm:h-16 md:!w-[5.4rem] md:!h-[5.4rem]"
                    style={{ color, "--neon-color": color } as CustomCSS}>
                    <Icon className={name === "Вконтакте" ? "w-7 h-7 sm:w-10 sm:h-10 md:w-[3.6rem] md:h-[3.6rem]" : "w-5 h-5 sm:w-6 sm:h-6 md:w-[2.1rem] md:h-[2.1rem]"} />
                    <span className="social-tooltip">{name}</span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </nav>
    </section>
  );
}
