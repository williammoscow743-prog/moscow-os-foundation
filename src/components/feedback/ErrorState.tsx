import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/** Standard error card with optional retry. */
export function ErrorState({
  title = "Something went wrong",
  message = "Please try again in a moment.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "surface flex flex-col items-center justify-center px-6 py-12 text-center",
        className,
      )}
    >
      <div className="grid h-10 w-10 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
