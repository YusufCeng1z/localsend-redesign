const out = [
  ["Discord", "https://discord.gg/GSRWmQNP87"],
  ["Reddit", "https://reddit.com/r/localsend"],
  ["Mastodon", "https://mastodon.social/@localsend"],
  ["GitHub", "https://github.com/localsend/localsend/discussions"],
] as const;

const link = "text-foreground underline decoration-foreground/25 decoration-2 underline-offset-[0.2em] motion-safe:transition-colors hover:text-accent-text hover:decoration-accent-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-text";

export function Community() {
  const [[, discord], [, reddit], [, mastodon], [, github]] = out;
  return (
    <section id="community" aria-labelledby="community-h" className="mx-auto max-w-[760px] scroll-mt-24 px-2 pb-20 text-center">
      <h2 id="community-h" className="sr-only">Community</h2>
      <p className="text-balance text-[clamp(1.25rem,2.6vw,1.75rem)] leading-[1.4] font-medium text-foreground/50">
        Chat on <a href={discord} className={link}>Discord</a>, trade tips on <a href={reddit} className={link}>Reddit</a>, follow releases on <a href={mastodon} className={link}>Mastodon</a>, or get help on <a href={github} className={link}>GitHub</a>.
      </p>
    </section>
  );
}
