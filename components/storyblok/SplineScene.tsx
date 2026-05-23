"use client";

import { Suspense, lazy } from "react";

// Spline is heavy + WebGL, so load it only on the client, lazily.
const Spline = lazy(() => import("@splinetool/react-spline"));

// Default to a public Spline scene; override per-deploy with
// NEXT_PUBLIC_SPLINE_SCENE, or pass `scene` explicitly.
const DEFAULT_SCENE =
  process.env.NEXT_PUBLIC_SPLINE_SCENE ||
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function SplineScene({
  scene = DEFAULT_SCENE,
  className = "",
}: {
  scene?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <Suspense fallback={null}>
        <Spline scene={scene} style={{ width: "100%", height: "100%" }} />
      </Suspense>
    </div>
  );
}
