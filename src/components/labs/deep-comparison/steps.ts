import type { ExecutionStep } from "@/lib/execution/types";
import type { CallStackFrame } from "@/components/visualizers/CallStack";
import type { DeepComparisonInputs, DeepComparisonStepState, NodeStatus, TreeNode } from "./types";

// Every result and every comparison count asserted below was observed by
// running the exact program from code.ts. See the lesson's verification script.

const MAIN: CallStackFrame = { id: "main", label: "main()" };

function frame(id: string, label: string, returnValue?: string): CallStackFrame {
  return {
    id,
    label,
    isActive: returnValue === undefined,
    statusBadge:
      returnValue === undefined
        ? { text: "COMPARING", tone: "new" }
        : { text: "RETURNING", tone: "success" },
    returnValue,
  };
}

/** The shared pair, as a merged tree. `cityRight` is what varies per scenario. */
function tree(
  statuses: Record<string, NodeStatus>,
  cityRight = '"Chennai"'
): TreeNode[] {
  const at = (path: string) => statuses[path] ?? "pending";
  return [
    { id: "root", path: "(root)", depth: 0, left: "{ … }", right: "{ … }", status: at("(root)") },
    { id: "name", path: "name", depth: 1, left: '"Maya"', right: '"Maya"', status: at("name") },
    { id: "address", path: "address", depth: 1, left: "{ … }", right: "{ … }", status: at("address") },
    {
      id: "city",
      path: "address.city",
      depth: 2,
      left: '"Chennai"',
      right: cityRight,
      status: at("address.city"),
    },
  ];
}

// ---------------------------------------------------------------------------
// 1. Shallow said no
// ---------------------------------------------------------------------------

function shallowVsDeepSteps(): ExecutionStep<DeepComparisonStepState>[] {
  return [
    {
      id: "pair",
      title: "The pair the last lesson could not settle",
      description:
        "Two separate objects holding equal data, with one of those values nested. Drawn as a tree, it is four pairs of values, not two.",
      activeCodeLines: [1, 2],
      state: {
        phase: "comparing",
        nodes: tree({ "(root)": "visiting" }),
        callStack: [MAIN],
        comparisons: 0,
      },
    },
    {
      id: "shallow",
      title: "The shallow check stops one level down",
      description:
        "name matches by value. address does not, because comparing two objects with === compares their identities — and that is as far as it looks.",
      whyExplanation:
        "Nothing about this is wrong; it is what one level deep means. The value inside address is never read, so the check cannot know it is the same.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "sv-1", kind: "output", content: "false" }],
      state: {
        phase: "returning",
        nodes: tree({
          "(root)": "mismatch",
          name: "match",
          address: "mismatch",
          "address.city": "skipped",
        }),
        callStack: [MAIN],
        comparisons: 0,
        result: false,
        note: "address.city was never looked at — that is the whole difference.",
      },
    },
    {
      id: "deep-descends",
      title: "The deep check does one more thing",
      description:
        "When a pair of values turns out to be two objects, instead of answering it asks the same question again about what is inside them.",
      whyExplanation:
        "That is the entire idea: a deep comparison is a shallow comparison that, on reaching an object, calls itself rather than giving up.",
      activeCodeLines: [5],
      state: {
        phase: "descending",
        nodes: tree({
          "(root)": "visiting",
          name: "match",
          address: "visiting",
          "address.city": "visiting",
        }),
        callStack: [MAIN, frame("root", "deepEqual(a, b)"), frame("addr", "deepEqual(a.address, b.address)")],
        comparisons: 3,
      },
    },
    {
      id: "deep-result",
      title: "So it reaches the value the shallow check skipped",
      description: '"Chennai" === "Chennai" is true, and with every pair matching the answer comes back true.',
      activeCodeLines: [5],
      consoleOutput: [{ id: "sv-2", kind: "output", content: "true" }],
      state: {
        phase: "done",
        nodes: tree({
          "(root)": "match",
          name: "match",
          address: "match",
          "address.city": "match",
        }),
        callStack: [MAIN],
        comparisons: 4,
        result: true,
        note: "Same two objects. Two different questions, so two different answers.",
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 2. Walking down
// ---------------------------------------------------------------------------

function walkSteps(): ExecutionStep<DeepComparisonStepState>[] {
  const root = (rv?: string) => frame("root", "deepEqual(a, b)", rv);

  return [
    {
      id: "call",
      title: "One call, for the pair as a whole",
      description: "The walk starts with a single question: are these two values equal?",
      activeCodeLines: [12],
      state: {
        phase: "comparing",
        nodes: tree({ "(root)": "visiting" }),
        callStack: [MAIN, root()],
        comparisons: 1,
      },
    },
    {
      id: "guards",
      title: "Three questions before any recursion",
      description:
        "Are they the same value? If so, done. Is either one not an object? Then === already settled it. Is either null? typeof null is \"object\", so that has to be ruled out by hand.",
      whyExplanation:
        "These are the base cases. Without them the function would either recurse forever or crash — the null check in particular, because Object.keys(null) throws.",
      activeCodeLines: [2, 3, 4],
      state: {
        phase: "comparing",
        nodes: tree({ "(root)": "visiting" }),
        callStack: [MAIN, root()],
        comparisons: 1,
      },
    },
    {
      id: "key-count",
      title: "Then check both sides have the same keys",
      description:
        "Both have two. Without this line only x's keys would be walked, so an extra key on y would go unnoticed.",
      activeCodeLines: [6, 7],
      state: {
        phase: "comparing",
        nodes: tree({ "(root)": "visiting" }),
        callStack: [MAIN, root()],
        comparisons: 1,
      },
    },
    {
      id: "descend-name",
      title: "Now recurse — starting with name",
      description:
        "Each key becomes the same question about a smaller pair. This call gets two strings rather than two objects.",
      activeCodeLines: [9],
      state: {
        phase: "descending",
        nodes: tree({ "(root)": "visiting", name: "visiting" }),
        callStack: [MAIN, root(), frame("name", 'deepEqual("Maya", "Maya")')],
        comparisons: 2,
      },
    },
    {
      id: "name-returns",
      title: "It answers on the first line and returns",
      description:
        "Two equal strings satisfy x === y, so this call never reaches the recursion. Most calls in a real walk end here.",
      activeCodeLines: [2],
      state: {
        phase: "returning",
        nodes: tree({ "(root)": "visiting", name: "match" }),
        callStack: [MAIN, root(), frame("name", 'deepEqual("Maya", "Maya")', "true")],
        comparisons: 2,
      },
    },
    {
      id: "descend-address",
      title: "address is a pair of objects, so it goes deeper",
      description:
        "This is the call the shallow check never made. Same function, same three guards, one level further down.",
      activeCodeLines: [9],
      state: {
        phase: "descending",
        nodes: tree({ "(root)": "visiting", name: "match", address: "visiting" }),
        callStack: [MAIN, root(), frame("addr", "deepEqual(a.address, b.address)")],
        comparisons: 3,
      },
    },
    {
      id: "descend-city",
      title: "Which recurses once more, into city",
      description:
        "Three frames deep now. The stack depth is the depth of the data — nothing about the function tracks where it is.",
      whyExplanation:
        "That is why recursion suits this problem: the call stack remembers the path back up for free, so the function only ever has to handle one pair.",
      activeCodeLines: [9],
      state: {
        phase: "descending",
        nodes: tree({
          "(root)": "visiting",
          name: "match",
          address: "visiting",
          "address.city": "visiting",
        }),
        callStack: [MAIN, root(), frame("addr", "deepEqual(a.address, b.address)"), frame("city", 'deepEqual("Chennai", "Chennai")')],
        comparisons: 4,
      },
    },
    {
      id: "unwind",
      title: "true comes back up, one frame at a time",
      description:
        "city returns true, so address's every() finishes true, so the root's every() finishes true.",
      activeCodeLines: [9],
      state: {
        phase: "returning",
        nodes: tree({
          "(root)": "visiting",
          name: "match",
          address: "match",
          "address.city": "match",
        }),
        callStack: [MAIN, root(), frame("addr", "deepEqual(a.address, b.address)", "true")],
        comparisons: 4,
      },
    },
    {
      id: "result",
      title: "true, after exactly four comparisons",
      description:
        "One call per node of the tree: the root, name, address, and address.city. That is the whole cost.",
      whyExplanation:
        "The count is the node count, not the key count — which is why the complexity is linear in the size of the data rather than in its width or its depth alone.",
      activeCodeLines: [12],
      consoleOutput: [{ id: "wa-1", kind: "output", content: "true" }],
      state: {
        phase: "done",
        nodes: tree({
          "(root)": "match",
          name: "match",
          address: "match",
          "address.city": "match",
        }),
        callStack: [MAIN],
        comparisons: 4,
        result: true,
        note: "4 nodes, 4 comparisons. Every node is visited exactly once when the objects match.",
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 3. Where it fails
// ---------------------------------------------------------------------------

function mismatchSteps(): ExecutionStep<DeepComparisonStepState>[] {
  const BANGALORE = '"Bangalore"';

  return [
    {
      id: "pair",
      title: "One value differs, at the bottom",
      description: "Everything above address.city is identical, so nothing at the top level gives it away.",
      activeCodeLines: [1, 2],
      state: {
        phase: "comparing",
        nodes: tree({ "(root)": "visiting" }, BANGALORE),
        callStack: [MAIN],
        comparisons: 0,
      },
    },
    {
      id: "name-ok",
      title: "name matches, so the walk continues",
      description: "every() only carries on while each answer is true — the first false ends it.",
      activeCodeLines: [4],
      state: {
        phase: "descending",
        nodes: tree({ "(root)": "visiting", name: "match", address: "visiting" }, BANGALORE),
        callStack: [MAIN, frame("root", "deepEqual(a, b)"), frame("addr", "deepEqual(a.address, b.address)")],
        comparisons: 3,
      },
    },
    {
      id: "city-differs",
      title: "And two lines down, it finds the difference",
      description:
        '"Chennai" === "Bangalore" is false. Not objects either, so this call returns false immediately.',
      activeCodeLines: [4],
      state: {
        phase: "short-circuit",
        nodes: tree(
          { "(root)": "visiting", name: "match", address: "visiting", "address.city": "mismatch" },
          BANGALORE
        ),
        callStack: [
          MAIN,
          frame("root", "deepEqual(a, b)"),
          frame("addr", "deepEqual(a.address, b.address)"),
          frame("city", 'deepEqual("Chennai", "Bangalore")', "false"),
        ],
        comparisons: 4,
      },
    },
    {
      id: "result",
      title: "One false at any depth makes the whole thing false",
      description:
        "The false travels back up through every frame. There is no partial answer — deep equality is all or nothing.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "mi-1", kind: "output", content: "false" }],
      state: {
        phase: "returning",
        nodes: tree(
          { "(root)": "mismatch", name: "match", address: "mismatch", "address.city": "mismatch" },
          BANGALORE
        ),
        callStack: [MAIN],
        comparisons: 4,
        result: false,
        note: "4 comparisons — the difference was in the last node, so nothing was saved.",
      },
    },
    {
      id: "sub-call",
      title: "The inner call is the same question, on less data",
      description:
        "Calling deepEqual on just the two address objects gives the same false in 2 comparisons instead of 4. That inner call is exactly what the walk above made on its own.",
      whyExplanation:
        "A recursive function has only one case to handle. Every frame in the walk was this same call with a smaller pair — which is also why a difference found early costs so little.",
      activeCodeLines: [5],
      consoleOutput: [{ id: "mi-2", kind: "output", content: "false" }],
      state: {
        phase: "done",
        nodes: [
          { id: "address", path: "address", depth: 0, left: "{ … }", right: "{ … }", status: "mismatch" },
          {
            id: "city",
            path: "address.city",
            depth: 1,
            left: '"Chennai"',
            right: BANGALORE,
            status: "mismatch",
          },
        ],
        callStack: [MAIN],
        comparisons: 2,
        result: false,
        note: "Had name differed instead, the walk would have stopped after 2 comparisons too.",
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 4. All together — where the textbook version breaks
// ---------------------------------------------------------------------------

function allTogetherSteps(): ExecutionStep<DeepComparisonStepState>[] {
  // Each hole compares two whole values rather than a nested shape, so the
  // tree is a single row showing both sides.
  const pair = (left: string, right: string, status: NodeStatus): TreeNode[] => [
    { id: "pair", path: "the two arguments", depth: 0, left, right, status },
  ];

  return [
    {
      id: "naive",
      title: "The version almost everyone writes",
      description:
        "Four lines, and it handles the scenarios above correctly. Two of the guards from the previous tab are missing.",
      whyExplanation:
        "This is the answer most people give under interview pressure, and it is a reasonable starting point. What follows is what an interviewer asks next.",
      activeCodeLines: [1, 2, 3, 4, 5],
      state: {
        phase: "comparing",
        nodes: [],
        callStack: [MAIN],
        comparisons: 0,
      },
    },
    {
      id: "hole-extra-key",
      title: "An extra key on the right goes unnoticed",
      description:
        "Only x's keys are walked, and every one of them matches, so the missing key-count check lets this through as true.",
      activeCodeLines: [7],
      consoleOutput: [{ id: "at-1", kind: "output", content: "true" }],
      state: {
        phase: "returning",
        nodes: pair("{ id: 1 }", "{ id: 1, extra: 2 }", "match"),
        callStack: [MAIN],
        comparisons: 0,
        result: true,
        note: "Two objects that are plainly different, reported as equal.",
      },
    },
    {
      id: "hole-asymmetric",
      title: "And swapping the arguments changes the answer",
      description:
        "The same two objects, the other way round, now report false — because x has a key y lacks and x is the side being walked.",
      whyExplanation:
        "An equality function that depends on argument order is broken in a way that is easy to miss in testing. The key-count guard fixes both this and the case above at once.",
      activeCodeLines: [8],
      consoleOutput: [{ id: "at-2", kind: "output", content: "false" }],
      state: {
        phase: "short-circuit",
        nodes: pair("{ id: 1, extra: 2 }", "{ id: 1 }", "mismatch"),
        callStack: [MAIN],
        comparisons: 0,
        result: false,
        note: "equal(a, b) and equal(b, a) disagree.",
      },
    },
    {
      id: "hole-array",
      title: "An array and an object look the same",
      description:
        "Array indices are just keys, and typeof [] is \"object\", so nothing in the function distinguishes these two.",
      activeCodeLines: [9],
      consoleOutput: [{ id: "at-3", kind: "output", content: "true" }],
      state: {
        phase: "returning",
        nodes: pair("[1, 2]", "{ 0: 1, 1: 2 }", "match"),
        callStack: [MAIN],
        comparisons: 0,
        result: true,
        note: "Fixed by comparing Array.isArray(x) with Array.isArray(y).",
      },
    },
    {
      id: "hole-nan",
      title: "NaN defeats it — and stays defeating it",
      description:
        "The leaf comparison is ===, and NaN === NaN is false. Two objects holding the same NaN are reported as different.",
      whyExplanation:
        "This one is not fixed by any of the guards, because it is not a hole in the walk — it is the base case doing exactly what === does. Switching the leaf check to Object.is is the repair.",
      activeCodeLines: [10],
      consoleOutput: [{ id: "at-4", kind: "output", content: "false" }],
      state: {
        phase: "returning",
        nodes: pair("{ n: NaN }", "{ n: NaN }", "mismatch"),
        callStack: [MAIN],
        comparisons: 0,
        result: false,
      },
    },
    {
      id: "hole-null",
      title: "And null does not return anything at all",
      description:
        "typeof null is \"object\", so null slips past the primitive guard and reaches Object.keys(null), which throws.",
      activeCodeLines: [11],
      consoleOutput: [
        {
          id: "at-5",
          kind: "error",
          content: "TypeError: Cannot convert undefined or null to object",
        },
      ],
      state: {
        phase: "done",
        nodes: pair("null", "{ id: 1 }", "mismatch"),
        callStack: [MAIN],
        comparisons: 0,
        note: "Three lines repair four of these: the key-count check, x === null || y === null, and Array.isArray(x) !== Array.isArray(y). NaN needs Object.is at the leaf.",
      },
    },
  ];
}

export function buildInitialSteps({
  scenario,
}: DeepComparisonInputs): ExecutionStep<DeepComparisonStepState>[] {
  if (scenario === "shallow-vs-deep") return shallowVsDeepSteps();
  if (scenario === "walk") return walkSteps();
  if (scenario === "mismatch") return mismatchSteps();
  return allTogetherSteps();
}
