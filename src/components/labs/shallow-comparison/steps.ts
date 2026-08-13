import type { ExecutionStep } from "@/lib/execution/types";
import type {
  Comparison,
  HeapObject,
  ShallowComparisonInputs,
  ShallowComparisonStepState,
} from "./types";

// Every result asserted below was observed by running the exact program from
// code.ts, not predicted. See the lesson's verification script.

const bool = (v: boolean) => ({ kind: "output" as const, content: String(v) });

/** The flat pair used by the first two scenarios. */
function flat(id: string, tag: string, isActive?: boolean): HeapObject {
  return {
    id,
    tag,
    isActive,
    entries: [
      { key: "id", displayValue: "1" },
      { key: "city", displayValue: '"Chennai"' },
    ],
  };
}

function comparison(id: string, label: string, result: boolean, note?: string): Comparison {
  return { id, label, result, note };
}

// ---------------------------------------------------------------------------
// 1. Same contents
// ---------------------------------------------------------------------------

function lookAlikesSteps(): ExecutionStep<ShallowComparisonStepState>[] {
  const eqAB = comparison("ab", "a === b", false, "Two objects, so two identities.");
  const eqAC = comparison("ac", "a === c", true, "One object with two names.");

  return [
    {
      id: "create-a",
      title: "The first object is created",
      description:
        "The literal makes an object, and a is a name that leads to it. The Values & References lesson called this the reference.",
      activeCodeLines: [1],
      state: {
        phase: "bindings",
        objects: [flat("o1", "#1", true)],
        bindings: [{ name: "a", target: "o1" }],
        comparisons: [],
      },
    },
    {
      id: "create-b",
      title: "The second literal makes a second object",
      description:
        "Identical contents, typed identically — and still a separate object, with its own identity.",
      whyExplanation:
        "Every object literal that runs creates a new object. Two literals can never produce the same one, however alike they look.",
      activeCodeLines: [2],
      state: {
        phase: "bindings",
        objects: [flat("o1", "#1"), flat("o2", "#2", true)],
        bindings: [
          { name: "a", target: "o1" },
          { name: "b", target: "o2" },
        ],
        comparisons: [],
        note: "Same contents on screen. Different tags in memory.",
      },
    },
    {
      id: "alias-c",
      title: "c makes no object at all",
      description:
        "Assigning a copies the reference, not the object. There is no third box — just a third name for the first one.",
      activeCodeLines: [3],
      state: {
        phase: "bindings",
        objects: [flat("o1", "#1", true), flat("o2", "#2")],
        bindings: [
          { name: "a", target: "o1" },
          { name: "c", target: "o1" },
          { name: "b", target: "o2" },
        ],
        comparisons: [],
      },
    },
    {
      id: "compare-ab",
      title: "What === actually looks at",
      description:
        "For objects, === does not read any properties. It asks a single question: are these two names leading to the same object?",
      whyExplanation:
        "This is the whole lesson. Contents never enter into it — the comparison is about identity, and it is decided before a single key is read.",
      activeCodeLines: [5],
      state: {
        phase: "comparing",
        objects: [flat("o1", "#1", true), flat("o2", "#2", true)],
        bindings: [
          { name: "a", target: "o1" },
          { name: "c", target: "o1" },
          { name: "b", target: "o2" },
        ],
        comparisons: [],
      },
    },
    {
      id: "result-ab",
      title: "a === b is false",
      description: "#1 and #2 are different objects, so the answer is false — identical contents or not.",
      activeCodeLines: [5],
      consoleOutput: [{ id: "la-1", ...bool(false) }],
      state: {
        phase: "verdict",
        objects: [flat("o1", "#1"), flat("o2", "#2")],
        bindings: [
          { name: "a", target: "o1" },
          { name: "c", target: "o1" },
          { name: "b", target: "o2" },
        ],
        comparisons: [eqAB],
      },
    },
    {
      id: "result-ac",
      title: "a === c is true",
      description: "Both names lead to #1, so this is the same object compared with itself.",
      whyExplanation:
        "Nothing about c's contents made this true — only that no second object was ever created. Sharing is the only way two names compare equal.",
      activeCodeLines: [6],
      consoleOutput: [{ id: "la-2", ...bool(true) }],
      state: {
        phase: "done",
        objects: [flat("o1", "#1", true), flat("o2", "#2")],
        bindings: [
          { name: "a", target: "o1" },
          { name: "c", target: "o1" },
          { name: "b", target: "o2" },
        ],
        comparisons: [eqAB, eqAC],
        note: "Look-alikes: false. The same object: true.",
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 2. Key by key
// ---------------------------------------------------------------------------

function shallowSteps(): ExecutionStep<ShallowComparisonStepState>[] {
  const objects = [flat("o1", "#1"), flat("o2", "#2")];
  const bindings = [
    { name: "a", target: "o1" },
    { name: "b", target: "o2" },
  ];
  const idEq = comparison("id", "a.id === b.id", true, "Numbers are compared by value.");
  const cityEq = comparison("city", "a.city === b.city", true, "Strings are compared by value.");
  const result = comparison("result", "shallowEqual(a, b)", true);

  return [
    {
      id: "objects",
      title: "Still two separate objects",
      description:
        "Nothing has changed about identity — a === b would be false here too. The question is what a useful comparison would do instead.",
      activeCodeLines: [1, 2],
      state: { phase: "bindings", objects, bindings, comparisons: [] },
    },
    {
      id: "keys",
      title: "Take the first object's own keys",
      description:
        "Object.keys gives the own, enumerable keys — id and city. Those are the only things this check will look at.",
      whyExplanation:
        "Own keys only: anything inherited from a prototype is not walked, which is why this matches what people mean by an object's data.",
      activeCodeLines: [5],
      state: { phase: "comparing", objects, bindings, comparisons: [] },
    },
    {
      id: "length-guard",
      title: "Both objects have the same number of keys",
      description:
        "Without this line the check would only walk x's keys, so an extra key on y would go unnoticed and two different objects would report equal.",
      activeCodeLines: [6],
      state: { phase: "comparing", objects, bindings, comparisons: [] },
    },
    {
      id: "compare-id",
      title: "a.id === b.id",
      description: "1 === 1. A number is a primitive, so this compares the values themselves.",
      activeCodeLines: [7],
      state: { phase: "comparing", objects, bindings, comparisons: [idEq] },
    },
    {
      id: "compare-city",
      title: "a.city === b.city",
      description: '"Chennai" === "Chennai". Strings are primitives too, so again the values are compared.',
      whyExplanation:
        "=== behaves in two ways depending on what it is given: primitives by value, objects by identity. Every surprise in this lesson comes from that split.",
      activeCodeLines: [7],
      state: { phase: "comparing", objects, bindings, comparisons: [idEq, cityEq] },
    },
    {
      id: "result",
      title: "shallowEqual(a, b) is true",
      description:
        "Every key matched, so two different objects are reported as equal — which is usually what you wanted.",
      activeCodeLines: [10],
      consoleOutput: [{ id: "sh-1", ...bool(true) }],
      state: {
        phase: "done",
        objects,
        bindings,
        comparisons: [idEq, cityEq, result],
        note: "This worked because every value was a primitive. The next tab changes one of them.",
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 3. Where it stops
// ---------------------------------------------------------------------------

function nestedSteps(): ExecutionStep<ShallowComparisonStepState>[] {
  const outer = (id: string, tag: string, addressTag: string, isActive?: boolean): HeapObject => ({
    id,
    tag,
    isActive,
    entries: [
      { key: "id", displayValue: "1" },
      { key: "address", displayValue: addressTag, isReference: true },
    ],
  });
  const address = (id: string, tag: string, isActive?: boolean): HeapObject => ({
    id,
    tag,
    isActive,
    entries: [{ key: "city", displayValue: '"Chennai"' }],
  });

  const objects = [outer("o1", "#1", "#3"), address("o3", "#3"), outer("o2", "#2", "#4"), address("o4", "#4")];
  // A nested object has no variable of its own, but `a.address` is a real way
  // to reach it — naming the path is more use than leaving the box unlabelled.
  const bindings = [
    { name: "a", target: "o1" },
    { name: "a.address", target: "o3" },
    { name: "b", target: "o2" },
    { name: "b.address", target: "o4" },
  ];
  const idEq = comparison("id", "a.id === b.id", true, "A primitive, compared by value.");
  const addrEq = comparison("addr", "a.address === b.address", false, "#3 and #4 are different objects.");
  const result = comparison("result", "shallowEqual(a, b)", false);

  return [
    {
      id: "objects",
      title: "The same pair, with one value moved inside an object",
      description: "id is still a number, but city now lives in a nested address object.",
      activeCodeLines: [1, 2],
      state: { phase: "bindings", objects, bindings, comparisons: [] },
    },
    {
      id: "nested-objects",
      title: "That is four objects, not two",
      description:
        "Each address literal made its own object. #1 holds a reference to #3, and #2 holds a reference to #4.",
      whyExplanation:
        "A nested object is not stored inside its parent — the parent holds a reference to it, exactly like a variable does. So nesting multiplies identities.",
      activeCodeLines: [1, 2],
      state: {
        phase: "bindings",
        objects: [
          outer("o1", "#1", "#3"),
          address("o3", "#3", true),
          outer("o2", "#2", "#4"),
          address("o4", "#4", true),
        ],
        bindings,
        comparisons: [],
        note: "Two outer objects, and two more inside them.",
      },
    },
    {
      id: "compare-id",
      title: "a.id === b.id is true",
      description: "Unchanged from the previous tab — a primitive compared by value.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "ne-1", ...bool(true) }],
      state: { phase: "comparing", objects, bindings, comparisons: [idEq] },
    },
    {
      id: "compare-address",
      title: "a.address === b.address is false",
      description:
        "This is the same === from the very first tab, applied one level down: it asks which object, and the answer is two different ones.",
      whyExplanation:
        "Nothing special happens at a nested value. The comparison does not descend into it — it compares the reference the parent is holding.",
      activeCodeLines: [5],
      consoleOutput: [{ id: "ne-2", ...bool(false) }],
      state: {
        phase: "nested-check",
        objects: [outer("o1", "#1", "#3", true), address("o3", "#3", true), outer("o2", "#2", "#4", true), address("o4", "#4", true)],
        bindings,
        comparisons: [idEq, addrEq],
      },
    },
    {
      id: "result",
      title: "So shallowEqual(a, b) is false",
      description:
        "One key matched and one did not, and the check stops there. It never reads city on either side.",
      activeCodeLines: [6],
      consoleOutput: [{ id: "ne-3", ...bool(false) }],
      state: {
        phase: "done",
        objects,
        bindings,
        comparisons: [idEq, addrEq, result],
        note: "Shallow means one level. Going deeper is the next lesson.",
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// 4. All together
// ---------------------------------------------------------------------------

function allTogetherSteps(): ExecutionStep<ShallowComparisonStepState>[] {
  const user = (isActive?: boolean): HeapObject => ({
    id: "user",
    tag: "#1",
    isActive,
    entries: [
      { key: "id", displayValue: "1" },
      { key: "tags", displayValue: "#2", isReference: true },
    ],
  });
  const tags = (isActive?: boolean): HeapObject => ({
    id: "tags",
    tag: "#2",
    isActive,
    entries: [{ key: "0", displayValue: '"admin"' }],
  });
  // The argument literal creates two objects, not one — its own array included.
  const lookAlike: HeapObject = {
    id: "look",
    tag: "#3",
    isActive: true,
    entries: [
      { key: "id", displayValue: "1" },
      { key: "tags", displayValue: "#4", isReference: true },
    ],
  };
  const lookAlikeTags: HeapObject = {
    id: "look-tags",
    tag: "#4",
    isActive: true,
    entries: [{ key: "0", displayValue: '"admin"' }],
  };
  const copy = (isActive?: boolean): HeapObject => ({
    id: "copy",
    tag: "#5",
    isActive,
    entries: [
      { key: "id", displayValue: "1" },
      { key: "tags", displayValue: "#2", isReference: true },
    ],
  });

  const base = [
    { name: "user", target: "user" },
    { name: "users[0]", target: "user" },
    { name: "user.tags", target: "tags" },
  ];
  // Two names on the one tags box is the picture the whole capstone builds to.
  const withCopy = [
    ...base,
    { name: "copy", target: "copy" },
    { name: "copy.tags", target: "tags" },
  ];

  const missed = comparison("missed", "users.includes(lookAlike)", false, "Nothing in the array is that object.");
  const found = comparison("found", "users.includes(user)", true, "The array holds this exact object.");
  const copyEq = comparison("copy", "copy === user", false, "Spread produced a new object.");
  const tagsEq = comparison("tags", "copy.tags === user.tags", true, "The nested array was not copied.");
  const updated = comparison("updated", "shallowEqual(user, { ...user, id: 2 })", false, "id differs.");

  return [
    {
      id: "setup",
      title: "One user object, held in an array",
      description:
        "users does not contain a copy of the user. It holds the same reference, so the array and the variable lead to #1.",
      activeCodeLines: [1, 2],
      state: {
        phase: "bindings",
        objects: [user(true), tags()],
        bindings: base,
        comparisons: [],
      },
    },
    {
      id: "includes-lookalike",
      title: "Searching with a look-alike finds nothing",
      description:
        "The literal in the argument creates a brand-new object at the moment of the call. includes compares by identity, so it never matches #1.",
      whyExplanation:
        "includes, indexOf and Set membership all compare the way === does. Passing an object that merely looks right is the most common way this lesson bites in real code.",
      activeCodeLines: [4],
      consoleOutput: [{ id: "at-1", ...bool(false) }],
      state: {
        phase: "comparing",
        objects: [user(), tags(), lookAlike, lookAlikeTags],
        bindings: base,
        comparisons: [missed],
        note: "#3 and #4 were created by the argument itself, and thrown away straight after.",
      },
    },
    {
      id: "includes-user",
      title: "Searching with the object itself finds it",
      description: "Same array, same method — the only difference is that this really is #1.",
      activeCodeLines: [5],
      consoleOutput: [{ id: "at-2", ...bool(true) }],
      state: {
        phase: "comparing",
        objects: [user(true), tags()],
        bindings: base,
        comparisons: [missed, found],
      },
    },
    {
      id: "copy",
      title: "Spread makes a new outer object",
      description:
        "copy is #5, not #1, so copy === user is false. That much is the point of spreading.",
      activeCodeLines: [7, 8],
      consoleOutput: [{ id: "at-3", ...bool(false) }],
      state: {
        phase: "nested-check",
        objects: [user(), tags(), copy(true)],
        bindings: withCopy,
        comparisons: [missed, found, copyEq],
      },
    },
    {
      id: "shared-tags",
      title: "But the nested array is still shared",
      description:
        "Spread copied the values of user's own keys — and the value of tags is a reference. Both objects hold the same #2.",
      whyExplanation:
        "This is what shallow copy means, and why pushing to copy.tags would change what user.tags shows. The new object is genuinely new; what is inside it is not.",
      activeCodeLines: [9],
      consoleOutput: [{ id: "at-4", ...bool(true) }],
      state: {
        phase: "nested-check",
        objects: [user(true), tags(true), copy(true)],
        bindings: withCopy,
        comparisons: [missed, found, copyEq, tagsEq],
        note: "A new box on the outside, the same box on the inside.",
      },
    },
    {
      id: "shallow-updated",
      title: "And a shallow check sees the change that matters",
      description:
        "{ ...user, id: 2 } differs from user at one key, so the check reports false — without ever looking inside tags.",
      activeCodeLines: [11],
      consoleOutput: [{ id: "at-5", ...bool(false) }],
      state: {
        phase: "done",
        objects: [user(), tags(), copy()],
        bindings: withCopy,
        comparisons: [missed, found, copyEq, tagsEq, updated],
        note: "Identity decides lookups. A shallow check decides whether anything changed — one level down.",
      },
    },
  ];
}

export function buildInitialSteps({
  scenario,
}: ShallowComparisonInputs): ExecutionStep<ShallowComparisonStepState>[] {
  if (scenario === "look-alikes") return lookAlikesSteps();
  if (scenario === "shallow") return shallowSteps();
  if (scenario === "nested") return nestedSteps();
  return allTogetherSteps();
}
