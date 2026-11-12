import { lazy, Suspense, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Matcher } from "@/components/sections/Matcher";

// Below-the-fold sections are code-split; recharts lives only in the Research chunk.
const Explore = lazy(() => import("@/components/sections/Explore").then((m) => ({ default: m.Explore })));
const Research = lazy(() => import("@/components/sections/Research").then((m) => ({ default: m.Research })));
const Stories = lazy(() => import("@/components/sections/Stories").then((m) => ({ default: m.Stories })));
const FAQ = lazy(() => import("@/components/sections/FAQ").then((m) => ({ default: m.FAQ })));

const Placeholder = () => <div className="h-[60vh]" aria-hidden />;

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="noise relative min-h-dvh overflow-x-clip">
      <a href="#match" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background">
        Skip to matching
      </a>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Matcher onSearchComplete={() => setRefreshKey((k) => k + 1)} />
        <Suspense fallback={<Placeholder />}>
          <Explore />
          <Research refreshKey={refreshKey} />
          <Stories />
          <FAQ />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
