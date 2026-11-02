"use client";

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Controls, DownloadButton, HeaderState, Logo, MobileMenu, NavLinks, Reveal, Shell, SkipLink, Surface, useHeader } from "./shared";

function Row({ h, split, chrome, ghost = false }: { h: HeaderState; split: boolean; chrome: boolean; ghost?: boolean }) {
  const p = { chrome, ghost };
  return (
    <div className={`flex items-center ${split ? "justify-between gap-3" : "justify-center"}`}>
      <Reveal className={`relative ${split ? "" : "lg:-mr-24"}`}>
        <Surface {...p} className="px-3 sm:px-4">
          <Logo size={22} />
        </Surface>
      </Reveal>
      <Reveal className="relative z-10 hidden lg:block">
        <Surface {...p} className="px-2">
          <NavLinks s={h.s} />
        </Surface>
      </Reveal>
      <Reveal className={`relative ${split ? "" : "lg:-ml-24"}`}>
        <Surface {...p} className="gap-1 px-2">
          <div className="hidden items-center lg:flex">
            <Controls h={h} />
          </div>
          <DownloadButton s={h.s} />
          <MobileMenu h={h} />
        </Surface>
      </Reveal>
    </div>
  );
}

export function Header() {
  const h = useHeader();
  const reduce = useReducedMotion();
  // The islands start fused into one liquid blob, pull apart, then settle into glass.
  const [split, setSplit] = useState(false);
  const [chrome, setChrome] = useState(false);
  useEffect(() => {
    const a = setTimeout(() => setSplit(true), 550);
    const b = setTimeout(() => setChrome(true), 1500);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  const gooey = !reduce && !chrome;

  return (
    <MotionConfig reducedMotion="user">
      <svg aria-hidden="true" className="absolute size-0">
        <defs>
          <filter id="goo" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
          </filter>
        </defs>
      </svg>
      <SkipLink s={h.s} />
      <Shell>
        <AnimatePresence>
          {gooey && (
            <motion.div key="goo" aria-hidden inert exit={{ opacity: 0, transition: { duration: 0.35 } }} style={{ filter: "url(#goo)" }} className="pointer-events-none absolute inset-x-0 top-0">
              <Row h={h} split={split} chrome={false} ghost />
            </motion.div>
          )}
        </AnimatePresence>
        <Row h={h} split={split} chrome={chrome || !!reduce} />
      </Shell>
    </MotionConfig>
  );
}
