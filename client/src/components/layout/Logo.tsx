import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <a href="/" className={cn("group inline-flex items-center gap-2.5 outline-none", className)} aria-label="Neighborly home">
      <span className="relative grid size-8 place-items-center rounded-[10px] bg-foreground text-background transition-transform duration-300 group-hover:rotate-[-8deg]">
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M6 10v9h12v-9" />
          <circle cx="12" cy="14.5" r="2" fill="var(--primary)" stroke="none" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
      </span>
      <span className="text-[17px] font-semibold tracking-tight">
        Neighborly
      </span>
    </a>
  );
}
