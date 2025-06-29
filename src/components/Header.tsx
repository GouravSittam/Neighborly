
import React from 'react';
import { MapPin, Users, BarChart3, Book, Sunset, Trees, Zap } from 'lucide-react';
import { Navbar1 } from '@/components/ui/navbar1';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const Header = () => {
  const navbarData = {
    logo: {
      url: "/",
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E",
      alt: "NeighborFit logo",
      title: "NeighborFit",
    },
    menu: [
      { title: "Home", url: "/" },
      {
        title: "Discover",
        url: "#discover",
        items: [
          {
            title: "Neighborhood Explorer",
            description: "Browse and explore different neighborhoods",
            icon: <MapPin className="size-5 shrink-0" />,
            url: "#discover",
          },
          {
            title: "Area Insights",
            description: "Get detailed insights about any area",
            icon: <BarChart3 className="size-5 shrink-0" />,
            url: "#insights",
          },
          {
            title: "Community Data",
            description: "Access comprehensive community information",
            icon: <Users className="size-5 shrink-0" />,
            url: "#community",
          },
          {
            title: "Research Library",
            description: "Learn about our data-driven methodology",
            icon: <Book className="size-5 shrink-0" />,
            url: "#research",
          },
        ],
      },
      {
        title: "Resources",
        url: "#resources",
        items: [
          {
            title: "How It Works",
            description: "Learn about our matching algorithm",
            icon: <Zap className="size-5 shrink-0" />,
            url: "#research",
          },
          {
            title: "Success Stories",
            description: "Read about users who found their perfect match",
            icon: <Sunset className="size-5 shrink-0" />,
            url: "#stories",
          },
          {
            title: "Moving Guide",
            description: "Tips and resources for your next move",
            icon: <Trees className="size-5 shrink-0" />,
            url: "#guide",
          },
          {
            title: "FAQ",
            description: "Frequently asked questions and answers",
            icon: <Book className="size-5 shrink-0" />,
            url: "#faq",
          },
        ],
      },
      {
        title: "Matching",
        url: "#matching",
      },
      {
        title: "Insights",
        url: "#insights",
      },
    ],
    mobileExtraLinks: [
      { name: "About", url: "#about" },
      { name: "Contact", url: "#contact" },
      { name: "Privacy", url: "#privacy" },
      { name: "Terms", url: "#terms" },
    ],
    auth: {
      login: { text: "Sign In", url: "#login" },
      signup: { text: "Get Started", url: "#matching" },
    },
    themeToggle: <ThemeToggle />,
  };

  return <Navbar1 {...navbarData} />;
};
