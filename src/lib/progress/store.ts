import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Which of a lesson's two questions an answer belongs to. */
export type AnswerKind = "prediction" | "challenge";

export interface Progress {
  completedLessons: string[];
  lessonVisits: Record<string, number>;
  challengeResults: Record<string, boolean>;
  /** First-attempt correctness for each lesson's prediction. */
  predictionResults: Record<string, boolean>;
  /** Consecutive questions answered correctly on the first attempt. */
  firstTryStreak: number;
  bestStreak: number;
  /** Celebration keys already fired, so a tier can never repeat on revisit. */
  celebrated: string[];
}

interface ProgressState extends Progress {
  markVisited: (slug: string) => void;
  markCompleted: (slug: string) => void;
  /**
   * Records an answer and maintains the streak. Only the *first ever* answer to
   * a given lesson+kind counts — retrying or revisiting can neither extend nor
   * break the streak, so it cannot be farmed.
   */
  recordAnswer: (slug: string, kind: AnswerKind, correct: boolean, isFirstAttempt: boolean) => void;
  markCelebrated: (key: string) => void;
  resetProgress: () => void;
}

const initialProgress: Progress = {
  completedLessons: [],
  lessonVisits: {},
  challengeResults: {},
  predictionResults: {},
  firstTryStreak: 0,
  bestStreak: 0,
  celebrated: [],
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
      recordAnswer: (slug, kind, correct, isFirstAttempt) => {
        const state = get();
        const bucket = kind === "prediction" ? state.predictionResults : state.challengeResults;

        // Already answered once — record nothing and leave the streak alone.
        if (slug in bucket) return;

        const next = { ...bucket, [slug]: correct };
        const earned = correct && isFirstAttempt;
        const streak = earned ? state.firstTryStreak + 1 : 0;

        set({
          ...(kind === "prediction" ? { predictionResults: next } : { challengeResults: next }),
          firstTryStreak: streak,
          bestStreak: Math.max(state.bestStreak, streak),
        });
      },
      markCelebrated: (key) => {
        if (get().celebrated.includes(key)) return;
        set({ celebrated: [...get().celebrated, key] });
      },
      resetProgress: () => set(initialProgress),
    }),
    {
      name: "jsvl-progress",
      // Rehydrated manually post-mount (see StoreHydration) so the server
      // render and first client render always agree on the empty defaults.
      skipHydration: true,
      version: 1,
      // v0 predates predictionResults/streaks/celebrated. Without this, a
      // returning user rehydrates them as undefined and the first
      // `celebrated.includes(...)` throws.
      migrate: (persisted) => migrateProgress(persisted),
    }
  )
);

/**
 * Exported for direct testing: fills any missing field with its default and
 * discards anything of the wrong shape, so no stored payload can crash a
 * returning user.
 */
export function migrateProgress(persisted: unknown): Progress {
  const p = (persisted ?? {}) as Partial<Progress>;
  const array = (v: unknown, fallback: string[]) => (Array.isArray(v) ? (v as string[]) : fallback);
  const record = <T,>(v: unknown, fallback: Record<string, T>) =>
    v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, T>) : fallback;
  const count = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : 0);

  return {
    completedLessons: array(p.completedLessons, initialProgress.completedLessons),
    lessonVisits: record<number>(p.lessonVisits, initialProgress.lessonVisits),
    challengeResults: record<boolean>(p.challengeResults, initialProgress.challengeResults),
    predictionResults: record<boolean>(p.predictionResults, initialProgress.predictionResults),
    firstTryStreak: count(p.firstTryStreak),
    bestStreak: Math.max(count(p.bestStreak), count(p.firstTryStreak)),
    celebrated: array(p.celebrated, initialProgress.celebrated),
  };
}
