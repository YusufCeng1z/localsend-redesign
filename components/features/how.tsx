import { StepInstall, StepSelect, StepTap } from "@/components/illustrations/steps";

const STEPS = [
  { n: "01", title: "Install & open", text: "Download LocalSend on all your devices. No account, no login, no servers.", visual: <StepInstall /> },
  { n: "02", title: "Select files", text: "Choose photos, videos, documents or text. Any file type is supported.", visual: <StepSelect /> },
  { n: "03", title: "Tap to send", text: "Tap the nearby device. The transfer happens instantly over your local network.", visual: <StepTap /> },
];

export function How() {
  return (
    <section aria-labelledby="how-h" className="mx-auto max-w-[1152px] px-2 pt-8 pb-28">
      <div className="mb-14 text-center">
        <h2 id="how-h" className="text-balance text-[clamp(2rem,4.5vw,3rem)] leading-[1.1] font-semibold text-foreground">Zero configuration.</h2>
        <p className="mx-auto mt-4 max-w-lg text-balance text-[18px] leading-7 text-foreground/60">Just install and start sharing.</p>
      </div>
      <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-foreground/10 ring-1 ring-foreground/10 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
        {STEPS.map((s) => (
          <li key={s.n} className="flex min-w-0 flex-col gap-8 bg-[color:var(--surface-solid)] p-6 sm:p-8">
            {s.visual}
            <div>
              <p className="text-xs font-medium tabular-nums text-accent-text">Step {s.n}</p>
              <h3 className="mt-2 text-[20px] leading-tight font-medium text-foreground">{s.title}</h3>
              <p className="mt-2 text-pretty text-[15px] leading-6 text-foreground/60">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
