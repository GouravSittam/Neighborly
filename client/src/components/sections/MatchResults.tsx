import { motion } from "motion/react";
import { Check, Footprints, MapPin, PawPrint, SearchX, Shield, Trophy, Wallet } from "lucide-react";
import type { MatchResult } from "@/lib/api";
import { cn } from "@/lib/utils";

function Ring({ value, size = 56 }: { value: number; size?: number }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const tone = value >= 80 ? "var(--primary)" : value >= 60 ? "var(--amber)" : "var(--destructive)";
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="4" stroke="currentColor" className="text-white/15" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="4" strokeLinecap="round" stroke={tone}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="font-mono text-sm font-semibold text-white">{value}%</span>
    </div>
  );
}

const BREAKDOWN_KEYS = ["budget", "lifestyle", "commute", "safety", "walkability"] as const;

export function MatchResults({ matches }: { matches: MatchResult[] }) {
  if (matches.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="surface mt-10 flex flex-col items-center px-6 py-16 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-muted">
          <SearchX className="size-6 text-muted-foreground" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">No matches — yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Try widening your budget or commute, or selecting fewer priorities.
        </p>
      </motion.div>
    );
  }

  const avg = (fn: (m: MatchResult) => number) => Math.round(matches.reduce((s, m) => s + fn(m), 0) / matches.length);
  const maxBreakdown = Math.max(1, ...matches.flatMap((m) => BREAKDOWN_KEYS.map((k) => m.scoreBreakdown[k] ?? 0)));

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="mt-16">
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Trophy className="size-3.5" /> {matches.length} matches found
          </span>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Your <span className="font-display-italic text-gradient">shortlist</span>
          </h3>
          <p className="mt-1 text-muted-foreground">Ranked by compatibility with your profile.</p>
        </div>
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border text-center">
          {[
            { l: "Avg match", v: `${avg((m) => m.compatibilityPercentage)}%` },
            { l: "Avg rent", v: `$${avg((m) => m.neighborhood.average_rent).toLocaleString()}` },
            { l: "Avg walk", v: avg((m) => m.neighborhood.walk_score) },
          ].map((s) => (
            <div key={s.l} className="bg-card px-5 py-3">
              <dd className="font-mono text-lg font-semibold">{s.v}</dd>
              <dt className="text-[11px] text-muted-foreground">{s.l}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((m, i) => {
          const n = m.neighborhood;
          return (
            <motion.article
              key={n.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "group surface flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-foreground/15",
                i === 0 && "ring-1 ring-primary/50 shadow-[0_20px_60px_-20px_var(--glow)]",
              )}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={n.image} alt={n.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="glass absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-xs font-semibold">
                  #{i + 1}
                </span>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
                  <div className="min-w-0">
                    <h4 className="truncate text-xl font-semibold">{n.name}</h4>
                    <p className="flex items-center gap-1 text-sm text-white/75">
                      <MapPin className="size-3.5" /> {n.city}{n.state ? `, ${n.state}` : ""}
                    </p>
                  </div>
                  <Ring value={m.compatibilityPercentage} />
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-5 p-5">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { icon: Wallet, l: "Rent", v: `$${n.average_rent.toLocaleString()}` },
                    { icon: Footprints, l: "Walk", v: n.walk_score },
                    { icon: Shield, l: "Safety", v: `${n.safety_rating}/5` },
                  ].map(({ icon: Icon, l, v }) => (
                    <div key={l} className="rounded-xl bg-muted/60 py-2.5">
                      <Icon className="mx-auto size-3.5 text-muted-foreground" />
                      <div className="mt-1 font-mono text-sm font-semibold">{v}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
                    </div>
                  ))}
                </div>

                {/* Score breakdown */}
                <div className="space-y-2">
                  {BREAKDOWN_KEYS.map((k) => {
                    const v = m.scoreBreakdown[k] ?? 0;
                    return (
                      <div key={k} className="flex items-center gap-3 text-xs">
                        <span className="w-20 capitalize text-muted-foreground">{k}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-violet"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(v / maxBreakdown) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <ul className="space-y-2">
                  {m.matchReasons.slice(0, 3).map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                      <span className="text-muted-foreground">{r}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-border pt-4">
                  {n.features.slice(0, 4).map((f) => (
                    <span key={f} className="rounded-full border border-border px-2.5 py-0.5 text-xs capitalize text-muted-foreground">{f}</span>
                  ))}
                  {n.pet_friendly && (
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-primary">
                      <PawPrint className="size-3.5" /> Pets OK
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}
