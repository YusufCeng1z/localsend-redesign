// [question, short answer, detail]
const QA = [
  ["Is it free?", "Yes", "Open source under Apache 2.0. No ads, no in-app purchases."],
  ["Needs internet?", "No", "Devices only need the same Wi-Fi or local network."],
  ["Is it secure?", "HTTPS", "The certificate is generated on your device. Add a PIN if you like."],
  ["Where do files go?", "Downloads", "Your Downloads folder by default. Change it in Settings."],
  ["Which platforms?", "All five", "Windows, macOS, Linux, Android and iOS."],
  ["Need an account?", "No", "No login, no registration. Install and send."],
];

// Two short columns of closed rows; one opens at a time per column.
function Column({ rows, name }: { rows: typeof QA; name: string }) {
  return (
    <div className="divide-y divide-foreground/10 border-y border-foreground/10">
      {rows.map(([q, a, d]) => (
        <details key={q} name={name} className="faq group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text [&::-webkit-details-marker]:hidden">
            {q}
            <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-foreground/60 motion-safe:transition-transform group-open:rotate-45 group-open:text-accent-text"><path d="M12 5v14M5 12h14" /></svg>
          </summary>
          <p className="pb-4 text-pretty text-[15px] leading-6 text-foreground/60"><span className="text-foreground">{a}.</span> {d}</p>
        </details>
      ))}
    </div>
  );
}

export function Faq() {
  return (
    <section aria-labelledby="faq-h" className="mx-auto max-w-[1152px] px-2 pb-20">
      <h2 id="faq-h" className="mb-5 text-[20px] font-medium text-foreground">Quick answers</h2>
      <div className="grid items-start gap-x-12 md:grid-cols-[repeat(2,minmax(0,1fr))]">
        <Column rows={QA.slice(0, 3)} name="faq-a" />
        <Column rows={QA.slice(3)} name="faq-b" />
      </div>
    </section>
  );
}
