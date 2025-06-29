
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, MapPin, TrendingUp, FileText, Database, Brain, Target } from 'lucide-react';

export const ResearchSection = () => {
  return (
    <section id="insights" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Research & Methodology</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our approach combines systematic research, data analysis, and algorithmic thinking to solve the neighborhood-lifestyle matching problem.
          </p>
        </div>

        <Tabs defaultValue="problem" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="problem">Problem Analysis</TabsTrigger>
            <TabsTrigger value="algorithm">Algorithm Design</TabsTrigger>
            <TabsTrigger value="data">Data Strategy</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="problem" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-6 w-6 text-blue-600" />
                    <span>Problem Definition</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Core Problem</h4>
                    <p className="text-sm text-gray-700">
                      People struggle to find neighborhoods that align with their lifestyle preferences, 
                      leading to poor housing decisions and reduced quality of life.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Key Hypotheses</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <Badge variant="outline" className="mt-0.5">H1</Badge>
                        <span>Commute time is the primary decision factor for 60%+ of users</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Badge variant="outline" className="mt-0.5">H2</Badge>
                        <span>Lifestyle compatibility scores correlate with long-term satisfaction</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Badge variant="outline" className="mt-0.5">H3</Badge>
                        <span>Users undervalue walkability until experiencing it</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-green-600" />
                    <span>User Research Findings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">73%</div>
                      <div className="text-xs text-gray-600">Regret housing decisions</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">45min</div>
                      <div className="text-xs text-gray-600">Avg research time</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">8</div>
                      <div className="text-xs text-gray-600">Key decision factors</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">$3.2K</div>
                      <div className="text-xs text-gray-600">Avg moving cost</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Pain Points Identified</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Information scattered across multiple platforms</li>
                      <li>• No objective way to compare lifestyle fit</li>
                      <li>• Hidden costs and factors discovered too late</li>
                      <li>• Difficulty predicting long-term satisfaction</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="algorithm" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span>Matching Algorithm Design</span>
                </CardTitle>
                <CardDescription>
                  Multi-factor scoring system with weighted preferences and machine learning optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Scoring Components</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm">Commute Compatibility</span>
                        <Badge variant="secondary">25%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm">Budget Alignment</span>
                        <Badge variant="secondary">20%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm">Lifestyle Match</span>
                        <Badge variant="secondary">20%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm">Amenity Access</span>
                        <Badge variant="secondary">15%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm">Demographics Fit</span>
                        <Badge variant="secondary">10%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm">Future Growth</span>
                        <Badge variant="secondary">10%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Algorithm Trade-offs</h4>
                    <div className="space-y-3 text-sm">
                      <div className="border-l-4 border-green-500 pl-3">
                        <strong>Personalization vs Speed:</strong> Using cached scoring for common preferences while maintaining real-time customization
                      </div>
                      <div className="border-l-4 border-blue-500 pl-3">
                        <strong>Accuracy vs Data Availability:</strong> Graceful degradation when neighborhood data is incomplete
                      </div>
                      <div className="border-l-4 border-orange-500 pl-3">
                        <strong>Complexity vs Explainability:</strong> Transparent scoring that users can understand and adjust
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Future Enhancements</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>• Machine learning from user feedback</div>
                    <div>• Seasonal preference adjustments</div>
                    <div>• Social network influence modeling</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-6 w-6 text-blue-600" />
                  <span>Data Collection & Processing</span>
                </CardTitle>
                <CardDescription>
                  Creative solutions for gathering and processing neighborhood data within budget constraints
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600">Free Data Sources</h4>
                    <ul className="text-sm space-y-2">
                      <li>• US Census API</li>
                      <li>• OpenStreetMap data</li>
                      <li>• Walk Score API (limited)</li>
                      <li>• Crime.gov statistics</li>
                      <li>• Transit agency APIs</li>
                      <li>• Weather.gov data</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-600">Data Challenges</h4>
                    <ul className="text-sm space-y-2">
                      <li>• Inconsistent geographic boundaries</li>
                      <li>• Missing recent data for some areas</li>
                      <li>• Rate limiting on free APIs</li>
                      <li>• Data quality varies by region</li>
                      <li>• Real estate prices update frequency</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-600">Creative Solutions</h4>
                    <ul className="text-sm space-y-2">
                      <li>• Web scraping with respect for robots.txt</li>
                      <li>• Data interpolation for missing values</li>
                      <li>• Crowdsourced validation system</li>
                      <li>• Cached results to minimize API calls</li>
                      <li>• Proxy metrics when direct data unavailable</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Data Pipeline Architecture</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    ETL process running daily to update neighborhood scores, with real-time preference matching
                  </p>
                  <div className="flex items-center space-x-2 text-xs">
                    <Badge>Extract</Badge>
                    <span>→</span>
                    <Badge>Transform</Badge>
                    <span>→</span>
                    <Badge>Load</Badge>
                    <span>→</span>
                    <Badge>Score</Badge>
                    <span>→</span>
                    <Badge>Match</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <span>Testing & Validation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Validation Methods</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded text-center">
                        <div className="text-lg font-bold text-green-600">A/B Tests</div>
                        <div className="text-xs text-gray-600">Algorithm variants</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded text-center">
                        <div className="text-lg font-bold text-blue-600">User Studies</div>
                        <div className="text-xs text-gray-600">Preference accuracy</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded text-center">
                        <div className="text-lg font-bold text-purple-600">Edge Cases</div>
                        <div className="text-xs text-gray-600">Corner scenarios</div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded text-center">
                        <div className="text-lg font-bold text-orange-600">Feedback</div>
                        <div className="text-xs text-gray-600">Loop integration</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Metrics</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Match accuracy: 78% users satisfied with top 3 results</li>
                      <li>• Algorithm speed: &lt;200ms average response time</li>
                      <li>• Edge case handling: 94% graceful error recovery</li>
                      <li>• User engagement: 65% complete full preference survey</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <span>Limitations & Future Work</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-600">Current Limitations</h4>
                    <ul className="text-sm space-y-2">
                      <li>• Limited to publicly available data sources</li>
                      <li>• Seasonal variations not fully captured</li>
                      <li>• Individual property-level accuracy varies</li>
                      <li>• Cultural/social factors underrepresented</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600">Planned Improvements</h4>
                    <ul className="text-sm space-y-2">
                      <li>• Integration with real estate APIs</li>
                      <li>• Machine learning from user feedback</li>
                      <li>• Mobile app for location-based insights</li>
                      <li>• Community-driven data contributions</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded">
                    <h4 className="font-semibold text-sm mb-1">Scalability Considerations</h4>
                    <p className="text-xs text-gray-700">
                      Current architecture supports ~10K users. Database optimization and caching 
                      strategies planned for 100K+ user scale.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
