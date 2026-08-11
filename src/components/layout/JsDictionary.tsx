"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dictionary } from "@/data/dictionary";

export function JsDictionary() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="JavaScript dictionary">
            <BookOpen className="size-4" />
          </Button>
        }
      />
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">JavaScript Dictionary</p>
          <p className="text-xs text-muted-foreground">Quick definitions for common terms.</p>
        </div>
        <ScrollArea className="h-80">
          <dl className="divide-y divide-border">
            {dictionary.map((entry) => (
              <div key={entry.term} className="px-4 py-2.5">
                <dt className="text-sm font-medium">{entry.term}</dt>
                <dd className="text-xs text-muted-foreground">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
