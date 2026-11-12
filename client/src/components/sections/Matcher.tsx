import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Baby, Bike, Clock, Coffee, Dumbbell, GraduationCap, Loader2, Moon, Palette, PiggyBank,
  RotateCcw, Search, ShieldCheck, Store, Trees, Utensils, Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/primitives";
import { Reveal, Section, SectionHeading } from "@/components/section";
import { fetchMatches, type MatchPreferences, type MatchResult } from "@/lib/api";
import { cn } from "@/lib/utils";
import { MatchResults } from "./MatchResults";

const LIFESTYLE = [
  { id: "nightlife", label: "Nightlife", icon: Moon },
  { id: "family", label: "Family-friendly", icon: Baby },
  { id: "fitness", label: "Fitness & outdoors", icon: Dumbbell },
  { id: "culture", label: "Arts & culture", icon: Palette },
  { id: "food", label: "Food scene", icon: Utensils },
  { id: "quiet", label: "Peace & quiet", icon: Trees },
];

const PRIORITIES = [
  { id: "commute", label: "Short commute", icon: Bike },
  { id: "walkability", label: "Walkability", icon: Coffee },
  { id: "affordability", label: "Affordability", icon: PiggyBank },
  { id: "safety", label: "Safety", icon: ShieldCheck },
  { id: "schools", label: "Schools", icon: GraduationCap },
  { id: "amenities", label: "Amenities", icon: Store },
];

const DEFAULTS: MatchPreferences = { maxCommute: [30], budgetRange: [3000], lifestyle: [], priorities: [] };

function ChipGroup({
  legend,
  hint,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  hint: string;
  options: typeof LIFESTYLE;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <div className="flex items-baseline justify-between">
        <legend className="text-sm font-medium">{legend}</legend>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map(({ id, label, icon: Icon }) => {
          const on = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(id)}
              className={cn(
                "group relative flex min-h-12 items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm transition-all duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
                on
                  ? "border-primary/60 bg-accent text-accent-foreground shadow-[0_0_0_1px_var(--primary)_inset,0_8px_24px_-12px_var(--glow)]"
                  : "border-border bg-background/40 hover:border-foreground/20 hover:bg-muted/60",
              )}
            >
              <Icon className={cn("size-4 shrink-0 transition-colors", on ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Matcher({ onSearchComplete }: { onSearchComplete?: () => void }) {
  const [prefs, setPrefs] = useState<MatchPreferences>(DEFAULTS);
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [pending, setPending] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const toggle = (key: "lifestyle" | "priorities", id: string) =>
    setPrefs((p) => ({
      ...p,
      [key]: p[key].includes(id) ? p[key].filter((x) => x !== id) : [...p[key], id],
    }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const results = await fetchMatches(prefs);
      setMatches(results);
      // The server logs each search for the research dashboard; refresh it.
      onSearchComplete?.();
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (err) {
      toast.error("Couldn't fetch matches", {
        description: err instanceof Error ? err.message : "Is the API server running on port 4000?",
      });
    } finally {
      setPending(false);
    }
  }

  const selectedCount = prefs.lifestyle.length + prefs.priorities.length;

  return (
    <Section id="match">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 mx-auto h-96 max-w-4xl rounded-full bg-violet/10 blur-[120px]" />
      <SectionHeading
        eyebrow="Smart matching"
        title={<>Tell us how you live. <em>We'll do the rest.</em></>}
        description="Six quick choices. Our algorithm weighs them against every neighborhood in the dataset and ranks the best fits."
      />

      <Reveal>
        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <div className="surface space-y-9 p-6 sm:p-8">
            {/* Sliders */}
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium" id="commute-label">
                    <Clock className="size-4 text-muted-foreground" /> Max commute
                  </label>
                  <span className="font-mono text-2xl font-semibold tabular-nums">
                    {prefs.maxCommute[0]}<span className="ml-1 text-sm font-normal text-muted-foreground">min</span>
                  </span>
                </div>
                <Slider
                  aria-labelledby="commute-label"
                  aria-label="Maximum commute in minutes"
                  value={prefs.maxCommute}
                  onValueChange={(v) => setPrefs((p) => ({ ...p, maxCommute: v }))}
                  min={10} max={60} step={5}
                />
                <div className="flex justify-between font-mono text-[11px] text-muted-foreground"><span>10</span><span>60</span></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium" id="budget-label">
                    <Wallet className="size-4 text-muted-foreground" /> Monthly budget
                  </label>
                  <span className="font-mono text-2xl font-semibold tabular-nums">
                    ${prefs.budgetRange[0].toLocaleString()}
                  </span>
                </div>
                <Slider
                  aria-labelledby="budget-label"
                  aria-label="Monthly budget in dollars"
                  value={prefs.budgetRange}
                  onValueChange={(v) => setPrefs((p) => ({ ...p, budgetRange: v }))}
                  min={1000} max={8000} step={250}
                />
                <div className="flex justify-between font-mono text-[11px] text-muted-foreground"><span>$1k</span><span>$8k</span></div>
              </div>
            </div>

            <ChipGroup legend="Lifestyle" hint="Pick any" options={LIFESTYLE} selected={prefs.lifestyle} onToggle={(id) => toggle("lifestyle", id)} />
            <ChipGroup legend="Top priorities" hint="What matters most" options={PRIORITIES} selected={prefs.priorities} onToggle={(id) => toggle("priorities", id)} />
          </div>

          {/* Live summary */}
          <aside className="surface flex flex-col p-6 lg:sticky lg:top-24 lg:self-start">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Your profile</h3>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Commute</dt><dd className="font-mono">≤ {prefs.maxCommute[0]} min</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Budget</dt><dd className="font-mono">${prefs.budgetRange[0].toLocaleString()}/mo</dd></div>
              <div>
                <dt className="text-muted-foreground">Preferences</dt>
                <dd className="mt-2 flex min-h-8 flex-wrap gap-1.5">
                  <AnimatePresence mode="popLayout">
                    {selectedCount === 0 ? (
                      <motion.span key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-muted-foreground/70">
                        Nothing selected yet
                      </motion.span>
                    ) : (
                      [...prefs.lifestyle, ...prefs.priorities].map((id) => {
                        const opt = [...LIFESTYLE, ...PRIORITIES].find((o) => o.id === id)!;
                        return (
                          <motion.span
                            layout
                            key={id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
                          >
                            {opt.label}
                          </motion.span>
                        );
                      })
                    )}
                  </AnimatePresence>
                </dd>
              </div>
            </dl>
            <div className="mt-8 space-y-2">
              <Button type="submit" size="lg" className="w-full overflow-hidden" disabled={pending}>
                {!pending && <span aria-hidden className="shimmer absolute inset-0" />}
                {pending ? <Loader2 className="animate-spin" /> : <Search />}
                {pending ? "Matching…" : "Find my matches"}
              </Button>
              <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => { setPrefs(DEFAULTS); setMatches(null); }}>
                <RotateCcw /> Reset
              </Button>
            </div>
          </aside>
        </form>
      </Reveal>

      <div ref={resultsRef} className="scroll-mt-28">
        <AnimatePresence>{matches && <MatchResults matches={matches} />}</AnimatePresence>
      </div>
    </Section>
  );
}
