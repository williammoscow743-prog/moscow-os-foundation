import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "primary";

const TONES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-transparent",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-transparent",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-transparent",
  danger: "bg-red-500/10 text-red-600 dark:text-red-400 border-transparent",
  primary: "bg-primary/10 text-primary border-transparent",
};

export interface StatusBadgeProps {
  tone?: StatusTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Colored badge for statuses / priorities. */
export function StatusBadge({
  tone = "neutral",
  icon,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("gap-1", TONES[tone], className)}>
      {icon}
      {children}
    </Badge>
  );
}
