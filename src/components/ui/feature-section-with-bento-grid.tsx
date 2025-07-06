import React, { useEffect, useState } from "react";
import {
  MapPin,
  BarChart3,
  Users,
  Brain,
  Home,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Feature() {
  const [stats, setStats] = useState<null | {
    total: number;
    avgRent: number;
    avgWalk: number;
    topFeatures: string[];
    topCity: string;
  }>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/neighborhoods");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        const dataArr = Array.isArray(data) ? data : [];
        const total = dataArr.length;
        const avgRent =
          total > 0
            ? Math.round(
                dataArr.reduce(
                  (sum: number, n: any) => sum + n.average_rent,
                  0
                ) / total
              )
            : 0;
        const avgWalk =
          total > 0
            ? Math.round(
                dataArr.reduce((sum: number, n: any) => sum + n.walk_score, 0) /
                  total
              )
            : 0;
        // Count features
        const featureCounts: Record<string, number> = {};
        dataArr.forEach((n: any) =>
          n.features.forEach((f: string) => {
            featureCounts[f] = (featureCounts[f] || 0) + 1;
          })
        );
        const topFeatures = Object.entries(featureCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([f]) => f);
        // Most common city
        const cityCounts: Record<string, number> = {};
        dataArr.forEach((n: any) => {
          cityCounts[n.city] = (cityCounts[n.city] || 0) + 1;
        });
        const topCity =
          Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
        setStats({ total, avgRent, avgWalk, topFeatures, topCity });
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="w-full py-12 sm:py-20 lg:py-40">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge>Research & Methodology</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Data-Driven Neighborhood Matching
              </h2>
              <p className="text-lg md:text-xl max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Our advanced algorithm analyzes over 100 factors to find your
                perfect neighborhood match.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
            <div className="bg-muted rounded-md p-6 flex flex-col items-center justify-center aspect-square min-w-0">
              <Home className="w-8 h-8 stroke-1 mb-2" />
              <div className="text-2xl md:text-3xl font-bold">
                {loading ? "-" : stats?.total ?? "-"}
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                Neighborhoods
              </div>
            </div>
            <div className="bg-muted rounded-md p-6 flex flex-col items-center justify-center aspect-square min-w-0">
              <DollarSign className="w-8 h-8 stroke-1 mb-2" />
              <div className="text-2xl md:text-3xl font-bold">
                {loading ? "-" : stats?.avgRent ? `$${stats.avgRent}` : "-"}
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                Avg. Rent
              </div>
            </div>
            <div className="bg-muted rounded-md p-6 flex flex-col items-center justify-center aspect-square min-w-0">
              <TrendingUp className="w-8 h-8 stroke-1 mb-2" />
              <div className="text-2xl md:text-3xl font-bold">
                {loading ? "-" : stats?.avgWalk ? stats.avgWalk : "-"}
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                Avg. Walk Score
              </div>
            </div>
            <div className="bg-muted rounded-md p-6 flex flex-col items-center justify-center aspect-square min-w-0">
              <MapPin className="w-8 h-8 stroke-1 mb-2" />
              <div className="flex flex-wrap gap-1 justify-center mb-1">
                {loading ? (
                  <span>-</span>
                ) : (
                  stats?.topFeatures.map((f) => (
                    <Badge key={f} className="text-xs md:text-sm">
                      {f}
                    </Badge>
                  ))
                )}
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                Top Features
              </div>
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-center mt-4">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Feature };
