import { getMvpConcepts, getVisibleConceptsBySection } from "@/data/concepts";
import { SECTION_ORDER, type ConceptSection } from "@/types/concept";

/**
 * The three things worth celebrating, in increasing rarity. Exclusive by
 * design: finishing the last lesson of the last section fires "track" only,
 * never three overlapping bursts.
 */
export type CelebrationTier = "lesson" | "section" | "track";

export interface CelebrationEvent {
  tier: CelebrationTier;
  /** Stable key recorded in `celebrated` the first time this milestone lands. */
  key: string;
  /**
   * The lower-tier keys this event absorbs, which the caller must record
   * alongside `key`. Without this, firing "track" leaves that lesson's own
   * `lesson:` and `section:` keys unrecorded.
   */
  supersedes: string[];
  /** Short line shown alongside the burst. */
  message: string;
  /** Which section completed, for the "section" tier. */
  section?: ConceptSection;
  /**
   * False when this milestone has been celebrated before.
   *
   * The tier is decided by what the milestone is *worth*, never by whether it
   * has already been seen — re-finishing the last lesson of a section shows the
   * section celebration again. This flag only tells the caller whether there is
   * anything new to record.
   */
  isNew: boolean;
}

/** The snapshot this decision needs — a subset of the progress store. */
export interface CelebrationInput {
  completedLessons: string[];
  celebrated: string[];
}

function sectionOf(slug: string): ConceptSection | undefined {
  return SECTION_ORDER.find((section) =>
    getVisibleConceptsBySection(section).some((c) => c.slug === slug)
  );
}

function sectionTitle(section: ConceptSection): string {
  return section.charAt(0).toUpperCase() + section.slice(1);
}

/**
 * Whether `slug` is the lesson that actually finished `group`.
 *
 * `completedLessons` is append-ordered, so the member sitting furthest along it
 * is the one that completed the set. Anchoring on that rather than on "the set
 * is now complete" matters twice over: it credits whichever lesson genuinely
 * finished a section even when they are done out of order, and it stops every
 * other member of a finished section from claiming the same milestone on a
 * replay. `markCompleted` is a no-op for an already-complete lesson, so the
 * order — and therefore the credit — is stable across repeat answers.
 */
function finishedTheSet(completedLessons: string[], group: string[], slug: string): boolean {
  const members = group.filter((s) => completedLessons.includes(s));
  if (members.length !== group.length) return false;

  let lastSlug: string | null = null;
  let lastIndex = -1;
  for (const member of members) {
    const index = completedLessons.indexOf(member);
    if (index > lastIndex) {
      lastIndex = index;
      lastSlug = member;
    }
  }
  return lastSlug === slug;
}

/**
 * Given the progress *after* `slug` was marked complete, returns the highest
 * tier that completion represents — or null when the slug is not part of the
 * visible track, or is not actually complete.
 *
 * The tier depends only on what has been completed, never on what has already
 * been celebrated, so finishing the last lesson of a section always shows the
 * section celebration. `isNew` carries the has-it-fired-before question
 * separately, because that governs recording rather than presentation.
 *
 * Section membership and totals are read from the concept data rather than
 * hardcoded, so this stays correct if a concept's visibility changes.
 */
export function celebrationFor(
  progress: CelebrationInput,
  slug: string
): CelebrationEvent | null {
  const { completedLessons, celebrated } = progress;

  // Only lessons that are part of the visible track can be celebrated.
  const all = getMvpConcepts();
  if (!all.some((c) => c.slug === slug)) return null;
  if (!completedLessons.includes(slug)) return null;

  const section = sectionOf(slug);
  const lessonKey = `lesson:${slug}`;
  const sectionKey = section ? `section:${section}` : null;

  // Track: this lesson finished the whole visible track.
  if (finishedTheSet(completedLessons, all.map((c) => c.slug), slug)) {
    return {
      tier: "track",
      key: "track",
      supersedes: [lessonKey, ...(sectionKey ? [sectionKey] : [])],
      message: `All ${all.length} lessons complete`,
      isNew: !celebrated.includes("track"),
    };
  }

  // Section: this lesson finished its own section.
  if (section && sectionKey) {
    const items = getVisibleConceptsBySection(section);
    if (finishedTheSet(completedLessons, items.map((c) => c.slug), slug)) {
      return {
        tier: "section",
        key: sectionKey,
        supersedes: [lessonKey],
        message: `${sectionTitle(section)} complete — ${items.length} of ${items.length}`,
        section,
        isNew: !celebrated.includes(sectionKey),
      };
    }
  }

  // Lesson: just this one.
  return {
    tier: "lesson",
    key: lessonKey,
    supersedes: [],
    message: "Lesson complete",
    isNew: !celebrated.includes(lessonKey),
  };
}
