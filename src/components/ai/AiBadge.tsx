import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AiBadgeProps {
  label?: string;
  className?: string;
}

/** Small badge to mark AI-generated or AI-assisted content. */
export function AiBadge({ label = "AI", className }: AiBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary",
        className,
      )}
    >
      <Sparkles className="h-3 w-3" />
      {label}
    </span>
  );
}
