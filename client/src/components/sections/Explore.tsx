import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/section";
import { cn } from "@/lib/utils";

const ARCHETYPES = [
  {
    title: "Urban Loft District",
    tag: "Young professionals",
    description: "Walk to restaurants, nightlife and galleries. Energy on every corner.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=75",
  },
  {
    title: "Suburban Family Haven",
    tag: "Families",
    description: "Tree-lined streets, top schools and parks within a stroller's reach.",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1000&q=75",
  },
  {
    title: "Waterfront Living",
    tag: "Lifestyle",
    description: "Marina access, water views and long evening walks along the shore.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=75",
  },
  {
    title: "Historic Arts Quarter",
    tag: "Creatives",
    description: "Preserved architecture, local galleries and artisan shops.",
    image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1000&q=75",
  },
  {
    title: "Innovation Corridor",
    tag: "Tech & remote",
    description: "Co-working spaces, fast fibre and a café on every block.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=75",
  },
];

export function Explore() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = (i: number) => {
    const el = track.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    if (!card) return;
    setIndex(Math.round(el.scrollLeft / (card.offsetWidth + 16)));
  };

  return (
    <Section id="explore" className="overflow-hidden">
      <div className="mb-10 flex items-end justify-between gap-6">
        <SectionHeading
          align="left"
          eyebrow="Explore"
          title={<>Every lifestyle has a <em>neighborhood.</em></>}
          description="Not sure where to start? Browse the archetypes our algorithm matches most often."
          className="mb-0 md:mb-0"
        />
        <div className="hidden shrink-0 gap-2 md:flex">
          <Button variant="outline" size="icon" aria-label="Previous" disabled={index === 0} onClick={() => scrollTo(Math.max(0, index - 1))}>
            <ArrowLeft />
          </Button>
          <Button variant="outline" size="icon" aria-label="Next" disabled={index >= ARCHETYPES.length - 1} onClick={() => scrollTo(Math.min(ARCHETYPES.length - 1, index + 1))}>
            <ArrowRight />
          </Button>
        </div>
      </div>

      <div
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8"
      >
        {ARCHETYPES.map((a, i) => (
          <a
            key={a.title}
            href="#match"
            className="group relative aspect-[3/4] w-[78%] shrink-0 snap-start overflow-hidden rounded-[1.75rem] border border-border sm:w-[46%] lg:w-[31%]"
          >
            <img src={a.image} alt={a.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <span className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {a.tag}
            </span>
            <span className="absolute right-5 top-5 font-mono text-xs text-white/60">0{i + 1}</span>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="font-display-italic text-3xl leading-tight md:text-4xl">{a.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-white/75">{a.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                Find similar
                <span className="grid size-7 place-items-center rounded-full bg-white text-black transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="size-4" />
                </span>
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-1.5">
        {ARCHETYPES.map((a, i) => (
          <button
            key={a.title}
            onClick={() => scrollTo(i)}
            aria-label={`Go to ${a.title}`}
            className={cn("h-1.5 rounded-full transition-all", i === index ? "w-8 bg-primary" : "w-1.5 bg-foreground/20 hover:bg-foreground/40")}
          />
        ))}
      </div>
    </Section>
  );
}
