"use client";

import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { StreakBadge } from "@/components/feedback/StreakBadge";
import { useCelebrate } from "@/components/feedback/CelebrationProvider";
import { useProgress } from "@/lib/progress/store";
import { celebrationFor } from "@/lib/progress/celebration";
import { playCue } from "@/lib/sound/play";
import type { ChallengeConfig } from "./types";

export interface ChallengeCardProps {
  slug: string;
  challenge: ChallengeConfig;
}

export function ChallengeCard({ slug, challenge }: ChallengeCardProps) {
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const markCompleted = useProgress((s) => s.markCompleted);
  const markCelebrated = useProgress((s) => s.markCelebrated);
  const celebrate = useCelebrate();

  function handleAnswered(correct: boolean, isFirstAttempt: boolean) {
    recordAnswer(slug, "challenge", correct, isFirstAttempt);

    // A lesson is complete when its challenge is answered *correctly*. A wrong
    // answer still shows the explanation and offers a retry — it just does not
    // tick the lesson off, so the progress bars mean what they say.
    if (!correct) {
      playCue("wrong");
      return;
    }

    markCompleted(slug);

    // markCompleted is a no-op if the lesson was already done, so read the
    // resulting state rather than assuming this call changed it.
    const { completedLessons, celebrated } = useProgress.getState();
    const event = celebrationFor({ completedLessons, celebrated }, slug);
    if (!event) return;

    // Record only the first time a milestone lands — but always celebrate at
    // the tier the milestone is worth, so re-finishing the last lesson of a
    // section still gets the section burst rather than a plain lesson one.
    if (event.isNew) {
      for (const key of [event.key, ...event.supersedes]) markCelebrated(key);
    }

    celebrate(event);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          <Brain className="size-4 text-primary" />
          Tiny Challenge
          <StreakBadge />
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
          onAnswered={handleAnswered}
        />
      </CardContent>
    </Card>
  );
}
