import { create } from "zustand";

export type ExplanationMode = "simple" | "technical";

interface ExplanationModeState {
  mode: ExplanationMode;
  setMode: (mode: ExplanationMode) => void;
  toggle: () => void;
}

// Deliberately not persisted to localStorage — Concept mode is always the
// default on a fresh page load, for every lesson, regardless of what a
// learner previously selected in an earlier session. Toggling still applies
// normally within the current session (client-side lesson navigation).
export const useExplanationMode = create<ExplanationModeState>()((set, get) => ({
  mode: "simple",
  setMode: (mode) => set({ mode }),
  toggle: () => set({ mode: get().mode === "simple" ? "technical" : "simple" }),
}));
