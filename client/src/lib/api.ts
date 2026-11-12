import type { MatchResult, ResearchData, UserPreferences } from "../../../server/src/types";

export type { MatchResult, ResearchData, UserPreferences };

/** Base URL for the API. Empty in dev (Vite proxies /api); set VITE_API_URL in production. */
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body?.error || body?.message || `Request failed (${res.status})`, res.status);
  }
  return body as T;
}

export type MatchPreferences = Required<
  Pick<UserPreferences, "maxCommute" | "budgetRange" | "lifestyle" | "priorities">
>;

export async function fetchMatches(preferences: MatchPreferences): Promise<MatchResult[]> {
  const res = await api<{ data?: { matches?: MatchResult[] } }>("/api/match?limit=12", {
    method: "POST",
    body: JSON.stringify(preferences),
  });
  return res.data?.matches ?? [];
}


export async function fetchResearch(): Promise<ResearchData> {
  const res = await api<{ data: ResearchData }>("/api/research/overview");
  return res.data;
}
