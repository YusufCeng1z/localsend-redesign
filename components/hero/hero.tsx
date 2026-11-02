"use client";

import { MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const draw = { off: { pathLength: 0 }, on: { pathLength: 1, transition: { duration: 0.5, delay: 0.12, ease: "easeOut" as const } } };

function GlyphSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg aria-hidden="true" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const icons = {
  fast: (
    <GlyphSvg>
      <motion.path variants={draw} d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </GlyphSvg>
  ),
  private: (
    <GlyphSvg>
      <motion.rect variants={draw} x="3" y="11" width="18" height="11" rx="2" />
      <motion.path variants={draw} d="M7 11V7a5 5 0 0 1 10 0v4" />
    </GlyphSvg>
  ),
  offline: (
    <GlyphSvg>
      <motion.path variants={draw} d="M12 20h.01M8.5 16.429a5 5 0 0 1 7 0M5 12.859a10 10 0 0 1 5.17-2.69M19 12.859a10 10 0 0 0-2.007-1.523M2 8.82a15 15 0 0 1 4.177-2.643M22 8.82a15 15 0 0 0-11.288-3.764" />
      <motion.path variants={draw} d="m2 2 20 20" />
    </GlyphSvg>
  ),
};

// Jagged tear line through the middle of a word; the two polygons are exact complements.
const LEFT = "polygon(0 0,50% 0,46% 12%,54% 25%,46% 38%,54% 50%,46% 62%,54% 75%,46% 88%,50% 100%,0 100%)";
const RIGHT = "polygon(50% 0,100% 0,100% 100%,50% 100%,46% 88%,54% 75%,46% 62%,54% 50%,46% 38%,54% 25%,46% 12%)";
const spring = { type: "spring", stiffness: 380, damping: 20 } as const;

function Keyword({ k, children }: { k: keyof typeof icons; children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const [torn, setTorn] = useState(false); // halves stay on screen until they have closed again
  const pointer = useRef("mouse");
  const active = on;
  const half = (clipPath: string, dir: 1 | -1) => (
    <motion.span
      aria-hidden
      variants={{ off: { x: 0, y: 0, rotate: 0 }, on: { x: 24 * dir, y: 3 * dir, rotate: 3 * dir } }}
      transition={spring}
      onAnimationStart={(d) => d === "on" && setTorn(true)}
      onAnimationComplete={(d) => d === "off" && setTorn(false)}
      style={{ clipPath, opacity: torn ? 1 : 0 }}
      className="absolute inset-0 whitespace-nowrap"
    >
      {children}
    </motion.span>
  );
  return (
    <motion.span
      tabIndex={0}
      variants={{ off: { marginLeft: 0, marginRight: 0 }, on: { marginLeft: 24, marginRight: 24 } }}
      transition={spring}
      animate={active ? "on" : "off"}
      initial="off"
      onPointerDown={(e) => (pointer.current = e.pointerType)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOn(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOn(false)}
      onClick={() => pointer.current !== "mouse" && setOn(!on)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      className={`relative inline-block cursor-default rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-text motion-safe:transition-colors motion-safe:duration-200 ${active ? "text-accent-text" : ""}`}
    >
      <span style={{ opacity: torn ? 0 : 1 }}>{children}</span>
      {half(LEFT, -1)}
      {half(RIGHT, 1)}
      <motion.span
        aria-hidden
        variants={{ off: { opacity: 0, scale: 0.3, rotate: -20 }, on: { opacity: 1, scale: 1, rotate: 0 } }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.5, delay: 0.04 }}
        className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-accent-text drop-shadow-[0_0_14px_rgba(47,198,183,0.75)]"
      >
        {icons[k]}
      </motion.span>
    </motion.span>
  );
}

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, ease: [0.2, 0, 0, 1] as const, delay },
});

export function Hero({ actions }: { actions: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const mask = `block ${open ? "" : "overflow-hidden pb-[0.15em] -mb-[0.15em]"}`;
  const rise = (delay: number) => ({ initial: { y: "105%" }, animate: { y: 0 }, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay } });

  return (
    <MotionConfig reducedMotion="user">
      <section className="mx-auto max-w-[997px] pt-24 pb-24 text-center sm:pt-[136px]">
        <h1 className="text-balance text-[clamp(2.25rem,6.5vw,4rem)] font-semibold leading-[1.1] text-foreground">
          <span className={mask}>
            <motion.span {...rise(0.1)} className="block">
              Share files without the cloud.
            </motion.span>
          </span>
          <span className={mask}>
            <motion.span {...rise(0.25)} className="block text-foreground/60">
              <span className="whitespace-nowrap"><Keyword k="fast">Fast</Keyword>,</span> <span className="whitespace-nowrap"><Keyword k="private">private</Keyword>,</span> <span className="whitespace-nowrap"><Keyword k="offline">offline</Keyword>.</span>
            </motion.span>
          </span>
        </h1>

        <motion.p {...enter(0.9)} className="mx-auto mt-6 max-w-xl text-balance text-[18px] leading-7 text-foreground/60">
          Open source and cross-platform file sharing for everyone.
        </motion.p>

        <motion.div {...enter(1.05)} className="mt-12">
          {actions}
        </motion.div>
      </section>
    </MotionConfig>
  );
}
