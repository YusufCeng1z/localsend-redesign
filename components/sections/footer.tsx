const COLS = [
  ["Product", [["Download", "https://localsend.org/download"], ["Web app", "https://web.localsend.org"], ["Changelog", "https://localsend.org/changelog"]]],
  ["Community", [["GitHub", "https://github.com/localsend/localsend"], ["Discord", "https://discord.gg/GSRWmQNP87"], ["Reddit", "https://reddit.com/r/localsend"], ["Mastodon", "https://mastodon.social/@localsend"]]],
  ["Legal", [["Privacy", "https://localsend.org/privacy"], ["Code signing", "https://localsend.org/code-signing"], ["Terms", "https://localsend.org/terms"], ["Imprint", "https://localsend.org/imprint"]]],
] as const;

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1152px] border-t border-foreground/10 px-2 pt-12 pb-10">
      <div className="grid gap-10 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(5,minmax(0,1fr))]">
        <p className="max-w-xs text-[15px] leading-6 text-foreground/60 sm:col-span-2">Share files to nearby devices. Free, open source, no cloud.</p>
        {COLS.map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <h3 className="text-[15px] font-medium text-foreground">{title}</h3>
            <ul className="mt-3 space-y-2">
              {links.map(([name, href]) => (
                <li key={name}><a href={href} className="text-[15px] text-foreground/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text motion-safe:transition-colors">{name}</a></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="mt-12 text-[13px] leading-5 text-foreground/50">© 2022-2026 Tien Nam Do. Apache License 2.0. This page is an unofficial redesign concept of localsend.org.</p>
    </footer>
  );
}
