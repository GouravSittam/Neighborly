import React from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { Icons } from "@/components/ui/icons";

export const Hero = () => {
  return (
    <HeroSection
      badge={{
        text: "Powered by Data Science",
        action: {
          text: "Learn how it works",
          href: "#research",
        },
      }}
      title="Find Your Perfect Neighborhood Match"
      description="Our data-driven matching algorithm analyzes your lifestyle preferences, commute needs, and personal priorities to recommend neighborhoods where you'll truly thrive."
      actions={[
        {
          text: "Start Matching",
          href: "#matching",
          variant: "default",
          icon: <Icons.arrowRight className="h-5 w-5" />,
        },
        {
          text: "View Research",
          href: "#research",
          variant: "outline",
        },
      ]}
      video={{
        src: "https://cdn.dribbble.com/userupload/42670008/file/original-d6c4b23f8f4230fc32fb5b1094fc3086.mp4",
        alt: "Beautiful neighborhood with tree-lined streets and modern homes",
      }}
    />
  );
};
