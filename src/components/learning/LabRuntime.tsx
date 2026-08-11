"use client";

import { useEffect, useMemo, useState } from "react";
import { useExecutionEngine } from "@/lib/execution/useExecutionEngine";
import { useProgress } from "@/lib/progress/store";
import { CodePanel } from "@/components/visualizers/CodePanel";
import { ConsolePanel } from "@/components/visualizers/ConsolePanel";
import { labRegistry } from "@/components/labs/registry";
import { LessonShell } from "./LessonShell";
import { GuidedLessonShell } from "./GuidedLessonShell";
import { ExplanationPanel } from "./ExplanationPanel";
import { WhyPanel } from "./WhyPanel";
import { StepController } from "./StepController";
import { PredictionCard } from "./PredictionCard";
import { LessonFooter } from "./LessonFooter";
import type { Concept } from "@/types/concept";

export interface LabRuntimeProps {
  // Looked up from the registry here (inside a Client Component) rather than
  // passed down as a prop from the server, because LabDefinition objects
  // carry functions (getCode, buildInitialSteps, Controls, Visualization)
  // that can't cross the server/client boundary as props.
  slug: string;
  concept: Concept;
  positionInSection: number;
  totalInSection: number;
}

export function LabRuntime({ slug, concept, positionInSection, totalInSection }: LabRuntimeProps) {
  const lab = labRegistry[slug];
  if (!lab) {
    throw new Error(`LabRuntime: no lab registered for slug "${slug}"`);
  }

  const [inputs, setInputs] = useState(lab.defaultInputs);
  // Seeded once on mount: scripted labs immediately resync via the effect
  // below, interactive labs grow their own steps from here via appendStep.
  const initialSteps = useMemo(() => lab.buildInitialSteps(inputs), [lab]); // eslint-disable-line react-hooks/exhaustive-deps
  const engine = useExecutionEngine({ steps: initialSteps });
  const markVisited = useProgress((s) => s.markVisited);

  useEffect(() => {
    markVisited(concept.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concept.slug]);

  useEffect(() => {
    if (lab.mode === "scripted") {
      engine.replaceSteps(lab.buildInitialSteps(inputs));
    }
    // Interactive labs seed step 0 once and grow steps via engine.appendStep
    // from their own Controls, so they intentionally don't react here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const code = useMemo(() => lab.getCode(inputs), [lab, inputs]);

  if (lab.layout === "guided") {
    return (
      <GuidedLessonShell
        concept={concept}
        positionInSection={positionInSection}
        totalInSection={totalInSection}
        explanation={<ExplanationPanel concept={concept} />}
        experience={lab.experience}
        code={<CodePanel code={code} activeLines={engine.currentStep?.activeCodeLines ?? []} />}
        visualization={<lab.Visualization step={engine.currentStep} inputs={inputs} engine={engine} />}
        simulationControls={
          lab.simulationControls && (
            <lab.simulationControls inputs={inputs} onInputsChange={setInputs} engine={engine} />
          )
        }
        stepController={<StepController engine={engine} />}
        consolePanel={
          lab.showConsole === false ? undefined : <ConsolePanel entries={engine.consoleEntries} onClear={engine.reset} />
        }
        whyPanel={
          lab.showWhyPanel === false ? undefined : (
            <WhyPanel text={engine.currentStep?.whyExplanation ?? engine.currentStep?.description} />
          )
        }
        explainSummary={lab.explainSummary}
        prediction={lab.prediction && <PredictionCard prediction={lab.prediction} />}
        footer={<LessonFooter concept={concept} lab={lab} />}
      />
    );
  }

  return (
    <LessonShell
      concept={concept}
      positionInSection={positionInSection}
      totalInSection={totalInSection}
      explanation={<ExplanationPanel concept={concept} />}
      controls={
        <div className="space-y-4">
          {lab.prediction && <PredictionCard prediction={lab.prediction} />}
          {lab.Controls && <lab.Controls inputs={inputs} onInputsChange={setInputs} engine={engine} />}
        </div>
      }
      code={<CodePanel code={code} activeLines={engine.currentStep?.activeCodeLines ?? []} />}
      visualization={<lab.Visualization step={engine.currentStep} inputs={inputs} engine={engine} />}
      stepController={<StepController engine={engine} />}
      consolePanel={<ConsolePanel entries={engine.consoleEntries} onClear={engine.reset} />}
      whyPanel={<WhyPanel text={engine.currentStep?.whyExplanation ?? engine.currentStep?.description} />}
      footer={<LessonFooter concept={concept} lab={lab} />}
    />
  );
}
