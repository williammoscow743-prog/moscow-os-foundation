import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

export function ComingSoon({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-primary/30 rounded-full" />
        <div className="grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Icon className="h-7 w-7 text-primary" />
        </div>
      </div>
      <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        Coming in a future sprint
      </div>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
