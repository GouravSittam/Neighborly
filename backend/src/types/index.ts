// Core data types for the Neighborly application

export interface Neighborhood {
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
  // Additional fields for enhanced matching
  transit_score?: number;
  bike_score?: number;
  crime_rate?: number;
  school_rating?: number;
  population_density?: number;
  median_age?: number;
  median_income?: number;
  unemployment_rate?: number;
  weather_data?: WeatherData;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface WeatherData {
  average_temp: number;
  precipitation_days: number;
  sunny_days: number;
  climate_type: string;
}

export interface UserPreferences {
  maxCommute?: number[];
  budgetRange?: number[];
  lifestyle?: string[];
  priorities?: string[];
  // Enhanced preferences
  household_size?: number;
  age_group?: string;
  occupation?: string;
  commute_destination?: string;
  pet_ownership?: boolean;
  vehicle_ownership?: boolean;
  climate_preference?: string;
  noise_tolerance?: string;
  community_engagement?: string;
}

export interface MatchResult {
  neighborhood: Neighborhood;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  matchReasons: string[];
  compatibilityPercentage: number;
}

export interface ScoreBreakdown {
  budget: number;
  lifestyle: number;
  priorities: number;
  commute: number;
  safety: number;
  walkability: number;
  amenities: number;
  total: number;
}

export interface ResearchData {
  userBehavior: UserBehaviorMetrics;
  algorithmPerformance: AlgorithmMetrics;
  dataQuality: DataQualityMetrics;
  marketTrends: MarketTrends;
}

export interface UserBehaviorMetrics {
  totalSearches: number;
  averagePreferences: UserPreferences;
  mostPopularFeatures: string[];
  searchPatterns: SearchPattern[];
  conversionRate: number;
}

export interface SearchPattern {
  timestamp: Date;
  preferences: UserPreferences;
  resultCount: number;
  sessionDuration: number;
}

export interface AlgorithmMetrics {
  averageResponseTime: number;
  accuracyScore: number;
  userSatisfaction: number;
  matchDistribution: Record<string, number>;
  algorithmVersion: string;
}

export interface DataQualityMetrics {
  dataCompleteness: number;
  dataAccuracy: number;
  lastUpdated: Date;
  sourceReliability: number;
  missingFields: string[];
}

export interface MarketTrends {
  rentTrends: RentTrend[];
  neighborhoodPopularity: NeighborhoodPopularity[];
  featureDemand: FeatureDemand[];
  seasonalPatterns: SeasonalPattern[];
}

export interface RentTrend {
  neighborhoodId: number;
  month: string;
  averageRent: number;
  changePercent: number;
}

export interface NeighborhoodPopularity {
  neighborhoodId: number;
  searchCount: number;
  matchCount: number;
  popularityScore: number;
}

export interface FeatureDemand {
  feature: string;
  demandScore: number;
  trend: "increasing" | "decreasing" | "stable";
}

export interface SeasonalPattern {
  month: string;
  searchVolume: number;
  popularFeatures: string[];
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  city?: string;
  minRent?: number;
  maxRent?: number;
  features?: string[];
  minWalkScore?: number;
  minSafetyRating?: number;
}
