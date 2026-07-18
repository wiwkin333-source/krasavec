"use client";

import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
  maxWaitMs?: number;
  targetRatio?: number;
}

/**
 * Luxury preloader — «Добро пожаловать» is always visible.
 * Layout: ГРАВИКОТ → Добро пожаловать → spinner % → progress → Лазерное ателье
 */
export function Preloader({
  onComplete,
  maxWaitMs = 12_000,
  targetRatio = 0.5,
}: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [criticalReady, setCriticalReady] = useState(false);
  const doneRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // ===== Particle system for luxury background =====
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", handleResize);

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number; opacity: number;
      color: string;
      pulse: number; pulseSpeed: number;
    }

    const colors = [
      "rgba(245,230,200,",
      "rgba(41,227,255,",
      "rgba(139,92,246,",
      "rgba(255,43,214,",
      "rgba(255,255,255,",
    ];

    const particles: Particle[] = [];
    const count = Math.min(80, Math.floor((w * h) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    interface DustLine {
      x: number; y: number;
      length: number; angle: number;
      opacity: number; speed: number;
      color: string;
    }
    const dustLines: DustLine[] = [];
    for (let i = 0; i < 12; i++) {
      dustLines.push({
        x: Math.random() * w,
        y: Math.random() * h,
        length: Math.random() * 60 + 20,
        angle: Math.random() * Math.PI,
        opacity: Math.random() * 0.15 + 0.03,
        speed: Math.random() * 0.3 + 0.1,
        color: Math.random() > 0.5 ? "rgba(245,230,200," : "rgba(41,227,255,",
      });
    }

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      time += 1;

      const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6);
      grd.addColorStop(0, "rgba(20,10,40,0.3)");
      grd.addColorStop(0.5, "rgba(10,5,20,0.1)");
      grd.addColorStop(1, "rgba(5,5,16,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      const blobX1 = w * 0.3 + Math.sin(time * 0.005) * w * 0.15;
      const blobY1 = h * 0.4 + Math.cos(time * 0.007) * h * 0.1;
      const grd2 = ctx.createRadialGradient(blobX1, blobY1, 0, blobX1, blobY1, 200);
      grd2.addColorStop(0, "rgba(139,92,246,0.12)");
      grd2.addColorStop(0.5, "rgba(255,43,214,0.06)");
      grd2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd2;
      ctx.fillRect(0, 0, w, h);

      const blobX2 = w * 0.7 + Math.cos(time * 0.006) * w * 0.12;
      const blobY2 = h * 0.6 + Math.sin(time * 0.008) * h * 0.08;
      const grd3 = ctx.createRadialGradient(blobX2, blobY2, 0, blobX2, blobY2, 180);
      grd3.addColorStop(0, "rgba(41,227,255,0.08)");
      grd3.addColorStop(0.5, "rgba(139,92,246,0.04)");
      grd3.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd3;
      ctx.fillRect(0, 0, w, h);

      for (const dl of dustLines) {
        dl.x += dl.speed;
        dl.y -= dl.speed * 0.3;
        if (dl.x > w + 80) { dl.x = -80; dl.y = Math.random() * h; }
        if (dl.y < -80) { dl.y = h + 80; }
        const pulse = Math.sin(time * 0.015 + dl.angle) * 0.5 + 0.5;
        ctx.save();
        ctx.globalAlpha = dl.opacity * (0.5 + pulse * 0.5);
        ctx.translate(dl.x, dl.y);
        ctx.rotate(dl.angle);
        const lineGrd = ctx.createLinearGradient(-dl.length / 2, 0, dl.length / 2, 0);
        lineGrd.addColorStop(0, dl.color + "0)");
        lineGrd.addColorStop(0.5, dl.color + "0.8)");
        lineGrd.addColorStop(1, dl.color + "0)");
        ctx.strokeStyle = lineGrd;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-dl.length / 2, 0);
        ctx.lineTo(dl.length / 2, 0);
        ctx.stroke();
        ctx.restore();
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        const pulseFactor = 0.5 + Math.sin(p.pulse) * 0.5;
        const alpha = p.opacity * (0.4 + pulseFactor * 0.6);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color + "1)";
        ctx.shadowColor = p.color + "0.6)";
        ctx.shadowBlur = p.size * 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.8 + pulseFactor * 0.4), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ===== Asset preloading logic =====
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    let loaded = 0;
    let criticalLoaded = 0;
    let criticalTotal = 0;

    const assets = getAssetsList();
    criticalTotal = assets.filter((a) => a.critical).length;

    const tick = () => {
      if (cancelled) return;
      const ratio = Math.min(1, loaded / assets.length);
      setProgress((prev) => (ratio > prev ? ratio : prev));
      if (ratio >= targetRatio && criticalLoaded >= criticalTotal && !doneRef.current) {
        finish();
      }
    };

    const finish = () => {
      if (doneRef.current || cancelled) return;
      doneRef.current = true;
      setCriticalReady(true);
      setProgress(1);

      // Brief pause, then exit
      window.setTimeout(() => {
        if (cancelled) return;
        setExiting(true);
        window.setTimeout(() => {
          if (!cancelled) onComplete();
        }, 1000);
      }, 800);
    };

    const safety = window.setTimeout(() => {
      if (!doneRef.current) finish();
    }, maxWaitMs);

    const tasks = assets.map((asset) =>
      preloadSingleAsset(asset).then(() => {
        loaded += 1;
        if (asset.critical) criticalLoaded += 1;
        if (asset.critical && criticalLoaded >= criticalTotal) {
          setCriticalReady(true);
        }
        tick();
      })
    );

    Promise.allSettled(tasks).then(() => {
      if (!doneRef.current) finish();
    });

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
    };
  }, []);

  // Smooth progress creep
  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.99) return prev;
        const ceiling = criticalReady ? 0.99 : 0.97;
        const next = Math.min(ceiling, prev + 0.008);
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [criticalReady]);

  const pct = Math.round(progress * 100);

  return (
    <div
      aria-hidden={exiting}
      suppressHydrationWarning
      className={`preloader-root ${exiting ? "preloader-exit" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#050510",
        color: "#eaf2ff",
        transition: "opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1), visibility 1000ms cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: exiting ? 0 : 1,
        visibility: exiting ? "hidden" : "visible",
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Luxury corner accents */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 24, left: 24, width: 80, height: 80, borderTop: "1px solid rgba(245,230,200,0.15)", borderLeft: "1px solid rgba(245,230,200,0.15)" }} />
        <div style={{ position: "absolute", top: 24, right: 24, width: 80, height: 80, borderTop: "1px solid rgba(245,230,200,0.15)", borderRight: "1px solid rgba(245,230,200,0.15)" }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 80, height: 80, borderBottom: "1px solid rgba(245,230,200,0.15)", borderLeft: "1px solid rgba(245,230,200,0.15)" }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 80, height: 80, borderBottom: "1px solid rgba(245,230,200,0.15)", borderRight: "1px solid rgba(245,230,200,0.15)" }} />
      </div>

      {/* Main content — always visible, elegant vertical flow */}
      <div style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* 1. Brand name — ГРАВИКОТ */}
        <div style={{
          fontFamily: '"Unbounded", sans-serif',
          fontWeight: 800,
          fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          background: "linear-gradient(90deg, #f5e6c8, #fff, #f5e6c8)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: "shimmer 4s linear infinite",
          filter: "drop-shadow(0 0 24px rgba(245,230,200,0.25))",
          marginBottom: 8,
        }}>
          ГРАВИКОТ
        </div>

        {/* 2. Welcome — always visible */}
        <div style={{
          fontFamily: '"Unbounded", sans-serif',
          fontWeight: 800,
          fontSize: "clamp(1rem, 2.8vw, 1.6rem)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          background: "linear-gradient(90deg, #f5e6c8, #fff, #29e3ff, #c9a8ff, #ff8be0, #f5e6c8)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: "shimmer 3s linear infinite",
          filter: "drop-shadow(0 0 20px rgba(245,230,200,0.4)) drop-shadow(0 0 40px rgba(41,227,255,0.2))",
          marginBottom: 32,
        }}>
          Добро пожаловать
        </div>

        {/* 3. Spinner ring with percentage */}
        <div style={{ position: "relative", width: 120, height: 120, marginBottom: 24 }}>
          {/* Outer glow ring */}
          <div style={{
            position: "absolute", inset: -14, borderRadius: "50%",
            border: "1px solid rgba(245,230,200,0.08)",
            boxShadow: "0 0 40px rgba(245,230,200,0.06), inset 0 0 40px rgba(245,230,200,0.03)",
          }} />

          {/* Expanding pulse rings */}
          <div style={{ position: "absolute", inset: -18, borderRadius: "50%", border: "1px solid rgba(245,230,200,0.1)", animation: "preloader-ring-expand 2.5s ease-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: -18, borderRadius: "50%", border: "1px solid rgba(41,227,255,0.08)", animation: "preloader-ring-expand 2.5s ease-out 0.8s infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: -18, borderRadius: "50%", border: "1px solid rgba(139,92,246,0.06)", animation: "preloader-ring-expand 2.5s ease-out 1.6s infinite", pointerEvents: "none" }} />

          {/* Static background ring */}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(245,230,200,0.06)" }} />

          {/* Animated progress arc (SVG) */}
          <svg viewBox="0 0 120 120" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(245,230,200,0.04)" strokeWidth="2" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke="url(#preloaderGrad)" strokeWidth="2" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress)}`}
              style={{ transition: "stroke-dashoffset 200ms linear" }}
            />
            <defs>
              <linearGradient id="preloaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5e6c8" />
                <stop offset="30%" stopColor="#29e3ff" />
                <stop offset="60%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ff2bd6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Spinner tick */}
          <div style={{
            position: "absolute", inset: 6, borderRadius: "50%",
            border: "1px solid transparent",
            borderTopColor: "rgba(245,230,200,0.3)",
            borderRightColor: "rgba(41,227,255,0.15)",
            animation: "preloader-spin 3s linear infinite",
          }} />

          {/* Center percentage */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: '"Unbounded", sans-serif',
            fontWeight: 800,
            fontSize: "1.4rem",
            letterSpacing: "0.05em",
            background: "linear-gradient(135deg, #f5e6c8, #fff, #29e3ff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 12px rgba(245,230,200,0.3))",
          }}>
            {pct}
          </div>
        </div>

        {/* 4. Elegant progress bar */}
        <div style={{
          width: "min(200px, 50vw)",
          height: 1,
          background: "rgba(245,230,200,0.08)",
          overflow: "hidden",
          position: "relative",
          marginBottom: 20,
        }}>
          <div style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg, #f5e6c8, #29e3ff, #8b5cf6, #ff2bd6)",
            transition: "width 200ms linear",
            boxShadow: "0 0 16px rgba(245,230,200,0.5), 0 0 32px rgba(41,227,255,0.3)",
          }} />
        </div>

        {/* 5. Subtle bottom label */}
        <div style={{
          fontFamily: '"Exo 2", sans-serif',
          fontWeight: 600,
          fontSize: "clamp(8px, 1vw, 10px)",
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          color: "rgba(245,230,200,0.3)",
        }}>
          Лазерное ателье
        </div>
      </div>
    </div>
  );
}

// ===== Asset preloading logic =====

interface AssetDescriptor {
  url: string;
  kind: "video" | "image";
  critical?: boolean;
}

function getAssetsList(): AssetDescriptor[] {
  if (typeof window === "undefined") return [];

  const fmt = detectPreferredVideoFormat();
  const videoAssets: AssetDescriptor[] =
    fmt === "webm"
      ? [
          { url: "/assets/hero.webm", kind: "video", critical: true },
          { url: "/assets/click.webm", kind: "video", critical: false },
        ]
      : [
          { url: "/assets/hero.mp4", kind: "video", critical: true },
          { url: "/assets/click.mp4", kind: "video", critical: false },
        ];

  const imageAssets: AssetDescriptor[] = [
    { url: "/assets/gravikot-poster.webp", kind: "image", critical: true },
    { url: "/assets/shar.webp", kind: "image" },
    { url: "/assets/cta-pyramid-bg.webp", kind: "image" },
    { url: "/assets/krutysh.webp", kind: "image" },
    { url: "/assets/cart-button.webp", kind: "image" },
    { url: "/assets/poluchit-maket.webp", kind: "image" },
    { url: "/assets/products/p2.png", kind: "image" },
    { url: "/assets/products/p3.png", kind: "image" },
    { url: "/assets/products/p5.png", kind: "image" },
    { url: "/assets/products/p6.png", kind: "image" },
    { url: "/assets/products/p7.png", kind: "image" },
    { url: "/assets/products/p8.png", kind: "image" },
    { url: "/assets/products/p9.png", kind: "image" },
    { url: "/assets/products/p10.png", kind: "image" },
    { url: "/assets/products/glass-1.png", kind: "image" },
    { url: "/assets/products/glass-2.png", kind: "image" },
    { url: "/assets/products/flute-1.png", kind: "image" },
    { url: "/assets/products/flute-2.png", kind: "image" },
    { url: "/assets/products/dresden-1.png", kind: "image" },
    { url: "/assets/products/dresden-2.png", kind: "image" },
    { url: "/assets/products/gramine-2.png", kind: "image" },
    { url: "/assets/products/gramine-3.png", kind: "image" },
    { url: "/assets/products/gramine-4.png", kind: "image" },
    { url: "/assets/products/gramine-5.png", kind: "image" },
    { url: "/assets/products/gramine-6.png", kind: "image" },
    { url: "/assets/products/gramine-7.png", kind: "image" },
    { url: "/assets/products/maag-2.jpg", kind: "image" },
    { url: "/assets/products/maag-3.jpg", kind: "image" },
    { url: "/assets/products/maag-4.jpg", kind: "image" },
    { url: "/assets/products/maag-5.jpg", kind: "image" },
    { url: "/assets/products/maag-6.jpg", kind: "image" },
    { url: "/assets/products/collins-1.png", kind: "image" },
    { url: "/assets/products/collins-2.png", kind: "image" },
    { url: "/assets/products/collins-3.png", kind: "image" },
    { url: "/assets/products/collins-4.png", kind: "image" },
  ];

  return [...videoAssets, ...imageAssets];
}

function detectPreferredVideoFormat(): "webm" | "mp4" {
  if (typeof window === "undefined" || typeof document === "undefined") return "mp4";
  try {
    const v = document.createElement("video");
    const webmProbe =
      v.canPlayType('video/webm; codecs="vp9"') ||
      v.canPlayType('video/webm; codecs="vp8"') ||
      v.canPlayType("video/webm");
    if (webmProbe === "probably") return "webm";
    const mp4Probe = v.canPlayType('video/mp4; codecs="avc1.42E01E"');
    if (mp4Probe === "probably") return "mp4";
    return webmProbe === "maybe" ? "webm" : "mp4";
  } catch {
    return "mp4";
  }
}

const videoBlobUrls = new Map<string, string>();

export function resolveVideoUrl(originalUrl: string): string {
  return videoBlobUrls.get(originalUrl) ?? originalUrl;
}

export function getHeroVideoUrl(): string {
  const fmt = detectPreferredVideoFormat();
  const url = fmt === "webm" ? "/assets/hero.webm" : "/assets/hero.mp4";
  return resolveVideoUrl(url);
}

export function getClickVideoUrl(): string {
  const fmt = detectPreferredVideoFormat();
  const url = fmt === "webm" ? "/assets/click.webm" : "/assets/click.mp4";
  return resolveVideoUrl(url);
}

function preloadImage(url: string, timeoutMs = 12_000): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") { resolve(); return; }
    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = "low";
    const done = () => resolve();
    img.onload = done;
    img.onerror = done;
    img.src = url;
    window.setTimeout(done, timeoutMs);
  });
}

function preloadVideoFull(url: string, timeoutMs = 30_000): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof fetch === "undefined") { resolve(); return; }
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), timeoutMs);
    fetch(url, { method: "GET", cache: "default", signal: ctrl.signal })
      .then(async (res) => {
        if (!res.ok) { window.clearTimeout(timer); resolve(); return; }
        try {
          const blob = await res.blob();
          if (blob.size > 0) {
            const blobUrl = URL.createObjectURL(blob);
            videoBlobUrls.set(url, blobUrl);
          }
        } catch { /* ignore */ }
        window.clearTimeout(timer);
        resolve();
      })
      .catch(() => { window.clearTimeout(timer); resolve(); });
  });
}

function preloadSingleAsset(asset: AssetDescriptor): Promise<void> {
  if (asset.kind === "image") return preloadImage(asset.url);
  return preloadVideoFull(asset.url);
}
