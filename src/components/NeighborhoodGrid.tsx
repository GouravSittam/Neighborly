
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, DollarSign, Car, Users, Star, TrendingUp } from 'lucide-react';

export const NeighborhoodGrid = () => {
  const neighborhoods = [
    {
      id: 1,
      name: "Downtown Heights",
      city: "Urban Core",
      matchScore: 92,
      avgRent: 2800,
      commuteTime: 15,
      walkScore: 89,
      demographics: "Young Professionals",
      highlights: ["Excellent Transit", "Nightlife", "Restaurants"],
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
      pros: ["Short commute", "Vibrant culture", "High walkability"],
      cons: ["Higher cost", "Noise levels"]
    },
    {
      id: 2,
      name: "Riverside Gardens",
      city: "Suburban",
      matchScore: 88,
      avgRent: 2200,
      commuteTime: 25,
      walkScore: 72,
      demographics: "Families",
      highlights: ["Great Schools", "Parks", "Family-Friendly"],
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      pros: ["Affordable", "Good schools", "Green spaces"],
      cons: ["Longer commute", "Less nightlife"]
    },
    {
      id: 3,
      name: "Tech Triangle",
      city: "Innovation District",
      matchScore: 85,
      avgRent: 2500,
      commuteTime: 20,
      walkScore: 81,
      demographics: "Tech Workers",
      highlights: ["Innovation Hub", "Modern Amenities", "Coworking"],
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
      pros: ["Tech community", "Modern facilities", "Good transit"],
      cons: ["Rapidly changing", "Competitive market"]
    }
  ];

  return (
    <section id="discover" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Neighborhood Matches</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Based on your preferences, here are neighborhoods that align with your lifestyle goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {neighborhoods.map((neighborhood) => (
            <Card key={neighborhood.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={neighborhood.image} 
                  alt={neighborhood.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white font-semibold">
                    {neighborhood.matchScore}% Match
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{neighborhood.name}</h3>
                    <p className="text-sm text-gray-600">{neighborhood.city}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{(neighborhood.matchScore / 20).toFixed(1)}</span>
                    </div>
                  </div>
                </CardTitle>
                
                <div className="space-y-2">
                  <Progress value={neighborhood.matchScore} className="h-2" />
                  <p className="text-sm text-gray-600">Match Score: {neighborhood.matchScore}%</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>${neighborhood.avgRent}/mo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-blue-600" />
                    <span>{neighborhood.commuteTime}min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span>Walk Score: {neighborhood.walkScore}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-xs">{neighborhood.demographics}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Highlights</h4>
                  <div className="flex flex-wrap gap-1">
                    {neighborhood.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <h5 className="font-semibold text-green-700 mb-1">Pros</h5>
                    <ul className="space-y-1">
                      {neighborhood.pros.map((pro, index) => (
                        <li key={index} className="text-gray-600">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-orange-700 mb-1">Considerations</h5>
                    <ul className="space-y-1">
                      {neighborhood.cons.map((con, index) => (
                        <li key={index} className="text-gray-600">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  View Detailed Analysis
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
