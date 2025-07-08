import fs from "fs";
import path from "path";
import {
  ResearchData,
  UserBehaviorMetrics,
  AlgorithmMetrics,
  DataQualityMetrics,
  MarketTrends,
  UserPreferences,
  SearchPattern,
  RentTrend,
  NeighborhoodPopularity,
  FeatureDemand,
  SeasonalPattern,
} from "../types";

export class ResearchAnalytics {
  private static readonly DATA_DIR = path.join(__dirname, "../../data");
  private static readonly ANALYTICS_FILE = path.join(
    ResearchAnalytics.DATA_DIR,
    "analytics.json"
  );
  private static readonly USER_BEHAVIOR_FILE = path.join(
    ResearchAnalytics.DATA_DIR,
    "user-behavior.json"
  );
  private static readonly MARKET_TRENDS_FILE = path.join(
    ResearchAnalytics.DATA_DIR,
    "market-trends.json"
  );

  private static analyticsData: ResearchData | null = null;
  private static searchPatterns: SearchPattern[] = [];

  /**
   * Ensure data directory and files exist
   */
  private static ensureDataFiles() {
    if (!fs.existsSync(this.DATA_DIR)) {
      fs.mkdirSync(this.DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(this.ANALYTICS_FILE)) {
      fs.writeFileSync(
        this.ANALYTICS_FILE,
        JSON.stringify(this.createInitialAnalyticsData(), null, 2)
      );
    }
    if (!fs.existsSync(this.USER_BEHAVIOR_FILE)) {
      fs.writeFileSync(this.USER_BEHAVIOR_FILE, "[]");
    }
    if (!fs.existsSync(this.MARKET_TRENDS_FILE)) {
      fs.writeFileSync(this.MARKET_TRENDS_FILE, "[]");
    }
  }

  /**
   * Initialize analytics system
   */
  public static async initialize(): Promise<void> {
    try {
      this.ensureDataFiles();
      await this.loadAnalyticsData();
      console.log("[ResearchAnalytics] Analytics system initialized");
    } catch (error) {
      console.log("[ResearchAnalytics] Initializing new analytics data");
      this.analyticsData = this.createInitialAnalyticsData();
      this.ensureDataFiles();
      await this.saveAnalyticsData();
    }
  }

  /**
   * Track user search behavior
   */
  public static trackSearch(
    preferences: UserPreferences,
    resultCount: number,
    sessionDuration: number
  ): void {
    const searchPattern: SearchPattern = {
      timestamp: new Date(),
      preferences,
      resultCount,
      sessionDuration,
    };

    this.searchPatterns.push(searchPattern);
    this.updateUserBehaviorMetrics(searchPattern);

    // Save periodically (in production, this would be batched)
    if (this.searchPatterns.length % 10 === 0) {
      this.saveUserBehaviorData();
    }
  }

  /**
   * Track algorithm performance
   */
  public static trackAlgorithmPerformance(
    responseTime: number,
    resultCount: number,
    algorithmVersion: string = "2.0"
  ): void {
    if (!this.analyticsData) return;

    const metrics = this.analyticsData.algorithmPerformance;

    // Update average response time
    const totalSearches =
      metrics.averageResponseTime * metrics.userSatisfaction + 1;
    metrics.averageResponseTime =
      (metrics.averageResponseTime * (totalSearches - 1) + responseTime) /
      totalSearches;

    // Update match distribution
    const resultKey = resultCount.toString();
    metrics.matchDistribution[resultKey] =
      (metrics.matchDistribution[resultKey] || 0) + 1;

    metrics.algorithmVersion = algorithmVersion;

    this.saveAnalyticsData();
  }

  /**
   * Update data quality metrics
   */
  public static updateDataQuality(qualityMetrics: DataQualityMetrics): void {
    if (!this.analyticsData) return;

    this.analyticsData.dataQuality = qualityMetrics;
    this.saveAnalyticsData();
  }

  /**
   * Generate comprehensive research report
   */
  public static generateResearchReport(): ResearchData {
    if (!this.analyticsData) {
      throw new Error("Analytics data not initialized");
    }

    // Update market trends
    this.updateMarketTrends();

    // Calculate final metrics
    this.calculateFinalMetrics();

    return this.analyticsData;
  }

  /**
   * Get user behavior insights
   */
  public static getUserBehaviorInsights(): UserBehaviorMetrics {
    if (!this.analyticsData) {
      throw new Error("Analytics data not initialized");
    }

    return this.analyticsData.userBehavior;
  }

  /**
   * Get algorithm performance insights
   */
  public static getAlgorithmInsights(): AlgorithmMetrics {
    if (!this.analyticsData) {
      throw new Error("Analytics data not initialized");
    }

    return this.analyticsData.algorithmPerformance;
  }

  /**
   * Get market trends insights
   */
  public static getMarketTrends(): MarketTrends {
    if (!this.analyticsData) {
      throw new Error("Analytics data not initialized");
    }

    return this.analyticsData.marketTrends;
  }

  /**
   * Create initial analytics data structure
   */
  private static createInitialAnalyticsData(): ResearchData {
    return {
      userBehavior: {
        totalSearches: 0,
        averagePreferences: {},
        mostPopularFeatures: [],
        searchPatterns: [],
        conversionRate: 0,
      },
      algorithmPerformance: {
        averageResponseTime: 0,
        accuracyScore: 85,
        userSatisfaction: 0,
        matchDistribution: {},
        algorithmVersion: "2.0",
      },
      dataQuality: {
        dataCompleteness: 0,
        dataAccuracy: 0,
        lastUpdated: new Date(),
        sourceReliability: 85,
        missingFields: [],
      },
      marketTrends: {
        rentTrends: [],
        neighborhoodPopularity: [],
        featureDemand: [],
        seasonalPatterns: [],
      },
    };
  }

  /**
   * Load analytics data from file
   */
  private static async loadAnalyticsData(): Promise<void> {
    const data = fs.readFileSync(ResearchAnalytics.ANALYTICS_FILE, "utf-8");
    this.analyticsData = JSON.parse(data);

    // Convert date strings back to Date objects
    if (this.analyticsData) {
      this.analyticsData.dataQuality.lastUpdated = new Date(
        this.analyticsData.dataQuality.lastUpdated
      );
      this.analyticsData.userBehavior.searchPatterns =
        this.analyticsData.userBehavior.searchPatterns.map((pattern: any) => ({
          ...pattern,
          timestamp: new Date(pattern.timestamp),
        }));
    }
  }

  /**
   * Save analytics data to file
   */
  private static async saveAnalyticsData(): Promise<void> {
    if (this.analyticsData) {
      fs.writeFileSync(
        ResearchAnalytics.ANALYTICS_FILE,
        JSON.stringify(this.analyticsData, null, 2)
      );
    }
  }

  /**
   * Save user behavior data
   */
  private static async saveUserBehaviorData(): Promise<void> {
    fs.writeFileSync(
      ResearchAnalytics.USER_BEHAVIOR_FILE,
      JSON.stringify(this.searchPatterns, null, 2)
    );
  }

  /**
   * Update user behavior metrics based on new search pattern
   */
  private static updateUserBehaviorMetrics(searchPattern: SearchPattern): void {
    if (!this.analyticsData) return;

    const behavior = this.analyticsData.userBehavior;
    behavior.totalSearches++;
    behavior.searchPatterns.push(searchPattern);

    // Update average preferences
    this.updateAveragePreferences(searchPattern.preferences);

    // Update most popular features
    this.updatePopularFeatures(searchPattern.preferences);

    // Update conversion rate (simplified - in real app would track actual conversions)
    behavior.conversionRate = Math.min(95, behavior.conversionRate + 0.1);

    // Keep only recent search patterns (last 1000)
    if (behavior.searchPatterns.length > 1000) {
      behavior.searchPatterns = behavior.searchPatterns.slice(-1000);
    }
  }

  /**
   * Update average preferences across all users
   */
  private static updateAveragePreferences(preferences: UserPreferences): void {
    if (!this.analyticsData) return;

    const behavior = this.analyticsData.userBehavior;
    const currentAvg = behavior.averagePreferences;
    const totalSearches = behavior.totalSearches;

    // Update budget range average
    if (preferences.budgetRange && preferences.budgetRange.length > 0) {
      const currentBudget = currentAvg.budgetRange?.[0] || 0;
      const newBudget = preferences.budgetRange[0];
      currentAvg.budgetRange = [
        Math.round(
          (currentBudget * (totalSearches - 1) + newBudget) / totalSearches
        ),
      ];
    }

    // Update commute time average
    if (preferences.maxCommute && preferences.maxCommute.length > 0) {
      const currentCommute = currentAvg.maxCommute?.[0] || 0;
      const newCommute = preferences.maxCommute[0];
      currentAvg.maxCommute = [
        Math.round(
          (currentCommute * (totalSearches - 1) + newCommute) / totalSearches
        ),
      ];
    }

    // Update lifestyle preferences frequency
    if (preferences.lifestyle) {
      if (!currentAvg.lifestyle) currentAvg.lifestyle = [];
      preferences.lifestyle.forEach((lifestyle) => {
        if (!currentAvg.lifestyle!.includes(lifestyle)) {
          currentAvg.lifestyle!.push(lifestyle);
        }
      });
    }
  }

  /**
   * Update most popular features based on user preferences
   */
  private static updatePopularFeatures(preferences: UserPreferences): void {
    if (!this.analyticsData) return;

    const behavior = this.analyticsData.userBehavior;
    const featureCounts: Record<string, number> = {};

    // Count feature preferences
    if (preferences.lifestyle) {
      preferences.lifestyle.forEach((feature) => {
        featureCounts[feature] = (featureCounts[feature] || 0) + 1;
      });
    }

    if (preferences.priorities) {
      preferences.priorities.forEach((priority) => {
        featureCounts[priority] = (featureCounts[priority] || 0) + 1;
      });
    }

    // Update most popular features
    const sortedFeatures = Object.entries(featureCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([feature]) => feature);

    behavior.mostPopularFeatures = sortedFeatures;
  }

  /**
   * Update market trends based on current data
   */
  private static updateMarketTrends(): void {
    if (!this.analyticsData) return;

    const trends = this.analyticsData.marketTrends;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

    // Generate simulated rent trends
    this.generateRentTrends(trends, currentMonth);

    // Generate neighborhood popularity trends
    this.generateNeighborhoodPopularity(trends);

    // Generate feature demand trends
    this.generateFeatureDemand(trends);

    // Generate seasonal patterns
    this.generateSeasonalPatterns(trends, currentMonth);
  }

  /**
   * Generate simulated rent trends
   */
  private static generateRentTrends(
    trends: MarketTrends,
    currentMonth: string
  ): void {
    const baseRents = [1200, 1500, 1800, 2000, 2100];
    const neighborhoods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    trends.rentTrends = neighborhoods.map((neighborhoodId) => {
      const baseRent = baseRents[Math.floor(Math.random() * baseRents.length)];
      const changePercent = (Math.random() - 0.5) * 10; // -5% to +5%

      return {
        neighborhoodId,
        month: currentMonth,
        averageRent: Math.round(baseRent * (1 + changePercent / 100)),
        changePercent: Math.round(changePercent * 10) / 10,
      };
    });
  }

  /**
   * Generate neighborhood popularity metrics
   */
  private static generateNeighborhoodPopularity(trends: MarketTrends): void {
    const neighborhoods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    trends.neighborhoodPopularity = neighborhoods.map((neighborhoodId) => {
      const searchCount = Math.floor(Math.random() * 100) + 10;
      const matchCount = Math.floor(searchCount * 0.3) + 5;
      const popularityScore = Math.round((matchCount / searchCount) * 100);

      return {
        neighborhoodId,
        searchCount,
        matchCount,
        popularityScore,
      };
    });
  }

  /**
   * Generate feature demand trends
   */
  private static generateFeatureDemand(trends: MarketTrends): void {
    const features = [
      "walkability",
      "safety",
      "affordability",
      "nightlife",
      "family-friendly",
      "parks",
    ];
    const trends_list: ("increasing" | "decreasing" | "stable")[] = [
      "increasing",
      "decreasing",
      "stable",
    ];

    trends.featureDemand = features.map((feature) => {
      const demandScore = Math.floor(Math.random() * 100) + 20;
      const trend = trends_list[Math.floor(Math.random() * trends_list.length)];

      return {
        feature,
        demandScore,
        trend,
      };
    });
  }

  /**
   * Generate seasonal patterns
   */
  private static generateSeasonalPatterns(
    trends: MarketTrends,
    currentMonth: string
  ): void {
    const months = [
      "2024-01",
      "2024-02",
      "2024-03",
      "2024-04",
      "2024-05",
      "2024-06",
    ];
    const features = ["parks", "walkability", "family-friendly", "nightlife"];

    trends.seasonalPatterns = months.map((month) => {
      const searchVolume = Math.floor(Math.random() * 1000) + 100;
      const popularFeatures = features
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      return {
        month,
        searchVolume,
        popularFeatures,
      };
    });
  }

  /**
   * Calculate final metrics for the research report
   */
  private static calculateFinalMetrics(): void {
    if (!this.analyticsData) return;

    // Calculate user satisfaction based on search patterns
    const behavior = this.analyticsData.userBehavior;
    const avgSessionDuration =
      behavior.searchPatterns.reduce(
        (sum, pattern) => sum + pattern.sessionDuration,
        0
      ) / behavior.searchPatterns.length;

    // Higher session duration indicates higher satisfaction
    const satisfaction = Math.min(100, Math.max(0, avgSessionDuration / 100));
    this.analyticsData.algorithmPerformance.userSatisfaction =
      Math.round(satisfaction);

    // Calculate accuracy score based on data quality and user behavior
    const dataQuality = this.analyticsData.dataQuality;
    const accuracy =
      (dataQuality.dataCompleteness + dataQuality.dataAccuracy) / 2;
    this.analyticsData.algorithmPerformance.accuracyScore =
      Math.round(accuracy);
  }
}
