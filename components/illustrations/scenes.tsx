"use client";

import { animate, motion } from "motion/react";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { Check, EASE, useOnce } from "@/components/features/visuals";
import { OrbitingCircles } from "./orbiting-circles";
import "./fx.css";
import { AndroidLogo, AppleLogo, LinuxLogo, WindowsLogo } from "./logos";


// Magic UI Orbiting Circles: the platforms LocalSend runs on circle the app.
const solid = "grid size-full place-items-center rounded-full text-foreground/90 ring-1 ring-foreground/20 bg-[color-mix(in_srgb,var(--foreground)_9%,var(--surface-solid))]";

export function DeviceOrbit() {
  return (
    <div className="relative h-60 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 m-auto size-12"><Image src="/logo.png" alt="" width={48} height={48} className="size-12" /></div>
      <OrbitingCircles radius={56} duration={24} iconSize={40}>
        <span className={solid}><AppleLogo size={19} /></span>
        <span className={solid}><WindowsLogo size={17} /></span>
      </OrbitingCircles>
      <OrbitingCircles radius={102} duration={36} iconSize={40} reverse>
        <span className={solid}><LinuxLogo size={19} /></span>
        <span className={solid}><AndroidLogo size={20} /></span>
      </OrbitingCircles>
    </div>
  );
}

// Cult UI Security Checkpoint: lines of traffic stop at the card, only the right ones pass.
export function Checkpoint() {
  const { ref, play, reduce } = useOnce();
  const rows = ["pass", "block", "pass", "block", "pass", "block"] as const;
  return (
    <div ref={ref} className="relative grid h-60 place-items-center overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-center gap-[18px]">
        {rows.map((r, i) => (
          <div key={i} className="relative h-0.5">
            <motion.div
              initial={reduce ? false : { width: 0 }}
              animate={{ width: play ? (r === "pass" ? "100%" : "calc(50% - 76px)") : 0 }}
              transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.15 + i * 0.08, ease: EASE }}
              className={`h-0.5 rounded-full ${r === "pass" ? "bg-gradient-to-r from-transparent via-accent/50 to-accent" : "bg-gradient-to-r from-transparent via-foreground/15 to-foreground/40"}`}
            />
            {r === "block" && (
              <motion.span initial={false} animate={{ opacity: play ? 1 : 0 }} transition={{ delay: reduce ? 0 : 0.9 + i * 0.08 }} className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-foreground/50" style={{ left: "calc(50% - 79px)" }} />
            )}
          </div>
        ))}
      </div>
      <motion.div initial={reduce ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: play ? 1 : 0, scale: play ? 1 : 0.97 }} transition={{ duration: 0.4, delay: 0.1, ease: EASE }} className="relative w-[152px] rounded-xl bg-[color:var(--surface-solid)] p-3.5 ring-1 ring-foreground/15">
        <p className="flex items-center gap-1.5 text-xs font-medium text-foreground/90"><span className="text-accent-text"><Check /></span>Encrypted</p>
        <p className="mt-2 border-l border-foreground/15 pl-2.5 text-xs leading-[1.4] text-foreground/60">Only you and the recipient can open it.</p>
      </motion.div>
    </div>
  );
}

// Fast: a lightning bolt in front of speed stripes that rush across the card.
const STREAKS = [
  { y: 10, w: 120, h: 3, d: 0.9, o: 0 },
  { y: 21, w: 64, h: 2, d: 1.5, o: 0.4 },
  { y: 31, w: 160, h: 5, d: 0.7, o: 0.15 },
  { y: 43, w: 80, h: 2, d: 1.2, o: 0.8 },
  { y: 57, w: 140, h: 6, d: 0.8, o: 0.3 },
  { y: 69, w: 56, h: 2, d: 1.7, o: 0.55 },
  { y: 80, w: 110, h: 4, d: 1.0, o: 0.1 },
  { y: 91, w: 76, h: 3, d: 1.4, o: 0.65 },
];

export function SpeedFast() {
  const { ref, play, reduce } = useOnce();
  const [mbps, setMbps] = useState(reduce ? 86 : 0);
  useEffect(() => {
    if (!play || reduce) return;
    const c = animate(0, 86, { duration: 1.4, delay: 0.3, ease: "easeOut", onUpdate: (v) => setMbps(Math.round(v)) });
    return () => c.stop();
  }, [play, reduce]);
  return (
    <div ref={ref} className="relative grid h-60 place-items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div aria-hidden className={`absolute inset-0 ${play && !reduce ? "fx-play" : ""}`}>
        {STREAKS.map((s, i) => (
          <span
            key={i}
            className="fx-streak absolute left-0 -skew-x-[35deg] rounded-full bg-gradient-to-r from-transparent via-accent/70 to-accent"
            style={{ top: `${s.y}%`, width: s.w, height: s.h, "--d": `${s.d}s`, "--o": s.o * 2, ...(play && !reduce ? {} : { left: `${12 + ((i * 29) % 60)}%`, opacity: 0.55 }) } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="relative flex flex-col items-center">
        <svg aria-hidden width="84" height="84" viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" className="text-accent">
          <motion.path
            d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"
            stroke="currentColor"
            initial={reduce ? false : { pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: play ? 1 : 0, fillOpacity: play ? 1 : 0 }}
            fill="currentColor"
            transition={{ pathLength: { duration: 0.6, ease: EASE }, fillOpacity: { duration: 0.3, delay: 0.5 } }}
          />
        </svg>
        <p className="mt-3 rounded-md bg-[color:var(--surface-solid)] px-2 py-0.5 text-xs tabular-nums text-foreground/60">
          <span className="font-medium text-foreground">{mbps} MB/s</span> · 1.2 GB in 14 seconds
        </p>
      </div>
    </div>
  );
}

// One big icon over an ambient background, same recipe as the Fast card.
function Stage({ bg, icon, caption }: { bg: (on: boolean) => ReactNode; icon: (p: { play: boolean; reduce: boolean }) => ReactNode; caption: string }) {
  const { ref, play, reduce } = useOnce();
  const on = play && !reduce;
  return (
    <div ref={ref} className="relative grid h-60 place-items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div aria-hidden className={`absolute inset-0 ${on ? "fx-play" : ""}`}>{bg(on)}</div>
      <div className="relative flex flex-col items-center">
        {icon({ play, reduce })}
        <p className="mt-3 rounded-md bg-[color:var(--surface-solid)] px-2 py-0.5 text-xs text-foreground/60">{caption}</p>
      </div>
    </div>
  );
}

const Glyph = ({ children }: { children: ReactNode }) => (
  <svg aria-hidden width="84" height="84" viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const draw = (play: boolean, reduce: boolean, delay = 0) => ({
  initial: reduce ? false : { pathLength: 0 },
  animate: { pathLength: play ? 1 : 0 },
  transition: { duration: 0.7, delay, ease: EASE },
}) as const;

// Cloud off: data comes down from above and fades out before it gets anywhere.
const DROPS = [
  { x: 8, h: 56, d: 1.6, o: 0 }, { x: 20, h: 40, d: 2.1, o: 0.9 }, { x: 33, h: 72, d: 1.4, o: 0.4 },
  { x: 46, h: 48, d: 1.9, o: 1.3 }, { x: 58, h: 64, d: 1.5, o: 0.7 }, { x: 70, h: 44, d: 2.2, o: 0.2 },
  { x: 82, h: 68, d: 1.7, o: 1.1 }, { x: 93, h: 52, d: 1.3, o: 0.5 },
];
export const NetworkOffline = () => (
  <Stage
    caption="Nothing goes through the cloud"
    bg={(on) => (
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_52%)]">
        {DROPS.map((s, i) => (
          <span key={i} className="fx-drop absolute top-0 w-0.5 rounded-full bg-gradient-to-b from-transparent to-foreground/45" style={{ left: `${s.x}%`, height: s.h, "--d": `${s.d}s`, "--o": s.o, ...(on ? {} : { top: `${(i * 13) % 40}%`, opacity: 0.6 }) } as CSSProperties} />
        ))}
      </div>
    )}
    icon={({ play, reduce }) => (
      <Glyph>
        <motion.path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" stroke="currentColor" className="text-foreground/60" {...draw(play, reduce)} />
        <motion.path d="m3 3 18 18" stroke="var(--accent)" strokeWidth="1.8" {...draw(play, reduce, 0.5)} />
      </Glyph>
    )}
  />
);

