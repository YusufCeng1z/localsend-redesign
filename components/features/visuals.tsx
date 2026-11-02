"use client";

import { useInView, useReducedMotion } from "motion/react";
import { type ReactNode, useRef } from "react";

export const EASE = [0.2, 0, 0, 1] as const;
export const box = "bg-foreground/[0.05] ring-1 ring-foreground/10";

// `play` turns true once when the visual scrolls in; reduced motion skips straight to the end state.
export function useOnce() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const seen = useInView(ref, { once: true, margin: "-15% 0px" });
  return { ref, reduce, play: seen || reduce };
}

export function Svg({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
export const Laptop = ({ size }: { size?: number }) => <Svg size={size}><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19h20" /></Svg>;
export const Phone = ({ size }: { size?: number }) => <Svg size={size}><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M11 18.5h2" /></Svg>;
export const Check = ({ size = 12 }: { size?: number }) => <Svg size={size}><path d="m5 12.5 4.5 4.5L19 7.5" /></Svg>;
export const File = ({ size }: { size?: number }) => <Svg size={size}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></Svg>;
export const Wifi = ({ size }: { size?: number }) => <Svg size={size}><path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01" /></Svg>;
