import type { ReactNode } from "react";
import { Checkpoint, DeviceOrbit, SpeedFast } from "@/components/illustrations/scenes";

export function FeatureGrid({ offline }: { offline: ReactNode }) {
  const items = [
    { title: "Fast", text: "Transfer files at your WiFi's maximum speed. No bandwidth caps.", visual: <SpeedFast />, wide: true },
    { title: "Secure", text: "End-to-end encryption means only you and the recipient can access your files.", visual: <Checkpoint /> },
    { title: "Cross-platform", text: "Available for Windows, macOS, Linux, Android and iOS.", visual: <DeviceOrbit /> },
    { title: "Offline", text: "Works entirely offline. Your data never leaves your local network.", visual: offline, wide: true },
  ];
  return (
    <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-foreground/10 ring-1 ring-foreground/10 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(3,minmax(0,1fr))]">
      {items.map((f) => (
        <li key={f.title} className={`flex min-w-0 flex-col justify-between gap-8 bg-[color:var(--surface-solid)] p-6 sm:p-8 ${f.wide ? "sm:col-span-2 lg:grid lg:grid-cols-[repeat(2,minmax(0,1fr))] lg:items-center lg:gap-10" : ""}`}>
          <div className={`mx-auto w-full ${f.wide ? "max-w-[26rem]" : "max-w-[22rem]"}`}>{f.visual}</div>
          <div>
            <h3 className="text-[20px] leading-tight font-medium text-foreground">{f.title}</h3>
            <p className="mt-2 text-pretty text-[15px] leading-6 text-foreground/60">{f.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
