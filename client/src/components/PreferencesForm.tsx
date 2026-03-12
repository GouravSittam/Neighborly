import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  MapPin,
  DollarSign,
  Car,
  Coffee,
  Loader2,
  Search,
  Clock,
  Wallet,
  Sparkles,
} from "lucide-react";
import { NeighborhoodGrid } from "./NeighborhoodGrid";
import InsightSection from "@/components/InsightSection";

interface MatchResult {
  neighborhood: {
    id: number;
    name: string;
    city: string;
    state: string;
    features: string[];
    average_rent: number;
    walk_score: number;
    safety_rating: number;
    description: string;
    image: string;
    pet_friendly: boolean;
    transit_score?: number;
    bike_score?: number;
    coordinates?: { lat: number; lng: number };
  };
  score: number;
  scoreBreakdown: {
    budget: number;
    lifestyle: number;
    priorities: number;
    commute: number;
    safety: number;
    walkability: number;
    amenities: number;
    total: number;
  };
  matchReasons: string[];
  compatibilityPercentage: number;
}

type Match = {
  id: number;
  name: string;
  city: string;
  features: string[];
  average_rent: number;
  walk_score: number;
  safety_rating: number;
  score: number;
};

interface PreferencesFormProps {
  onSearchComplete?: () => void;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({
  onSearchComplete,
}) => {
  const [preferences, setPreferences] = useState({
    maxCommute: [30],
    budgetRange: [3000],
    lifestyle: [] as string[],
    priorities: [] as string[],
  });
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStartTime] = useState(Date.now());
  const resultsRef = useRef<HTMLDivElement>(null);

  const lifestyleOptions = [
    { id: "nightlife", label: "Nightlife", icon: "🌃" },
    { id: "family", label: "Family-Friendly", icon: "👨‍👩‍👧‍👦" },
    { id: "fitness", label: "Fitness & Outdoor", icon: "💪" },
    { id: "culture", label: "Arts & Culture", icon: "🎨" },
    { id: "food", label: "Food Scene", icon: "🍽️" },
    { id: "quiet", label: "Peaceful & Quiet", icon: "🌿" },
  ];

  const priorities = [
    { id: "commute", label: "Short Commute", icon: "🚗" },
    { id: "walkability", label: "Walkability", icon: "🚶" },
    { id: "affordability", label: "Affordability", icon: "💰" },
    { id: "safety", label: "Safety Rating", icon: "🛡️" },
    { id: "schools", label: "School Quality", icon: "🎓" },
    { id: "amenities", label: "Local Amenities", icon: "🏪" },
  ];

  const toggleSelection = (type: "lifestyle" | "priorities", id: string) => {
    setPreferences((prev) => {
      const arr = prev[type] as string[];
      return {
        ...prev,
        [type]: arr.includes(id)
          ? arr.filter((item) => item !== id)
          : [...arr, id],
      };
    });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMatches([]);

    const sessionDuration = Date.now() - sessionStartTime;

    try {
      const res = await fetch("/api/match?limit=15", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      if (!res.ok) throw new Error("Failed to fetch matches");
      const data = await res.json();
      setMatches(data.data?.matches || []);

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      // Track analytics
      if (data.data?.matches) {
        try {
          await fetch("/api/research/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              preferences,
              resultCount: data.data.matches.length,
              sessionDuration,
            }),
          });
        } catch (analyticsError) {
          console.warn("Failed to track analytics:", analyticsError);
        }
      }
      // Call onSearchComplete after analytics
      if (onSearchComplete) onSearchComplete();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="matching">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Smart Matching
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Tell Us About Your Ideal Lifestyle
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our algorithm analyzes 100+ data points to find neighborhoods that
            genuinely match your lifestyle and priorities.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-border/50 card-elevated">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calculator className="h-5 w-5 text-primary" />
                Lifestyle Preferences
              </CardTitle>
              <CardDescription>
                Help us understand what matters most to you in a neighborhood
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-4">
              {/* Commute Preference */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-sans font-medium text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Maximum Commute Time
                  </label>
                  <span className="text-2xl font-sans font-bold text-primary tabular-nums">
                    {preferences.maxCommute[0]}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      min
                    </span>
                  </span>
                </div>
                <Slider
                  value={preferences.maxCommute}
                  onValueChange={(value) =>
                    setPreferences((prev) => ({ ...prev, maxCommute: value }))
                  }
                  max={60}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10 min</span>
                  <span>60 min</span>
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-sans font-medium text-foreground flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    Monthly Budget
                  </label>
                  <span className="text-2xl font-sans font-bold text-accent tabular-nums">
                    ${preferences.budgetRange[0].toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      /mo
                    </span>
                  </span>
                </div>
                <Slider
                  value={preferences.budgetRange}
                  onValueChange={(value) =>
                    setPreferences((prev) => ({ ...prev, budgetRange: value }))
                  }
                  max={8000}
                  min={1000}
                  step={250}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$1,000</span>
                  <span>$8,000</span>
                </div>
              </div>

              {/* Lifestyle Interests — selectable cards */}
              <div className="space-y-3">
                <label className="text-sm font-sans font-medium text-foreground">
                  Lifestyle Interests
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {lifestyleOptions.map((option) => {
                    const selected = preferences.lifestyle.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleSelection("lifestyle", option.id)}
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          selected
                            ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-sm ring-1 ring-primary/20"
                            : "border-border hover:border-primary/40 hover:bg-muted/50"
                        }`}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <span className="text-sm font-sans font-medium text-foreground">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priorities — selectable cards */}
              <div className="space-y-3">
                <label className="text-sm font-sans font-medium text-foreground">
                  Top Priorities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {priorities.map((priority) => {
                    const selected = preferences.priorities.includes(
                      priority.id,
                    );
                    return (
                      <button
                        key={priority.id}
                        type="button"
                        onClick={() =>
                          toggleSelection("priorities", priority.id)
                        }
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          selected
                            ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-sm ring-1 ring-primary/20"
                            : "border-border hover:border-primary/40 hover:bg-muted/50"
                        }`}
                      >
                        <span className="text-2xl">{priority.icon}</span>
                        <span className="text-sm font-sans font-medium text-foreground">
                          {priority.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg h-14"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Finding Your Matches...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Find My Neighborhood Matches
                  </>
                )}
              </Button>
              {error && (
                <div className="text-destructive text-center text-sm mt-2 p-3 bg-destructive/10 rounded-lg">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </form>

        {/* Display matches */}
        {matches.length > 0 && (
          <div ref={resultsRef} className="mt-16">
            <NeighborhoodGrid matches={matches} />
            <InsightSection />
          </div>
        )}
      </div>
    </section>
  );
};
