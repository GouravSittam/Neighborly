import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Clock, GraduationCap, Leaf, LineChart, ScanSearch, ShieldCheck } from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/section";
import { cn } from "@/lib/utils";

function Tile({
  className,
  icon,
  title,
  body,
  children,
  delay = 0,
}: {
  className?: string;
  icon: ReactNode;
  title: string;
  body: string;
  children?: ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={cn("group surface relative flex flex-col overflow-hidden p-6 transition-colors hover:border-foreground/15 md:p-7", className)}>
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-primary/0 blur-3xl transition-colors duration-500 group-hover:bg-primary/15" />
      <span className="grid size-10 place-items-center rounded-xl border border-border bg-muted/50 text-primary">
        {icon}
      </span>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
      {children && <div className="mt-6 flex-1">{children}</div>}
    </Reveal>
  );
}

const SIGNALS = [38, 62, 48, 80, 56, 92, 70, 84, 60, 96, 74, 88, 66, 90];

export function Features() {
  const reduce = useReducedMotion();
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Why Neighborly"
        title={<>Moving is a big decision. <em>Make it a clear one.</em></>}
        description="We turn scattered neighborhood data into one honest score — weighted by what you actually care about."
      />

      <div className="grid auto-rows-[minmax(0,auto)] gap-4 md:grid-cols-6">
        <Tile
          className="md:col-span-4"
          icon={<ScanSearch className="size-5" />}
          title="100+ signals per neighborhood"
          body="Rent, walkability, transit, safety, schools, green space, nightlife and more — normalised and scored against your preferences."
        >
          <div className="flex h-32 items-end gap-1.5">
            {SIGNALS.map((h, i) => (
              <motion.div
                key={i}
                initial={reduce ? false : { height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "flex-1 rounded-t-md",
                  i === 9 ? "bg-gradient-to-t from-primary to-violet" : "bg-muted group-hover:bg-foreground/10",
                )}
              />
            ))}
          </div>
        </Tile>

        <Tile
          className="md:col-span-2"
          delay={0.08}
          icon={<Check className="size-5" />}
          title="Explainable scores"
          body="No black box. Every match comes with the reasons behind it."
        >
          <ul className="space-y-2.5 text-sm">
            {["Within your $3,000 budget", "Walk score 92 — errands on foot", "3 parks within 10 minutes"].map((r) => (
              <li key={r} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                <span className="text-muted-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </Tile>

        <Tile
          className="md:col-span-2"
          delay={0.04}
          icon={<Clock className="size-5" />}
          title="Commute-aware"
          body="Set your max commute and we'll drop anything that eats your mornings."
        >
          <svg viewBox="0 0 200 70" className="h-20 w-full" fill="none" aria-hidden>
            <motion.path
              d="M10 55 C 50 55, 50 15, 95 15 S 150 50, 190 20"
              stroke="url(#route)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1 0"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
            <circle cx="10" cy="55" r="5" fill="var(--primary)" />
            <circle cx="190" cy="20" r="5" fill="var(--violet)" />
            <defs>
              <linearGradient id="route" x1="0" x2="1">
                <stop stopColor="var(--primary)" />
                <stop offset="1" stopColor="var(--violet)" />
              </linearGradient>
            </defs>
          </svg>
        </Tile>

        <Tile
          className="md:col-span-2"
          delay={0.08}
          icon={<ShieldCheck className="size-5" />}
          title="Safety first"
          body="Safety ratings and crime data weighted into every result."
        >
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-5xl font-semibold tracking-tight">4.6</span>
            <span className="text-sm text-muted-foreground">/ 5 avg. top match</span>
          </div>
        </Tile>

        <Tile
          className="md:col-span-2"
          delay={0.12}
          icon={<LineChart className="size-5" />}
          title="Live market trends"
          body="Rent movement and demand shifts, refreshed continuously."
        >
          <svg viewBox="0 0 200 60" className="h-16 w-full" aria-hidden>
            <defs>
              <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 45 L25 40 L50 42 L75 30 L100 34 L125 22 L150 26 L175 12 L200 16 L200 60 L0 60 Z" fill="url(#spark)" />
            <path d="M0 45 L25 40 L50 42 L75 30 L100 34 L125 22 L150 26 L175 12 L200 16" fill="none" stroke="var(--primary)" strokeWidth="2" />
          </svg>
        </Tile>

        <Tile
          className="md:col-span-3"
          delay={0.04}
          icon={<GraduationCap className="size-5" />}
          title="Great for families"
          body="School ratings, playgrounds and quiet streets surface automatically when you pick family-friendly."
        />
        <Tile
          className="md:col-span-3"
          delay={0.08}
          icon={<Leaf className="size-5" />}
          title="Green space, quantified"
          body="Parks, trails and tree cover — because a 10-minute walk to green changes everything."
        />
      </div>
    </Section>
  );
}
