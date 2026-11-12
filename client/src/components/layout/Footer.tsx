import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/section";
import { Logo } from "./Logo";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54v-1.9c-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.16a10.8 10.8 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.55.23 2.7.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.33-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.78.54a11.26 11.26 0 0 0 7.68-10.67C23.25 5.48 18.27.5 12 .5Z" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[17px]" fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Matching", href: "#match" },
      { label: "Explore", href: "#explore" },
      { label: "Research", href: "#research" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Stories", href: "#stories" },
      { label: "FAQ", href: "#faq" },
      { label: "GitHub", href: "https://github.com/GouravSittam/Neighborly" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-4 pb-8 sm:px-6 lg:px-8">
      {/* CTA */}
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-16 text-center sm:px-12 md:py-24">
        <div aria-hidden className="grid-bg absolute inset-0 opacity-70" />
        <div aria-hidden className="absolute -bottom-40 left-1/2 h-80 w-[44rem] max-w-full -translate-x-1/2 rounded-full bg-primary/25 blur-[100px]" />
        <div aria-hidden className="absolute -top-32 -right-20 h-64 w-64 rounded-full bg-violet/20 blur-[90px]" />
        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Your next <span className="font-display-italic text-gradient">home base</span> is a few clicks away.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground md:text-lg">
            Two minutes of preferences. A ranked shortlist of neighborhoods with the reasons behind every score.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" className="overflow-hidden">
              <a href="#match">
                <span aria-hidden className="shimmer absolute inset-0" />
                Start matching — it's free
              </a>
            </Button>
            <Button asChild size="xl" variant="outline">
              <a href="#research">See the data</a>
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Links */}
      <div className="mx-auto mt-16 grid max-w-7xl gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Data-driven neighborhood matching. Built to make moving feel less like guessing.
          </p>
          <div className="flex gap-1">
            {[
              { icon: <XIcon />, href: "https://twitter.com", label: "X (Twitter)" },
              { icon: <GithubIcon />, href: "https://github.com/GouravSittam/Neighborly", label: "GitHub" },
              { icon: <LinkedinIcon />, href: "https://linkedin.com", label: "LinkedIn" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{col.title}</h3>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="group inline-flex items-center gap-1 text-sm transition-colors hover:text-primary">
                    {l.label}
                    {l.href.startsWith("http") && <ArrowUpRight className="size-3.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden className="pointer-events-none mx-auto mt-16 max-w-7xl select-none overflow-hidden">
        <p className="font-display-italic bg-gradient-to-b from-foreground/15 to-transparent bg-clip-text text-center text-[22vw] leading-[0.8] text-transparent lg:text-[17rem]">
          Neighborly
        </p>
      </div>

      <div className="mx-auto mt-6 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Neighborly. All rights reserved.</p>
        <p className="font-mono">Made with care · v2.0</p>
      </div>
    </footer>
  );
}
