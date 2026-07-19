import { cn } from "@/lib/utils";

export interface ProgressRingProps {
  value: number; // 0..100
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

/** Circular progress indicator. */
export function ProgressRing({
  value,
  size = 44,
  strokeWidth = 4,
  className,
  label,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute text-xs font-medium">
        {label ?? `${Math.round(clamped)}%`}
      </span>
    </div>
  );
}
