import type { ExecutionStep } from "@/lib/execution/types";
import type { RangeDirection, RangeInputs, RangeLineItem, RangeStepState } from "./types";

const MAX_ITEMS = 100;

function comparator(direction: RangeDirection): "<" | ">" {
  return direction === "up" ? "<" : ">";
}

function snapshotLine(line: RangeLineItem[], includedThrough: number): RangeLineItem[] {
  return line.map((item, index) => ({
    ...item,
    status: item.isBoundary ? item.status : index <= includedThrough ? "included" : "pending",
  }));
}

export function buildInitialSteps({ start, end, step }: RangeInputs): ExecutionStep<RangeStepState>[] {
  const direction: RangeDirection = step >= 0 ? "up" : "down";
  const cmp = comparator(direction);

  const included: number[] = [];
  let capped = false;
  if (step !== 0) {
    let value = start;
    while (direction === "up" ? value < end : value > end) {
      included.push(value);
      if (included.length >= MAX_ITEMS) {
        capped = true;
        break;
      }
      value += step;
    }
  }

  const line: RangeLineItem[] = [
    ...included.map((value) => ({ value, status: "pending" as const })),
    { value: end, status: "pending" as const, isBoundary: true },
  ];

  const steps: ExecutionStep<RangeStepState>[] = [];

  steps.push({
    id: "call",
    title: "range() starts",
    description: `range(${start}, ${end}, ${step}) provides start = ${start}, end = ${end}, step = ${step}.`,
    whyExplanation: `start is the first value, end is the excluded boundary, and step is added after every collected value.`,
    activeCodeLines: [1, 2, 3, 24],
    state: {
      line: snapshotLine(line, -1),
      result: [],
      currentValue: null,
      boundaryCheck: null,
      isFinal: false,
      direction,
      capped: false,
    },
  });

  steps.push({
    id: "init",
    title: "Create the result and current value",
    description: `result = []. value starts at ${start}.`,
    whyExplanation: "The function builds a brand-new array rather than modifying anything that already exists.",
    activeCodeLines: [10, 11, 12],
    state: {
      line: snapshotLine(line, -1),
      result: [],
      currentValue: start,
      boundaryCheck: null,
      isFinal: false,
      direction,
      capped: false,
    },
  });

  const result: number[] = [];
  for (let i = 0; i < included.length; i++) {
    const value = included[i];
    const next = value + step;
    result.push(value);
    steps.push({
      id: `check-${value}`,
      title: `Check ${value} and collect it`,
      description: `${value} ${cmp} ${end} is true, so push ${value}. Then advance to ${next}.`,
      whyExplanation: "Every value that passes the boundary check gets collected, then the loop moves on by step.",
      activeCodeLines: [14, 15, 16, 17, 18],
      state: {
        line: snapshotLine(line, i),
        result: [...result],
        currentValue: value,
        boundaryCheck: { expression: `${value} ${cmp} ${end}`, result: true },
        isFinal: false,
        direction,
        capped: false,
      },
    });
  }

  const boundaryLine = line.map((item) => (item.isBoundary ? { ...item, status: "excluded" as const } : { ...item, status: "included" as const }));

  let emptyReason: string | undefined;
  if (result.length === 0) {
    emptyReason =
      start === end
        ? `start (${start}) already equals the end boundary (${end}), so nothing is collected.`
        : `the step moves away from the end boundary, so the range never advances toward ${end}.`;
  }

  if (capped) {
    steps.push({
      id: "boundary",
      title: "Stop at the output limit",
      description: `The generated range reached the ${MAX_ITEMS}-item limit, so playback stops here.`,
      whyExplanation: "A hard cap keeps this interactive walkthrough safe even for very large requested ranges.",
      activeCodeLines: [14, 15, 16],
      state: {
        line: boundaryLine,
        result: [...result],
        currentValue: result[result.length - 1],
        boundaryCheck: null,
        isFinal: false,
        direction,
        capped: true,
      },
    });
  } else {
    const candidate = start + included.length * step;
    steps.push({
      id: "boundary",
      title: "Reach the boundary",
      description: `${candidate} ${cmp} ${end} is false. Do not push ${end}.${emptyReason ? ` ${emptyReason}` : ""}`,
      whyExplanation: "The end boundary is checked but never collected — that's what makes it excluded.",
      activeCodeLines: [14, 15, 16],
      state: {
        line: boundaryLine,
        result: [...result],
        currentValue: candidate,
        boundaryCheck: { expression: `${candidate} ${cmp} ${end}`, result: false },
        isFinal: false,
        direction,
        capped: false,
      },
    });
  }

  steps.push({
    id: "return",
    title: "Return the result",
    description: `Return [${result.join(", ")}] as a new array.${capped ? ` Only the first ${MAX_ITEMS} items are shown.` : ""}`,
    whyExplanation: "The original inputs are never changed — range() only ever builds and returns a new array.",
    activeCodeLines: [21],
    state: {
      line: boundaryLine,
      result: [...result],
      currentValue: null,
      boundaryCheck: capped
        ? null
        : { expression: `${start + included.length * step} ${cmp} ${end}`, result: false },
      isFinal: true,
      direction,
      capped,
    },
  });

  return steps;
}
