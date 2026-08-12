import type { LabDefinition } from "@/types/lab";
import { InfoTooltip } from "@/components/learning/InfoTooltip";
import { InlineCode } from "@/components/learning/InlineCode";
import { getCode } from "./code";
import { buildInitialSteps } from "./steps";
import { NullUndefinedControls } from "./NullUndefinedControls";
import { NullUndefinedVisualization } from "./NullUndefinedVisualization";
import { UnderstandContent } from "./UnderstandContent";
import type { NullUndefinedInputs, NullUndefinedStepState } from "./types";

export const nullVsUndefinedLab: LabDefinition<NullUndefinedInputs, NullUndefinedStepState> = {
  slug: "null-vs-undefined",
  mode: "scripted",
  layout: "guided",
  defaultInputs: { thirdValue: "0" },
  getCode,
  buildInitialSteps,
  simulationControls: NullUndefinedControls,
  Visualization: NullUndefinedVisualization,

  experience: {
    content: <UnderstandContent />,
  },

  explainSummary: {
    title: "Why does JavaScript have two kinds of empty?",
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
        JavaScript produces <InlineCode>undefined</InlineCode> on its own; only a programmer produces{" "}
        <InlineCode>null</InlineCode>.
      </>,
      <>
        <InlineCode>0</InlineCode> is a real{" "}
        <InfoTooltip label="value">Concrete data JavaScript can store and use, with its own type.</InfoTooltip> — not
        a stand-in for &quot;no value.&quot;
      </>,
    ],
    comparisonItems: [
      {
        label: "undefined",
        columns: [
          { header: "Who set it", value: "JavaScript, automatically" },
          { header: "typeof", value: '"undefined"' },
          { header: "Means", value: "No value has been provided yet" },
        ],
      },
      {
        label: "null",
        columns: [
          { header: "Who set it", value: "The programmer, deliberately" },
          { header: "typeof", value: '"object" (the quirk)' },
          { header: "Means", value: "No value here, on purpose" },
        ],
      },
      {
        label: "0",
        columns: [
          { header: "Who set it", value: "The programmer, deliberately" },
          { header: "typeof", value: '"number"' },
          { header: "Means", value: "A real value that happens to be falsy" },
        ],
      },
    ],
    columnsHeader: "Value",
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

  prediction: {
    prompt: "What does `console.log(typeof user)` print?",
    code: ["let user = null;", "console.log(typeof user);"],
    options: [
      {
        id: "null",
        label: '"null"',
        feedback: "`typeof` only ever returns one of a fixed set of type names, and `\"null\"` is not one of them.",
      },
      {
        id: "undefined",
        label: '"undefined"',
        feedback: "That is what `typeof` reports for a variable with no value. `user` was deliberately set to `null`.",
      },
      { id: "object", label: '"object"' },
      {
        id: "string",
        label: '"string"',
        feedback: "`null` is not text. `typeof` reports the type of the value, not how it looks when written out.",
      },
    ],
    correctOptionId: "object",
    explanation:
      '`null` is a primitive value, but `typeof user` returns `"object"` because of a historical JavaScript quirk kept for backwards compatibility.',
  },

  challenge: {
    question: "Which variable is empty because a programmer decided it should be?",
    code: ["let draft;", "let published = null;", 'let title = "";', "let views = 0;"],
    options: [
      { id: "published", label: "published" },
      {
        id: "draft",
        label: "draft",
        feedback:
          "`draft` was declared and never assigned, so JavaScript filled it with `undefined`. Nobody chose that.",
      },
      {
        id: "title",
        label: "title",
        feedback: "`\"\"` is a real string that happens to contain nothing. It is a value, not the absence of one.",
      },
      {
        id: "views",
        label: "views",
        feedback: "`0` is a real number. It looks empty only because it is falsy.",
      },
    ],
    correctOptionId: "published",
    explanation:
      "`null` is the one value a programmer assigns to say \"no value here, on purpose.\" `undefined` is what JavaScript uses when no value was provided, and `\"\"` and `0` are ordinary values that merely look empty.",
  },

  remember:
    "`undefined` means no value yet. `null` means no value on purpose — the programmer chose it deliberately. `0` (and other falsy-looking values) are still real values. `typeof null === \"object\"` is a historical quirk, not a sign that null is an object.",
};
