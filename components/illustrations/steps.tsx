"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { box, Check, EASE, Phone, Svg, useOnce } from "@/components/features/visuals";

const solid = "bg-[color-mix(in_srgb,var(--foreground)_9%,var(--surface-solid))] ring-1 ring-foreground/15";

// Steps through `n` beats once the visual scrolls in, `gap` ms apart. Reduced motion jumps to the last beat.
function useBeats(n: number, gap: number, first = 500) {
  const { ref, play, reduce } = useOnce();
  const [beat, setBeat] = useState(reduce ? n : 0);
  useEffect(() => {
    if (!play || reduce) return;
    const ids = Array.from({ length: n }, (_, i) => setTimeout(() => setBeat(i + 1), first + i * gap));
    return () => ids.forEach(clearTimeout);
  }, [play, reduce, n, gap, first]);
  return { ref, beat, reduce };
}

// 1. Install: the app, and what you do not need.
const NOT = ["No account", "No login", "No servers"];
export function StepInstall() {
  const { ref, beat, reduce } = useBeats(3, 450);
  return (
    <div ref={ref} className="grid h-52 place-items-center">
      <div className="flex flex-col items-center gap-5">
        <motion.div initial={reduce ? false : { scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className={`relative grid size-16 place-items-center rounded-2xl ${solid}`}>
          <Image src="/logo.png" alt="" width={36} height={36} className="size-9" />
          <span className="absolute -right-2 -bottom-2 grid size-6 place-items-center rounded-full bg-accent text-on-accent">
            <Svg size={14}><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" /></Svg>
          </span>
        </motion.div>
        <ul className="flex flex-col gap-2 text-xs text-foreground/85">
          {NOT.map((t, i) => (
            <motion.li key={t} initial={false} animate={{ opacity: beat > i ? 1 : 0.25, x: beat > i ? 0 : -4 }} transition={{ duration: 0.35, ease: EASE }} className="flex items-center gap-2">
              <span className={`grid size-4 place-items-center rounded-full ${beat > i ? "bg-accent text-on-accent" : "bg-foreground/10 text-transparent"}`}><Check size={10} /></span>
              {t}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 2. Select: any kind of file, ticked one by one.
const FILES = [["JPG", "holiday.jpg", "4.2 MB"], ["MOV", "clip.mov", "820 MB"], ["PDF", "slides.pdf", "48 MB"], ["TXT", "Pasted text", "1 KB"]];
export function StepSelect() {
  const { ref, beat, reduce } = useBeats(3, 450, 600);
  return (
    <div ref={ref} className="grid h-52 place-items-center">
      <div className={`w-full max-w-[17rem] rounded-xl p-2 ${box}`}>
        <ul className="space-y-0.5">
          {FILES.map(([ext, name, size], i) => {
            const on = beat > i && i < 3;
            return (
              <li key={name} className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs transition-colors duration-300 ${on ? "bg-accent/10" : ""}`}>
                <span className="grid h-6 w-9 place-items-center rounded-md bg-foreground/10 text-[10px] font-medium text-foreground/70">{ext}</span>
                <span className="flex-1 truncate text-foreground/85">{name}</span>
                <span className="text-foreground/60">{size}</span>
                <span className={`grid size-4 place-items-center rounded-full ring-1 transition-colors duration-300 ${on ? "bg-accent text-on-accent ring-accent" : "text-transparent ring-foreground/25"}`}><Check size={10} /></span>
              </li>
            );
          })}
        </ul>
        <motion.p initial={false} animate={{ opacity: beat >= 3 || reduce ? 1 : 0.4 }} className="mt-1.5 flex items-center justify-between px-2 pb-1 pt-2 text-xs text-foreground/60">
          <span>{Math.min(beat, 3)} selected</span>
          <span className="rounded-md bg-accent px-2 py-0.5 font-medium text-on-accent">Send</span>
        </motion.p>
      </div>
    </div>
  );
}

// 3. Tap: a nearby device gets tapped, and the files go.
export function StepTap() {
  const { ref, beat } = useBeats(3, 900, 700);
  const sent = beat >= 3;
  return (
    <div ref={ref} className="grid h-52 place-items-center">
      <div className="relative w-full max-w-[17rem]">
        <p className="mb-2 px-1 text-xs text-foreground/60">Nearby devices</p>
        <div className={`relative overflow-hidden rounded-xl p-3 text-xs transition-colors duration-300 ${beat >= 2 ? "bg-accent/10 ring-1 ring-accent/40" : box}`}>
          <div className="flex items-center gap-3">
            <span className="text-foreground/75"><Phone size={20} /></span>
            <span className="flex-1"><span className="block text-foreground/90">Pixel 8</span><span className="text-foreground/60">Android</span></span>
            <span className={`flex items-center gap-1 transition-opacity duration-300 ${sent ? "text-accent-text opacity-100" : "opacity-0"}`}><Check />Sent</span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-foreground/10">
            <motion.div initial={false} animate={{ width: beat >= 2 ? "100%" : "0%" }} transition={{ duration: 0.8, ease: EASE }} className="h-full rounded-full bg-accent" />
          </div>
        </div>
        <motion.svg
          aria-hidden
          width="22"
          height="22"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-[58px] left-[48%] text-foreground drop-shadow"
          initial={{ x: 70, y: 56, opacity: 0 }}
          animate={beat === 0 ? { x: 70, y: 56, opacity: 0 } : { x: 0, y: 0, opacity: beat >= 3 ? 0 : 1, scale: beat === 2 ? 0.85 : 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <path d="M5 3l14 8-6 2 4 7-3 1.5-4-7-5 4z" fill="currentColor" stroke="var(--surface-solid)" strokeWidth="1.2" strokeLinejoin="round" />
        </motion.svg>
      </div>
    </div>
  );
}
