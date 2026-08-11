"use client";

import { Fragment } from "react";
import { Lightbulb, Sparkle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ExplainSummaryConfig } from "./types";

export interface ExplainSummaryProps extends ExplainSummaryConfig {
  className?: string;
}

/**
 * Generic bullet-list explanation card for a guided lesson's "Why?" phase —
 * short, compact, and reusable by future lessons with their own bullet
 * content (which may itself embed InfoTooltips). `quirkNote` and
 * `technicalNote` are both always-shown callouts — only the page's top
 * intro text depends on the Concept/Technical toggle.
 */
export function ExplainSummary({
  title = "What's really going on",
  bullets,
  quirkNote,
  technicalNote,
  comparisonItems,
  className,
}: ExplainSummaryProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="size-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" aria-hidden />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        {comparisonItems && comparisonItems.length > 0 && (
          comparisonItems[0].columns ? (
            <div className="overflow-hidden rounded-md border border-border">
              <div className="hidden grid-cols-4 sm:grid">
                <div className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-foreground">
                  Method
                </div>
                {comparisonItems[0].columns.map((c) => (
                  <div
                    key={c.header}
                    className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-foreground"
                  >
                    {c.header}
                  </div>
                ))}
                {comparisonItems.map((item, i) => {
                  const isLast = i === comparisonItems.length - 1;
                  return (
                    <Fragment key={item.label}>
                      <div className={cn("px-3 py-2 text-sm", !isLast && "border-b border-border")}>{item.label}</div>
                      {item.columns?.map((c) => (
                        <div
                          key={c.header}
                          className={cn("px-3 py-2 text-sm text-muted-foreground", !isLast && "border-b border-border")}
                        >
                          {c.value}
                        </div>
                      ))}
                    </Fragment>
                  );
                })}
              </div>
              <div className="grid gap-2 p-2 sm:hidden">
                {comparisonItems.map((item) => (
                  <div key={item.label} className="space-y-1 rounded-md border border-border bg-muted/20 p-2">
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    {item.columns?.map((c) => (
                      <p key={c.header} className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{c.header}:</span> {c.value}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-2 rounded-md border border-border bg-muted/30 p-3 sm:grid-cols-3">
              {comparisonItems.map((item) => (
                <div key={item.label} className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          )
        )}
        {quirkNote && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
            {quirkNote}
          </div>
        )}
        {technicalNote && (
          <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <Sparkle className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
            <span>{technicalNote}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
