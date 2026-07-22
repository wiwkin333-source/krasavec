"use client";

import { useState } from "react";
import { OrderForm } from "@/components/gravikot/OrderForm";

/**
 * Image-as-button for product cards.
 * The uploaded image itself IS the clickable button — no glow, no text.
 * Gold light-wave sweep masked to the image silhouette only.
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
        className="relative shrink-0 overflow-hidden group border-0 bg-transparent p-0 cursor-pointer"
      >
        {/* The image IS the button */}
        <img
          src="/images/svoy-btn.webp"
          alt="Хочу своё"
          className="block h-[36px] sm:h-[44px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Gold light wave — masked to the image silhouette via CSS mask-image */}
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.35) 45%, rgba(255,180,0,0.18) 55%, transparent 100%)",
            animation: "contactWave 4.5s ease-in-out infinite",
            /* Mask the wave to the image silhouette — transparent areas of the PNG mask clip the wave */
            WebkitMaskImage: "url('/images/svoy-btn-mask.png')",
            maskImage: "url('/images/svoy-btn-mask.png')",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      </button>

      <OrderForm open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  );
}
