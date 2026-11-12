import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Footprints, MapPin, Shield, Sparkles, Train, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

const CITIES = [
  "Springfield", "Riverton", "Bay City", "Metroville", "Greenwood", "Harbor Point",
  "Oak Ridge", "Lakeside", "Midtown", "Old Town", "Westbrook", "Cedar Hills",
];

function ScoreRing({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid size-16 place-items-center">
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-muted" />
        <motion.circle
          cx="32" cy="32" r={r} fill="none" strokeWidth="5" strokeLinecap="round"
          stroke="url(#ring)"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.6, delay: 0.9, ease }}
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--violet)" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-mono text-sm font-semibold">{value}%</span>
    </div>
  );
}

function PreviewCard() {
  const bars = [
    { label: "Budget fit", v: 96 },
    { label: "Lifestyle", v: 91 },
    { label: "Commute", v: 88 },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[26rem]">
      {/* Main card */}
      <div className="ring-gradient rounded-[1.75rem] p-px shadow-[0_30px_80px_-20px_oklch(0_0_0/0.45)]">
        <div className="overflow-hidden rounded-[calc(1.75rem-1px)] bg-card">
          <div className="relative h-44 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=75"
              alt="Suburban home with a front porch and lawn"
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
            <span className="glass absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5 text-primary" /> Top match
            </span>
          </div>
          <div className="space-y-5 p-5 pt-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Greenwood</h3>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" /> Springfield
                </p>
              </div>
              <ScoreRing value={94} />
            </div>
            <div className="space-y-3">
              {bars.map((b, i) => (
                <div key={b.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="font-mono">{b.v}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-violet"
                      initial={{ width: 0 }}
                      animate={{ width: `${b.v}%` }}
                      transition={{ duration: 1.2, delay: 1.1 + i * 0.12, ease }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { icon: Footprints, label: "Walk", v: "85" },
                { icon: Shield, label: "Safety", v: "4.5" },
                { icon: Train, label: "Transit", v: "78" },
              ].map(({ icon: Icon, label, v }) => (
                <div key={label} className="rounded-xl bg-muted/60 py-2.5">
                  <Icon className="mx-auto size-3.5 text-muted-foreground" />
                  <div className="mt-1 font-mono text-sm font-semibold">{v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating chips */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.6, ease }}
        className="glass animate-float absolute -left-6 top-24 hidden items-center gap-3 rounded-2xl px-4 py-3 shadow-xl sm:-left-16 sm:flex"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-foreground">
          <TrendingUp className="size-4" />
        </span>
        <div>
          <div className="text-xs text-muted-foreground">Avg. rent</div>
          <div className="font-mono text-sm font-semibold">$1,200<span className="text-muted-foreground">/mo</span></div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.6, ease }}
        style={{ animationDelay: "1.5s" }}
        className="glass animate-float absolute -right-4 bottom-24 hidden rounded-2xl px-4 py-3 shadow-xl sm:-right-14 sm:block"
      >
        <div className="text-xs text-muted-foreground">Why it fits</div>
        <div className="mt-1 flex flex-wrap gap-1">
          {["Parks", "Quiet", "Pet-friendly"].map((t) => (
            <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">{t}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 80]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[60rem] max-w-[140vw] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-[120px]" />
        <div className="absolute top-80 -left-40 h-[22rem] w-[22rem] rounded-full bg-amber/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:px-8">
        <motion.div style={{ y, opacity }} className="text-center lg:text-left">
          <motion.a
            href="#research"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="glass group inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-xs"
          >
            <span className="rounded-full bg-foreground px-2.5 py-1 font-medium text-background">New</span>
            <span className="text-muted-foreground">Matching engine v2 — explainable scores</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <h1 className="mt-7 text-5xl font-semibold leading-[0.95] tracking-[-0.035em] sm:text-6xl md:text-7xl xl:text-[5.5rem]">
            {["Find", "the", "neighborhood"].map((w, i) => (
              <motion.span
                key={w}
                className="inline-block pr-[0.25em]"
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease }}
              >
                {w}
              </motion.span>
            ))}
            <br className="hidden sm:block" />
            <motion.span
              className="inline-block pr-[0.25em]"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.34, ease }}
            >
              that
            </motion.span>
            <motion.span
              className="font-display-italic text-gradient inline-block pr-2 text-[1.08em]"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.44, ease }}
            >
              fits your life.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease }}
            className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0"
          >
            Tell us how you live — budget, commute, the things you love. Neighborly scores every
            neighborhood against you and shows exactly why it fits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.72, ease }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button asChild size="xl" className="overflow-hidden">
              <a href="#match">
                <span aria-hidden className="shimmer absolute inset-0" />
                Find my match <ArrowRight />
              </a>
            </Button>
            <Button asChild size="xl" variant="outline">
              <a href="#explore">Explore neighborhoods</a>
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mx-auto mt-12 grid max-w-md grid-cols-3 divide-x divide-border lg:mx-0"
          >
            {[
              { v: "100+", l: "signals scored" },
              { v: "94%", l: "satisfaction" },
              { v: "<50ms", l: "to match" },
            ].map((s) => (
              <div key={s.l} className="px-4 first:pl-0">
                <dt className="sr-only">{s.l}</dt>
                <dd className="font-mono text-2xl font-semibold tracking-tight">{s.v}</dd>
                <dd className="mt-1 text-xs text-muted-foreground">{s.l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 0.4, ease }}
          className="px-6 sm:px-16 lg:px-4"
        >
          <PreviewCard />
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative mt-24 overflow-hidden border-y border-border py-5 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
        <div className="animate-marquee flex w-max gap-12 pr-12">
          {[...CITIES, ...CITIES].map((c, i) => (
            <span key={i} className="flex items-center gap-12 whitespace-nowrap font-display-italic text-2xl text-muted-foreground/70">
              {c}
              <span className="size-1.5 rounded-full bg-primary/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
