import { useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { AlertTriangle, Database, Gauge, RefreshCw, Search, Target, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/primitives";
import { Reveal, Section, SectionHeading } from "@/components/section";
import { fetchResearch, type ResearchData } from "@/lib/api";

/* ── chart chrome ─────────────────────────────────────── */
// Respect reduced-motion: skip Recharts' entry animations.
const animate = typeof window === "undefined" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const axis = { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false } as const;

function ChartTooltip({ active, payload, label, unit = "" }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string | number;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs shadow-xl">
      <div className="text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-semibold text-foreground">
        {payload[0].value.toLocaleString()}{unit}
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children, className = "" }: { title: string; subtitle: string; children: ReactNode; className?: string }) {
  return (
    <div className={`surface p-6 ${className}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-64 place-items-center rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground">
      <p className="max-w-xs px-6">{children}</p>
    </div>
  );
}

function Stat({ icon, label, value, note }: { icon: ReactNode; label: string; value: string; note: string }) {
  return (
    <div className="surface group relative overflow-hidden p-6">
      <div aria-hidden className="absolute -right-10 -top-10 size-32 rounded-full bg-primary/0 blur-2xl transition-colors duration-500 group-hover:bg-primary/15" />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {label}
        <span className="text-primary [&_svg]:size-4">{icon}</span>
      </div>
      <div className="mt-4 font-mono text-4xl font-semibold tracking-tight">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-violet transition-[width] duration-1000" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

/* ── derived series ───────────────────────────────────── */
function useDerived(data: ResearchData | undefined) {
  return useMemo(() => {
    const patterns = data?.userBehavior.searchPatterns ?? [];

    const byDay = new Map<string, number>();
    for (const p of patterns) {
      const day = new Date(p.timestamp).toISOString().slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }
    const daily = [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([day, searches]) => ({
        day: new Date(day).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        searches,
      }));

    const counts = new Map<string, number>();
    for (const p of patterns) {
      for (const k of [...(p.preferences.lifestyle ?? []), ...(p.preferences.priorities ?? [])]) {
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
    const demand = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name: name[0].toUpperCase() + name.slice(1), value }));

    const distribution = Object.entries(data?.algorithmPerformance.matchDistribution ?? {})
      .map(([k, v]) => ({ name: `${k} results`, value: v }))
      .sort((a, b) => b.value - a.value);

    return { daily, demand, distribution };
  }, [data]);
}

/* ── section ──────────────────────────────────────────── */
export function Research({ refreshKey = 0 }: { refreshKey?: number }) {
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["research", refreshKey],
    queryFn: fetchResearch,
    placeholderData: (prev) => prev,
  });
  const { daily, demand, distribution } = useDerived(data);

  return (
    <Section id="research">
      <SectionHeading
        eyebrow="Research & analytics"
        title={<>Built on data. <em>Shown in the open.</em></>}
        description="Live numbers from the matching engine — what people search for, how the algorithm performs, and where the market is moving."
      />

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="surface h-36 animate-pulse" />
          ))}
          <div className="surface h-80 animate-pulse sm:col-span-2 lg:col-span-4" />
        </div>
      ) : isError || !data ? (
        <Reveal className="surface flex flex-col items-center px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </span>
          <h3 className="mt-5 text-xl font-semibold">Research data unavailable</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Couldn't reach the analytics API."} Make sure the server is running.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => refetch()}>
            <RefreshCw className={isFetching ? "animate-spin" : ""} /> Retry
          </Button>
        </Reveal>
      ) : (
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={<Search />} label="Total searches" value={data.userBehavior.totalSearches.toLocaleString()} note="All-time match requests" />
            <Stat icon={<Target />} label="Accuracy" value={`${data.algorithmPerformance.accuracyScore}%`} note={`Algorithm v${data.algorithmPerformance.algorithmVersion}`} />
            <Stat icon={<Database />} label="Data completeness" value={`${data.dataQuality.dataCompleteness}%`} note={`${data.dataQuality.dataAccuracy}% accuracy`} />
            <Stat icon={<Gauge />} label="Conversion" value={`${data.userBehavior.conversionRate.toFixed(1)}%`} note="Searches that led to action" />
          </div>

          <Tabs defaultValue="behavior" className="mt-10">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="behavior"><Users /> Behavior</TabsTrigger>
                <TabsTrigger value="algorithm"><Target /> Algorithm</TabsTrigger>
                <TabsTrigger value="market"><TrendingUp /> Market</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="behavior" className="mt-6 grid gap-4 lg:grid-cols-5">
              <Panel className="lg:col-span-3" title="Searches per day" subtitle="Last 14 active days">
                {daily.length ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={daily} margin={{ left: -20, right: 8, top: 8 }}>
                      <defs>
                        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="day" {...axis} />
                      <YAxis allowDecimals={false} {...axis} />
                      <Tooltip content={<ChartTooltip unit=" searches" />} cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: 4 }} />
                      <Area isAnimationActive={animate} type="monotone" dataKey="searches" stroke="var(--chart-1)" strokeWidth={2} fill="url(#area)" activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty>No searches recorded yet. Run a match above to start the log.</Empty>
                )}
              </Panel>
              <Panel className="lg:col-span-2" title="What people ask for" subtitle="Most-selected lifestyle & priority choices">
                {demand.length ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={demand} layout="vertical" margin={{ left: 0, right: 16 }} barCategoryGap={6}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={96} {...axis} />
                      <Tooltip content={<ChartTooltip unit=" picks" />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
                      <Bar isAnimationActive={animate} dataKey="value" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty>Preferences will appear here as people search.</Empty>
                )}
              </Panel>
            </TabsContent>

            <TabsContent value="algorithm" className="mt-6 grid gap-4 lg:grid-cols-2">
              <Panel title="Results returned" subtitle="How many matches each search produced">
                {distribution.length ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={distribution} margin={{ left: -20, right: 8, top: 8 }}>
                      <CartesianGrid vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="name" {...axis} />
                      <YAxis allowDecimals={false} {...axis} />
                      <Tooltip content={<ChartTooltip unit=" searches" />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
                      <Bar isAnimationActive={animate} dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={56} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty>No distribution data yet.</Empty>
                )}
              </Panel>
              <Panel title="Quality & reliability" subtitle="Health of the data feeding the algorithm">
                <div className="space-y-6">
                  <Meter label="Completeness" value={data.dataQuality.dataCompleteness} />
                  <Meter label="Accuracy" value={data.dataQuality.dataAccuracy} />
                  <Meter label="Source reliability" value={data.dataQuality.sourceReliability} />
                  <Meter label="Match accuracy" value={data.algorithmPerformance.accuracyScore} />
                </div>
              </Panel>
            </TabsContent>

            <TabsContent value="market" className="mt-6 grid gap-4 lg:grid-cols-2">
              <Panel title="Rent trend" subtitle="Average monthly rent across neighborhoods">
                {data.marketTrends.rentTrends?.length ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={data.marketTrends.rentTrends} margin={{ left: -10, right: 8, top: 8 }}>
                      <CartesianGrid vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="month" {...axis} />
                      <YAxis {...axis} tickFormatter={(v) => `$${v}`} />
                      <Tooltip content={<ChartTooltip />} />
                      <Line isAnimationActive={animate} type="monotone" dataKey="averageRent" stroke="var(--chart-1)" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty>Rent trend data hasn't been collected yet.</Empty>
                )}
              </Panel>
              <Panel title="Feature demand" subtitle="How interest in each feature is shifting">
                {data.marketTrends.featureDemand?.length ? (
                  <ul className="divide-y divide-border">
                    {data.marketTrends.featureDemand.map((f) => (
                      <li key={f.feature} className="flex items-center justify-between py-3 text-sm">
                        <span className="capitalize">{f.feature}</span>
                        <span className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {f.trend === "increasing" ? "↑ rising" : f.trend === "decreasing" ? "↓ falling" : "→ stable"}
                          </span>
                          <span className="font-mono font-medium">{f.demandScore}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty>Feature demand will populate as the market dataset grows.</Empty>
                )}
              </Panel>
            </TabsContent>
          </Tabs>
        </Reveal>
      )}
    </Section>
  );
}
