"use client";

import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { useProgress } from "@/lib/progress/store";
import type { ChallengeConfig } from "./types";

export interface ChallengeCardProps {
  slug: string;
  challenge: ChallengeConfig;
}

export function ChallengeCard({ slug, challenge }: ChallengeCardProps) {
  const recordChallengeResult = useProgress((s) => s.recordChallengeResult);
  const markCompleted = useProgress((s) => s.markCompleted);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="size-4 text-primary" />
          Tiny Challenge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChoiceQuestion
          prompt={challenge.question}
          code={challenge.code}
          options={challenge.options}
          correctOptionId={challenge.correctOptionId}
          explanation={challenge.explanation}
          submitLabel="Check answer"
          resultNoun="answer"
          onAnswered={(correct) => {
            recordChallengeResult(slug, correct);
            markCompleted(slug);
          }}
        />
      </CardContent>
    </Card>
  );
}
