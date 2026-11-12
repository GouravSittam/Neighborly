import type { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/primitives";

/** Fades + lifts its children into view once, on scroll. */
export function Reveal({
  delay = 0,
  className,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  // Reduced-motion users get the content immediately — never hidden behind a scroll trigger.
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    />
  );
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("relative py-24 md:py-32", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

/**
 * Section heading. Wrap the emphasised word(s) of `title` in <em> to get the
 * serif-italic gradient treatment, e.g. title={<>Find your <em>place</em></>}.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        "mb-14 flex flex-col gap-5 md:mb-16",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] md:text-5xl lg:text-6xl [&_em]:font-display-italic [&_em]:text-gradient [&_em]:pr-1">
        {title}
      </h2>
      {description && (
        <p className={cn("max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
      {children}
    </Reveal>
  );
}
