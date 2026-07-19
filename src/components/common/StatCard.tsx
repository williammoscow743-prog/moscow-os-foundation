import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatTone = "default" | "success" | "danger" | "info" | "warning";

const TONE_STYLES: Record<StatTone, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  danger: "bg-red-500/10 text-red-600 dark:text-red-400",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: StatTone;
  className?: string;
}

/** KPI / metric card used on dashboards. */
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
  className,
}: StatCardProps) {
  return (
    <div className={cn("surface p-4", className)}>
      <div className="flex items-center gap-2">
        {icon && (
          <div className={cn("grid h-7 w-7 place-items-center rounded-md", TONE_STYLES[tone])}>
            {icon}
          </div>
        )}
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
