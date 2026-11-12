import { Component, type ErrorInfo, type ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="grid min-h-dvh place-items-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Something went wrong.</h1>
          <p className="mt-2 text-muted-foreground">{this.state.error.message}</p>
          <button
            onClick={() => location.reload()}
            className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
