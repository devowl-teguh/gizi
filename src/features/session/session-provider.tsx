"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";

export type ChildProfile = { nickname: string; birthDate: string; sex: "" | "female" | "male" };
type State = { profile: ChildProfile | null; query: string; generation: number };
type Action = { type: "profile"; profile: ChildProfile } | { type: "query"; query: string } | { type: "reset" };
const initial: State = { profile: null, query: "", generation: 0 };
export function sessionReducer(state: State, action: Action): State {
  switch (action.type) {
    case "profile": return { ...state, profile: action.profile };
    case "query": return { ...state, query: action.query };
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
