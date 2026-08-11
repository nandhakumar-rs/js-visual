import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ExplanationMode = "simple" | "technical";

interface ExplanationModeState {
  mode: ExplanationMode;
  setMode: (mode: ExplanationMode) => void;
  toggle: () => void;
}

export const useExplanationMode = create<ExplanationModeState>()(
  persist(
    (set, get) => ({
      mode: "simple",
      setMode: (mode) => set({ mode }),
      toggle: () =>
        set({ mode: get().mode === "simple" ? "technical" : "simple" }),
    }),
    {
      name: "jsvl-explanation-mode",
      // Rehydrated manually post-mount (see StoreHydration) so the server
      // render and first client render always agree on the default value.
      skipHydration: true,
    }
  )
);
