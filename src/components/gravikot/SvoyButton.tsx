"use client";

import { useState } from "react";
import { OrderForm } from "@/components/gravikot/OrderForm";

/**
 * Image-as-button for product cards.
 * The uploaded image itself IS the clickable button.
 * Opens the order form when clicked.
 * Gold light-wave sweep animation.
 */
export function SvoyButton() {
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOrderOpen(true)}
        aria-label="Хочу своё — заказать с своим изображением"
        className="relative shrink-0 rounded-xl overflow-hidden group"
        style={{
          boxShadow: "0 0 14px -3px rgba(255,215,0,.35), 0 0 28px -6px rgba(255,180,0,.15)",
          width: "72px",
          height: "48px",
        }}
      >
        {/* The image IS the button — no text overlay */}
        <img
          src="/images/svoy-btn.webp"
          alt="Хочу своё"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gold light wave sweep — thin horizontal line moving L→R every 4.5s */}
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.25) 45%, rgba(255,180,0,0.12) 55%, transparent 100%)",
            animation: "contactWave 4.5s ease-in-out infinite",
          }}
        />
      </button>

      <OrderForm open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  );
}
