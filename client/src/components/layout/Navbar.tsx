import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { AuthDialog, type AuthMode } from "./AuthDialog";

const LINKS = [
  { href: "#match", label: "Match" },
  { href: "#explore", label: "Explore" },
  { href: "#research", label: "Research" },
  { href: "#stories", label: "Stories" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [active, setActive] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Highlight the link for the section currently in view.
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
        <motion.nav
          aria-label="Main"
          animate={{ maxWidth: scrolled ? 920 : 1240 }}
          transition={{ type: "spring", stiffness: 260, damping: 32 }}
          className={cn(
            "flex w-full items-center justify-between gap-4 rounded-full py-2 pr-2 pl-5 transition-[background,box-shadow,border-color] duration-300",
            scrolled || mobileOpen
              ? "glass shadow-[0_8px_32px_-12px_oklch(0_0_0/0.25)]"
              : "border border-transparent",
          )}
        >
          <Logo />

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
                    active === l.href ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active === l.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-muted"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {user ? (
              <div className="hidden items-center gap-1 md:flex">
                <span className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-sm">
                  <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-primary to-violet text-xs font-semibold text-primary-foreground">
                    {(user.name || user.email).slice(0, 1).toUpperCase()}
                  </span>
                  <span className="max-w-[10rem] truncate">{user.name || user.email}</span>
                </span>
                <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out">
                  <LogOut />
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-1 md:flex">
                <Button variant="ghost" size="sm" onClick={() => openAuth("signin")}>
                  Sign in
                </Button>
                <Button variant="secondary" size="sm" onClick={() => openAuth("signup")}>
                  Get started <ArrowRight />
                </Button>
              </div>
            )}
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full hover:bg-muted md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass fixed inset-x-3 top-[4.75rem] z-40 rounded-3xl p-3 shadow-2xl md:hidden"
          >
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base hover:bg-muted"
                  >
                    {l.label}
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
              {user ? (
                <Button variant="outline" className="col-span-2" onClick={() => { logout(); setMobileOpen(false); }}>
                  <LogOut /> Sign out {user.name ? `(${user.name})` : ""}
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => openAuth("signin")}>Sign in</Button>
                  <Button variant="secondary" onClick={() => openAuth("signup")}>Get started</Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} mode={authMode} onModeChange={setAuthMode} />
    </>
  );
}
