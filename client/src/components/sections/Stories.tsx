import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Quote } from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/section";
import { cn } from "@/lib/utils";

const STORIES = [
  {
    name: "Priya Sharma",
    role: "Product designer · moved to Downtown",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70",
    quote: "I cut my commute by 40% and finally live somewhere I can walk to dinner. The score breakdown made the decision feel obvious.",
    stats: [{ v: "−40%", l: "commute" }, { v: "92", l: "walk score" }],
  },
  {
    name: "The Patel family",
    role: "Family of four · moved to Greenwood",
    avatar: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=70",
    quote: "Top schools, three parks, and quiet streets. We compared six neighborhoods side by side and knew in an evening.",
    stats: [{ v: "A+", l: "schools" }, { v: "4.8", l: "safety" }],
  },
  {
    name: "Carlos Rivera",
    role: "Remote engineer · moved to Riverside",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=70",
    quote: "Four co-working spots nearby, better nightlife, and I'm saving $300 a month. I wish I'd used this for my last move too.",
    stats: [{ v: "$300", l: "saved / mo" }, { v: "+4", l: "co-working" }],
  },
];

export function Stories() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % STORIES.length), 7000);
    return () => clearInterval(t);
  }, [paused]);

  const s = STORIES[active];

  return (
    <Section id="stories">
      <SectionHeading
        eyebrow="Stories"
        title={<>People who found <em>their place.</em></>}
      />
      <Reveal
        className="mx-auto max-w-4xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="surface relative overflow-hidden p-8 md:p-14">
          <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
          <Quote className="relative size-10 text-primary/40" />
          <AnimatePresence mode="wait">
            <motion.figure
              key={active}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <blockquote className="mt-6 font-display text-3xl leading-[1.2] tracking-tight md:text-[2.6rem]">
                “{s.quote}”
              </blockquote>
              <figcaption className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img src={s.avatar} alt="" className="size-12 rounded-full object-cover ring-2 ring-border" />
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-sm text-muted-foreground">{s.role}</div>
                  </div>
                </div>
                <dl className="flex gap-8">
                  {s.stats.map((st) => (
                    <div key={st.l}>
                      <dd className="font-mono text-2xl font-semibold text-primary">{st.v}</dd>
                      <dt className="text-xs text-muted-foreground">{st.l}</dt>
                    </div>
                  ))}
                </dl>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          {STORIES.map((st, i) => (
            <button
              key={st.name}
              onClick={() => setActive(i)}
              aria-label={`Show story from ${st.name}`}
              aria-current={i === active}
              className={cn(
                "rounded-full p-0.5 transition-all",
                i === active ? "ring-2 ring-primary" : "opacity-50 grayscale hover:opacity-100",
              )}
            >
              <img src={st.avatar} alt="" className="size-10 rounded-full object-cover" />
            </button>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
