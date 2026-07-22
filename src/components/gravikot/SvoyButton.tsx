"use client";

import { useState } from "react";
import { OrderForm } from "@/components/gravikot/OrderForm";

/**
 * "Хочу своё" button for product cards.
 * Shows the uploaded image with "хочу своё" text overlay.
 * Opens the order form when clicked.
 */
export function SvoyButton() {
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOrderOpen(true)}
        aria-label="Хочу своё — заказать с своим изображением"
        className="relative shrink-0 rounded-xl overflow-hidden group flex items-center justify-center"
        style={{
          boxShadow: "0 0 16px -4px rgba(255,43,214,.35), 0 0 32px -8px rgba(41,227,255,.15)",
          minWidth: "120px",
          height: "44px",
        }}
      >
        {/* Button background image */}
        <img
          src="/images/svoy-btn.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          aria-hidden="true"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Light wave sweep animation */}
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(41,227,255,0.2) 45%, rgba(255,43,214,0.1) 55%, transparent 100%)",
            animation: "contactWave 4.5s ease-in-out infinite",
          }}
        />

        {/* Text label */}
        <span className="relative z-10 font-tech uppercase tracking-[.12em] text-sm text-white drop-shadow-[0_1px_4px_rgba(0,0,0,.8)] group-hover:text-sky-200 transition-colors duration-300">
          хочу своё
        </span>
      </button>

      <OrderForm open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  );
}
