"use client";

import { useEffect } from "react";
import { useProgress } from "@/lib/progress/store";

/**
 * Persisted zustand stores use skipHydration so the server render and the
 * first client render always agree on defaults; this component pulls the
 * real localStorage value in after mount, avoiding hydration-mismatch
 * warnings for state that legitimately differs per browser. Explanation mode
 * is intentionally not persisted (see explanation-mode-store.ts), so it has
 * nothing to rehydrate here.
 */
export function StoreHydration() {
  useEffect(() => {
    useProgress.persist.rehydrate();
  }, []);

  return null;
}
