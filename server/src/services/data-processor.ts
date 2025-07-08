import fs from "fs";
import path from "path";
import axios from "axios";
import { Neighborhood, DataQualityMetrics } from "../types";

export class DataProcessor {
  private static readonly DATA_SOURCES = {
    neighborhoods: path.join(__dirname, "../../data/neighborhoods.json"),
    enriched: path.join(__dirname, "../../data/enriched-neighborhoods.json"),
    metrics: path.join(__dirname, "../../data/quality-metrics.json"),
  };

  /**
   * Main data processing pipeline
   */
  public static async processData(): Promise<{
    neighborhoods: Neighborhood[];
    qualityMetrics: DataQualityMetrics;
  }> {
    console.log("[DataProcessor] Starting data processing pipeline...");

    try {
      // Load raw data
      const rawData = await this.loadRawData();

      // Validate data
      const validationResult = this.validateData(rawData);

      // Enrich data with additional sources
      const enrichedData = await this.enrichData(rawData);

      // Calculate quality metrics
      const qualityMetrics = this.calculateQualityMetrics(enrichedData);

      // Save processed data
      await this.saveProcessedData(enrichedData, qualityMetrics);

      console.log("[DataProcessor] Data processing completed successfully");

      return {
        neighborhoods: enrichedData,
        qualityMetrics,
      };
    } catch (error) {
      console.error("[DataProcessor] Error in data processing:", error);
      throw error;
    }
  }

  /**
   * Load raw neighborhood data
   */
  private static async loadRawData(): Promise<Neighborhood[]> {
    const dataPath = this.DATA_SOURCES.neighborhoods;

    if (!fs.existsSync(dataPath)) {
      throw new Error("Neighborhood data file not found");
    }

    const rawData = fs.readFileSync(dataPath, "utf-8");
    const neighborhoods: Neighborhood[] = JSON.parse(rawData);

    console.log(`[DataProcessor] Loaded ${neighborhoods.length} neighborhoods`);
    return neighborhoods;
  }

  /**
   * Validate data integrity and completeness
   */
  private static validateData(neighborhoods: Neighborhood[]): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let valid = true;

    neighborhoods.forEach((neighborhood, index) => {
      // Required field validation
      if (!neighborhood.id) {
        errors.push(`Neighborhood ${index}: Missing ID`);
        valid = false;
      }

      if (!neighborhood.name) {
        errors.push(`Neighborhood ${index}: Missing name`);
        valid = false;
      }

      if (!neighborhood.city) {
        errors.push(`Neighborhood ${index}: Missing city`);
        valid = false;
      }

      // Data type validation
      if (
        typeof neighborhood.average_rent !== "number" ||
        neighborhood.average_rent <= 0
      ) {
        errors.push(`Neighborhood ${neighborhood.id}: Invalid rent value`);
        valid = false;
      }

      if (
        typeof neighborhood.walk_score !== "number" ||
        neighborhood.walk_score < 0 ||
        neighborhood.walk_score > 100
      ) {
        errors.push(`Neighborhood ${neighborhood.id}: Invalid walk score`);
        valid = false;
      }

      if (
        typeof neighborhood.safety_rating !== "number" ||
        neighborhood.safety_rating < 0 ||
        neighborhood.safety_rating > 5
      ) {
        errors.push(`Neighborhood ${neighborhood.id}: Invalid safety rating`);
        valid = false;
      }

      // Optional field warnings
      if (!neighborhood.features || neighborhood.features.length === 0) {
        warnings.push(`Neighborhood ${neighborhood.id}: No features listed`);
      }

      if (!neighborhood.description) {
        warnings.push(`Neighborhood ${neighborhood.id}: No description`);
      }

      if (!neighborhood.image) {
        warnings.push(`Neighborhood ${neighborhood.id}: No image`);
      }
    });

    // Duplicate ID check
    const ids = neighborhoods.map((n) => n.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate IDs found: ${duplicateIds.join(", ")}`);
      valid = false;
    }

    console.log(
      `[DataProcessor] Validation complete: ${errors.length} errors, ${warnings.length} warnings`
    );

    return { valid, errors, warnings };
  }

  /**
   * Enrich data with additional information from external sources
   */
  private static async enrichData(
    neighborhoods: Neighborhood[]
  ): Promise<Neighborhood[]> {
    console.log("[DataProcessor] Enriching neighborhood data...");

    const enrichedNeighborhoods = await Promise.all(
      neighborhoods.map(async (neighborhood) => {
        try {
          const enriched = { ...neighborhood };

          // Add missing fields with default values
          if (!enriched.state) {
            enriched.state = this.inferStateFromCity(enriched.city);
          }

          // Add transit and bike scores if missing
          if (!enriched.transit_score) {
            enriched.transit_score = this.calculateTransitScore(enriched);
          }

          if (!enriched.bike_score) {
            enriched.bike_score = this.calculateBikeScore(enriched);
          }

          // Add demographic data (simulated)
          enriched.population_density =
            this.generatePopulationDensity(enriched);
          enriched.median_age = this.generateMedianAge(enriched);
          enriched.median_income = this.generateMedianIncome(enriched);
          enriched.unemployment_rate = this.generateUnemploymentRate(enriched);

          // Add weather data (simulated)
          enriched.weather_data = this.generateWeatherData(enriched);

          // Add coordinates (simulated)
          enriched.coordinates = this.generateCoordinates(enriched);

          return enriched;
        } catch (error) {
          console.warn(
            `[DataProcessor] Error enriching neighborhood ${neighborhood.id}:`,
            error
          );
          return neighborhood; // Return original if enrichment fails
        }
      })
    );

    console.log(
      `[DataProcessor] Enriched ${enrichedNeighborhoods.length} neighborhoods`
    );
    return enrichedNeighborhoods;
  }

  /**
   * Calculate quality metrics for the dataset
   */
  private static calculateQualityMetrics(
    neighborhoods: Neighborhood[]
  ): DataQualityMetrics {
    const totalFields =
      neighborhoods.length * Object.keys(neighborhoods[0]).length;
    let filledFields = 0;
    const missingFields: string[] = [];

    neighborhoods.forEach((neighborhood) => {
      Object.entries(neighborhood).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          filledFields++;
        } else {
          missingFields.push(key);
        }
      });
    });

    const completeness = (filledFields / totalFields) * 100;

    // Calculate accuracy based on data validation
    const accuracy = this.calculateDataAccuracy(neighborhoods);

    // Estimate source reliability (in a real app, this would be based on actual source quality)
    const sourceReliability = 85; // Simulated value

    return {
      dataCompleteness: Math.round(completeness * 100) / 100,
      dataAccuracy: accuracy,
      lastUpdated: new Date(),
      sourceReliability,
      missingFields: [...new Set(missingFields)], // Remove duplicates
    };
  }

  /**
   * Save processed data to files
   */
  private static async saveProcessedData(
    neighborhoods: Neighborhood[],
    qualityMetrics: DataQualityMetrics
  ): Promise<void> {
    const enrichedPath = this.DATA_SOURCES.enriched;
    const metricsPath = this.DATA_SOURCES.metrics;

    // Save enriched neighborhoods
    fs.writeFileSync(enrichedPath, JSON.stringify(neighborhoods, null, 2));

    // Save quality metrics
    fs.writeFileSync(metricsPath, JSON.stringify(qualityMetrics, null, 2));

    console.log("[DataProcessor] Processed data saved successfully");
  }

  // Helper methods for data enrichment

  private static inferStateFromCity(city: string): string {
    const cityStateMap: Record<string, string> = {
      Springfield: "IL",
      Riverton: "CA",
      "Bay City": "CA",
      Metroville: "NY",
    };

    return cityStateMap[city] || "Unknown";
  }

  private static calculateTransitScore(neighborhood: Neighborhood): number {
    // Simulate transit score based on walk score and features
    let score = neighborhood.walk_score * 0.6;

    if (neighborhood.features.includes("public transport")) {
      score += 30;
    }

    if (
      neighborhood.features.includes("subway") ||
      neighborhood.features.includes("metro")
    ) {
      score += 20;
    }

    return Math.min(100, Math.round(score));
  }

  private static calculateBikeScore(neighborhood: Neighborhood): number {
    // Simulate bike score based on walk score and features
    let score = neighborhood.walk_score * 0.7;

    if (
      neighborhood.features.includes("bike lanes") ||
      neighborhood.features.includes("cycling")
    ) {
      score += 25;
    }

    if (neighborhood.features.includes("parks")) {
      score += 15;
    }

    return Math.min(100, Math.round(score));
  }

  private static generatePopulationDensity(neighborhood: Neighborhood): number {
    // Simulate population density based on neighborhood type
    const baseDensity = 5000;
    const variation = Math.random() * 3000;

    if (
      neighborhood.features.includes("downtown") ||
      neighborhood.features.includes("urban")
    ) {
      return Math.round(baseDensity + variation + 2000);
    } else if (neighborhood.features.includes("suburban")) {
      return Math.round(baseDensity + variation);
    } else {
      return Math.round(baseDensity + variation - 1000);
    }
  }

  private static generateMedianAge(neighborhood: Neighborhood): number {
    // Simulate median age based on neighborhood features
    let baseAge = 35;

    if (neighborhood.features.includes("family-friendly")) {
      baseAge += 5;
    }

    if (neighborhood.features.includes("tech hub")) {
      baseAge -= 5;
    }

    return Math.round(baseAge + (Math.random() - 0.5) * 10);
  }

  private static generateMedianIncome(neighborhood: Neighborhood): number {
    // Simulate median income based on rent and features
    const baseIncome = neighborhood.average_rent * 40; // Rough estimate
    const variation = baseIncome * 0.2;

    return Math.round(baseIncome + (Math.random() - 0.5) * variation);
  }

  private static generateUnemploymentRate(neighborhood: Neighborhood): number {
    // Simulate unemployment rate based on neighborhood type
    let baseRate = 5.0;

    if (neighborhood.features.includes("tech hub")) {
      baseRate -= 2;
    }

    if (neighborhood.features.includes("downtown")) {
      baseRate -= 1;
    }

    return Math.round((baseRate + (Math.random() - 0.5) * 4) * 10) / 10;
  }

  private static generateWeatherData(neighborhood: Neighborhood): any {
    // Simulate weather data based on location
    const baseTemp = 65;
    const tempVariation = 20;

    return {
      average_temp: Math.round(
        baseTemp + (Math.random() - 0.5) * tempVariation
      ),
      precipitation_days: Math.round(100 + Math.random() * 50),
      sunny_days: Math.round(200 + Math.random() * 100),
      climate_type: ["Mediterranean", "Continental", "Oceanic", "Subtropical"][
        Math.floor(Math.random() * 4)
      ],
    };
  }

  private static generateCoordinates(neighborhood: Neighborhood): {
    lat: number;
    lng: number;
  } {
    // Simulate coordinates based on city
    const cityCoordinates: Record<string, { lat: number; lng: number }> = {
      Springfield: { lat: 39.7817, lng: -89.6501 },
      Riverton: { lat: 37.7749, lng: -122.4194 },
      "Bay City": { lat: 37.7749, lng: -122.4194 },
      Metroville: { lat: 40.7128, lng: -74.006 },
    };

    const baseCoords = cityCoordinates[neighborhood.city] || {
      lat: 40.7128,
      lng: -74.006,
    };

    return {
      lat: baseCoords.lat + (Math.random() - 0.5) * 0.1,
      lng: baseCoords.lng + (Math.random() - 0.5) * 0.1,
    };
  }

  private static calculateDataAccuracy(neighborhoods: Neighborhood[]): number {
    // Simulate data accuracy calculation
    let accuracy = 95; // Base accuracy

    // Reduce accuracy for missing critical fields
    const missingCriticalFields = neighborhoods.filter(
      (n) => !n.name || !n.city || !n.average_rent
    ).length;

    accuracy -= (missingCriticalFields / neighborhoods.length) * 10;

    // Reduce accuracy for outliers
    const rentOutliers = neighborhoods.filter(
      (n) => n.average_rent < 500 || n.average_rent > 5000
    ).length;

    accuracy -= (rentOutliers / neighborhoods.length) * 5;

    return Math.max(0, Math.round(accuracy));
  }
}
