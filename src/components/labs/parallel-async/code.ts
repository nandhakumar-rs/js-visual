import type { ParallelAsyncInputs } from "./types";

export function getCode({ mode }: ParallelAsyncInputs): string[] {
  if (mode === "sequential") {
    return [
      "await getUser();      // 800ms",
      "await getPosts();     // 1200ms",
      "await getSettings();  // 500ms",
      "",
      "// total: 2500ms",
    ];
  }
  return [
    "await Promise.all([",
    "  getUser(),      // 800ms",
    "  getPosts(),     // 1200ms",
    "  getSettings(),  // 500ms",
    "]);",
    "",
    "// total: 1200ms (the longest one)",
  ];
}
