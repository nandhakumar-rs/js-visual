"use client";

import { useEffect } from "react";
import { useProgress } from "@/lib/progress/store";
import { useExplanationMode } from "@/lib/ui-state/explanation-mode-store";

/**
 * Persisted zustand stores use skipHydration so the server render and the
 * first client render always agree on defaults; this component pulls the
 * real localStorage value in after mount, avoiding hydration-mismatch
 * warnings for state that legitimately differs per browser.
 */
export function StoreHydration() {
  useEffect(() => {
    useProgress.persist.rehydrate();
    useExplanationMode.persist.rehydrate();
  }, []);

  return null;
}
