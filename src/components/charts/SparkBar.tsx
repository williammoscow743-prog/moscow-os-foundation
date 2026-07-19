import { cn } from "@/lib/utils";

export interface SparkBarProps {
  values: number[];
  max?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * Minimal dependency-free sparkbar chart for dashboard widgets.
 * Renders normalized vertical bars.
 */
export function SparkBar({ values, max, className, ariaLabel }: SparkBarProps) {
  const peak = max ?? Math.max(1, ...values);
  return (
    <div
      role="img"
      aria-label={ariaLabel ?? "sparkline"}
      className={cn("flex h-10 items-end gap-1", className)}
    >
      {values.map((v, i) => {
        const pct = Math.max(4, Math.round((v / peak) * 100));
        return (
          <span
            key={i}
            style={{ height: `${pct}%` }}
            className="w-1.5 rounded-sm bg-primary/60"
          />
        );
      })}
    </div>
  );
}
