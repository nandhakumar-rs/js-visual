"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Circle, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { getVisibleConceptsBySection } from "@/data/concepts";
import { SECTION_META, SECTION_ORDER, type ConceptSection } from "@/types/concept";
import { useProgress } from "@/lib/progress/store";
import { isLabImplemented } from "@/components/labs/registry";

const SECTIONS = SECTION_ORDER;

export interface AppSidebarContentProps {
  onNavigate?: () => void;
}

export function AppSidebarContent({ onNavigate }: AppSidebarContentProps) {
  const pathname = usePathname();
  const completedLessons = useProgress((s) => s.completedLessons);
  const [openSections, setOpenSections] = useState<Set<ConceptSection>>(
    () => new Set(SECTIONS)
  );

  function toggleSection(section: ConceptSection) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  }

  return (
    <nav aria-label="Lesson navigation" className="flex flex-col gap-1 p-2">
      {SECTIONS.map((section) => {
        const meta = SECTION_META[section];
        const items = getVisibleConceptsBySection(section);
        const isOpen = openSections.has(section);
        const completedCount = items.filter((i) => completedLessons.includes(i.slug)).length;

        return (
          <div key={section} className="mb-1">
            <button
              type="button"
              onClick={() => toggleSection(section)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm font-semibold hover:bg-accent"
            >
              <span>
                <span className="mr-1.5 text-muted-foreground">{meta.number}</span>
                {meta.title}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
                {completedCount}/{items.length}
                <ChevronDown
                  className={cn("size-3.5 transition-transform", isOpen && "rotate-180")}
                  aria-hidden
                />
              </span>
            </button>

            {isOpen && (
              <ul className="mt-0.5 space-y-0.5 border-l border-border pl-3">
                {items.map((concept) => {
                  const href = `/learn/${concept.slug}`;
                  const isCurrent = pathname === href;
                  const isDone = completedLessons.includes(concept.slug);
                  const implemented = isLabImplemented(concept.slug);

                  return (
                    <li key={concept.slug}>
                      <Link
                        href={href}
                        onClick={onNavigate}
                        aria-current={isCurrent ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors",
                          isCurrent
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                          !implemented && "opacity-60"
                        )}
                      >
                        {isDone ? (
                          <CircleCheck className="size-3.5 shrink-0 text-emerald-500" aria-hidden />
                        ) : (
                          <Circle className="size-3.5 shrink-0" aria-hidden />
                        )}
                        <span className="truncate">{concept.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
