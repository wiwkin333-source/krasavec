"use client";

import { useMemo } from "react";

type Star = { left: string; top: string; size: number; delay: string; dur: string; op: number };

function makeStars(count: number, seed: number): Star[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => {
    const size = rand() * 1.6 + 0.4;
    return {
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size,
      delay: `${(rand() * 8).toFixed(2)}s`,
      dur: `${(3 + rand() * 6).toFixed(2)}s`,
      op: 0.25 + rand() * 0.55,
    };
  });
}

export function StarrySky() {
  const stars = useMemo(() => makeStars(140, 42), []);
  const twinklers = useMemo(() => makeStars(18, 1337), []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 10%, rgba(40,30,90,.35), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(20,40,90,.35), transparent 55%), #050510",
      }}
    >
      {stars.map((st, i) => (
        <span
          key={`s-${i}`}
          className="absolute rounded-full"
          style={{
            left: st.left,
            top: st.top,
            width: `${st.size}px`,
            height: `${st.size}px`,
            background: "#cfe6ff",
            opacity: st.op,
            boxShadow: `0 0 ${st.size * 2}px rgba(180,210,255,.5)`,
          }}
        />
      ))}

      {twinklers.map((st, i) => (
        <span
          key={`t-${i}`}
          className="absolute rounded-full star-twinkle"
          style={{
            left: st.left,
            top: st.top,
            width: `${st.size + 0.6}px`,
            height: `${st.size + 0.6}px`,
            background: "#ffffff",
            animationDelay: st.delay,
            animationDuration: st.dur,
            boxShadow: `0 0 6px rgba(200,220,255,.9)`,
          }}
        />
      ))}

      <div className="comet">
        <div className="comet-tail" />
        <div className="comet-head" />
      </div>
    </div>
  );
}
