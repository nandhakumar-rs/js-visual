import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ModulesControls } from "./ModulesControls";
import { ModulesVisualization } from "./ModulesVisualization";
import type { ModulesInputs, ModulesStepState } from "./types";

export const modulesLab: LabDefinition<ModulesInputs, ModulesStepState> = {
  slug: "modules",
  mode: "scripted",
  defaultInputs: { exportStyle: "named" },
  getCode,
  buildInitialSteps,
  Controls: ModulesControls,
  Visualization: ModulesVisualization,
  challenge: {
    question: "A module can have how many default exports?",
    options: [
      { id: "0", label: "0" },
      { id: "1", label: "1" },
      { id: "many", label: "As many as it wants" },
    ],
    correctOptionId: "1",
    explanation:
      "A module can have any number of named exports, but at most one default export — that's why `import add from \"./math.js\"` doesn't need curly braces.",
  },
  remember:
    "Named exports (export const x) are imported with { x }; a default export (export default x) is imported without braces, under any local name you choose. Modern JS uses ES modules; older Node code uses CommonJS's require()/module.exports instead.",
};
