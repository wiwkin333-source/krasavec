"use client";

import { useMemo } from "react";

// Deterministic LCG random for SSR/CSR consistency
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function CatWizardButton({ onClick }: { onClick: () => void }) {
  const fireflies = useMemo(() => {
    const rand = seededRandom(777);
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      delay: rand() * 4,
      dur: 3 + rand() * 4,
      size: 2 + rand() * 3,
      color: ["#29e3ff", "#8b5cf6", "#ff2bd6"][i % 3],
    }));
  }, []);

  return (
    <button
      onClick={onClick}
      aria-label="Запустить проект"
      className="cat-wizard btn-fw-mobile group relative inline-block bg-transparent border-0 p-0 cursor-pointer"
      style={{ width: "min(420px, 90vw)" }}
    >
      <span aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        {fireflies.map((f) => (
          <span
            key={f.id}
            className="absolute rounded-full cat-firefly"
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: f.size,
              height: f.size,
              background: f.color,
              boxShadow: `0 0 ${f.size * 3}px ${f.color}`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.dur}s`,
            }}
          />
        ))}
      </span>

      <img
        src="/assets/krutysh.webp"
        alt="Запустить проект"
        className="relative w-full h-auto select-none cat-float transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
        style={{
          filter:
            "drop-shadow(0 0 24px rgba(139,92,246,.6)) drop-shadow(0 0 40px rgba(41,227,255,.35))",
        }}
        draggable={false}
      />
    </button>
  );
}
