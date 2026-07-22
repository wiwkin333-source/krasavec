"use client";

import { useState } from "react";
import { OrderForm } from "@/components/gravikot/OrderForm";

/**
 * "?" help/question button for product cards.
 * Small round button with "?" symbol.
 * Opens the order form when clicked — same as ContactButton.
 * Gold light-wave sweep animation.
 */
export function HelpButton() {
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOrderOpen(true)}
        aria-label="Задать вопрос"
        className="relative shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden glass group flex items-center justify-center"
        style={{
          boxShadow: "0 0 14px -3px rgba(255,215,0,.3), 0 0 28px -6px rgba(255,180,0,.12)",
        }}
      >
        {/* "?" symbol */}
        <span className="font-display font-bold text-lg sm:text-xl text-amber-300/80 group-hover:text-amber-200 transition-colors duration-300">
          ?
        </span>

        {/* Gold light wave sweep */}
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.15) 45%, rgba(255,180,0,0.08) 55%, transparent 100%)",
            animation: "contactWave 4.5s ease-in-out infinite",
          }}
        />
      </button>

      <OrderForm open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  );
}
