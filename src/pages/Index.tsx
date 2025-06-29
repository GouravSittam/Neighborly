import React from "react";
import { Twitter, Github, Linkedin } from "lucide-react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { PreferencesForm } from "../components/PreferencesForm";
import { Gallery4 } from "../components/ui/gallery4";
import { Feature } from "../components/ui/feature-section-with-bento-grid";
import { Footer } from "../components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main>
        <Hero />
        <div className="container mx-auto px-4 py-16 space-y-24">
          <PreferencesForm />
          <Gallery4 />
          <Feature />
        </div>
      </main>
      <Footer
        logo={
          <img 
            src="/logo.svg" 
            alt="Neighborly" 
            className="h-8 w-8"
          />
        }
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
          text: "© 2024 Neighborly",
          license: "All rights reserved",
        }}
      />
    </div>
  );
};

export default Index;
