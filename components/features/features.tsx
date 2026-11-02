import { NetworkOffline } from "@/components/illustrations/scenes";
import { FeatureGrid } from "./grid";

export function Features() {
  return (
    <section aria-labelledby="features-h" className="mx-auto max-w-[1152px] px-2 pt-8 pb-28">
      <div className="mb-14 text-center">
        <h2 id="features-h" className="text-balance text-[clamp(2rem,4.5vw,3rem)] leading-[1.1] font-semibold text-foreground">Built for your local network.</h2>
        <p className="mx-auto mt-4 max-w-lg text-balance text-[18px] leading-7 text-foreground/60">Everything you need for fast, secure file sharing, with nothing in the middle.</p>
      </div>
      <FeatureGrid offline={<NetworkOffline />} />
    </section>
  );
}
