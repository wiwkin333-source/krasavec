"use client";

export function GiftMaketButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Получить макет бесплатно"
      className={`group relative inline-block bg-transparent border-0 p-0 cursor-pointer transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: "min(619px, 90vw)" }}
    >
      <img
        src="/assets/poluchit-maket.webp"
        alt="Получить макет бесплатно"
        className="gift-maket-btn-heartbeat w-full h-auto select-none"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </button>
  );
}
