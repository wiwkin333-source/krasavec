"use client";

import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
  maxWaitMs?: number;
  targetRatio?: number;
}

/**
 * Luxury preloader — no skip button, no video text.
 * Shows a beautiful loading animation with a bright welcome message,
 * then fades out smoothly to reveal the site.
 */
export function Preloader({
  onComplete,
  maxWaitMs = 30_000,
  targetRatio = 0.85,
}: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [criticalReady, setCriticalReady] = useState(false);
  const doneRef = useRef(false);
  const totalAssetsRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    let loaded = 0;
    let criticalLoaded = 0;
    let criticalTotal = 0;

    // Asset list for preloading
    const assets = getAssetsList();
    totalAssetsRef.current = assets.length;
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

      // Show welcome message for a moment
      setWelcomeShown(true);

      // After welcome display, start the exit transition
      window.setTimeout(() => {
        if (cancelled) return;
        setExiting(true);
        // Wait for the fade-out to complete, then reveal the site
        window.setTimeout(() => {
          if (!cancelled) onComplete();
        }, 900);
      }, 1400);
    };

    // Safety timeout
    const safety = window.setTimeout(() => {
      if (!doneRef.current) finish();
    }, maxWaitMs);

    // Launch all preloaders in parallel
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

  // Smooth progress creep between discrete asset completions
  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.99) return prev;
        const ceiling = criticalReady ? 0.99 : 0.97;
        const next = Math.min(ceiling, prev + 0.004);
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
        transition: "opacity 900ms cubic-bezier(0.4, 0, 0.2, 1), visibility 900ms cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: exiting ? 0 : 1,
        visibility: exiting ? "hidden" : "visible",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          maxWidth: "120vw",
          maxHeight: "120vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,.4), rgba(255,43,214,.3) 40%, transparent 70%)",
          filter: "blur(40px)",
          opacity: 0.6,
          animation: "preloader-pulse 3s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Outer glowing ring */}
      <div
        style={{
          position: "relative",
          width: 160,
          height: 160,
          marginBottom: 40,
        }}
      >
        {/* Expanding ring pulse */}
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: "50%",
            border: "1px solid rgba(41,227,255,0.15)",
            animation: "preloader-ring-expand 2s ease-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: "50%",
            border: "1px solid rgba(255,43,214,0.12)",
            animation: "preloader-ring-expand 2s ease-out 0.7s infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: "50%",
            border: "1px solid rgba(139,92,246,0.1)",
            animation: "preloader-ring-expand 2s ease-out 1.4s infinite",
            pointerEvents: "none",
          }}
        />

        {/* Inner spinner ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#29e3ff",
            borderRightColor: "#8b5cf6",
            animation: "preloader-spin 1.2s linear infinite",
          }}
        />

        {/* Center percentage */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: '"Unbounded", sans-serif',
            fontWeight: 800,
            fontSize: "2rem",
            letterSpacing: "0.05em",
            background: "linear-gradient(135deg, #29e3ff, #8b5cf6, #ff2bd6)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {pct}
        </div>
      </div>

      {/* Brand name */}
      <div
        style={{
          fontFamily: '"Unbounded", sans-serif',
          fontWeight: 800,
          fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          background: "linear-gradient(90deg, #29e3ff, #8b5cf6, #ff2bd6)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          marginBottom: 12,
          textShadow: "0 0 32px rgba(41,227,255,0.35)",
        }}
      >
        ГРАВИКОТ
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "min(280px, 70vw)",
          height: 3,
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg, #29e3ff, #8b5cf6, #ff2bd6)",
            transition: "width 200ms linear",
            boxShadow: "0 0 12px rgba(41,227,255,0.6)",
          }}
        />
      </div>

      {/* Welcome message — appears when loading is done */}
      {welcomeShown && !exiting && (
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            left: 0,
            right: 0,
            textAlign: "center",
            animation: "preloader-welcome-appear 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards",
          }}
        >
          <div
            style={{
              fontFamily: '"Unbounded", sans-serif',
              fontWeight: 800,
              fontSize: "clamp(1.2rem, 3.5vw, 2rem)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "linear-gradient(90deg, #f5e6c8, #fff, #29e3ff, #c9a8ff, #ff8be0, #f5e6c8)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              animation: "shimmer 3s linear infinite",
              filter: "drop-shadow(0 0 20px rgba(41,227,255,.4)) drop-shadow(0 0 40px rgba(255,43,214,.3))",
            }}
          >
            Добро пожаловать
          </div>
        </div>
      )}
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

// Video Blob URL registry
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
