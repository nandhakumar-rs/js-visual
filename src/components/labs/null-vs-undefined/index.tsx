import type { LabDefinition } from "@/types/lab";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { NullUndefinedControls } from "./NullUndefinedControls";
import { NullUndefinedVisualization } from "./NullUndefinedVisualization";
import type { NullUndefinedInputs, NullUndefinedStepState } from "./types";

export const nullVsUndefinedLab: LabDefinition<NullUndefinedInputs, NullUndefinedStepState> = {
  slug: "null-vs-undefined",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { thirdValue: "0" },
  getCode,
  buildInitialSteps,
  Controls: NullUndefinedControls,
  Visualization: NullUndefinedVisualization,

  experience: {
    prompt: (
      <>
        Before we write any code, meet three{" "}
        <InfoTooltip label="variables">A named place where JavaScript can keep a value.</InfoTooltip> and what&apos;s
        really inside each one.
      </>
    ),
    cards: [
      { id: "a", label: "a", value: "undefined", caption: "JavaScript doesn't have a value here yet.", tone: "muted" },
      {
        id: "b",
        label: "b",
        value: "null",
        caption: "The programmer intentionally said there's no value here.",
        tone: "highlight",
      },
      { id: "c", label: "c", value: "0", caption: "This is a real value.", tone: "positive" },
    ],
  },

  explainSummary: {
    title: "What's really going on",
    bullets: [
      <>
        <InfoTooltip label="undefined" code>
          The type and value JavaScript automatically gives a variable that&apos;s been declared but never assigned.
        </InfoTooltip>{" "}
        means JavaScript doesn&apos;t have a value here yet.
      </>,
      <>
        <InfoTooltip label="null" code>
          A value a programmer deliberately assigns to represent &quot;no value here on purpose.&quot;
        </InfoTooltip>{" "}
        means the programmer deliberately chose &quot;no value.&quot;
      </>,
      <>
        <InlineCode>0</InlineCode> is a real{" "}
        <InfoTooltip label="value">Concrete data JavaScript can store and use, with its own type.</InfoTooltip> — not
        a stand-in for &quot;no value.&quot;
      </>,
    ],
    quirkNote: (
      <>
        <InlineCode>typeof null === &quot;object&quot;</InlineCode> is a{" "}
        <InfoTooltip label="historical quirk">
          Old behavior kept for compatibility, even though it looks strange today.
        </InfoTooltip>{" "}
        — it doesn&apos;t mean <InlineCode>null</InlineCode> is actually an object.
      </>
    ),
    technicalNote: (
      <>
        Spec-wise, <InlineCode>null</InlineCode> is a primitive, not an object. The &quot;object&quot; result comes
        from how the original JavaScript engine tagged value types internally (objects and <InlineCode>null</InlineCode>{" "}
        shared the same tag) — a bug from 1995 that&apos;s now permanent, since fixing it would break existing
        websites. It&apos;s a well-known interview talking point precisely because it trips people up.
      </>
    ),
  },

  experimentPrompt: "Pick a different value for `c`, then run it again to see how the walkthrough changes.",

  prediction: {
    code: ["let user = null;", "console.log(typeof user);"],
    options: [
      { id: "null", label: '"null"' },
      { id: "undefined", label: '"undefined"' },
      { id: "object", label: '"object"' },
      { id: "string", label: '"string"' },
    ],
    correctOptionId: "object",
    explanation:
      '`null` is a primitive value, but `typeof user` returns `"object"` because of a historical JavaScript quirk kept for backwards compatibility.',
  },

  challenge: {
    question: "Which value means \"JavaScript doesn't currently have a value here\" (as opposed to a value the programmer intentionally left empty)?",
    options: [
      { id: "undefined", label: "undefined" },
      { id: "null", label: "null" },
    ],
    correctOptionId: "undefined",
    explanation:
      "`undefined` is JavaScript's own \"nothing here yet\" — it shows up for unassigned variables, missing properties, and functions with no `return`. `null` is something a programmer sets deliberately.",
  },

  remember:
    "`undefined` means no value yet. `null` means no value on purpose — the programmer chose it deliberately. `0` (and other falsy-looking values) are still real values. `typeof null === \"object\"` is a historical quirk, not a sign that null is an object.",
};
