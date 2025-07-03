import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, DollarSign, Car, Users, Star } from "lucide-react";

export const NeighborhoodGrid = () => {
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:4000/api/neighborhoods");
        if (!res.ok) throw new Error("Failed to fetch neighborhoods");
        const data = await res.json();
        setNeighborhoods(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchNeighborhoods();
  }, []);

  return (
    <section id="discover" className="py-16">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All Neighborhoods
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Browse all available neighborhoods in our database.
          </p>
        </div>
        {loading ? (
          <div className="text-center text-lg">Loading neighborhoods...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {neighborhoods.map((neighborhood) => (
              <Card
                key={neighborhood.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="relative">
                  <img
                    src={neighborhood.image}
                    alt={neighborhood.name}
                    className="w-full h-48 object-cover sm:h-56 md:h-64 lg:h-48 xl:h-56"
                  />
                  <div className="absolute top-4 right-4">
                    {neighborhood.pet_friendly && (
                      <Badge className="bg-green-600 text-white font-semibold">
                        Pet Friendly
                      </Badge>
                    )}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold">
                        {neighborhood.name}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600">
                        {neighborhood.city}
                      </p>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    {neighborhood.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>${neighborhood.average_rent}/mo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span>Walk Score: {neighborhood.walk_score}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>Safety: {neighborhood.safety_rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm md:text-base">
                      Features
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {neighborhood.features.map(
                        (feature: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs md:text-sm"
                          >
                            {feature}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-auto">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
