import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  variant?: "spinner" | "skeleton-list" | "skeleton-grid";
  label?: string;
  className?: string;
  rows?: number;
}

/** Consistent loading placeholders. */
export function LoadingState({
  variant = "spinner",
  label = "Loading…",
  className,
  rows = 4,
}: LoadingStateProps) {
  if (variant === "skeleton-list") {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  if (variant === "skeleton-grid") {
    return (
      <div className={cn("grid gap-3 md:grid-cols-2 xl:grid-cols-3", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground",
        className,
      )}
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}
