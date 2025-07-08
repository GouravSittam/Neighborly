import React, { useState } from "react";
import {
  MapPin,
  Users,
  BarChart3,
  Book,
  Sunset,
  Trees,
  Zap,
} from "lucide-react";
import { Navbar1 } from "@/components/ui/navbar1";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AnimatedSignIn } from "@/components/ui/sign-in";
import { useAuth } from "@/hooks/use-auth";
import Signup from "@/components/ui/signup";

export const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const {
    user,
    login,
    logout,
    loading: authLoading,
    error: authError,
  } = useAuth();

  const openLoginModal = () => setShowLogin(true);
  const openSignupModal = () => setShowSignup(true);
  const closeLoginModal = () => setShowLogin(false);
  const closeSignupModal = () => setShowSignup(false);

  // Remove local login state and signup state
  // Remove handleSignup, signupEmail, setSignupEmail, signupPassword, setSignupPassword, signupError, signupSuccess

  const navbarData = {
    logo: {
      url: "/",
      src: "/logo.svg",
      alt: "Neighborly logo",
      title: "Neighborly",
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
    auth: user
      ? {
          login: { text: user.name || user.email, action: logout },
          signup: { text: "Logout", action: logout },
        }
      : {
          login: { text: "Sign In", action: openLoginModal },
          signup: { text: "Get Started", action: openSignupModal },
        },
    themeToggle: <ThemeToggle />,
  };

  return (
    <>
      <Navbar1 {...navbarData} />
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-6xl">
            <button
              className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2"
              onClick={closeLoginModal}
              aria-label="Close sign in modal"
            >
              &times;
            </button>
            <AnimatedSignIn onSuccess={closeLoginModal} />
            {authError && (
              <div className="text-red-600 text-center mt-2">{authError}</div>
            )}
          </div>
        </div>
      )}
      {/* TODO: Implement signup modal with global auth context */}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl">
            <button
              className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2"
              onClick={closeSignupModal}
              aria-label="Close sign up modal"
            >
              &times;
            </button>
            <Signup onSuccess={closeSignupModal} />
          </div>
        </div>
      )}
    </>
  );
};
