import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

type UserPreferences = {
  maxCommute?: number[];
  budgetRange?: number[];
  lifestyle?: string[];
  priorities?: string[];
};

type Neighborhood = {
  id: number;
  name: string;
  city: string;
  features: string[];
  average_rent: number;
  walk_score: number;
  safety_rating: number;
};

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "NeighborFit backend is running." });
});

// Placeholder: Neighborhood data endpoint
app.get("/api/neighborhoods", (_req, res) => {
  const dataPath = path.join(__dirname, "../data/neighborhoods.json");
  if (fs.existsSync(dataPath)) {
    const data = fs.readFileSync(dataPath, "utf-8");
    res.json(JSON.parse(data));
  } else {
    res.status(404).json({ error: "Neighborhood data not found." });
  }
});

// Placeholder: Matching algorithm endpoint
// @ts-expect-error: Express type inference issue, safe to ignore for route handler
app.post("/api/match", (req, res) => {
  const userPreferences: UserPreferences = req.body;
  const dataPath = path.join(__dirname, "../data/neighborhoods.json");
  if (!fs.existsSync(dataPath)) {
    return res.status(404).json({ error: "Neighborhood data not found." });
  }
  const neighborhoods: Neighborhood[] = JSON.parse(
    fs.readFileSync(dataPath, "utf-8")
  );

  // Scoring function
  function scoreNeighborhood(n: Neighborhood, prefs: UserPreferences): number {
    let score = 0;
    // Budget: closer to budget is better
    if (prefs.budgetRange && prefs.budgetRange.length > 0) {
      const diff = Math.abs(n.average_rent - prefs.budgetRange[0]);
      score += Math.max(0, 1000 - diff); // up to 1000 points
    }
    // Lifestyle: match features
    if (prefs.lifestyle && prefs.lifestyle.length > 0) {
      const matches = prefs.lifestyle.filter((l: string) =>
        n.features.includes(l)
      ).length;
      score += matches * 500; // 500 points per match
    }
    // Priorities: walkability, safety, etc.
    if (prefs.priorities && prefs.priorities.length > 0) {
      prefs.priorities.forEach((p: string) => {
        if (p === "walkability") score += n.walk_score * 5;
        if (p === "safety") score += n.safety_rating * 100;
        if (p === "affordability")
          score +=
            prefs.budgetRange && n.average_rent <= prefs.budgetRange[0]
              ? 300
              : 0;
      });
    }
    return score;
  }

  // Score and sort neighborhoods
  const scored = neighborhoods.map((n: Neighborhood) => ({
    ...n,
    score: scoreNeighborhood(n, userPreferences),
  }));
  scored.sort(
    (
      a: Neighborhood & { score: number },
      b: Neighborhood & { score: number }
    ) => b.score - a.score
  );

  res.json({ matches: scored.slice(0, 3) }); // Return top 3 matches
});

app.listen(PORT, () => {
  console.log(`Neighborly backend running on port ${PORT}`);
});
