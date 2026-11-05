"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { AssistantResult } from "@/lib/ai/contracts";
import type { GrowthResult } from "@/features/growth/calculations";
import type { DevelopmentResult } from "@/features/development/milestones";
import type { VaccineRecord } from "@/features/vaccines/schedule";

export type ChildProfile = { nickname: string; birthDate: string; sex: "" | "female" | "male" };
export type SavedSearch = { kind: "recipes" | "stimulation" | "guide"; query: string; result: Extract<AssistantResult, { status: "ok" }> };
type State = { profile: ChildProfile | null; query: string; latestSearch: SavedSearch | null; growth: GrowthResult | null; development: DevelopmentResult | null; vaccines: VaccineRecord | null; generation: number };
type Action = { type: "profile"; profile: ChildProfile } | { type: "query"; query: string } | { type: "search-result"; search: SavedSearch } | { type: "growth"; growth: GrowthResult } | { type: "development"; development: DevelopmentResult } | { type: "vaccines"; vaccines: VaccineRecord } | { type: "reset" };
const initial: State = { profile: null, query: "", latestSearch: null, growth: null, development: null, vaccines: null, generation: 0 };
export function sessionReducer(state: State, action: Action): State {
  switch (action.type) {
    case "profile": return { ...state, profile: action.profile, growth: null, development: null, vaccines: null };
    case "query": return { ...state, query: action.query };
    case "search-result": return { ...state, latestSearch: action.search };
    case "growth": return { ...state, growth: action.growth };
    case "development": return { ...state, development: action.development };
    case "vaccines": return { ...state, vaccines: action.vaccines };
    case "reset": return { ...initial, generation: state.generation + 1 };
  }
}
const SessionContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initial);
  return <SessionContext.Provider value={{ state, dispatch }}>{children}</SessionContext.Provider>;
}
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("SessionProvider is required");
  return context;
}
