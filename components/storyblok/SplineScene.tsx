"use client";

import { Suspense, lazy, useEffect, useRef, useState } from "react";

// Spline is heavy + WebGL, so load it only on the client, lazily.
const Spline = lazy(() => import("@splinetool/react-spline"));

// Default to a public Spline scene; override per-deploy with
// NEXT_PUBLIC_SPLINE_SCENE, or pass `scene` explicitly.
const DEFAULT_SCENE =
  process.env.NEXT_PUBLIC_SPLINE_SCENE ||
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

type ForwardedEvent = MouseEvent & { __sceneForwarded?: boolean };

export default function SplineScene({
  scene = DEFAULT_SCENE,
  className = "",
  interactive = true,
}: {
  scene?: string;
  className?: string;
  // When true, global cursor movement is forwarded to the scene so its
  // built-in "look at mouse" tracks the pointer everywhere — even when the
  // cursor is over the headline, subtitle, or CTA stacked above it.
  interactive?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Defer loading the (multi-MB) scene until it's near the viewport.
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || load) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  useEffect(() => {
    if (!interactive || !load) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      // Ignore the events we synthesize (prevents an infinite loop).
      if ((e as ForwardedEvent).__sceneForwarded) return;
      const canvas = wrapRef.current?.querySelector("canvas");
      if (!canvas) return;
      // Skip when the cursor is already over the canvas — it gets the
      // real event naturally; forwarding again would double up.
      if (e.target === canvas) return;

      for (const type of ["pointermove", "mousemove"] as const) {
        const evt = new MouseEvent(type, {
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: true,
        }) as ForwardedEvent;
        evt.__sceneForwarded = true;
        canvas.dispatchEvent(evt);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, load]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      // pointer-events-none: never intercept clicks/scroll. Mouse tracking
      // is driven by the forwarded events above, not by real hover.
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      {load && (
        <Suspense fallback={null}>
          <Spline scene={scene} style={{ width: "100%", height: "100%" }} />
        </Suspense>
      )}
    </div>
  );
}
