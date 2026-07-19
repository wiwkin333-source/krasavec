"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: ReactNode;
}

export function NeonButton({ variant = "primary", children, className = "", ...rest }: Props) {
  if (variant === "ghost") {
    return (
      <button {...rest}
        className={`neon-border rounded-full px-5 sm:px-8 py-3 sm:py-4 font-tech uppercase tracking-[.22em] text-sm text-white hover:scale-105 transition-transform ${className}`}>
        {children}
      </button>
    );
  }
  return (
    <button {...rest}
      className={`relative group inline-flex items-center justify-center h-12 sm:h-16 px-6 sm:px-10 rounded-full font-tech uppercase tracking-[.22em] text-sm text-black overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, #29e3ff, #8b5cf6, #ff2bd6)",
        backgroundSize: "200% 200%",
        animation: "gradient-shift 5s ease infinite",
        boxShadow: "0 0 40px -10px #29e3ff, 0 0 60px -20px #ff2bd6",
      }}>
      <span className="absolute -inset-1 rounded-full opacity-60 blur-xl animate-pulse-glow"
        style={{ background: "linear-gradient(135deg, #29e3ff, #ff2bd6)" }} />
      <span className="absolute inset-[2px] rounded-full" style={{
        background: "conic-gradient(from var(--ang), #29e3ff, #8b5cf6, #ff2bd6, #29e3ff)",
        animation: "border-spin 6s linear infinite", opacity: .9, zIndex: 0,
      }} />
      <span className="absolute inset-[4px] rounded-full"
        style={{ background: "linear-gradient(135deg, #29e3ff, #8b5cf6, #ff2bd6)" }} />
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute top-0 left-0 h-full w-1/3 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent)" }} />
      </span>
      <span className="relative z-10 font-bold">{children}</span>
    </button>
  );
}
