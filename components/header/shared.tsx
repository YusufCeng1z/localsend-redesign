"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

/* ---------- content ---------- */

export const langs = {
  en: { name: "English", Downloads: "Downloads", Community: "Community", Contact: "Contact", GitHub: "GitHub", Download: "Download", skip: "Skip to content", menu: "Menu", language: "Language", dark: "Switch to dark theme", light: "Switch to light theme" },
  tr: { name: "Türkçe", Downloads: "İndirmeler", Community: "Topluluk", Contact: "İletişim", GitHub: "GitHub", Download: "İndir", skip: "İçeriğe geç", menu: "Menü", language: "Dil", dark: "Koyu temaya geç", light: "Açık temaya geç" },
  de: { name: "Deutsch", Downloads: "Downloads", Community: "Community", Contact: "Kontakt", GitHub: "GitHub", Download: "Herunterladen", skip: "Zum Inhalt springen", menu: "Menü", language: "Sprache", dark: "Zum dunklen Design wechseln", light: "Zum hellen Design wechseln" },
  es: { name: "Español", Downloads: "Descargas", Community: "Comunidad", Contact: "Contacto", GitHub: "GitHub", Download: "Descargar", skip: "Saltar al contenido", menu: "Menú", language: "Idioma", dark: "Cambiar a tema oscuro", light: "Cambiar a tema claro" },
  fr: { name: "Français", Downloads: "Téléchargements", Community: "Communauté", Contact: "Contact", GitHub: "GitHub", Download: "Télécharger", skip: "Aller au contenu", menu: "Menu", language: "Langue", dark: "Passer au thème sombre", light: "Passer au thème clair" },
};
export type Lang = keyof typeof langs;
export type Strings = (typeof langs)[Lang];
type Theme = "dark" | "light";

const links = [
  { key: "Downloads", href: "#downloads" },
  { key: "Community", href: "#community" },
  { key: "Contact", href: "#contact" },
  { key: "GitHub", href: "https://github.com/localsend/localsend" },
] as const;

/* ---------- preferences ---------- */

// Preference is read after hydration, so a stored light theme flashes dark once; an inline script in <head> would avoid it
function usePref<T extends string>(key: string, initial: T, valid: (v: string) => boolean, apply: (v: T) => void) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored && valid(stored)) {
        apply(stored as T);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValue(stored as T);
      }
    } catch {}
  }, [key, apply, valid]);
  const set = (v: T) => {
    setValue(v);
    apply(v);
    try {
      localStorage.setItem(key, v);
    } catch {}
  };
  return [value, set] as const;
}

const applyTheme = (v: Theme) => (document.documentElement.dataset.theme = v);
const applyLang = (v: Lang) => (document.documentElement.lang = v);
const validTheme = (v: string) => v === "dark" || v === "light";
const validLang = (v: string) => v in langs;

export function useHeader() {
  const [theme, setTheme] = usePref<Theme>("theme", "dark", validTheme, applyTheme);
  const [lang, setLang] = usePref<Lang>("lang", "en", validLang, applyLang);
  return { theme, setTheme, lang, setLang, s: langs[lang] };
}
export type HeaderState = ReturnType<typeof useHeader>;

/* ---------- motion ---------- */

const shellV: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1], when: "beforeChildren", staggerChildren: 0.1 } },
};
const itemV: Variants = {
  hidden: { opacity: 0, y: -8, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" }, transition: { duration: 0.3, ease: "easeOut" } },
};

export function Shell({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.header variants={shellV} initial="hidden" animate="visible" className={`sticky top-6 z-50 mx-auto w-full max-w-[997px] ${className}`}>
      {children}
    </motion.header>
  );
}

export function Reveal({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div layout variants={itemV} transition={{ layout: { type: "spring", duration: 0.8, bounce: 0.22 } }} className={className}>
      {children}
    </motion.div>
  );
}

/* ---------- surface ---------- */

export function Surface({ chrome = true, ghost = false, className = "", children }: { chrome?: boolean; ghost?: boolean; className?: string; children: React.ReactNode }) {
  // ghost: opaque blob for the goo filter. Otherwise the real glass surface, fading in once chrome is on.
  const look = ghost
    ? "bg-[color:var(--surface-solid)]"
    : chrome
      ? "bg-[color:var(--surface)] backdrop-blur-[24px] backdrop-saturate-150"
      : "bg-transparent";
  return (
    <div className={`relative flex items-center rounded-[14px] border border-transparent motion-safe:transition-[background-color,backdrop-filter] motion-safe:duration-300 h-[56px] ${look} ${className}`}>
      {ghost ? <div className="invisible contents">{children}</div> : children}
    </div>
  );
}

/* ---------- pieces ---------- */

export const focus =
  "rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";
const iconBtn = `${focus} flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 px-2 text-[13px] font-medium text-foreground hover:bg-[color:var(--hl)] active:scale-[0.96] motion-safe:transition-[background-color,scale] motion-safe:duration-150 ease-out`;

function Icon({ children, size = 18 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function Logo({ size = 24 }: { size?: number }) {
  return (
    <Link href="/" className={`${focus} group flex items-center gap-1 text-foreground`} style={{ fontSize: size }}>
      <Image
        src="/logo.png"
        alt=""
        width={46}
        height={46}
        priority
        className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.2,0,0,1)] motion-safe:group-hover:rotate-45"
      />
      <span className="sr-only sm:not-sr-only">LocalSend</span>
    </Link>
  );
}

export function NavLinks({ s }: { s: Strings }) {
  const id = useId();
  const [active, setActive] = useState<string | null>(null);
  return (
    <nav aria-label="Main" className="flex items-center" onMouseLeave={() => setActive(null)}>
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          onMouseEnter={() => setActive(l.key)}
          onFocus={() => setActive(l.key)}
          onBlur={() => setActive(null)}
          className={`${focus} relative px-3 py-2.5 text-[15px] text-foreground`}
        >
          {active === l.key && (
            <motion.span aria-hidden layoutId={id} transition={{ type: "spring", bounce: 0.15, duration: 0.4 }} className="absolute inset-0 rounded-lg bg-[color:var(--hl)]" />
          )}
          <span className="relative">{s[l.key]}</span>
        </a>
      ))}
    </nav>
  );
}

export function DownloadButton({ s }: { s: Strings }) {
  return (
    <a
      href="#downloads"
      className={`${focus} group relative ml-1 inline-flex h-10 items-center gap-2 overflow-hidden rounded-[13px] bg-accent px-5 text-[15px] font-medium text-on-accent active:scale-[0.96] motion-safe:transition-[scale,filter] motion-safe:duration-150 ease-out hover:brightness-105`}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent motion-safe:group-hover:translate-x-full motion-safe:group-hover:transition-transform motion-safe:group-hover:duration-700" />
      <span className="relative hidden motion-safe:transition-transform motion-safe:group-hover:translate-y-0.5 sm:block">
        <Icon size={16}>
          <path d="M12 15V3M7 10l5 5 5-5M5 21h14" />
        </Icon>
      </span>
      <span className="relative">{s.Download}</span>
    </a>
  );
}

export function ThemeToggle({ theme, setTheme, s }: Pick<HeaderState, "theme" | "setTheme" | "s">) {
  const reduce = useReducedMotion();
  const blur = reduce ? "blur(0px)" : "blur(4px)";
  return (
    <button type="button" className={iconBtn} aria-label={theme === "dark" ? s.light : s.dark} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={theme}
          className="flex"
          initial={{ opacity: 0, scale: 0.25, rotate: -60, filter: blur }}
          animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, rotate: 60, filter: blur }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          <Icon>
            {theme === "dark" ? (
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            ) : (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </>
            )}
          </Icon>
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export const menuV: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -6 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: [0.2, 0, 0, 1], staggerChildren: 0.03, delayChildren: 0.04 } },
  exit: { opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.15, ease: "easeOut" } },
};
export const rowV: Variants = { hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } };

export function useDismiss(open: boolean, close: (refocus: boolean) => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, ref]);
}

export function LangMenu({ lang, setLang, s }: Pick<HeaderState, "lang" | "setLang" | "s">) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  useDismiss(open, (refocus) => {
    setOpen(false);
    if (refocus) btn.current?.focus();
  }, ref);

  return (
    <div ref={ref} className="relative">
      <button ref={btn} type="button" className={iconBtn} aria-label={s.language} aria-expanded={open} onClick={() => setOpen(!open)}>
        <Icon>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
        </Icon>
        <span className="uppercase">{lang}</span>
        <motion.span aria-hidden animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex">
          <Icon size={14}>
            <path d="m6 9 6 6 6-6" />
          </Icon>
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            variants={menuV}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+12px)] z-10 w-40 rounded-[14px] bg-[color:var(--surface-solid)] shadow-[0_8px_24px_rgba(0,0,0,0.35)] p-1.5"
          >
            {(Object.keys(langs) as Lang[]).map((l) => (
              <motion.li key={l} variants={rowV}>
                <button
                  type="button"
                  lang={l}
                  aria-current={l === lang}
                  className={`${focus} flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-left text-[15px] text-foreground hover:bg-[color:var(--hl)] motion-safe:transition-colors motion-safe:duration-100`}
                  onClick={() => {
                    setLang(l);
                    setOpen(false);
                    btn.current?.focus();
                  }}
                >
                  {langs[l].name}
                  {l === lang && (
                    <span className="text-accent-text">
                      <Icon size={16}>
                        <path d="M20 6 9 17l-5-5" />
                      </Icon>
                    </span>
                  )}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Controls({ h }: { h: HeaderState }) {
  return (
    <>
      <LangMenu lang={h.lang} setLang={h.setLang} s={h.s} />
      <ThemeToggle theme={h.theme} setTheme={h.setTheme} s={h.s} />
    </>
  );
}

export function MobileMenu({ h }: { h: HeaderState }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  useDismiss(open, (refocus) => {
    setOpen(false);
    if (refocus) btn.current?.focus();
  }, ref);

  return (
    <div ref={ref} className="relative lg:hidden">
      <button ref={btn} type="button" className={iconBtn} aria-label={h.s.menu} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span key={open ? "x" : "menu"} className="flex" initial={{ opacity: 0, scale: 0.25, rotate: -45 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.25, rotate: 45 }} transition={{ type: "spring", duration: 0.3, bounce: 0 }}>
            <Icon>{open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}</Icon>
          </motion.span>
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            variants={menuV}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+12px)] z-10 w-64 rounded-[14px] bg-[color:var(--surface-solid)] shadow-[0_8px_24px_rgba(0,0,0,0.35)] p-2"
          >
            <nav aria-label="Main mobile" className="flex flex-col">
              {links.map((l) => (
                <motion.a key={l.key} variants={rowV} href={l.href} onClick={() => setOpen(false)} className={`${focus} px-3 py-2.5 text-[15px] text-foreground hover:bg-[color:var(--hl)]`}>
                  {h.s[l.key]}
                </motion.a>
              ))}
            </nav>
            <motion.div variants={rowV} className="mt-2 flex items-center justify-between pt-2">
              <div role="group" aria-label={h.s.language} className="flex gap-1">
                {(Object.keys(langs) as Lang[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    lang={l}
                    aria-label={langs[l].name}
                    aria-pressed={l === h.lang}
                    onClick={() => h.setLang(l)}
                    className={`${focus} h-10 min-w-9 cursor-pointer px-1.5 text-[12px] font-medium uppercase text-foreground aria-pressed:bg-accent aria-pressed:text-on-accent hover:bg-[color:var(--hl)] aria-pressed:hover:bg-accent`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <ThemeToggle theme={h.theme} setTheme={h.setTheme} s={h.s} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SkipLink({ s }: { s: Strings }) {
  return (
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black">
      {s.skip}
    </a>
  );
}
