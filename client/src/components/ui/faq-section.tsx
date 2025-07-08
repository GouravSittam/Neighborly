"use client";

import * as React from "react";
import { useState } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:text-foreground",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

type ViewType = "general" | "icons" | "library";

interface FAQItem {
  question: string;
  answer: string;
  id: string;
}

interface FAQSection {
  category: string;
  items: FAQItem[];
}

interface FAQAccordionProps {
  category: string;
  items: FAQItem[];
}

const FAQ_SECTIONS: Record<ViewType, FAQSection> = {
  general: {
    category: "Getting Started",
    items: [
      {
        id: "what-is-neighborly",
        question: "What is Neighborly?",
        answer:
          "Neighborly is a neighborhood matching application that helps you find the best place to live based on your lifestyle, budget, and preferences.",
      },
      {
        id: "how-to-use",
        question: "How do I use Neighborly?",
        answer:
          "Simply fill out your preferences in the matching form, such as budget, commute time, and lifestyle interests. Neighborly will show you the best-matched neighborhoods instantly.",
      },
      {
        id: "is-it-free",
        question: "Is Neighborly free to use?",
        answer: "Yes! Neighborly is completely free for all users.",
      },
      {
        id: "mobile-friendly",
        question: "Can I use Neighborly on my phone?",
        answer:
          "Absolutely! Neighborly is fully responsive and works great on all devices, including smartphones and tablets.",
      },
      {
        id: "privacy",
        question: "How is my data protected?",
        answer:
          "We take privacy seriously. Your preferences are only used to generate matches and are never shared with third parties.",
      },
    ],
  },
  icons: {
    category: "Matching Algorithm",
    items: [
      {
        id: "how-matching-works",
        question: "How does the matching algorithm work?",
        answer:
          "Our algorithm analyzes over 100 factors, including your budget, commute, lifestyle, and priorities, to recommend neighborhoods that best fit your needs.",
      },
      {
        id: "can-i-customize",
        question: "Can I customize my match criteria?",
        answer:
          "Yes! You can adjust your preferences at any time to see updated matches instantly.",
      },
      {
        id: "accuracy",
        question: "How accurate are the matches?",
        answer:
          "Matches are based on the latest available data and your input. The more details you provide, the better your results.",
      },
    ],
  },
  library: {
    category: "Neighborhood Data",
    items: [
      {
        id: "data-sources",
        question: "Where does Neighborly get its neighborhood data?",
        answer:
          "We use a combination of public datasets, local statistics, and user feedback to keep our neighborhood information up to date.",
      },
      {
        id: "update-frequency",
        question: "How often is the data updated?",
        answer:
          "Neighborhood data is updated regularly to ensure accuracy and relevance for all users.",
      },
      {
        id: "suggest-neighborhood",
        question: "Can I suggest a new neighborhood or report an error?",
        answer:
          "Yes! Please contact us through the feedback form if you'd like to suggest a new area or notice any incorrect information.",
      },
    ],
  },
};

const FAQAccordion: React.FC<FAQAccordionProps> = ({ category, items }) => (
  <div className="">
    <Badge variant={"outline"} className="py-2 px-6 rounded-md">
      {category}
    </Badge>
    <Accordion type="single" collapsible className="w-full">
      {items.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export const Component = () => {
  const [activeView, setActiveView] = useState<ViewType>("general");

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="text-center mb-12">
        <p className="text-sm font-medium text-primary mb-2">FAQs</p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Frequently asked questions
        </h1>
        <p className="text-xl text-muted-foreground">
          Need help with something? Here are our most frequently asked
          questions.
        </p>
      </header>

      <div className="flex justify-center sticky top-2">
        <Tabs
          defaultValue="general"
          onValueChange={(value) => setActiveView(value as ViewType)}
          className="mb-8 max-w-xl border rounded-xl bg-background"
        >
          <TabsList className="w-full justify-start h-12 p-1">
            <TabsTrigger value="general">General FAQs</TabsTrigger>
            <TabsTrigger value="icons">UI Icons</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <FAQAccordion
        category={FAQ_SECTIONS[activeView].category}
        items={FAQ_SECTIONS[activeView].items}
      />
    </div>
  );
};
