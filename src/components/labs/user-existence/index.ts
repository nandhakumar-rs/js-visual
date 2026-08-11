import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { UserExistenceControls } from "./UserExistenceControls";
import { UserExistenceVisualization } from "./UserExistenceVisualization";
import type { UserExistenceInputs, UserExistenceStepState } from "./types";

export const userExistenceLab: LabDefinition<UserExistenceInputs, UserExistenceStepState> = {
  slug: "user-existence",
  mode: "scripted",
  defaultInputs: { users: ["Alex", "Maya", "John", "Priya"], searchName: "Priya", method: "find" },
  getCode,
  buildInitialSteps,
  Controls: UserExistenceControls,
  Visualization: UserExistenceVisualization,
  challenge: {
    question: "Match each method to what it returns when searching an array:",
    options: [
      { id: "a", label: "some() → boolean, find() → element, findIndex() → number" },
      { id: "b", label: "some() → element, find() → boolean, findIndex() → number" },
      { id: "c", label: "all three return the same thing" },
    ],
    correctOptionId: "a",
    explanation:
      "some() answers \"does a match exist?\" (true/false). find() hands back the matching element itself (or undefined). findIndex() hands back its position (or -1).",
  },
  remember:
    "some() returns a boolean, find() returns the matching element (or undefined), and findIndex() returns the matching index (or -1) — pick based on what you actually need back.",
};
