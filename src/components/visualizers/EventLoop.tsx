"use client";

import { RotateCw } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface EventLoopProps {
  active: boolean;
  label?: string;
  className?: string;
}

export function EventLoop({ active, label, className }: EventLoopProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 rounded-lg border border-border bg-card/30 p-2", className)}>
      <motion.div
        animate={active ? { rotate: 360 } : { rotate: 0 }}
        transition={active ? { duration: 1.2, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
      >
        <RotateCw className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} aria-hidden />
      </motion.div>
      <span className="text-xs text-muted-foreground">{label ?? "Event Loop"}</span>
    </div>
  );
}
