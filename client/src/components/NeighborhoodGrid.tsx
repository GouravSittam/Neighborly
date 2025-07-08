import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  CheckCircle,
  Clock,
  Shield,
  Car,
  Coffee,
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
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <MapPin className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No matches found
        </h3>
        <p className="text-gray-600">
          Try adjusting your preferences to find more neighborhoods.
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getCompatibilityColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  // Defensive: ensure matches is always an array
  const safeMatches = Array.isArray(matches) ? matches : [];

  const avgCompatibility =
    safeMatches.length > 0
      ? Math.round(
          safeMatches.reduce((sum, m) => sum + m.compatibilityPercentage, 0) /
            safeMatches.length
        )
      : "-";

  const avgRent =
    safeMatches.length > 0
      ? Math.round(
          safeMatches.reduce((sum, m) => sum + m.neighborhood.average_rent, 0) /
            safeMatches.length
        )
      : "-";

  const avgWalkScore =
    safeMatches.length > 0
      ? Math.round(
          safeMatches.reduce((sum, m) => sum + m.neighborhood.walk_score, 0) /
            safeMatches.length
        )
      : "-";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Your Neighborhood Matches
        </h3>
        <p className="text-lg text-gray-600">
          Ranked by compatibility with your preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match, index) => (
          <Card
            key={match.neighborhood.id}
            className="relative overflow-hidden"
          >
            {/* Rank Badge */}
            <div className="absolute top-4 right-4 z-10">
              <Badge
                variant={index === 0 ? "default" : "secondary"}
                className="text-sm font-bold"
              >
                #{index + 1}
              </Badge>
            </div>

            {/* Neighborhood Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={match.neighborhood.image}
                alt={match.neighborhood.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Compatibility Badge */}
              <div className="absolute bottom-4 left-4">
                <Badge
                  className={`${getCompatibilityColor(
                    match.compatibilityPercentage
                  )} font-bold`}
                >
                  {match.compatibilityPercentage}% Match
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-xl">
                {match.neighborhood.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {match.neighborhood.city}, {match.neighborhood.state}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                    <DollarSign className="h-3 w-3" />
                    <span>Rent</span>
                  </div>
                  <div className="font-semibold">
                    ${match.neighborhood.average_rent}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                    <Users className="h-3 w-3" />
                    <span>Walk</span>
                  </div>
                  <div className="font-semibold">
                    {match.neighborhood.walk_score}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                    <Shield className="h-3 w-3" />
                    <span>Safety</span>
                  </div>
                  <div className="font-semibold">
                    {match.neighborhood.safety_rating}/5
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Match Breakdown</h4>
                <div className="space-y-2">
                  {Object.entries(match.scoreBreakdown)
                    .filter(([key]) => key !== "total")
                    .map(([category, score]) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize">{category}</span>
                          <span className={getScoreColor(score)}>
                            {Math.round(score)}
                          </span>
                        </div>
                        <Progress
                          value={(score / 1000) * 100}
                          className="h-1"
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Match Reasons */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Why This Matches</h4>
                <div className="space-y-1">
                  {match.matchReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Features</h4>
                <div className="flex flex-wrap gap-1">
                  {match.neighborhood.features.slice(0, 4).map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {match.neighborhood.features.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{match.neighborhood.features.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Pet Friendly Badge */}
              {match.neighborhood.pet_friendly && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Pet Friendly</span>
                </div>
              )}

              {/* Overall Score */}
              <div className={`p-3 rounded-lg ${getScoreBgColor(match.score)}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Overall Score</span>
                  <span
                    className={`text-xl font-bold ${getScoreColor(
                      match.score
                    )}`}
                  >
                    {match.score}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Match Summary</CardTitle>
          <CardDescription>Overview of your matching results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {safeMatches.length}
              </div>
              <div className="text-sm text-gray-600">Total Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {avgCompatibility}
                {avgCompatibility !== "-" && "%"}
              </div>
              <div className="text-sm text-gray-600">Avg Compatibility</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {avgRent !== "-" ? "$" : ""}
                {avgRent}
              </div>
              <div className="text-sm text-gray-600">Avg Rent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {avgWalkScore}
              </div>
              <div className="text-sm text-gray-600">Avg Walk Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
