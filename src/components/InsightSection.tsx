"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Lightbulb,
  Target,
  Zap,
  Brain,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InsightData {
  id: string;
  title: string;
  description: string;
  value: string;
  change: number;
  trend: "up" | "down" | "neutral";
  category: "performance" | "engagement" | "revenue" | "growth";
  icon: React.ReactNode;
  details: string[];
  recommendation: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden"
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {title}
                </p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ShiningText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <motion.span
      className="bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-transparent"
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </motion.span>
  );
};

const InsightCard: React.FC<{ insight: InsightData; index: number }> = ({
  insight,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getCategoryColor = () => {
    switch (insight.category) {
      case "performance":
        return "from-blue-500/20 to-blue-600/20 border-blue-500/30";
      case "engagement":
        return "from-green-500/20 to-green-600/20 border-green-500/30";
      case "revenue":
        return "from-purple-500/20 to-purple-600/20 border-purple-500/30";
      case "growth":
        return "from-orange-500/20 to-orange-600/20 border-orange-500/30";
      default:
        return "from-gray-500/20 to-gray-600/20 border-gray-500/30";
    }
  };

  const getCategoryIcon = () => {
    switch (insight.category) {
      case "performance":
        return <BarChart3 className="h-5 w-5" />;
      case "engagement":
        return <Users className="h-5 w-5" />;
      case "revenue":
        return <DollarSign className="h-5 w-5" />;
      case "growth":
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      <Card
        className={`border bg-gradient-to-br ${getCategoryColor()} backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-background/50">
                {insight.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{insight.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  {getCategoryIcon()}
                  <span className="text-sm text-muted-foreground capitalize">
                    {insight.category}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{insight.value}</div>
              <div
                className={`flex items-center space-x-1 ${
                  insight.trend === "up"
                    ? "text-green-500"
                    : insight.trend === "down"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {insight.trend === "up" && <TrendingUp className="h-4 w-4" />}
                {insight.trend === "down" && (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {insight.change > 0 ? "+" : ""}
                  {insight.change}%
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4">{insight.description}</p>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-primary hover:text-primary/80"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showDetails ? "Hide Details" : "View Details"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Insights
              <ChevronRight
                className={`h-4 w-4 ml-1 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </Button>
          </div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-2"
              >
                <h4 className="font-medium text-sm">Key Details:</h4>
                <ul className="space-y-1">
                  {insight.details.map((detail, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-sm text-muted-foreground flex items-center"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                      {detail}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      AI Recommendation:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {insight.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const WonderfulInsightSection: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMetrics, setShowMetrics] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const insights: InsightData[] = useMemo(
    () => [
      {
        id: "1",
        title: "Match Quality Improvement",
        description:
          "Users are finding better neighborhood matches, with a 27% increase in satisfaction scores after refining their preferences.",
        value: "+27%",
        change: 27,
        trend: "up",
        category: "engagement",
        icon: <Target className="h-5 w-5 text-green-500" />,
        details: [
          "Average match score up to 88/100",
          'More users reporting "perfect fit" neighborhoods',
          "Preference refinement up 19%",
          "Repeat searches down 12% (better first-time results)",
        ],
        recommendation:
          "Encourage users to update their preferences regularly and highlight the benefits of detailed profiles for even better matches.",
      },
      {
        id: "2",
        title: "Neighborhood Diversity Explored",
        description:
          "Users are exploring a wider range of neighborhoods, with a 35% increase in searches for new areas and amenities.",
        value: "+35%",
        change: 35,
        trend: "up",
        category: "growth",
        icon: <BarChart3 className="h-5 w-5 text-orange-500" />,
        details: [
          "Searches for pet-friendly areas up 22%",
          "Interest in walkable neighborhoods up 31%",
          "More users filtering by school ratings",
          "Diversity of top 10 neighborhoods increased",
        ],
        recommendation:
          "Promote neighborhood guides and highlight unique features to help users discover hidden gems.",
      },
      {
        id: "3",
        title: "User Engagement & Retention",
        description:
          "Session duration and return visits are up, indicating users are finding value in the matching process and insights.",
        value: "+18%",
        change: 18,
        trend: "up",
        category: "performance",
        icon: <Users className="h-5 w-5 text-blue-500" />,
        details: [
          "Average session time: 6m 12s",
          "Return visits up 14%",
          "More users saving favorite neighborhoods",
          "Engagement with research insights up 20%",
        ],
        recommendation:
          "Add more interactive features and personalized recommendations to keep users engaged.",
      },
      {
        id: "4",
        title: "Satisfaction & Success Stories",
        description:
          "User satisfaction is at an all-time high, with more success stories and positive feedback being shared.",
        value: "94%",
        change: 6,
        trend: "up",
        category: "revenue",
        icon: <Lightbulb className="h-5 w-5 text-purple-500" />,
        details: [
          "Success story submissions up 40%",
          "Average review rating: 4.8/5",
          "Referral signups increased",
          "Positive feedback on match accuracy",
        ],
        recommendation:
          "Showcase user testimonials and encourage sharing of success stories to build trust and attract new users.",
      },
    ],
    []
  );

  const metrics = [
    {
      title: "Active Users",
      value: "12,400",
      change: 9.2,
      icon: <Users className="h-5 w-5" />,
      trend: "up" as const,
    },
    {
      title: "Avg. Match Score",
      value: "88",
      change: 7.5,
      icon: <Target className="h-5 w-5" />,
      trend: "up" as const,
    },
    {
      title: "Neighborhoods Explored",
      value: "320",
      change: 12.1,
      icon: <BarChart3 className="h-5 w-5" />,
      trend: "up" as const,
    },
    {
      title: "Satisfaction Rate",
      value: "94%",
      change: 6.0,
      icon: <Lightbulb className="h-5 w-5" />,
      trend: "up" as const,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center space-x-2"
        >
          <Brain className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-primary">
            Live Analytics
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Neighborhood Matching <ShiningText text="Insights" />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Real-time analytics and AI-powered insights to help you understand
          neighborhood trends and make informed decisions.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center space-x-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live Data</span>
          </div>
          <span>•</span>
          <span>Updated {currentTime.toLocaleTimeString()}</span>
        </motion.div>
      </div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </motion.div>

      {/* Insights Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Key Insights</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMetrics(!showMetrics)}
            className="flex items-center space-x-2"
          >
            {showMetrics ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span>{showMetrics ? "Hide" : "Show"} Details</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <InsightCard key={insight.id} insight={insight} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const InsightSection = WonderfulInsightSection;
export default InsightSection;
