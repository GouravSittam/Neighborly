import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4">
      <div aria-hidden className="grid-bg absolute inset-0" />
      <div aria-hidden className="absolute left-1/2 top-1/3 h-80 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute left-6 top-6"><Logo /></div>
      <div className="relative text-center">
        <p className="font-display-italic text-gradient text-[9rem] leading-none md:text-[13rem]">404</p>
        <h1 className="mt-2 text-3xl font-semibold">This street doesn't exist.</h1>
        <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
          The page you're looking for moved out — or never moved in.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/"><ArrowLeft /> Back home</Link>
        </Button>
      </div>
    </div>
  );
}
