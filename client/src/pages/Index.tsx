import React, { useState, Suspense, lazy } from "react";
import { Twitter, Github, Linkedin, Loader2 } from "lucide-react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { PreferencesForm } from "../components/PreferencesForm";
import { CommunityHighlights } from "@/components/CommunityHighlights";
import { Footer } from "../components/ui/footer";

const Gallery4 = lazy(() => import("../components/ui/gallery4").then(m => ({ default: m.Gallery4 })));
const InsightSection = lazy(() => import("@/components/InsightSection"));
const ResearchSection = lazy(() => import("../components/ResearchSection").then(m => ({ default: m.ResearchSection })));
const SuccessStory = lazy(() => import("@/components/SuccessStory"));
const FAQSection = lazy(() => import("@/components/ui/faq-section").then(m => ({ default: m.Component })));

const FallbackLoader = () => (
  <div className="flex items-center justify-center p-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
  </div>
);

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
            <Suspense fallback={<FallbackLoader />}>
              <Gallery4 />
            </Suspense>
          </div>
        </section>

        {/* Insight Analytics */}
        <section id="insights" className="py-20 md:py-28">
          <Suspense fallback={<FallbackLoader />}>
            <InsightSection />
          </Suspense>
        </section>

        {/* Research Analytics */}
        <section className="section-alt">
          <Suspense fallback={<FallbackLoader />}>
            <ResearchSection refreshKey={refreshKey} />
          </Suspense>
        </section>

        {/* Success Stories */}
        <section id="stories">
          <Suspense fallback={<FallbackLoader />}>
            <SuccessStory />
          </Suspense>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 md:py-28 section-alt">
          <Suspense fallback={<FallbackLoader />}>
            <FAQSection />
          </Suspense>
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
