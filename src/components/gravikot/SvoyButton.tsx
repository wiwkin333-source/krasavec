"use client";

import { useState } from "react";
import { OrderForm } from "@/components/gravikot/OrderForm";

/**
 * Luxury "Хочу своё" button for product cards.
 * Gold-accented glass morphism with shimmer text.
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
        className="relative shrink-0 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 group border border-amber-400/25 hover:border-amber-400/40 transition-all duration-300 hover:scale-[1.04]"
        style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.06) 0%, rgba(255,180,0,0.03) 50%, rgba(20,20,40,0.8) 100%)",
          boxShadow: "0 0 12px -3px rgba(255,215,0,.18), inset 0 1px 0 rgba(255,215,0,.08)",
        }}
      >
        {/* Gold shimmer text — no wave */}
        <span
          className="font-display font-semibold uppercase tracking-[.08em] sm:tracking-[.12em] text-xs sm:text-sm bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300"
          style={{
            backgroundImage: "linear-gradient(90deg, #ffd700 0%, #fff4c0 30%, #ffd700 50%, #ffaa00 80%, #ffd700 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmerText 3s linear infinite",
          }}
        >
          хочу своё
        </span>
      </button>

      <OrderForm open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  );
}
