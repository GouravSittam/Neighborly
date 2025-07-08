"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Star, ArrowRight, CheckCircle } from "lucide-react";

interface SuccessStoryData {
  id: number;
  name: string;
  company: string;
  role: string;
  image: string;
  story: string;
  metrics: {
    label: string;
    value: string;
    improvement: string;
  }[];
  quote: string;
  tags: string[];
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = ({
  className = "",
  variant = "default",
  children,
  ...props
}: BadgeProps) => {
  const variants = {
    default:
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border-border",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const SuccessStory = () => {
  const [activeStory, setActiveStory] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const successStories: SuccessStoryData[] = [
    {
      id: 1,
      name: "Priya Sharma",
      company: "Moved to Willow Park",
      role: "Young Professional",
      image:
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop",
      story:
        "Priya used Neighborly to find a vibrant, walkable neighborhood close to her new job. She discovered local cafes, parks, and a friendly community that made her transition to a new city seamless.",
      quote:
        "Neighborly made my move stress-free. I found the perfect place that matches my lifestyle and budget!",
      metrics: [
        {
          label: "Commute Time",
          value: "-40%",
          improvement: "shorter commute",
        },
        {
          label: "Walkability Score",
          value: "92",
          improvement: "high walkability",
        },
        {
          label: "Community Events",
          value: "+5",
          improvement: "new friends made",
        },
      ],
      tags: ["Relocation", "Walkability", "Community"],
    },
    {
      id: 2,
      name: "The Patel Family",
      company: "Settled in Maple Grove",
      role: "Family of Four",
      image:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop",
      story:
        "The Patels wanted a safe, family-friendly neighborhood with great schools and parks. Neighborly matched them with Maple Grove, where their kids now walk to school and play in green spaces every day.",
      quote:
        "We found a neighborhood where our kids thrive and we feel at home. Thank you, Neighborly!",
      metrics: [
        { label: "School Rating", value: "A+", improvement: "top schools" },
        { label: "Safety Score", value: "98", improvement: "peace of mind" },
        {
          label: "Park Visits",
          value: "+12/mo",
          improvement: "active lifestyle",
        },
      ],
      tags: ["Family", "Schools", "Safety"],
    },
    {
      id: 3,
      name: "Carlos Rivera",
      company: "Discovered Riverfront District",
      role: "Remote Worker",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400&auto=format&fit=crop",
      story:
        "Carlos wanted a lively neighborhood with coworking spaces and nightlife. Neighborly matched him with Riverfront District, where he enjoys work-life balance and a buzzing social scene.",
      quote:
        "I never knew a neighborhood could fit my work and social life so well. Neighborly nailed it!",
      metrics: [
        { label: "Coworking Spots", value: "+4", improvement: "more options" },
        { label: "Nightlife Score", value: "95", improvement: "fun evenings" },
        { label: "Monthly Savings", value: "$300", improvement: "better rent" },
      ],
      tags: ["Remote Work", "Nightlife", "Affordability"],
    },
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setActiveStory((prev) => (prev + 1) % successStories.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, successStories.length]);

  const currentStory = successStories[activeStory];

  return (
    <div className="w-full py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4">Success Stories</Badge>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Real Results from
            <span className="text-primary"> Real Customers</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover how industry leaders transformed their businesses and
            achieved extraordinary results with our platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Story Content */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Customer Info */}
                <div className="flex items-center space-x-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    <img
                      src={currentStory.image}
                      alt={currentStory.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {currentStory.name}
                    </h3>
                    <p className="text-muted-foreground">{currentStory.role}</p>
                    <p className="text-sm font-medium text-primary">
                      {currentStory.company}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {currentStory.tags.map((tag, index) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Badge variant="outline">{tag}</Badge>
                    </motion.div>
                  ))}
                </div>

                {/* Story */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {currentStory.story}
                </motion.p>

                {/* Quote */}
                <motion.blockquote
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="border-l-4 border-primary pl-6 py-4 bg-muted/50 rounded-r-lg"
                >
                  <p className="text-lg font-medium text-foreground italic">
                    "{currentStory.quote}"
                  </p>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </motion.blockquote>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex space-x-2">
                {successStories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveStory(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeStory
                        ? "bg-primary scale-125"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setActiveStory((prev) => (prev + 1) % successStories.length);
                  setIsAutoPlaying(false);
                }}
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors group"
              >
                <span className="text-sm font-medium">Next Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-8 shadow-lg"
              >
                <h4 className="text-2xl font-bold text-foreground mb-8 text-center">
                  Key Results Achieved
                </h4>
                <div className="space-y-6">
                  {currentStory.metrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                    >
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {metric.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {metric.improvement}
                        </p>
                      </div>
                      <div className="text-right">
                        <motion.p
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.4 + index * 0.1,
                            type: "spring",
                          }}
                          className="text-3xl font-bold text-primary"
                        >
                          {metric.value}
                        </motion.p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors inline-flex items-center space-x-2 group">
                <span>Start Your Success Story</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStory;
