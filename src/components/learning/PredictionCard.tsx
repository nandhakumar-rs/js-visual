"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { StreakBadge } from "@/components/feedback/StreakBadge";
import { useProgress } from "@/lib/progress/store";
import { playCue } from "@/lib/sound/play";
import type { PredictionConfig } from "./types";

export interface PredictionCardProps {
  slug: string;
  prediction: PredictionConfig;
}

export function PredictionCard({ slug, prediction }: PredictionCardProps) {
  const recordAnswer = useProgress((s) => s.recordAnswer);

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          <Sparkles className="size-4 text-primary" />
          What do you think happens?
          <StreakBadge />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChoiceQuestion
          prompt={prediction.prompt}
          code={prediction.code}
          options={prediction.options}
          correctOptionId={prediction.correctOptionId}
          explanation={prediction.explanation}
          submitLabel="Check answer"
          resultNoun="prediction"
          onAnswered={(correct, isFirstAttempt) => {
            recordAnswer(slug, "prediction", correct, isFirstAttempt);
            playCue(correct ? "correct" : "wrong");
          }}
        />
      </CardContent>
    </Card>
  );
}
