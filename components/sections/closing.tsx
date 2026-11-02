import { ArchField } from "@/components/hero/arch-field";
import { Download } from "@/components/hero/download";

export function Closing() {
  return (
    <section id="downloads" aria-labelledby="closing-h" className="relative mx-auto max-w-[997px] scroll-mt-24 px-2 pt-24 pb-40 text-center">
      {/* The hero's arches again, flipped so they rise from the footer. */}
      <ArchField className="top-[70px] left-1/2 h-[760px] w-screen -translate-x-1/2 -scale-y-100 opacity-50" />
      <h2 id="closing-h" className="text-balance text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05] font-semibold text-foreground">Send your first file in a minute.</h2>
      <p className="mx-auto mt-5 max-w-md text-balance text-[18px] leading-7 text-foreground/60">Free on every platform. No account needed.</p>
      <div className="mt-10"><Download /></div>
      <p id="contact" className="mt-20 scroll-mt-24 text-[15px] text-foreground/60">
        Found a bug or have an idea?{" "}
        <a href="https://github.com/localsend/localsend/issues" className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text">Open an issue on GitHub</a>.
      </p>
    </section>
  );
}
