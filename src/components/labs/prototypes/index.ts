import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { PrototypesControls } from "./PrototypesControls";
import { PrototypesVisualization } from "./PrototypesVisualization";
import type { PrototypesInputs, PrototypesStepState } from "./types";

export const prototypesLab: LabDefinition<PrototypesInputs, PrototypesStepState> = {
  slug: "prototypes",
  mode: "scripted",
  defaultInputs: { property: "greet" },
  getCode,
  buildInitialSteps,
  Controls: PrototypesControls,
  Visualization: PrototypesVisualization,
  prediction: {
    code: ["maya.toString();"],
    options: [
      { id: "found-own", label: "Found directly on maya" },
      { id: "found-proto", label: "Found further up the prototype chain" },
      { id: "error", label: "TypeError — toString doesn't exist" },
    ],
    correctOptionId: "found-proto",
    explanation:
      "maya doesn't have its own toString — JavaScript keeps walking up the prototype chain until it finds one on Object.prototype, which every object inherits from.",
  },
  challenge: {
    question: "When you access maya.greet(), where does JavaScript actually find greet?",
    options: [
      { id: "a", label: "As maya's own property" },
      { id: "b", label: "On Employee.prototype, via the prototype chain" },
      { id: "c", label: "It gets recreated fresh for every instance" },
    ],
    correctOptionId: "b",
    explanation:
      "Methods defined in a class body live on the prototype, shared by every instance. maya's own property lookup fails first, then the chain finds greet on Employee.prototype.",
  },
  remember:
    "When a property isn't found directly on an object, JavaScript walks up its [[Prototype]] chain until it's found or the chain ends at null — that's how methods are shared without being copied onto every instance.",
};
