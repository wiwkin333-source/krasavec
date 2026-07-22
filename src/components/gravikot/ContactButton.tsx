"use client";

import { useState } from "react";
import { OrderForm } from "@/components/gravikot/OrderForm";

/**
 * Contact button for product cards.
 * Uses the custom image with a subtle light-wave animation
 * that sweeps left-to-right every 4.5 seconds.
 * Opens the same messenger dialog as CatWizardButton.
 */
export function ContactButton() {
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOrderOpen(true)}
        aria-label="Заказать"
        className="relative shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden group"
        style={{
          boxShadow: "0 0 14px -3px rgba(255,215,0,.35), 0 0 28px -6px rgba(255,180,0,.15)",
        }}
      >
        {/* Button image */}
        <img
          src="/images/contact-btn.webp"
          alt="Заказать"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Light wave sweep — thin horizontal line moving L→R every 4.5s */}
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
