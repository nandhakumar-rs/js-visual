"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { concepts } from "@/data/concepts";
import { SECTION_META } from "@/types/concept";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(slug: string) {
    setOpen(false);
    router.push(`/learn/${slug}`);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full max-w-56 justify-start gap-2 text-muted-foreground sm:w-56"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search concepts</span>
        <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[0.65rem] sm:inline">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search concepts"
        description="Jump straight to any lesson"
      >
        <CommandInput placeholder="closure, promise, array, prototype, async..." />
        <CommandList>
          <CommandEmpty>No concepts found.</CommandEmpty>
          {(Object.keys(SECTION_META) as Array<keyof typeof SECTION_META>).map((section) => {
            const items = concepts.filter((c) => c.section === section);
            if (items.length === 0) return null;
            return (
              <CommandGroup key={section} heading={SECTION_META[section].title}>
                {items.map((concept) => (
                  <CommandItem
                    key={concept.slug}
                    value={`${concept.title} ${concept.slug}`}
                    onSelect={() => go(concept.slug)}
                  >
                    {concept.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
