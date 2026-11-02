"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ArchField } from "./arch-field";

const STATS = ["93k+ GitHub stars", "35M+ Downloads", "230+ Contributors", "0 Ads or trackers"];

// Flat image below the hero, with a halo of arches behind it.
export function Product() {
  return (
    <div className="mx-auto max-w-[1100px] pt-16 pb-28">
      {/* The first arch crests just above the screenshot, the rest run behind it and out past its sides. */}
      <ArchField className="top-[-276px] h-[1000px] left-1/2 w-screen -translate-x-1/2" />
      {/* Fades in after hydration. */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="relative">
        <div className="overflow-hidden rounded-[14px]">
          <Image src="/desktop.webp" alt="LocalSend desktop app receiving three PDF files with a progress bar" width={2000} height={1250} sizes="(min-width: 1100px) 1100px, 100vw" className="h-auto w-full" />
        </div>
        <div className="absolute right-[2%] bottom-[-6%] w-[22%] overflow-hidden rounded-[7%/3.2%]">
          <Image src="/mobile.webp" alt="LocalSend on Android, ready to receive as Fast Papaya" width={923} height={2000} sizes="264px" className="h-auto w-full" />
        </div>
      </motion.div>
      <ul className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-3 text-[15px] text-foreground/60">
        {STATS.map((s) => {
          const [n, ...rest] = s.split(" ");
          return <li key={s}><span className="font-medium tabular-nums text-foreground">{n}</span> {rest.join(" ")}</li>;
        })}
      </ul>
    </div>
  );
}
