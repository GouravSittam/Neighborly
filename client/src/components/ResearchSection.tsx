import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  Zap,
  Database,
  BarChart3,
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import type {
  ResearchData,
  UserBehaviorMetrics,
  SearchPattern,
  AlgorithmMetrics,
  DataQualityMetrics,
  MarketTrends,
  RentTrend,
  NeighborhoodPopularity,
  FeatureDemand,
  SeasonalPattern,
  UserPreferences,
} from "../../../server/src/types";

interface ResearchSectionProps {
  refreshKey?: number;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({
  refreshKey,
}) => {
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchResearchData();
  }, [refreshKey]);

  const fetchResearchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/research/overview");
      if (!response.ok) throw new Error("Failed to fetch research data");
      const data = await response.json();
      setResearchData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="research" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="h-8 w-64 bg-muted rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-5 w-96 bg-muted rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="h-12 w-full max-w-lg mx-auto bg-muted rounded-lg mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-20 bg-muted rounded mb-2" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !researchData) {
    return (
      <section id="research" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Research Data Unavailable
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || "Unable to load research insights"}
            </p>
            <Button onClick={fetchResearchData} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const COLORS = [
    "hsl(217, 91%, 60%)",
    "hsl(142, 70%, 45%)",
    "hsl(38, 92%, 50%)",
    "hsl(0, 84%, 60%)",
    "hsl(262, 80%, 60%)",
  ];

  return (
    <section id="research" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Research & Analytics
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive analysis of user behavior, algorithm performance, and
            market trends to drive data-informed decisions.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="user-behavior"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">User Behavior</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="algorithm"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <Zap className="h-4 w-4" />
              Algorithm
            </TabsTrigger>
            <TabsTrigger
              value="market-trends"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Market Trends</span>
              <span className="sm:hidden">Market</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Searches
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {researchData.userBehavior.totalSearches || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Response Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {researchData.algorithmPerformance.averageResponseTime || 0}
                    ms
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Algorithm v
                    {researchData.algorithmPerformance.algorithmVersion}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Data Quality
                  </CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {researchData.dataQuality.dataCompleteness || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {researchData.dataQuality.dataAccuracy || 0}% accuracy
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    User Satisfaction
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {researchData.algorithmPerformance.userSatisfaction || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on session duration
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Features</CardTitle>
                  <CardDescription>
                    Features most frequently selected by users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(researchData.userBehavior.mostPopularFeatures || []).map(
                      (feature, index) => (
                        <Badge
                          key={feature}
                          variant={index < 3 ? "default" : "secondary"}
                        >
                          {feature}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Quality Metrics</CardTitle>
                  <CardDescription>
                    Current data completeness and reliability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completeness</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              researchData.dataQuality.dataCompleteness || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {researchData.dataQuality.dataCompleteness || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Accuracy</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{
                            width: `${
                              researchData.dataQuality.dataAccuracy || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {researchData.dataQuality.dataAccuracy || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Source Reliability</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="bg-purple-500 dark:bg-purple-400 h-2 rounded-full"
                          style={{
                            width: `${
                              researchData.dataQuality.sourceReliability || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {researchData.dataQuality.sourceReliability || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="user-behavior" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search Volume Over Time</CardTitle>
                  <CardDescription>
                    Daily search patterns and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={(
                        researchData.userBehavior.searchPatterns || []
                      ).slice(-7)}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="resultCount"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average User Preferences</CardTitle>
                  <CardDescription>
                    Most common preference selections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {researchData.userBehavior.averagePreferences
                      ?.budgetRange && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Budget</span>
                        <span className="font-medium">
                          $
                          {
                            researchData.userBehavior.averagePreferences
                              .budgetRange[0]
                          }
                        </span>
                      </div>
                    )}
                    {researchData.userBehavior.averagePreferences
                      ?.maxCommute && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Commute Time</span>
                        <span className="font-medium">
                          {
                            researchData.userBehavior.averagePreferences
                              .maxCommute[0]
                          }{" "}
                          min
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="font-medium">
                        {(
                          researchData.userBehavior.conversionRate || 0
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="algorithm" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Algorithm Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators for the matching algorithm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        {
                          metric: "Accuracy",
                          value:
                            researchData.algorithmPerformance.accuracyScore,
                          color: "#0088FE",
                        },
                        {
                          metric: "Satisfaction",
                          value:
                            researchData.algorithmPerformance.userSatisfaction,
                          color: "#00C49F",
                        },
                        {
                          metric: "Response Time",
                          value: Math.max(
                            0,
                            100 -
                              researchData.algorithmPerformance
                                .averageResponseTime /
                                10,
                          ),
                          color: "#FFBB28",
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Match Distribution</CardTitle>
                  <CardDescription>
                    Distribution of results returned by the algorithm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          researchData.algorithmPerformance.matchDistribution ||
                            {},
                        ).map(([key, value], index) => ({
                          name: `${key} results`,
                          value,
                          color: COLORS[index % COLORS.length],
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(
                          researchData.algorithmPerformance.matchDistribution ||
                            {},
                        ).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="market-trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rent Trends</CardTitle>
                  <CardDescription>
                    Monthly rent changes across neighborhoods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={researchData.marketTrends.rentTrends || []}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="averageRent"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Demand Trends</CardTitle>
                  <CardDescription>
                    Changing demand for neighborhood features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(researchData.marketTrends.featureDemand || []).map(
                      (feature, index) => (
                        <div
                          key={feature.feature}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {feature.feature}
                            </span>
                            <Badge
                              variant={
                                feature.trend === "increasing"
                                  ? "default"
                                  : feature.trend === "decreasing"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {feature.trend}
                            </Badge>
                          </div>
                          <span className="text-sm font-medium">
                            {feature.demandScore}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Seasonal Patterns</CardTitle>
                <CardDescription>
                  Search volume and feature preferences by month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={researchData.marketTrends.seasonalPatterns || []}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="searchVolume" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
