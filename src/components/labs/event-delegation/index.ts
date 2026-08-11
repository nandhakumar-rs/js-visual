import type { LabDefinition } from "@/types/lab";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { EventDelegationControls } from "./EventDelegationControls";
import { EventDelegationVisualization } from "./EventDelegationVisualization";
import type { EventDelegationInputs, EventDelegationStepState } from "./types";

export const eventDelegationLab: LabDefinition<EventDelegationInputs, EventDelegationStepState> = {
  slug: "event-delegation",
  mode: "interactive",
  defaultInputs: { mode: "delegation", itemCount: 20 },
  getCode,
  buildInitialSteps,
  Controls: EventDelegationControls,
  Visualization: EventDelegationVisualization,
  challenge: {
    question: "Why is a single delegated listener on the parent usually more efficient than one listener per item?",
    options: [
      { id: "a", label: "Fewer listeners to create, and it automatically covers items added later" },
      { id: "b", label: "It makes each individual click faster" },
      { id: "c", label: "There's no real difference" },
    ],
    correctOptionId: "a",
    explanation:
      "One listener uses less memory than dozens, and because it relies on bubbling + event.target, it automatically works for items added to the list later — no need to re-attach anything.",
  },
  remember:
    "Because events bubble from the clicked element up through its ancestors, one listener on a shared parent can handle clicks from any current — or future — child by checking event.target.",
};
