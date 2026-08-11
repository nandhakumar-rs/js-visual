import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { PromiseAllControls } from "./PromiseAllControls";
import { PromiseAllVisualization } from "./PromiseAllVisualization";
import type { PromiseAllInputs, PromiseAllStepState } from "./types";

export const promiseAllLab: LabDefinition<PromiseAllInputs, PromiseAllStepState> = {
  slug: "promise-all",
  mode: "scripted",
  defaultInputs: { statusesFail: false },
  getCode,
  buildInitialSteps,
  Controls: PromiseAllControls,
  Visualization: PromiseAllVisualization,
  challenge: {
    question: "Promise.all([getUsers(), getStatuses()]) — if getUsers() succeeds but getStatuses() rejects, what happens?",
    options: [
      { id: "a", label: "Promise.all() resolves with just the users result" },
      { id: "b", label: "Promise.all() rejects immediately with getStatuses()'s error" },
      { id: "c", label: "Promise.all() waits forever" },
    ],
    correctOptionId: "b",
    explanation:
      "Promise.all() is all-or-nothing — the moment any input promise rejects, Promise.all() immediately rejects with that reason, discarding any other results (even ones that already succeeded).",
  },
  remember:
    "Promise.all() runs promises concurrently and resolves with an array of all their results once EVERY one fulfills — or rejects immediately with the first rejection if any of them fail.",
};
