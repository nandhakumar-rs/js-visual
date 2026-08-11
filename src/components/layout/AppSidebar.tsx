"use client";

import { useState } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AppSidebarContent } from "./AppSidebarContent";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile: sheet-triggered drawer */}
      <div className="border-b border-border p-2 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm" className="gap-1.5">
                <Menu className="size-4" />
                Lessons
              </Button>
            }
          />
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border">
              <SheetTitle>JavaScript Visual Lab</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100dvh-4rem)]">
              <AppSidebarContent onNavigate={() => setMobileOpen(false)} />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: persistent collapsible aside */}
      <aside
        className={cn(
          "sticky top-14 hidden h-[calc(100dvh-3.5rem)] shrink-0 border-r border-border bg-card/30 transition-[width] duration-200 lg:block",
          collapsed ? "w-12" : "w-64"
        )}
      >
        <div className="flex items-center justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        </div>
        {!collapsed && (
          <ScrollArea className="h-[calc(100%-2.75rem)]">
            <AppSidebarContent />
          </ScrollArea>
        )}
      </aside>
    </>
  );
}
