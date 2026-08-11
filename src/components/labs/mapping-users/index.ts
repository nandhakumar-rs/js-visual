import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { MappingUsersControls } from "./MappingUsersControls";
import { MappingUsersVisualization } from "./MappingUsersVisualization";
import type { MappingInputs, MappingStepState } from "./types";

export const mappingUsersLab: LabDefinition<MappingInputs, MappingStepState> = {
  slug: "mapping-users",
  mode: "scripted",
  defaultInputs: {
    users: [
      { id: "u1", name: "Alex", age: 20 },
      { id: "u2", name: "Maya", age: 22 },
      { id: "u3", name: "John", age: 19 },
    ],
    property: "name",
  },
  getCode,
  buildInitialSteps,
  Controls: MappingUsersControls,
  Visualization: MappingUsersVisualization,
  prediction: {
    code: [
      'const users = [{ name: "Alex" }, { name: "Maya" }];',
      "const result = users.map(user => user.name);",
      "console.log(users.length, result.length);",
    ],
    options: [
      { id: "same-array", label: "result is the same array as users" },
      { id: "new-array", label: "result is a brand new array" },
      { id: "error", label: "TypeError" },
    ],
    correctOptionId: "new-array",
    explanation:
      "map() always builds and returns a new array — it never modifies or reuses the original array's reference.",
  },
  challenge: {
    question: "Does .map() change the original array it's called on?",
    options: [
      { id: "yes", label: "Yes, it mutates it in place" },
      { id: "no", label: "No, it returns a new array" },
    ],
    correctOptionId: "no",
    explanation:
      "map() reads each element and collects new return values into a brand new array — the original array is left completely unchanged.",
  },
  remember: "array.map() builds a new array by transforming every element with a callback — it never mutates the original array.",
};
