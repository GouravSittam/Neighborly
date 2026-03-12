import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  DollarSign,
  CheckCircle,
  Shield,
  Footprints,
  Search,
  PawPrint,
  Trophy,
} from "lucide-react";

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

interface NeighborhoodGridProps {
  matches: MatchResult[];
  loading?: boolean;
}

export const NeighborhoodGrid: React.FC<NeighborhoodGridProps> = ({
  matches,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse overflow-hidden">
            <div className="h-48 bg-muted rounded-t-lg" />
            <CardHeader>
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-muted rounded-lg" />
                ))}
              </div>
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No matches found yet
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Adjust your preferences above and try again — different combinations
          may unlock great neighborhood matches.
        </p>
      </div>
    );
  }

  const getCompatibilityStyle = (percentage: number) => {
    if (percentage >= 80)
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    if (percentage >= 60)
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
    return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const safeMatches = Array.isArray(matches) ? matches : [];

  const avgCompatibility =
    safeMatches.length > 0
      ? Math.round(
          safeMatches.reduce((sum, m) => sum + m.compatibilityPercentage, 0) /
            safeMatches.length,
        )
      : 0;

  const avgRent =
    safeMatches.length > 0
      ? Math.round(
          safeMatches.reduce((sum, m) => sum + m.neighborhood.average_rent, 0) /
            safeMatches.length,
        )
      : 0;

  const avgWalkScore =
    safeMatches.length > 0
      ? Math.round(
          safeMatches.reduce((sum, m) => sum + m.neighborhood.walk_score, 0) /
            safeMatches.length,
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <Badge variant="secondary" className="mb-3">
          <Trophy className="h-3 w-3 mr-1" />
          {safeMatches.length} Matches Found
        </Badge>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Your Neighborhood Matches
        </h3>
        <p className="text-muted-foreground">
          Ranked by compatibility with your preferences
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
        <div className="text-center p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10">
          <div className="text-2xl font-bold text-primary">
            {avgCompatibility}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">Avg Match</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-muted/60 dark:bg-muted/40 border border-border/50">
          <div className="text-2xl font-bold text-foreground">
            ${avgRent.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Avg Rent</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-muted/60 dark:bg-muted/40 border border-border/50">
          <div className="text-2xl font-bold text-foreground">
            {avgWalkScore}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Avg Walk Score
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match, index) => (
          <Card
            key={match.neighborhood.id}
            className="relative overflow-hidden border-border/50 card-elevated hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300 group"
            style={{
              animationDelay: `${index * 60}ms`,
              animationFillMode: "both",
            }}
          >
            {/* Rank Badge */}
            <div className="absolute top-4 right-4 z-10">
              <Badge
                variant={index === 0 ? "default" : "secondary"}
                className="text-sm font-bold shadow-sm"
              >
                #{index + 1}
              </Badge>
            </div>

            {/* Neighborhood Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={match.neighborhood.image}
                alt={match.neighborhood.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Compatibility Badge */}
              <div className="absolute bottom-3 left-3">
                <Badge
                  className={`${getCompatibilityStyle(
                    match.compatibilityPercentage,
                  )} font-bold border backdrop-blur-sm`}
                >
                  {match.compatibilityPercentage}% Match
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {match.neighborhood.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {match.neighborhood.city}, {match.neighborhood.state}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <DollarSign className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
                  <div className="font-semibold text-sm">
                    ${match.neighborhood.average_rent}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Rent</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <Footprints className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
                  <div className="font-semibold text-sm">
                    {match.neighborhood.walk_score}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Walk</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <Shield className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
                  <div className="font-semibold text-sm">
                    {match.neighborhood.safety_rating}/5
                  </div>
                  <div className="text-[10px] text-muted-foreground">Safe</div>
                </div>
              </div>

              {/* Match Reasons */}
              <div className="space-y-1.5">
                {match.matchReasons.slice(0, 3).map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{reason}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1.5">
                {match.neighborhood.features.slice(0, 4).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {match.neighborhood.features.length > 4 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground"
                  >
                    +{match.neighborhood.features.length - 4} more
                  </Badge>
                )}
              </div>

              {/* Pet Friendly */}
              {match.neighborhood.pet_friendly && (
                <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                  <PawPrint className="h-3.5 w-3.5" />
                  <span>Pet Friendly</span>
                </div>
              )}

              {/* Overall Score */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                <span className="text-sm font-medium text-muted-foreground">
                  Overall Score
                </span>
                <span
                  className={`text-lg font-bold ${getScoreColor(match.score)}`}
                >
                  {match.score}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
