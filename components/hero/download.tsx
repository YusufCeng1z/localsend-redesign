"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { menuV, rowV, useDismiss } from "@/components/header/shared";

const WEB_URL = "https://web.localsend.org";

type OS = "Windows" | "macOS" | "Linux" | "Android" | "iOS";
type IconName = OS | "chevron" | "globe" | "out" | "download";

const paths: Record<IconName, React.ReactNode> = {
  macOS: <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />,
  Windows: (<><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>),
  Linux: <path d="m4 17 6-6-6-6M12 19h8" />,
  Android: (<><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></>),
  iOS: (<><rect x="5" y="2" width="14" height="20" rx="3" /><path d="M10 5h4" /></>),
  chevron: <path d="m6 9 6 6 6-6" />,
  globe: (<><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" /></>),
  out: <path d="M7 17 17 7M8 7h9v9" />,
  download: <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />,
};
const platforms: OS[] = ["macOS", "Windows", "Linux", "Android", "iOS"];

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function detect(): OS | null {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Mac/.test(ua)) return navigator.maxTouchPoints > 1 ? "iOS" : "macOS";
  if (/Win/.test(ua)) return "Windows";
  if (/Linux|X11/.test(ua)) return "Linux";
  return null;
}

function useOS() {
  const [os, setOs] = useState<OS | null>(null);
  useEffect(() => {
    // user agent is only known on the client, so detect after hydration
    const t = setTimeout(() => setOs(detect()), 0);
    return () => clearTimeout(t);
  }, []);
  return os;
}

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";
const press = "active:scale-[0.96] motion-safe:transition-[scale,background-color,color] motion-safe:duration-150 ease-out";
const secondary = `${focus} ${press} inline-flex h-[52px] cursor-pointer items-center gap-2 rounded-2xl bg-[color:var(--surface-solid)] px-6 text-[16px] font-medium text-foreground hover:bg-[color:var(--hl)]`;

/* ---------- pieces ---------- */

function Primary({ os }: { os: OS | null }) {
  const reduce = useReducedMotion();
  const blur = reduce ? "blur(0px)" : "blur(4px)";
  return (
    <a href="https://localsend.org/download" className={`${focus} ${press} group inline-flex h-[52px] items-center gap-2.5 rounded-2xl bg-accent px-6 text-[16px] font-medium text-on-accent hover:bg-accent-hover`}>
      <span aria-hidden className="flex motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-y-0.5">
        <Icon name="download" />
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span key={os ?? "none"} initial={{ opacity: 0, y: 8, filter: blur }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: blur }} transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}>
          {os ? `Download for ${os}` : "Download"}
        </motion.span>
      </AnimatePresence>
    </a>
  );
}

function PlatformMenu({ os, web = false }: { os: OS | null; web?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  useDismiss(open, (refocus) => {
    setOpen(false);
    if (refocus) btn.current?.focus();
  }, ref);
  const row = `${focus} flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-foreground hover:bg-[color:var(--hl)] motion-safe:transition-colors motion-safe:duration-100`;

  return (
    <div ref={ref} className="relative">
      <button ref={btn} type="button" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(!open)} className={secondary}>
        All platforms
        <motion.span aria-hidden animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex text-foreground/60">
          <Icon name="chevron" size={16} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul data-menu variants={menuV} initial="hidden" animate="show" exit="exit" style={{ transformOrigin: "top center" }} className="absolute left-1/2 top-[calc(100%+12px)] z-20 w-64 -translate-x-1/2 rounded-2xl bg-[color:var(--surface-solid)] p-1.5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
            {platforms.map((p) => (
              <motion.li key={p} variants={rowV}>
                <a href={`#downloads-${p.toLowerCase()}`} onClick={() => setOpen(false)} className={row}>
                  <span className="text-foreground/60"><Icon name={p} /></span>
                  {p}
                  {p === os && <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-[12px] text-accent-text">Detected</span>}
                </a>
              </motion.li>
            ))}
            {web && (
              <motion.li variants={rowV} className="mt-1.5 pt-1.5">
                <a href={WEB_URL} target="_blank" rel="noopener noreferrer" className={row}>
                  <span className="text-accent-text"><Icon name="globe" /></span>
                  <span>
                    Web app
                    <span className="block text-[13px] text-foreground/60">Runs in your browser</span>
                  </span>
                  <span className="ml-auto text-foreground/60"><Icon name="out" size={16} /></span>
                </a>
              </motion.li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// Fixed height so the caption appearing after OS detection never pushes the page down.
function Detected({ os }: { os: OS | null }) {
  return (
    <p className="min-h-[21px] text-[14px] leading-[21px] text-foreground/60">
      {os && (
        <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }} className="inline-block">
          We detected {os}. Not right? Pick another platform.
        </motion.span>
      )}
    </p>
  );
}

const col = "flex flex-col items-center gap-4";
const row = "flex flex-wrap items-center justify-center gap-3";

export function Download() {
  const os = useOS();
  return (
    <div className={col}>
      <div className={row}>
        <Primary os={os} />
        <PlatformMenu os={os} web />
      </div>
      <Detected os={os} />
    </div>
  );
}
