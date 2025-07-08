import {
  Neighborhood,
  UserPreferences,
  MatchResult,
  ScoreBreakdown,
} from "../types";

export class MatchingAlgorithm {
  private static readonly WEIGHTS = {
    budget: 0.25,
    lifestyle: 0.2,
    priorities: 0.2,
    commute: 0.15,
    safety: 0.1,
    walkability: 0.05,
    amenities: 0.05,
  };

  private static readonly MAX_SCORES = {
    budget: 1000,
    lifestyle: 1000,
    priorities: 1000,
    commute: 1000,
    safety: 1000,
    walkability: 1000,
    amenities: 1000,
  };

  /**
   * Main matching function that scores and ranks neighborhoods
   */
  public static matchNeighborhoods(
    neighborhoods: Neighborhood[],
    preferences: UserPreferences,
    limit: number = 5
  ): MatchResult[] {
    const startTime = Date.now();

    // Score each neighborhood
    const scoredNeighborhoods = neighborhoods.map((neighborhood) => {
      const scoreBreakdown = this.calculateScoreBreakdown(
        neighborhood,
        preferences
      );
      const totalScore = this.calculateTotalScore(scoreBreakdown);
      const matchReasons = this.generateMatchReasons(
        neighborhood,
        preferences,
        scoreBreakdown
      );
      const compatibilityPercentage =
        this.calculateCompatibilityPercentage(totalScore);

      return {
        neighborhood,
        score: totalScore,
        scoreBreakdown,
        matchReasons,
        compatibilityPercentage,
      };
    });

    // Sort by score and return top matches
    const sortedMatches = scoredNeighborhoods
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Log performance metrics
    const responseTime = Date.now() - startTime;
    this.logPerformanceMetrics(responseTime, preferences, sortedMatches.length);

    return sortedMatches;
  }

  /**
   * Calculate detailed score breakdown for each category
   */
  private static calculateScoreBreakdown(
    neighborhood: Neighborhood,
    preferences: UserPreferences
  ): ScoreBreakdown {
    return {
      budget: this.calculateBudgetScore(neighborhood, preferences),
      lifestyle: this.calculateLifestyleScore(neighborhood, preferences),
      priorities: this.calculatePrioritiesScore(neighborhood, preferences),
      commute: this.calculateCommuteScore(neighborhood, preferences),
      safety: this.calculateSafetyScore(neighborhood, preferences),
      walkability: this.calculateWalkabilityScore(neighborhood, preferences),
      amenities: this.calculateAmenitiesScore(neighborhood, preferences),
      total: 0, // Will be calculated separately
    };
  }

  /**
   * Budget scoring - considers affordability and value
   */
  private static calculateBudgetScore(
    neighborhood: Neighborhood,
    preferences: UserPreferences
  ): number {
    if (!preferences.budgetRange || preferences.budgetRange.length === 0) {
      return this.MAX_SCORES.budget * 0.5; // Neutral score if no budget preference
    }

    const budget = preferences.budgetRange[0];
    const rent = neighborhood.average_rent;
    const difference = Math.abs(rent - budget);
    const percentageDiff = (difference / budget) * 100;

    // Perfect score for exact match, decreasing score for larger differences
    if (percentageDiff <= 5) return this.MAX_SCORES.budget;
    if (percentageDiff <= 10) return this.MAX_SCORES.budget * 0.9;
    if (percentageDiff <= 20) return this.MAX_SCORES.budget * 0.7;
    if (percentageDiff <= 30) return this.MAX_SCORES.budget * 0.5;
    if (percentageDiff <= 50) return this.MAX_SCORES.budget * 0.3;

    return this.MAX_SCORES.budget * 0.1;
  }

  /**
   * Lifestyle scoring - matches user lifestyle preferences with neighborhood features
   */
  private static calculateLifestyleScore(
    neighborhood: Neighborhood,
    preferences: UserPreferences
  ): number {
    if (!preferences.lifestyle || preferences.lifestyle.length === 0) {
      return this.MAX_SCORES.lifestyle * 0.5;
    }

    const lifestyleArr = preferences.lifestyle ?? [];
    const featureMapping: Record<string, string[]> = {
      nightlife: ["nightlife", "restaurants", "bars", "entertainment"],
      family: ["family-friendly", "schools", "parks", "quiet"],
      fitness: ["parks", "gym", "hiking", "outdoor"],
      culture: ["art galleries", "museums", "theaters", "historic"],
      food: ["restaurants", "cafes", "food scene", "dining"],
      quiet: ["quiet", "peaceful", "suburban", "residential"],
    };

    let totalScore = 0;
    const maxPossibleScore =
      lifestyleArr.length *
      (this.MAX_SCORES.lifestyle / (lifestyleArr.length || 1));

    lifestyleArr.forEach((lifestyle) => {
      const relatedFeatures = featureMapping[lifestyle] || [lifestyle];
      const matches = relatedFeatures.filter((feature) =>
        neighborhood.features.some((nf) =>
          nf.toLowerCase().includes(feature.toLowerCase())
        )
      );

      if (matches.length > 0) {
        totalScore +=
          (this.MAX_SCORES.lifestyle / lifestyleArr.length) *
          (matches.length / relatedFeatures.length);
      }
    });

    return Math.min(totalScore, this.MAX_SCORES.lifestyle);
  }

  /**
   * Priorities scoring - weights different priority factors
   */
  private static calculatePrioritiesScore(
    neighborhood: Neighborhood,
    preferences: UserPreferences
  ): number {
    if (!preferences.priorities || preferences.priorities.length === 0) {
      return this.MAX_SCORES.priorities * 0.5;
    }

    let totalScore = 0;
    const scorePerPriority =
      this.MAX_SCORES.priorities / preferences.priorities.length;

    preferences.priorities.forEach((priority) => {
      switch (priority) {
        case "walkability":
          totalScore += (neighborhood.walk_score / 100) * scorePerPriority;
          break;
        case "safety":
          totalScore += (neighborhood.safety_rating / 5) * scorePerPriority;
          break;
        case "affordability":
          if (
            preferences.budgetRange &&
            neighborhood.average_rent <= preferences.budgetRange[0]
          ) {
            totalScore += scorePerPriority;
          }
          break;
        case "commute":
          // This is handled separately in commute scoring
          totalScore += scorePerPriority * 0.5;
          break;
        case "schools":
          if (neighborhood.school_rating) {
            totalScore += (neighborhood.school_rating / 10) * scorePerPriority;
          }
          break;
        case "amenities":
          totalScore += (neighborhood.features.length / 10) * scorePerPriority;
          break;
      }
    });

    return Math.min(totalScore, this.MAX_SCORES.priorities);
  }

  /**
   * Commute scoring - considers commute time and transportation options
   */
  private static calculateCommuteScore(
    neighborhood: Neighborhood,
    preferences: UserPreferences
  ): number {
    if (!preferences.maxCommute || preferences.maxCommute.length === 0) {
      return this.MAX_SCORES.commute * 0.5;
    }

    const maxCommute = preferences.maxCommute[0];
    let score = this.MAX_SCORES.commute;

    // Base score on walk score (better walkability = shorter effective commute)
    const walkScoreContribution =
      (neighborhood.walk_score / 100) * (this.MAX_SCORES.commute * 0.4);

    // Transit score contribution
    const transitContribution = neighborhood.transit_score
      ? (neighborhood.transit_score / 100) * (this.MAX_SCORES.commute * 0.3)
      : 0;

    // Bike score contribution
    const bikeContribution = neighborhood.bike_score
      ? (neighborhood.bike_score / 100) * (this.MAX_SCORES.commute * 0.3)
      : 0;

    score = walkScoreContribution + transitContribution + bikeContribution;

    return Math.min(score, this.MAX_SCORES.commute);
  }

  /**
   * Safety scoring - considers crime rates and safety ratings
   */
  private static calculateSafetyScore(
    neighborhood: Neighborhood,
    preferences: UserPreferences
  ): number {
    let score = (neighborhood.safety_rating / 5) * this.MAX_SCORES.safety;

    // Adjust based on crime rate if available
    if (neighborhood.crime_rate) {
      const crimePenalty = Math.min(
        neighborhood.crime_rate * 10,
        this.MAX_SCORES.safety * 0.3
      );
      score -= crimePenalty;
    }

    return Math.max(0, Math.min(score, this.MAX_SCORES.safety));
  }

  /**
   * Walkability scoring - considers walk score and pedestrian-friendly features
   */
  private static calculateWalkabilityScore(
    neighborhood: Neighborhood,
    preferences: UserPreferences
  ): number {
    let score = (neighborhood.walk_score / 100) * this.MAX_SCORES.walkability;

    // Bonus for pedestrian-friendly features
    const pedestrianFeatures = [
      "walkable",
      "sidewalks",
      "pedestrian",
      "walking",
    ];
    const hasPedestrianFeatures = pedestrianFeatures.some((feature) =>
      neighborhood.features.some((nf) => nf.toLowerCase().includes(feature))
    );

    if (hasPedestrianFeatures) {
      score += this.MAX_SCORES.walkability * 0.2;
    }

    return Math.min(score, this.MAX_SCORES.walkability);
  }

  /**
   * Amenities scoring - considers local amenities and services
   */
  private static calculateAmenitiesScore(
    neighborhood: Neighborhood,
    preferences: UserPreferences
  ): number {
    const amenityFeatures = [
      "restaurants",
      "cafes",
      "shopping",
      "grocery",
      "pharmacy",
      "bank",
      "post office",
      "library",
      "park",
      "gym",
      "hospital",
      "school",
    ];

    const amenityCount = amenityFeatures.filter((feature) =>
      neighborhood.features.some((nf) => nf.toLowerCase().includes(feature))
    ).length;

    return (amenityCount / amenityFeatures.length) * this.MAX_SCORES.amenities;
  }

  /**
   * Calculate weighted total score
   */
  private static calculateTotalScore(scoreBreakdown: ScoreBreakdown): number {
    let totalScore = 0;

    Object.entries(this.WEIGHTS).forEach(([category, weight]) => {
      const score = scoreBreakdown[category as keyof ScoreBreakdown] as number;
      totalScore += score * weight;
    });

    return Math.round(totalScore);
  }

  /**
   * Generate human-readable match reasons
   */
  private static generateMatchReasons(
    neighborhood: Neighborhood,
    preferences: UserPreferences,
    scoreBreakdown: ScoreBreakdown
  ): string[] {
    const reasons: string[] = [];

    // Budget reasons
    if (scoreBreakdown.budget > this.MAX_SCORES.budget * 0.8) {
      reasons.push(`Great value at $${neighborhood.average_rent}/month`);
    }

    // Lifestyle reasons
    if (scoreBreakdown.lifestyle > this.MAX_SCORES.lifestyle * 0.7) {
      const matchingFeatures = preferences.lifestyle?.filter((lifestyle) =>
        neighborhood.features.some((feature) =>
          feature.toLowerCase().includes(lifestyle.toLowerCase())
        )
      );
      if (matchingFeatures && matchingFeatures.length > 0) {
        reasons.push(`Perfect for ${matchingFeatures.join(", ")} lifestyle`);
      }
    }

    // Safety reasons
    if (scoreBreakdown.safety > this.MAX_SCORES.safety * 0.8) {
      reasons.push(`High safety rating of ${neighborhood.safety_rating}/5`);
    }

    // Walkability reasons
    if (scoreBreakdown.walkability > this.MAX_SCORES.walkability * 0.7) {
      reasons.push(`Excellent walkability score of ${neighborhood.walk_score}`);
    }

    // Feature highlights
    if (neighborhood.features.length > 0) {
      const keyFeatures = neighborhood.features.slice(0, 3);
      reasons.push(`Features: ${keyFeatures.join(", ")}`);
    }

    return reasons.slice(0, 3); // Limit to top 3 reasons
  }

  /**
   * Calculate compatibility percentage
   */
  private static calculateCompatibilityPercentage(totalScore: number): number {
    const maxPossibleScore = Object.values(this.MAX_SCORES).reduce(
      (sum, max) => sum + max,
      0
    );
    const averageWeight =
      Object.values(this.WEIGHTS).reduce((sum, weight) => sum + weight, 0) /
      Object.keys(this.WEIGHTS).length;
    const maxWeightedScore = maxPossibleScore * averageWeight;

    return Math.round((totalScore / maxWeightedScore) * 100);
  }

  /**
   * Log performance metrics for algorithm optimization
   */
  private static logPerformanceMetrics(
    responseTime: number,
    preferences: UserPreferences,
    resultCount: number
  ): void {
    console.log(
      `[Matching Algorithm] Response time: ${responseTime}ms, Results: ${resultCount}`
    );

    // Store metrics for analysis (in a real app, this would go to a database)
    const metrics = {
      timestamp: new Date(),
      responseTime,
      resultCount,
      preferencesCount: Object.keys(preferences).length,
      algorithmVersion: "2.0",
    };

    // In a production environment, this would be stored in a metrics database
    // For now, we'll just log it
    console.log("[Metrics]", JSON.stringify(metrics, null, 2));
  }
}
