import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  MapPin,
  DollarSign,
  Users,
  Car,
  Coffee,
} from "lucide-react";
import { NeighborhoodGrid } from "./NeighborhoodGrid";

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

  const lifestyleOptions = [
    { id: "nightlife", label: "Nightlife & Entertainment", icon: "🌃" },
    { id: "family", label: "Family-Friendly", icon: "👨‍👩‍👧‍👦" },
    { id: "fitness", label: "Fitness & Outdoor", icon: "🏃‍♂️" },
    { id: "culture", label: "Arts & Culture", icon: "🎨" },
    { id: "food", label: "Food Scene", icon: "🍽️" },
    { id: "quiet", label: "Peaceful & Quiet", icon: "🌿" },
  ];

  const priorities = [
    { id: "commute", label: "Short Commute", icon: Car },
    { id: "walkability", label: "Walkability", icon: MapPin },
    { id: "affordability", label: "Affordability", icon: DollarSign },
    { id: "safety", label: "Safety Rating", icon: "🛡️" },
    { id: "schools", label: "School Quality", icon: "🎓" },
    { id: "amenities", label: "Local Amenities", icon: Coffee },
  ];

  // Handle checkbox changes for lifestyle and priorities
  const handleCheckboxChange = (
    type: "lifestyle" | "priorities",
    id: string,
    checked: boolean
  ) => {
    setPreferences((prev) => {
      const arr = prev[type] as string[];
      return {
        ...prev,
        [type]: checked ? [...arr, id] : arr.filter((item) => item !== id),
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
      const res = await fetch("http://localhost:4000/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      if (!res.ok) throw new Error("Failed to fetch matches");
      const data = await res.json();
      setMatches(data.data?.matches || []);

      // Track analytics
      if (data.data?.matches) {
        try {
          await fetch("http://localhost:4000/api/research/track", {
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
    <section id="matching" className="py-16">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tell Us About Your Ideal Lifestyle
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Our matching algorithm uses your preferences to find neighborhoods
            that align with your needs and goals.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-6 w-6 text-blue-600" />
                <span>Lifestyle Preferences</span>
              </CardTitle>
              <CardDescription>
                Help us understand what matters most to you in a neighborhood
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Commute Preference */}
              <div className="space-y-4">
                <label className="text-sm md:text-base font-medium text-gray-700">
                  Maximum Commute Time:{" "}
                  <span className="text-blue-600 font-semibold">
                    {preferences.maxCommute[0]} minutes
                  </span>
                </label>
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
              </div>
              {/* Budget Range */}
              <div className="space-y-4">
                <label className="text-sm md:text-base font-medium text-gray-700">
                  Monthly Budget:{" "}
                  <span className="text-green-600 font-semibold">
                    ${preferences.budgetRange[0]}
                  </span>
                </label>
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
              </div>
              {/* Lifestyle Preferences */}
              <div className="space-y-4">
                <label className="text-sm md:text-base font-medium text-gray-700">
                  Lifestyle Interests
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {lifestyleOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        id={option.id}
                        checked={preferences.lifestyle.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "lifestyle",
                            option.id,
                            !!checked
                          )
                        }
                      />
                      <label
                        htmlFor={option.id}
                        className="text-sm md:text-base cursor-pointer flex items-center space-x-2"
                      >
                        <span className="text-lg">{option.icon}</span>
                        <span>{option.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {/* Priorities */}
              <div className="space-y-4">
                <label className="text-sm md:text-base font-medium text-gray-700">
                  Top Priorities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {priorities.map((priority) => (
                    <div
                      key={priority.id}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        id={priority.id}
                        checked={preferences.priorities.includes(priority.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "priorities",
                            priority.id,
                            !!checked
                          )
                        }
                      />
                      <label
                        htmlFor={priority.id}
                        className="text-sm md:text-base cursor-pointer flex items-center space-x-2"
                      >
                        {typeof priority.icon === "string" ? (
                          <span className="text-lg">{priority.icon}</span>
                        ) : (
                          <priority.icon className="h-4 w-4 text-blue-600" />
                        )}
                        <span>{priority.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                disabled={loading}
              >
                {loading
                  ? "Finding Matches..."
                  : "Find My Neighborhood Matches"}
              </Button>
              {error && (
                <div className="text-red-600 text-center mt-4">{error}</div>
              )}
            </CardContent>
          </Card>
        </form>
        {/* Display matches */}
        {matches.length > 0 && (
          <div className="max-w-6xl mx-auto mt-12">
            <NeighborhoodGrid matches={matches} />
          </div>
        )}
      </div>
    </section>
  );
};
