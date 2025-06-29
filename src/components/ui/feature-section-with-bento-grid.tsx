
import { MapPin, BarChart3, Users, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Feature() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge>Research & Methodology</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Data-Driven Neighborhood Matching
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Our advanced algorithm analyzes over 100 factors to find your perfect neighborhood match.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
              <MapPin className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">Location Intelligence</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  We analyze commute times, proximity to amenities, and transportation accessibility to match your lifestyle needs.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-md aspect-square p-6 flex justify-between flex-col">
              <BarChart3 className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">Market Analytics</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  Real-time market data and trends help identify neighborhoods with the best value and growth potential.
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-md aspect-square p-6 flex justify-between flex-col">
              <Users className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">Community Insights</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  Demographics, social dynamics, and community characteristics are analyzed to find your ideal neighbors.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
              <Brain className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">AI-Powered Matching</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  Machine learning algorithms continuously improve recommendations based on user feedback and success stories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
