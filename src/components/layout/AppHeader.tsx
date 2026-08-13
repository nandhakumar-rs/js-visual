import Link from "next/link";
import { Braces } from "lucide-react";
import { SearchCommand } from "./SearchCommand";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Braces className="size-5 text-primary" aria-hidden />
          <span className="hidden sm:inline">Visualize JS</span>
        </Link>

        <div className="flex-1" />

        <SearchCommand />
        <ThemeToggle />
      </div>
    </header>
  );
}
