# NeighborFit Backend

This is the backend for the NeighborFit project, which solves the neighborhood-lifestyle matching problem using research, data analysis, and algorithmic thinking.

## Features

- Serves real or sample neighborhood data
- Accepts user preferences and returns best-matching neighborhoods (algorithm placeholder)
- Handles data inconsistencies gracefully
- Designed for zero-budget, rapid prototyping

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run in development mode:
   ```bash
   npm run dev
   ```
3. Or run in production mode:
   ```bash
   npm start
   ```

## Endpoints

- `GET /api/health` — Health check
- `GET /api/neighborhoods` — List all neighborhoods
- `POST /api/match` — Get best-matching neighborhoods for user preferences (algorithm placeholder)

## Data

Neighborhood data is stored in `data/neighborhoods.json`. You can expand or update this file as needed.

## Matching Algorithm

The matching algorithm is currently a placeholder. You can implement your own logic in `src/server.ts` to score and rank neighborhoods based on user preferences.

## Documentation

- Problem definition, research, and algorithm rationale should be documented in this README and in code comments.
- Trade-offs and data challenges are noted in code and here as the project evolves.

---

_This backend is designed for rapid prototyping and demonstration purposes for the NeighborFit assignment._
