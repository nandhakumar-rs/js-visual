import type { ExecutionStep } from "@/lib/execution/types";
import type { CacheRow, MemoizationInputs, MemoizationStepState } from "./types";

// Every log, calculation count and cache key asserted below was observed by
// running the exact program from code.ts. See the lesson's verification script.
//
// `calls` counts completed calls, so calls === calculations + hits holds at
// every step, including the ones paused mid-lookup.

function row(id: string, key: string, value: string, status: CacheRow["status"]): CacheRow {
  return { id, key, value, status };
}

// ---------------------------------------------------------------------------
// 1. Hit and miss
// ---------------------------------------------------------------------------

function hitAndMissSteps(): ExecutionStep<MemoizationStepState>[] {
  return [
    {
      id: "empty",
      title: "A cache is just a Map you check first",
      description:
        "Nothing is stored yet. The function has one extra job before its real work: look in here.",
      activeCodeLines: [1],
      state: { phase: "calling", entries: [], calls: 0, calculations: 0, hits: 0 },
    },
    {
      id: "miss-1",
      title: "priceFor(2) — nothing stored, so it calculates",
      description:
        "cache.has(2) is false. The function does the work, writes the result under the key, and returns it.",
      whyExplanation:
        "A miss costs slightly more than no cache at all: the failed lookup plus the write. That overhead is the price of admission, and it is only worth paying if the same key comes back.",
      activeCodeLines: [4, 6, 7],
      consoleOutput: [{ id: "hm-1", kind: "output", content: "100" }],
      state: {
        phase: "miss",
        entries: [row("2", "2", "100", "added")],
        calls: 1,
        calculations: 1,
        hits: 0,
      },
    },
    {
      id: "miss-2",
      title: "priceFor(3) — a different key, so another miss",
      description: "Nothing about the first entry helps here. Each distinct input needs its own row.",
      activeCodeLines: [12],
      consoleOutput: [{ id: "hm-2", kind: "output", content: "150" }],
      state: {
        phase: "miss",
        entries: [row("2", "2", "100", "stored"), row("3", "3", "150", "added")],
        calls: 2,
        calculations: 2,
        hits: 0,
      },
    },
    {
      id: "look-again",
      title: "priceFor(2) again — and this time the lookup succeeds",
      description: "cache.has(2) is true, so the whole body below this line is skipped.",
      activeCodeLines: [4],
      state: {
        phase: "looking",
        entries: [row("2", "2", "100", "hit"), row("3", "3", "150", "stored")],
        calls: 2,
        calculations: 2,
        hits: 0,
      },
    },
    {
      id: "hit",
      title: "The stored result is returned as-is",
      description: "Same answer as the first call, and no calculation happened to produce it.",
      whyExplanation:
        "This is the entire trade: the work was done once and its answer kept, so every later call with that key costs a lookup instead of a calculation.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "hm-3", kind: "output", content: "100" }],
      state: {
        phase: "hit",
        entries: [row("2", "2", "100", "hit"), row("3", "3", "150", "stored")],
        calls: 3,
        calculations: 2,
        hits: 1,
      },
    },
    {
      id: "done",
      title: "Three calls, two calculations",
      description: "The saving is exactly the number of repeats — no more, no less.",
      activeCodeLines: [11, 12, 13],
      state: {
        phase: "done",
        entries: [row("2", "2", "100", "stored"), row("3", "3", "150", "stored")],
        calls: 3,
        calculations: 2,
        hits: 1,
        note: "Memory spent: one row per distinct input. Time saved: one calculation per repeat.",
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 2. What is the key?
// ---------------------------------------------------------------------------

function theKeySteps(): ExecutionStep<MemoizationStepState>[] {
  return [
    {
      id: "create",
      title: "This time the argument is an object",
      description:
        "order is a name leading to one object — call it #1. That object is what will be used as the cache key.",
      activeCodeLines: [11],
      state: { phase: "calling", entries: [], calls: 0, calculations: 0, hits: 0 },
    },
    {
      id: "miss",
      title: "totalFor(order) — a miss, as expected",
      description: "The cache is empty, so the work is done and stored under #1 itself.",
      activeCodeLines: [13, 4, 7],
      consoleOutput: [{ id: "tk-1", kind: "output", content: "100" }],
      state: {
        phase: "miss",
        entries: [row("o1", "#1", "100", "added")],
        calls: 1,
        calculations: 1,
        hits: 0,
      },
    },
    {
      id: "hit",
      title: "The same object again — a real hit",
      description:
        "cache.has(order) compares by identity, and this is the very same object, so the stored value comes straight back.",
      whyExplanation:
        "A Map keyed by an object works perfectly as long as callers hand you the same object. That is a much narrower guarantee than it sounds.",
      activeCodeLines: [14],
      consoleOutput: [{ id: "tk-2", kind: "output", content: "100" }],
      state: {
        phase: "hit",
        entries: [row("o1", "#1", "100", "hit")],
        calls: 2,
        calculations: 1,
        hits: 1,
      },
    },
    {
      id: "look-alike",
      title: "Now a look-alike, built fresh in the argument",
      description:
        "Identical contents, but the literal made a new object — #2. The Equality lesson's rule applies here unchanged.",
      activeCodeLines: [15, 4],
      state: {
        phase: "looking",
        entries: [row("o1", "#1", "100", "stored")],
        calls: 2,
        calculations: 1,
        hits: 1,
        note: "cache.has(#2) is false. There is no row for #2 — only for #1.",
      },
    },
    {
      id: "miss-2",
      title: "So it misses, and calculates the same answer again",
      description:
        "The work is repeated and a second row is written, holding the same value as the first.",
      whyExplanation:
        "Nothing warns you. The cache quietly grew and quietly did the work twice, because identity — not contents — is what a Map key compares.",
      activeCodeLines: [4, 6, 7],
      consoleOutput: [{ id: "tk-3", kind: "output", content: "100" }],
      state: {
        phase: "miss",
        entries: [row("o1", "#1", "100", "stored"), row("o2", "#2", "100", "added")],
        calls: 3,
        calculations: 2,
        hits: 1,
      },
    },
    {
      id: "done",
      title: "All three logs say 100 — the bug is invisible in the output",
      description:
        "Only the counters give it away: three calls, two calculations, two rows holding the same value.",
      activeCodeLines: [13, 14, 15],
      state: {
        phase: "done",
        entries: [row("o1", "#1", "100", "stored"), row("o2", "#2", "100", "stored")],
        calls: 3,
        calculations: 2,
        hits: 1,
        note: "A cache keyed by an object hits only for callers who kept hold of that exact object.",
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 3. When it hurts
// ---------------------------------------------------------------------------

function whenItHurtsSteps(): ExecutionStep<MemoizationStepState>[] {
  const bigCache = [
    row("0", "0", "0", "stored"),
    row("1", "1", "50", "stored"),
    row("2", "2", "100", "stored"),
  ];

  return [
    {
      id: "loop",
      title: "A thousand calls, every one with a new input",
      description:
        "Each call looks in the cache, finds nothing, calculates, and writes a row. Not one lookup succeeds.",
      whyExplanation:
        "Memoization pays off in proportion to repeats. With no repeats there is nothing to pay off — every call bore the overhead and none of the benefit.",
      activeCodeLines: [2],
      state: {
        phase: "miss",
        entries: bigCache,
        hiddenEntries: 997,
        calls: 1000,
        calculations: 1000,
        hits: 0,
        cacheLabel: "cache",
      },
    },
    {
      id: "size",
      title: "And all thousand rows are still there",
      description:
        "A Map holds its keys until you remove them. Nothing here ever will, so this only grows.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "wh-1", kind: "output", content: "1000" }],
      state: {
        phase: "looking",
        entries: bigCache,
        hiddenEntries: 997,
        calls: 1000,
        calculations: 1000,
        hits: 0,
        cacheLabel: "cache",
        note: "Zero hits, and a structure that will never shrink. This is a memory leak with extra steps.",
      },
    },
    {
      id: "convert-first",
      title: "The second failure needs no volume at all",
      description:
        "convert reads rate, which lives outside the function. The first call stores 5 → 50.",
      activeCodeLines: [17, 12, 13],
      consoleOutput: [{ id: "wh-2", kind: "output", content: "50" }],
      state: {
        phase: "miss",
        entries: [row("r5", "5", "50", "added")],
        calls: 1001,
        calculations: 1001,
        hits: 0,
        cacheLabel: "rateCache",
      },
    },
    {
      id: "rate-changes",
      title: "rate changes — and the cache has no idea",
      description:
        "The stored 50 was computed from the old rate. Nothing about assigning to rate touches the Map.",
      activeCodeLines: [18],
      state: {
        phase: "looking",
        entries: [row("r5", "5", "50", "bad")],
        calls: 1001,
        calculations: 1001,
        hits: 0,
        cacheLabel: "rateCache",
      },
    },
    {
      id: "stale",
      title: "So the second call returns the old answer",
      description:
        "convert(5) should now be 100. It returns 50, with no error and nothing in the output to suggest anything went wrong.",
      whyExplanation:
        "A cache is only safe over a pure function — one whose result depends on its arguments alone. The moment a hidden input can change, a stored answer can become a wrong answer.",
      activeCodeLines: [19],
      consoleOutput: [{ id: "wh-3", kind: "output", content: "50" }],
      state: {
        phase: "bad-hit",
        entries: [row("r5", "5", "50", "bad")],
        calls: 1002,
        calculations: 1001,
        hits: 1,
        cacheLabel: "rateCache",
        note: "Wasted work is expensive. A stale answer is wrong — and much harder to notice.",
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 4. All together
// ---------------------------------------------------------------------------

function allTogetherSteps(): ExecutionStep<MemoizationStepState>[] {
  const EMPTY_KEY = "[{}]";
  const XY = '[{"x":1,"y":2}]';
  const YX = '[{"y":2,"x":1}]';

  return [
    {
      id: "wrapper",
      title: "One wrapper for any function",
      description:
        "memoize takes a function and hands back a cached version of it. Every argument list has to collapse into a single Map key, and line 4 is where that happens.",
      whyExplanation:
        "That one line carries the whole correctness of the wrapper. Everything else here is bookkeeping.",
      activeCodeLines: [1, 2, 3, 4],
      state: { phase: "calling", entries: [], calls: 0, calculations: 0, hits: 0 },
    },
    {
      id: "first",
      title: "describe({ a: undefined }) — a miss, and the right answer",
      description:
        'The object has one key, so the answer is "1 keys". Note what it was filed under: stringify dropped the undefined value, so the key is [{}].',
      activeCodeLines: [15, 4],
      consoleOutput: [{ id: "at-1", kind: "output", content: "1 keys" }],
      state: {
        phase: "miss",
        entries: [row("k1", EMPTY_KEY, '"1 keys"', "added")],
        calls: 1,
        calculations: 1,
        hits: 0,
      },
    },
    {
      id: "false-hit",
      title: "describe({}) — a hit, and a wrong answer",
      description:
        'An empty object also stringifies to [{}]. The cache matches, so it returns "1 keys" — for an object with no keys at all.',
      whyExplanation:
        "Two different values collapsed onto one key, so the cache answered a question it was never asked. The function was never called, which is why nothing throws and nothing looks unusual.",
      activeCodeLines: [16, 5],
      consoleOutput: [{ id: "at-2", kind: "output", content: "1 keys" }],
      state: {
        phase: "bad-hit",
        entries: [row("k1", EMPTY_KEY, '"1 keys"', "bad")],
        calls: 2,
        calculations: 1,
        hits: 1,
        note: 'The correct answer was "0 keys". A false hit is the expensive kind of bug.',
      },
    },
    {
      id: "key-order-1",
      title: "describe({ x: 1, y: 2 }) — a normal miss",
      description: "Two keys, so two keys. Filed under the stringified argument list.",
      activeCodeLines: [17],
      consoleOutput: [{ id: "at-3", kind: "output", content: "2 keys" }],
      state: {
        phase: "miss",
        entries: [row("k1", EMPTY_KEY, '"1 keys"', "stored"), row("k2", XY, '"2 keys"', "added")],
        calls: 3,
        calculations: 2,
        hits: 1,
      },
    },
    {
      id: "key-order-2",
      title: "The same data in a different order — a miss too",
      description:
        "stringify writes keys in insertion order, so this produces a different string and a third row. The answer is right; the work was wasted.",
      whyExplanation:
        "The same key that collides on values that differ also splits on values that match. One key strategy, two opposite failures — which is why the choice of key is the whole design.",
      activeCodeLines: [18, 4],
      consoleOutput: [{ id: "at-4", kind: "output", content: "2 keys" }],
      state: {
        phase: "miss",
        entries: [
          row("k1", EMPTY_KEY, '"1 keys"', "stored"),
          row("k2", XY, '"2 keys"', "stored"),
          row("k3", YX, '"2 keys"', "added"),
        ],
        calls: 4,
        calculations: 3,
        hits: 1,
      },
    },
    {
      id: "summary",
      title: "Four calls, three calculations, one wrong answer",
      description:
        "The cache did save one call — the one it should not have. Every other lookup missed, including the pair holding identical data.",
      activeCodeLines: [4],
      state: {
        phase: "done",
        entries: [
          row("k1", EMPTY_KEY, '"1 keys"', "bad"),
          row("k2", XY, '"2 keys"', "stored"),
          row("k3", YX, '"2 keys"', "stored"),
        ],
        calls: 4,
        calculations: 3,
        hits: 1,
        note: "A cache is only as good as its key — and a key that is wrong in both directions is worse than no cache.",
      },
    },
  ];
}

export function buildInitialSteps({
  scenario,
}: MemoizationInputs): ExecutionStep<MemoizationStepState>[] {
  if (scenario === "hit-and-miss") return hitAndMissSteps();
  if (scenario === "the-key") return theKeySteps();
  if (scenario === "when-it-hurts") return whenItHurtsSteps();
  return allTogetherSteps();
}
