import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SoundState {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (enabled: boolean) => void;
}

/**
 * On by default: feedback sounds people never discover are feedback sounds
 * that do nothing. The header toggle makes it one click to silence, and the
 * choice is remembered.
 *
 * skipHydration matches the progress store — rehydrated post-mount by
 * StoreHydration so the server render and first client render agree.
 */
export const useSound = create<SoundState>()(
  persist(
    (set, get) => ({
      enabled: true,
      toggle: () => set({ enabled: !get().enabled }),
      setEnabled: (enabled) => set({ enabled }),
    }),
    { name: "jsvl-sound", skipHydration: true }
  )
);
