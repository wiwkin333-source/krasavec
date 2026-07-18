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
        className="w-full h-auto select-none"
        style={{
          filter:
            "drop-shadow(0 0 24px rgba(139,92,246,.55)) drop-shadow(0 0 40px rgba(41,227,255,.35))",
        }}
        draggable={false}
      />
    </button>
  );
}
