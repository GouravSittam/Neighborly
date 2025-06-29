
import React from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { Icons } from '@/components/ui/icons';

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
      image={{
        src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop&crop=faces",
        alt: "Beautiful neighborhood with tree-lined streets and modern homes",
      }}
    />
  );
};
