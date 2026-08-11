import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { ClassesControls } from "./ClassesControls";
import { ClassesVisualization } from "./ClassesVisualization";
import type { ClassesInputs, ClassesStepState } from "./types";

export const classesLab: LabDefinition<ClassesInputs, ClassesStepState> = {
  slug: "classes",
  mode: "scripted",
  defaultInputs: { name: "Maya", showInheritance: true },
  getCode,
  buildInitialSteps,
  Controls: ClassesControls,
  Visualization: ClassesVisualization,
  challenge: {
    question: "class Manager extends Employee { constructor(name, team) { super(name); this.team = team; } }\n\nWhat does super(name) do?",
    options: [
      { id: "a", label: "Calls Employee's constructor with this already bound to the new instance" },
      { id: "b", label: "Creates a brand new, separate Employee object" },
      { id: "c", label: "Does nothing unless Employee also has a super() call" },
    ],
    correctOptionId: "a",
    explanation:
      "super(...) delegates to the parent class's constructor, running it against the SAME instance being constructed — that's why this.name is available afterward.",
  },
  remember:
    "Class methods live on the shared prototype, not copied per instance. extends wires up the prototype chain, and super() must run before using `this` in a subclass constructor.",
};
