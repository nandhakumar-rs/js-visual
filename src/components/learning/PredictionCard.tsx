"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChoiceQuestion } from "./ChoiceQuestion";
import type { PredictionConfig } from "./types";

export interface PredictionCardProps {
  prediction: PredictionConfig;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-primary" />
          What do you think happens?
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
        />
      </CardContent>
    </Card>
  );
}
