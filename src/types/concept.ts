export type ConceptSection = "core" | "dom" | "async" | "comparison";

export type ConceptDifficulty = "beginner" | "intermediate";

export type ConceptVisibility = "mvp" | "later";

export interface Concept {
  id: string;
  slug: string;
  title: string;
  section: ConceptSection;
  order: number;
  /** Position within the MVP curriculum's section, when `visibility` is "mvp". Falls back to `order` when omitted. */
  mvpOrder?: number;
  visibility: ConceptVisibility;
  simpleDescription: string;
  technicalDescription: string;
  difficulty: ConceptDifficulty;
  prerequisites?: string[];
  interviewQuestion?: string;
  /**
   * Purpose-written answer to `interviewQuestion`. Falls back to
   * `technicalDescription` when omitted (existing lessons without a
   * dedicated answer yet) — but a real answer should directly address the
   * question, not restate the intro copy, Technical Details, or Remember
   * text.
   */
  interviewAnswer?: string;
}

/** Sections shown in the public MVP curriculum, in display order. Deliberately excludes "dom". */
export const SECTION_ORDER: ConceptSection[] = ["core", "async", "comparison"];

export const SECTION_META: Record<
  ConceptSection,
  { number: string; title: string; blurb: string; path: string }
> = {
  core: {
    number: "01",
    title: "JavaScript Foundations",
    blurb: "Values, references, execution context, scope, and closures.",
    path: "/learn/core",
  },
  dom: {
    number: "02",
    title: "Working with DOM",
    blurb: "Elements, trees, events, and delegation.",
    path: "/learn/dom",
  },
  async: {
    number: "02",
    title: "Async JavaScript",
    blurb: "Callbacks, promises, the event loop, and async/await.",
    path: "/learn/async",
  },
  comparison: {
    number: "03",
    title: "Comparison & Performance",
    blurb: "Reference identity, equality, and memoization.",
    path: "/learn/comparison",
  },
};
