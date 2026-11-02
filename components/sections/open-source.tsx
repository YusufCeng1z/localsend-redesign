import { cacheLife } from "next/cache";
import Image from "next/image";

type Contributor = { login: string; avatar_url: string };

async function contributors(): Promise<Contributor[]> {
  "use cache";
  cacheLife("days");
  try {
    const r = await fetch("https://api.github.com/repos/localsend/localsend/contributors?per_page=100");
    return r.ok ? await r.json() : [];
  } catch {
    return [];
  }
}

const btn = "inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[15px] font-medium active:scale-[0.96] motion-safe:transition-[scale,background-color] motion-safe:duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text";

export async function OpenSource() {
  const people = await contributors();
  return (
    <section aria-labelledby="oss-h" className="mx-auto max-w-[1152px] px-2 pb-24 text-center">
      <h2 id="oss-h" className="text-balance text-[clamp(2rem,4.5vw,3rem)] leading-[1.1] font-semibold text-foreground">Built in the open, by 230+ people.</h2>
      <p className="mx-auto mt-4 max-w-lg text-pretty text-[18px] leading-7 text-foreground/60">Every line is public. Read it, audit it, fork it. Funded by sponsors, never by your data.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href="https://github.com/localsend/localsend" className={`${btn} bg-accent text-on-accent hover:bg-accent-hover`}>
          <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" /></svg>
          Star on GitHub
        </a>
        <a href="https://github.com/sponsors/Tienisto" className={`${btn} text-foreground ring-1 ring-foreground/15 hover:bg-foreground/[0.06]`}>Become a sponsor</a>
      </div>
      {people.length > 0 && (
        <ul aria-label="Top contributors" className="mx-auto mt-14 flex max-w-[920px] flex-wrap justify-center gap-2 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
          {people.map((p) => (
            <li key={p.login}>
              <a href={`https://github.com/${p.login}`} title={p.login} className="block rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text">
                <Image src={`${p.avatar_url}&s=80`} alt={p.login} width={40} height={40} unoptimized className="size-10 rounded-full opacity-70 grayscale motion-safe:transition-[opacity,filter,scale] motion-safe:duration-200 hover:scale-125 hover:opacity-100 hover:grayscale-0" />
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-10 text-[15px] text-foreground/60">Apache 2.0 · No ads · No trackers · No accounts</p>
    </section>
  );
}
