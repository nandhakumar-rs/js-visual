/** Tree shapes offered by the picker, as `depth×breadth`. */
export type TreeSize = "2x2" | "3x2" | "3x3" | "4x3";

/** Where the two trees are made to differ. */
export type DifferAt = "nowhere" | "first" | "deepest";

export const SIZE_LABEL: Record<TreeSize, string> = {
  "2x2": "2 × 2",
  "3x2": "3 × 2",
  "3x3": "3 × 3",
  "4x3": "4 × 3",
};

export const DIFFER_LABEL: Record<DifferAt, string> = {
  nowhere: "Nowhere",
  first: "First key",
  deepest: "Deepest leaf",
};

const SHAPE: Record<TreeSize, { depth: number; breadth: number }> = {
  "2x2": { depth: 2, breadth: 2 },
  "3x2": { depth: 3, breadth: 2 },
  "3x3": { depth: 3, breadth: 3 },
  "4x3": { depth: 4, breadth: 3 },
};

type Value = number | string | { [key: string]: Value };

function build(depth: number, breadth: number): Value {
  if (depth === 0) return 1;
  const node: { [key: string]: Value } = {};
  for (let i = 0; i < breadth; i++) node["k" + i] = build(depth - 1, breadth);
  return node;
}

/**
 * Node count, computed from the shape rather than by walking the tree, so it is
 * an independent number to check the measured comparison count against.
 */
export function nodeCount(size: TreeSize): number {
  const { depth, breadth } = SHAPE[size];
  let total = 1;
  let level = 1;
  for (let i = 1; i <= depth; i++) {
    level *= breadth;
    total += level;
  }
  return total;
}

function withDifference(tree: Value, where: DifferAt, size: TreeSize): Value {
  const { depth, breadth } = SHAPE[size];
  const copy = structuredClone(tree) as { [key: string]: Value };
  if (where === "nowhere") return copy;
  if (where === "first") {
    copy.k0 = "DIFFERENT";
    return copy;
  }
  // Walk down the last branch and change the very last leaf.
  let node = copy;
  for (let i = 0; i < depth - 1; i++) node = node["k" + (breadth - 1)] as { [key: string]: Value };
  node["k" + (breadth - 1)] = 2;
  return copy;
}

/** The guarded deepEqual from the lesson, with one increment per call. */
function counted(x: Value, y: Value, c: { n: number }): boolean {
  c.n++;
  if (x === y) return true;
  if (typeof x !== "object" || typeof y !== "object") return false;
  if (x === null || y === null) return false;
  const keys = Object.keys(x);
  if (keys.length !== Object.keys(y).length) return false;
  return keys.every((key) => counted(x[key], y[key], c));
}

export interface RunResult {
  result: boolean;
  comparisons: number;
  nodes: number;
}

/**
 * Builds both trees and runs the real function over them, counting its calls.
 * Nothing here is looked up: the comparison count is whatever the walk did.
 */
export function runCase(size: TreeSize, where: DifferAt): RunResult {
  const { depth, breadth } = SHAPE[size];
  const a = build(depth, breadth);
  const b = withDifference(a, where, size);
  const c = { n: 0 };
  const result = counted(a, b, c);
  return { result, comparisons: c.n, nodes: nodeCount(size) };
}

export function buildCode(size: TreeSize, where: DifferAt): string[] {
  const { depth, breadth } = SHAPE[size];
  const lines = [
    `// depth ${depth}, ${breadth} keys per level — ${nodeCount(size)} values in all`,
    `const a = buildTree(${depth}, ${breadth});`,
    "const b = buildTree(" + depth + ", " + breadth + ");",
  ];

  if (where === "first") lines.push('b.k0 = "DIFFERENT";');
  if (where === "deepest") {
    const path = Array.from({ length: depth }, () => `k${breadth - 1}`).join(".");
    lines.push(`b.${path} = 2;`);
  }

  lines.push("", "deepEqual(a, b);");
  return lines;
}
