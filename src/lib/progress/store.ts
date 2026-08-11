import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Progress {
  completedLessons: string[];
  lessonVisits: Record<string, number>;
  challengeResults: Record<string, boolean>;
}

interface ProgressState extends Progress {
  markVisited: (slug: string) => void;
  markCompleted: (slug: string) => void;
  recordChallengeResult: (slug: string, correct: boolean) => void;
  resetProgress: () => void;
}

const initialProgress: Progress = {
  completedLessons: [],
  lessonVisits: {},
  challengeResults: {},
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialProgress,
      markVisited: (slug) =>
        set({
          lessonVisits: {
            ...get().lessonVisits,
            [slug]: (get().lessonVisits[slug] ?? 0) + 1,
          },
        }),
      markCompleted: (slug) => {
        if (get().completedLessons.includes(slug)) return;
        set({ completedLessons: [...get().completedLessons, slug] });
      },
      recordChallengeResult: (slug, correct) =>
        set({
          challengeResults: { ...get().challengeResults, [slug]: correct },
        }),
      resetProgress: () => set(initialProgress),
    }),
    {
      name: "jsvl-progress",
      // Rehydrated manually post-mount (see StoreHydration) so the server
      // render and first client render always agree on the empty defaults.
      skipHydration: true,
    }
  )
);
