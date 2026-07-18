"use client";

import { useEffect, useState } from "react";

export function HeroBackground() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const particleCount = isMobile ? 14 : 48;
  const sparkleCount = isMobile ? 3 : 6;
  const blurClass = isMobile ? "blur-2xl" : "blur-3xl";
  const floatClass = isMobile ? "" : "animate-float-slow";

  const particles = Array.from({ length: particleCount }, (_, i) => {
    const left = (i * 17.37) % 100;
    const dur = 7 + ((i * 5) % 9);
    const delay = (i * 0.31) % 8;
    const color = i % 2 === 0 ? "#29e3ff" : "#ff2bd6";
    const size = 2 + (i % 3);
    return { left, dur, delay, color, size, i };
  });
  const sparkles = Array.from({ length: sparkleCount }, (_, i) => ({
    top: 10 + (i * 14) % 80,
    left: 8 + (i * 17) % 84,
    delay: (i * 0.7) % 4,
    i,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {!isMobile && <div className="absolute inset-0 bg-grid-anim opacity-60" />}
      <div className="absolute inset-0 radial-glow" />
      <div className={`absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full ${blurClass} opacity-50 ${floatClass}`}
        style={{ background: "radial-gradient(circle, #29e3ff, transparent 70%)" }} />
      <div className={`absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full ${blurClass} opacity-40 ${floatClass}`}
        style={{ background: "radial-gradient(circle, #ff2bd6, transparent 70%)", animationDelay: "2s" }} />
      <div className={`absolute bottom-0 left-1/3 w-[380px] h-[380px] rounded-full ${blurClass} opacity-50 ${floatClass}`}
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)", animationDelay: "4s" }} />
      <div className="absolute top-0 inset-x-0 h-[40vh]" style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }} />
      <div className="absolute bottom-0 inset-x-0 h-[40vh]" style={{ background: "linear-gradient(to top, var(--background), transparent)" }} />
      {particles.map((p) => (
        <span key={p.i} className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: `-10px`,
            width: p.size, height: p.size,
            background: p.color,
            boxShadow: `0 0 8px ${p.color}, 0 0 16px ${p.color}`,
            animation: `particle ${p.dur}s linear ${p.delay}s infinite`,
          }} />
      ))}
      {[15, 42, 70, 92].map((t, i) => (
        <div key={i} className="absolute left-0 right-0 h-px"
          style={{
            top: `${t}%`,
            background: "linear-gradient(90deg, transparent, #29e3ff, #ff2bd6, transparent)",
            opacity: .4,
            animation: `beam-sweep 7s ease-in-out ${i * 1.4}s infinite`,
          }} />
      ))}
      {sparkles.map((s) => (
        <span key={s.i} className="absolute w-[2px] h-[2px] bg-white rounded-full"
          style={{
            top: `${s.top}%`, left: `${s.left}%`,
            boxShadow: "0 0 6px #29e3ff, 0 0 12px #ff2bd6",
            animation: `sparkle 3s ease-in-out ${s.delay}s infinite`,
          }} />
      ))}
    </div>
  );
}
