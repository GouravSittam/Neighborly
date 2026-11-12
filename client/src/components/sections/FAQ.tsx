import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/primitives";
import { Reveal, Section, SectionHeading } from "@/components/section";

const FAQS = [
  {
    q: "What is Neighborly?",
    a: "A data-driven neighborhood matcher. You tell us your budget, commute and lifestyle; we score every neighborhood in our dataset against you and rank the best fits — with the reasons behind each score.",
  },
  {
    q: "How does the matching algorithm work?",
    a: "Each neighborhood gets weighted sub-scores for budget, lifestyle, priorities, commute, safety, walkability and amenities. The weights shift based on what you select, and the total becomes your compatibility percentage.",
  },
  {
    q: "Is Neighborly free?",
    a: "Yes. Matching, exploring and the research dashboard are completely free.",
  },
  {
    q: "Where does the data come from?",
    a: "A blend of public datasets — rent, walk and transit scores, safety ratings and amenities — cleaned and validated by our data-processing pipeline. Data quality metrics are shown live in the Research section.",
  },
  {
    q: "How accurate are the matches?",
    a: "Our current algorithm scores 98% accuracy on internal validation, and we track satisfaction continuously. Still, visit before you move — data can't capture everything.",
  },
  {
    q: "How is my data protected?",
    a: "Search preferences are logged anonymously for research. Accounts use hashed passwords and HTTP-only cookies. We never sell personal data.",
  },
];

export function FAQ() {
  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title={<>Questions, <em>answered.</em></>}
            description="Everything you need to know about how Neighborly works."
            className="lg:sticky lg:top-28 md:mb-8"
          >
            <Button asChild variant="outline" className="mt-2">
              <a href="mailto:hello@neighborly.app"><Mail /> Still curious? Get in touch</a>
            </Button>
          </SectionHeading>
        </div>
        <Reveal delay={0.1}>
          <Accordion type="single" collapsible defaultValue="item-0" className="surface px-6 md:px-8">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}
