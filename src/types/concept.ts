export type ConceptSection = "core" | "dom" | "async" | "comparison";

export type ConceptDifficulty = "beginner" | "intermediate";

export interface Concept {
  id: string;
  slug: string;
  title: string;
  section: ConceptSection;
  order: number;
  simpleDescription: string;
  technicalDescription: string;
  difficulty: ConceptDifficulty;
  prerequisites?: string[];
  interviewQuestion?: string;
}

export const SECTION_META: Record<
  ConceptSection,
  { number: string; title: string; blurb: string; path: string }
> = {
  core: {
    number: "01",
    title: "Core JavaScript",
    blurb: "Scope, closures, arrays, this, prototypes, debounce...",
    path: "/learn/core",
  },
  dom: {
    number: "02",
    title: "Working with DOM",
    blurb: "Elements, trees, events, and delegation.",
    path: "/learn/dom",
  },
  async: {
    number: "03",
    title: "Async JavaScript",
    blurb: "Callbacks, promises, async/await, and the event loop.",
    path: "/learn/async",
  },
  comparison: {
    number: "04",
    title: "Comparison & Memoization",
    blurb: "Reference identity, deep equality, and caching.",
    path: "/learn/comparison",
  },
};
