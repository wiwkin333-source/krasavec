"use client";

import { useEffect, useRef, useState } from "react";

interface Heart { id: number; x: number; y: number; dx: number; dy: number; dr: number; color: string; }

let nextId = 0;

const CLICKABLE_SELECTOR = 'a, button, input, textarea, select, label, summary, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [data-clickable], [contenteditable="true"]';

function isClickable(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return !!target.closest(CLICKABLE_SELECTOR);
}

export function HeartBurst() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const heldRef = useRef(false);
  const posRef = useRef({ x: 0, y: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const spawn = (cx: number, cy: number, count: number) => {
      const batch: Heart[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 120 + Math.random() * 240;
        batch.push({
          id: nextId++, x: cx, y: cy,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 80,
          dr: (Math.random() - 0.5) * 360,
          color: `hsl(${40 + Math.random() * 20}, 100%, ${70 + Math.random() * 15}%)`,
        });
      }
      setHearts((h) => [...h, ...batch]);
      setTimeout(() => {
        const ids = new Set(batch.map((b) => b.id));
        setHearts((h) => h.filter((x) => !ids.has(x.id)));
      }, 2200);
    };

    const stop = () => {
      heldRef.current = false;
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };

    const onDown = (e: PointerEvent) => {
      if (isClickable(e.target)) return;
      heldRef.current = true;
      posRef.current = { x: e.clientX, y: e.clientY };
      spawn(e.clientX, e.clientY, 8);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!heldRef.current) return;
        const { x, y } = posRef.current;
        spawn(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40, 3);
      }, 70);
    };

    const onMove = (e: PointerEvent) => {
      if (!heldRef.current) return;
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    window.addEventListener("blur", stop);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      window.removeEventListener("blur", stop);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {hearts.map((h) => (
        <svg key={h.id} viewBox="0 0 24 24" width="28" height="28"
          className="absolute pointer-events-none"
          style={{
            left: h.x, top: h.y,
            ["--dx" as any]: `${h.dx}px`,
            ["--dy" as any]: `${h.dy}px`,
            ["--dr" as any]: `${h.dr}deg`,
            color: h.color,
            filter: `drop-shadow(0 0 8px ${h.color}) drop-shadow(0 0 16px ${h.color})`,
            animation: "heart-fly 2.2s ease-out forwards",
            transformOrigin: "center",
          }}>
          <path fill="currentColor" d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7L12 17.8 5.7 21.2l1.7-7L2 9.5l7.1-.6L12 2z" />
        </svg>
      ))}
    </div>
  );
}
