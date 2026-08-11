"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion, PenLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChallengeCard } from "./ChallengeCard";
import { InlineCodeText } from "./InlineCodeText";
import type { AnyLabDefinition } from "@/types/lab";
import type { Concept } from "@/types/concept";

export interface LessonFooterProps {
  concept: Concept;
  lab: AnyLabDefinition;
}

export function LessonFooter({ concept, lab }: LessonFooterProps) {
  const [answerOpen, setAnswerOpen] = useState(false);
  const showInterviewQuestion = Boolean(concept.interviewQuestion);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PenLine className="size-4 text-primary" />
            Remember
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <InlineCodeText text={lab.remember} />
          </p>
        </CardContent>
      </Card>

      {showInterviewQuestion && (
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircleQuestion className="size-4 text-primary" />
              Interview Question
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <InlineCodeText text={concept.interviewQuestion ?? ""} />
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnswerOpen((o) => !o)}
              aria-expanded={answerOpen}
              className="gap-1.5"
            >
              <ChevronDown className={cn("size-4 transition-transform", answerOpen && "rotate-180")} />
              {answerOpen ? "Hide answer" : "Show answer"}
            </Button>
            {answerOpen && (
              <p className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                <InlineCodeText text={concept.technicalDescription} />
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="min-w-0 md:col-span-2">
        <ChallengeCard slug={concept.slug} challenge={lab.challenge} />
      </div>
    </div>
  );
}
