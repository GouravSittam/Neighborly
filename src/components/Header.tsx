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

export const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLoginModal = () => setShowLogin(true);
  const openSignupModal = () => setShowSignup(true);
  const closeLoginModal = () => setShowLogin(false);
  const closeSignupModal = () => setShowSignup(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setLoginSuccess("Logged in!");
      setTimeout(() => {
        setShowLogin(false);
        setLoginEmail("");
        setLoginPassword("");
        setLoginSuccess("");
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError("Login failed");
      }
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: signupEmail, password: signupPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      setSignupSuccess("Account created! You can now sign in.");
      setTimeout(() => {
        setShowSignup(false);
        setSignupEmail("");
        setSignupPassword("");
        setSignupSuccess("");
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSignupError(err.message);
      } else {
        setSignupError("Signup failed");
      }
    }
  }

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
    auth: {
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
            <AnimatedSignIn />
          </div>
        </div>
      )}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg relative w-full max-w-sm">
            <button
              className="absolute top-2 right-2"
              onClick={closeSignupModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Sign Up
              </button>
              {signupError && (
                <div className="text-red-600 text-sm">{signupError}</div>
              )}
              {signupSuccess && (
                <div className="text-green-600 text-sm">{signupSuccess}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};
