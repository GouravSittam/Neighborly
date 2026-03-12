import React, { useState } from "react";
import { Twitter, Github, Linkedin } from "lucide-react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { PreferencesForm } from "../components/PreferencesForm";
import { ResearchSection } from "../components/ResearchSection";
import { Gallery4 } from "../components/ui/gallery4";
import { Footer } from "../components/ui/footer";
import { Component as FAQSection } from "@/components/ui/faq-section";
import SuccessStory from "@/components/SuccessStory";
import InsightSection from "@/components/InsightSection";
import { CommunityHighlights } from "@/components/CommunityHighlights";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearchComplete = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <Hero />

        {/* Community Highlights — show value before asking for input */}
        <section className="py-20 md:py-28 section-alt">
          <CommunityHighlights />
        </section>

        {/* Preferences Matching Form */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <PreferencesForm onSearchComplete={handleSearchComplete} />
          </div>
        </section>

        {/* Neighborhood Gallery */}
        <section id="discover" className="py-20 md:py-28 section-alt">
          <div className="container mx-auto px-4">
            <Gallery4 />
          </div>
        </section>

        {/* Insight Analytics */}
        <section id="insights" className="py-20 md:py-28">
          <InsightSection />
        </section>

        {/* Research Analytics */}
        <section className="section-alt">
          <ResearchSection refreshKey={refreshKey} />
        </section>

        {/* Success Stories */}
        <section id="stories">
          <SuccessStory />
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 md:py-28 section-alt">
          <FAQSection />
        </section>
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
          { href: "#stories", label: "Stories" },
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
