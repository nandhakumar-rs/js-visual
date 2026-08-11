import type { ExecutionStep } from "@/lib/execution/types";
import type { ImmutableArrayInputs, ImmutableArrayStepState } from "./types";

export function buildInitialSteps({ mode, newValue }: ImmutableArrayInputs): ExecutionStep<ImmutableArrayStepState>[] {
  const base = [1, 2, 3];

  if (mode === "push") {
    return [
      {
        id: "seed",
        title: "array created",
        description: "array points to a single array object in memory: [1, 2, 3].",
        activeCodeLines: [1],
        state: { array: base, sameReference: true },
      },
      {
        id: "push",
        title: `array.push(${newValue})`,
        description: `push() adds ${newValue} to the SAME array object and returns the new length — array itself now has 4 items.`,
        whyExplanation:
          "push() mutates the array in place. There's still only one array object; array just has more items in it now than before.",
        activeCodeLines: [2],
        state: { array: [...base, newValue], sameReference: true },
      },
      {
        id: "log",
        title: "console.log(array)",
        description: `array now logs [${[...base, newValue].join(", ")}] — the original array was changed.`,
        activeCodeLines: [4],
        consoleOutput: [
          { id: "log-1", kind: "command", content: "console.log(array)" },
          { id: "log-2", kind: "output", content: `[${[...base, newValue].join(", ")}]` },
        ],
        state: { array: [...base, newValue], sameReference: true },
      },
    ];
  }

  const newArray = [...base, newValue];
  return [
    {
      id: "seed",
      title: "array created",
      description: "array points to a single array object in memory: [1, 2, 3].",
      activeCodeLines: [1],
      state: { array: base, sameReference: true },
    },
    {
      id: "spread",
      title: `[...array, ${newValue}]`,
      description: `The spread operator copies every element of array into a brand new array, then adds ${newValue}. array itself is never touched.`,
      whyExplanation:
        "Spreading into a new array literal creates a completely new array object. newArray and array are now two separate objects that happen to share some values.",
      activeCodeLines: [2],
      state: { array: base, newArray, sameReference: false },
    },
    {
      id: "log",
      title: "console.log(array, newArray)",
      description: `array is still [${base.join(", ")}]; newArray is [${newArray.join(", ")}].`,
      activeCodeLines: [4],
      consoleOutput: [
        { id: "log-1", kind: "command", content: "console.log(array, newArray)" },
        { id: "log-2", kind: "output", content: `[${base.join(", ")}] [${newArray.join(", ")}]` },
      ],
      state: { array: base, newArray, sameReference: false },
    },
  ];
}
