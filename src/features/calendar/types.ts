/** Shared calendar event model. Finance is the first source; other modules can add more. */

export type CalendarSource = "bill" | "budget" | "income" | "expense";

export interface CalendarEvent {
  /** Stable, deterministic id — same input always yields the same id (dedupe key). */
  id: string;
  source: CalendarSource;
  /** Id of the underlying finance record. */
  recordId: string;
  title: string;
  /** yyyy-MM-dd */
  date: string;
  category?: string | null;
  amount?: number | null;
  currency?: string | null;
  status?: string | null;
  /** In-app link back to the originating record. */
  link: string;
  /** True when this occurrence was generated from a recurrence rule. */
  recurring?: boolean;
}

export const CALENDAR_SOURCE_LABELS: Record<CalendarSource, string> = {
  bill: "Bills",
  budget: "Budgets",
  income: "Income",
  expense: "Expenses",
};

/** Design-system tones (semantic tokens only — no hardcoded hex). */
export const CALENDAR_SOURCE_STYLES: Record<CalendarSource, string> = {
  bill: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  budget: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  income: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  expense: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
};

export const CALENDAR_OVERDUE_STYLE =
  "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
