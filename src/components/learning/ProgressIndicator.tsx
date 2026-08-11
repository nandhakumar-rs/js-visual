import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface ProgressIndicatorProps {
  completed: number;
  total: number;
  label?: string;
  className?: string;
}

export function ProgressIndicator({ completed, total, label, className }: ProgressIndicatorProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="tabular-nums text-muted-foreground">
            {completed} / {total}
          </span>
        </div>
      )}
      <Progress value={pct} aria-label={label ? `${label} progress` : "Progress"} />
    </div>
  );
}
