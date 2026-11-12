import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Input,
  Label,
} from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export type AuthMode = "signin" | "signup";

export function AuthDialog({
  mode,
  onModeChange,
  open,
  onOpenChange,
}: {
  mode: AuthMode;
  onModeChange: (m: AuthMode) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { login, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      if (isSignup) await signup(name, email, password);
      else await login(email, password);
      toast.success(isSignup ? "Welcome to Neighborly!" : "Welcome back!");
      setPassword("");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setError(null); }}>
      <DialogContent>
        <div className="relative overflow-hidden px-7 pt-8 pb-6">
          <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-48 w-80 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
          <DialogTitle className="relative text-2xl font-semibold tracking-tight">
            {isSignup ? (
              <>Find your <span className="font-display-italic text-gradient">place</span></>
            ) : (
              <>Welcome <span className="font-display-italic text-gradient">back</span></>
            )}
          </DialogTitle>
          <DialogDescription className="relative mt-1.5 text-sm text-muted-foreground">
            {isSignup
              ? "Create an account to save matches and track neighborhoods."
              : "Sign in to pick up where you left off."}
          </DialogDescription>
        </div>

        {/* Mode switch */}
        <div className="mx-7 grid grid-cols-2 rounded-full bg-muted p-1 text-sm">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { onModeChange(m); setError(null); }}
              className={cn(
                "h-9 rounded-full font-medium transition-all",
                mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-7 pt-6 pb-7">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="auth-name">Name</Label>
              <Input id="auth-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input id="auth-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <div className="relative">
              <Input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={isSignup ? 6 : undefined}
                required
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-1 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            {isSignup ? "Create account" : "Sign in"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
