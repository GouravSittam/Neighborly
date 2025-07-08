import React, { useState } from "react";
import { Twitter, Github, Linkedin } from "lucide-react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { PreferencesForm } from "../components/PreferencesForm";
import { ResearchSection } from "../components/ResearchSection";
import { Gallery4 } from "../components/ui/gallery4";
import { Feature } from "../components/ui/feature-section-with-bento-grid";
import { Footer } from "../components/ui/footer";
import { Component as FAQSection } from "@/components/ui/faq-section";
import SuccessStory from "@/components/SuccessStory";
import InsightSection from "@/components/InsightSection";

const CommunityHighlights = () => (
  <section className="w-full py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <div className="container mx-auto px-4 flex flex-col items-center">
      <video
        src="https://cdn.dribbble.com/userupload/3499810/file/original-8a8c67b6f13ca0e45b09465da5a0b03f.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full max-w-2xl mb-8 rounded-xl shadow-lg object-cover"
        style={{ minHeight: 200 }}
      />
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
        Discover What Makes Our Neighborhoods Special
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl text-center">
        Explore the unique features and vibrant community life that set our
        neighborhoods apart.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col items-center">
          <svg
            className="w-12 h-12 mb-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 8v4l3 3" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Vibrant Local Events</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            From farmers markets to music festivals, there's always something
            happening to bring neighbors together.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col items-center">
          <svg
            className="w-12 h-12 mb-4 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Top-Rated Schools</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Our neighborhoods are home to some of the best schools, making them
            perfect for families and lifelong learners.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col items-center">
          <svg
            className="w-12 h-12 mb-4 text-teal-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 21v-4a4 4 0 0 1 8 0v4" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Green Spaces & Parks</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Enjoy beautiful parks, playgrounds, and walking trails that make
            outdoor living easy and fun.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearchComplete = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main>
        <Hero />
        <div className="container mx-auto px-4 py-16 space-y-24">
          <PreferencesForm onSearchComplete={handleSearchComplete} />
          <ResearchSection refreshKey={refreshKey} />
          <Gallery4 />
            {/* Discover section with placeholder */}
            <section id="discover" className="max-w-6xl mx-auto mt-12">
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold mb-4">
                Your Perfect Neighborhood Matches
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Start your search above to discover neighborhoods that match
                your preferences.
              </p>
            </div>
            <InsightSection />
          </section>
          <CommunityHighlights />
          <SuccessStory />
          <FAQSection />
          {/* Discover section with placeholder */}
          {/* <section id="discover" className="max-w-6xl mx-auto mt-12">
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold mb-4">
                Your Perfect Neighborhood Matches
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Start your search above to discover neighborhoods that match
                your preferences.
              </p>
            </div>
            <InsightSection />
          </section> */}
        </div>
      </main>
      <Footer
        logo={<img src="/logo.svg" alt="Neighborly" className="h-8 w-8" />}
        brandName="Neighborly"
        socialLinks={[
          {
            icon: <Twitter className="h-5 w-5" />,
            href: "https://twitter.com/neighborly",
            label: "Twitter",
          },
          {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com/neighborly",
            label: "GitHub",
          },
          {
            icon: <Linkedin className="h-5 w-5" />,
            href: "https://linkedin.com/company/neighborly",
            label: "LinkedIn",
          },
        ]}
        mainLinks={[
          { href: "#discover", label: "Discover" },
          { href: "#matching", label: "Start Matching" },
          { href: "#insights", label: "Insights" },
          { href: "#research", label: "Research" },
          { href: "#contact", label: "Contact" },
        ]}
        legalLinks={[
          { href: "#privacy", label: "Privacy Policy" },
          { href: "#terms", label: "Terms of Service" },
          { href: "#cookies", label: "Cookie Policy" },
        ]}
        copyright={{
          text: "© 2025 Neighborly",
          license: "All rights reserved",
        }}
      />
    </div>
  );
};

export default Index;
