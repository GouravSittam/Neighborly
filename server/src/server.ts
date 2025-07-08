import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

// Import our services
import { MatchingAlgorithm } from "./services/matching-algorithm";
import { DataProcessor } from "./services/data-processor";
import { ResearchAnalytics } from "./services/research-analytics";

// Import types
import {
  Neighborhood,
  UserPreferences,
  MatchResult,
  APIResponse,
  ResearchData,
  FilterParams,
  PaginationParams,
  User,
} from "./types";

const app = express();
const PORT = process.env.PORT || 4000;

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const users: User[] = [];
let userIdCounter = 1;

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

// Security and performance middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: "http://localhost:5173", // adjust as needed
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Global variables
let neighborhoods: Neighborhood[] = [];
let isInitialized = false;

/**
 * Initialize the application
 */
async function initializeApp() {
  try {
    console.log("[Server] Initializing application...");

    // Initialize analytics
    await ResearchAnalytics.initialize();

    // Process and load neighborhood data
    const { neighborhoods: processedNeighborhoods, qualityMetrics } =
      await DataProcessor.processData();
    neighborhoods = processedNeighborhoods;

    // Update analytics with data quality metrics
    ResearchAnalytics.updateDataQuality(qualityMetrics);

    isInitialized = true;
    console.log(
      `[Server] Application initialized with ${neighborhoods.length} neighborhoods`
    );
  } catch (error) {
    console.error("[Server] Initialization failed:", error);
    process.exit(1);
  }
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Neighborly backend is running",
    initialized: isInitialized,
    neighborhoodCount: neighborhoods.length,
    timestamp: new Date().toISOString(),
  });
});

// Get all neighborhoods with filtering and pagination
app.get("/api/neighborhoods", (req, res) => {
  try {
    const {
      city,
      minRent,
      maxRent,
      features,
      minWalkScore,
      minSafetyRating,
      page = 1,
      limit = 10,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    let filteredNeighborhoods = [...neighborhoods];

    // Apply filters
    if (city) {
      filteredNeighborhoods = filteredNeighborhoods.filter((n) =>
        n.city.toLowerCase().includes(city.toString().toLowerCase())
      );
    }

    if (minRent) {
      filteredNeighborhoods = filteredNeighborhoods.filter(
        (n) => n.average_rent >= Number(minRent)
      );
    }

    if (maxRent) {
      filteredNeighborhoods = filteredNeighborhoods.filter(
        (n) => n.average_rent <= Number(maxRent)
      );
    }

    if (features) {
      const featureArray = features.toString().split(",");
      filteredNeighborhoods = filteredNeighborhoods.filter((n) =>
        featureArray.some((feature) =>
          n.features.some((nf) =>
            nf.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    if (minWalkScore) {
      filteredNeighborhoods = filteredNeighborhoods.filter(
        (n) => n.walk_score >= Number(minWalkScore)
      );
    }

    if (minSafetyRating) {
      filteredNeighborhoods = filteredNeighborhoods.filter(
        (n) => n.safety_rating >= Number(minSafetyRating)
      );
    }

    // Apply sorting
    filteredNeighborhoods.sort((a, b) => {
      const aValue = a[sortBy as keyof Neighborhood];
      const bValue = b[sortBy as keyof Neighborhood];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedNeighborhoods = filteredNeighborhoods.slice(
      startIndex,
      endIndex
    );

    const response: APIResponse<{
      neighborhoods: Neighborhood[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }> = {
      success: true,
      data: {
        neighborhoods: paginatedNeighborhoods,
        total: filteredNeighborhoods.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(filteredNeighborhoods.length / Number(limit)),
      },
      timestamp: new Date(),
    };

    res.json(response);
  } catch (error) {
    console.error("[Server] Error fetching neighborhoods:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch neighborhoods",
      timestamp: new Date(),
    });
  }
});

// Get neighborhood by ID
app.get("/api/neighborhoods/:id", (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const neighborhood = neighborhoods.find((n) => n.id === id);

    if (!neighborhood) {
      return res.status(404).json({
        success: false,
        error: "Neighborhood not found",
        timestamp: new Date(),
      });
    }

    const response: APIResponse<Neighborhood> = {
      success: true,
      data: neighborhood,
      timestamp: new Date(),
    };

    res.json(response);
  } catch (error) {
    console.error("[Server] Error fetching neighborhood:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch neighborhood",
      timestamp: new Date(),
    });
  }
});

// Enhanced matching endpoint
app.post("/api/match", async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    const userPreferences: UserPreferences = req.body;
    const { limit = 5 } = req.query;

    if (!isInitialized) {
      return res.status(503).json({
        success: false,
        error: "Service is initializing, please try again in a moment",
        timestamp: new Date(),
      });
    }

    // Validate preferences
    if (!userPreferences || Object.keys(userPreferences).length === 0) {
      return res.status(400).json({
        success: false,
        error: "User preferences are required",
        timestamp: new Date(),
      });
    }

    // Run matching algorithm
    const matches: MatchResult[] = MatchingAlgorithm.matchNeighborhoods(
      neighborhoods,
      userPreferences,
      Number(limit)
    );

    const responseTime = Date.now() - startTime;

    // Track analytics
    ResearchAnalytics.trackSearch(
      userPreferences,
      matches.length,
      responseTime
    );
    ResearchAnalytics.trackAlgorithmPerformance(responseTime, matches.length);

    const response: APIResponse<{
      matches: MatchResult[];
      totalNeighborhoods: number;
      responseTime: number;
      algorithmVersion: string;
    }> = {
      success: true,
      data: {
        matches,
        totalNeighborhoods: neighborhoods.length,
        responseTime,
        algorithmVersion: "2.0",
      },
      timestamp: new Date(),
    };

    res.json(response);
  } catch (error) {
    console.error("[Server] Error in matching:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process matching request",
      timestamp: new Date(),
    });
  }
});

// Research and analytics endpoints
app.get("/api/research/overview", (_req, res) => {
  try {
    const researchData = ResearchAnalytics.generateResearchReport();

    const response: APIResponse<ResearchData> = {
      success: true,
      data: researchData,
      timestamp: new Date(),
    };

    res.json(response);
  } catch (error) {
    console.error("[Server] Error generating research report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate research report",
      timestamp: new Date(),
    });
  }
});

app.get("/api/research/user-behavior", (_req, res) => {
  try {
    const userBehavior = ResearchAnalytics.getUserBehaviorInsights();

    const response: APIResponse<any> = {
      success: true,
      data: userBehavior,
      timestamp: new Date(),
    };

    res.json(response);
  } catch (error) {
    console.error("[Server] Error fetching user behavior:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user behavior data",
      timestamp: new Date(),
    });
  }
});

app.get("/api/research/algorithm-performance", (_req, res) => {
  try {
    const algorithmMetrics = ResearchAnalytics.getAlgorithmInsights();

    const response: APIResponse<any> = {
      success: true,
      data: algorithmMetrics,
      timestamp: new Date(),
    };

    res.json(response);
  } catch (error) {
    console.error("[Server] Error fetching algorithm metrics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch algorithm metrics",
      timestamp: new Date(),
    });
  }
});

app.get("/api/research/market-trends", (_req, res) => {
  try {
    const marketTrends = ResearchAnalytics.getMarketTrends();

    const response: APIResponse<any> = {
      success: true,
      data: marketTrends,
      timestamp: new Date(),
    };

    res.json(response);
  } catch (error) {
    console.error("[Server] Error fetching market trends:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch market trends",
      timestamp: new Date(),
    });
  }
});

// Data quality endpoint
app.get("/api/data/quality", (_req, res) => {
  try {
    const dataPath = path.join(__dirname, "../data/quality-metrics.json");

    if (fs.existsSync(dataPath)) {
      const qualityData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

      const response: APIResponse<any> = {
        success: true,
        data: qualityData,
        timestamp: new Date(),
      };

      res.json(response);
    } else {
      res.status(404).json({
        success: false,
        error: "Quality metrics not found",
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error("[Server] Error fetching data quality:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch data quality metrics",
      timestamp: new Date(),
    });
  }
});

// Statistics endpoint
app.get("/api/stats", (_req, res) => {
  try {
    const stats = {
      totalNeighborhoods: neighborhoods.length,
      cities: [...new Set(neighborhoods.map((n) => n.city))].length,
      averageRent: Math.round(
        neighborhoods.reduce((sum, n) => sum + n.average_rent, 0) /
          neighborhoods.length
      ),
      averageWalkScore: Math.round(
        neighborhoods.reduce((sum, n) => sum + n.walk_score, 0) /
          neighborhoods.length
      ),
      averageSafetyRating:
        Math.round(
          (neighborhoods.reduce((sum, n) => sum + n.safety_rating, 0) /
            neighborhoods.length) *
            10
        ) / 10,
      featureCount: neighborhoods.reduce(
        (sum, n) => sum + n.features.length,
        0
      ),
      petFriendlyCount: neighborhoods.filter((n) => n.pet_friendly).length,
      initialized: isInitialized,
      lastUpdated: new Date().toISOString(),
    };

    const response: APIResponse<any> = {
      success: true,
      data: stats,
      timestamp: new Date(),
    };

    res.json(response);
  } catch (error) {
    console.error("[Server] Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
      timestamp: new Date(),
    });
  }
});

// Auth middleware
function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    req.user = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Signup endpoint
app.post("/api/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: "User already exists" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = { id: userIdCounter++, email, passwordHash, name };
  users.push(user);
  res.status(201).json({ message: "User created" });
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // set to true in production
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  res.json({
    message: "Logged in",
    user: { id: user.id, email: user.email, name: user.name },
  });
});

// /me endpoint
app.get("/api/me", requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  // Find user by id to get name
  const user = users.find((u) => u.id === req.user!.id);
  res.json({
    user: { id: req.user.id, email: req.user.email, name: user?.name },
  });
});

// Logout endpoint
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("[Server] Unhandled error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      timestamp: new Date(),
    });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    timestamp: new Date(),
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`[Server] Neighborly backend starting on port ${PORT}`);
  await initializeApp();
  console.log(`[Server] Neighborly backend running on port ${PORT}`);
});

export default app;
