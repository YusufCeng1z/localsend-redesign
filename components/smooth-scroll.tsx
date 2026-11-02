"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

// Inertial wheel scrolling. Skipped for reduced motion; touch keeps native scrolling.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
