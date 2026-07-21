"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, MessageCircle, Send } from "lucide-react";

const VkIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12.78 16.5c-5.39 0-8.47-3.7-8.6-9.86h2.7c.09 4.52 2.08 6.43 3.66 6.82V6.64h2.55v3.91c1.56-.17 3.2-1.95 3.75-3.91h2.55c-.42 2.42-2.2 4.2-3.46 4.93 1.26.59 3.29 2.14 4.06 4.93h-2.81c-.6-1.86-2.1-3.3-4.09-3.5v3.5h-.31z"/></svg>
);

const links = [
  { name: "Max", url: "https://max.ru/u/f9LHodD0cOLK18QCsfIszzSgyxb-hXR-hb_1AwW4xmnZpq4wc7xUfIZVV-8", color: "#00e676", Icon: MessageCircle },
  { name: "Telegram", url: "https://t.me/gravikot_avto_bot", color: "#29e3ff", Icon: Send },
  { name: "Вконтакте", url: "https://vk.com/club239806069", color: "#4C75A3", Icon: VkIcon },
];

export function OrderForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-background/85 backdrop-blur-xl overflow-x-clip"
      onClick={onClose}>
      <div className="relative neon-border rounded-3xl max-w-lg w-full p-6 sm:p-8 md:p-10"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 0 60px -10px #29e3ff, 0 0 100px -20px #ff2bd6" }}>
        <button onClick={onClose} aria-label="Закрыть"
          className="absolute top-4 right-4 p-2 rounded-full glass hover:scale-110 transition">
          <X className="w-5 h-5" />
        </button>
        <h2 className="luxe-title text-center text-xl sm:text-2xl">Свяжитесь с нами</h2>
        <p className="mt-3 text-center text-sky-200/80 font-tech">
          Выберите удобный для вас мессенджер:
        </p>
        <div className="mt-8 space-y-3">
          {links.map(({ name, url, color, Icon }) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl glass hover-lift transition border border-white/10">
              <span className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: `${color}22`, boxShadow: `0 0 24px -4px ${color}`, color }}>
                <Icon className="w-6 h-6" />
              </span>
              <span className="font-tech uppercase tracking-[.15em] sm:tracking-[.2em] text-base sm:text-lg">{name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
