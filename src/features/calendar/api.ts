import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { BillRow, BudgetRow, ExpenseRow, IncomeRow } from "@/features/finance/types";
import { buildFinanceEvents, type DateRange } from "./finance-events";
import type { CalendarEvent } from "./types";

export const CALENDAR_KEY = ["calendar"] as const;

/**
 * Finance events for a visible date range only — never loads the whole finance
 * database. RLS scopes every query to the signed-in user; the query is disabled
 * until a session exists.
 *
 * Recurring bills are fetched by `due_date <= range.end` (a bill that started
 * before the window can still recur inside it) and expanded client-side.
 */
export function useFinanceCalendarEvents(range: DateRange) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...CALENDAR_KEY, "finance", user?.id, range.start, range.end],
    enabled: !!user,
    queryFn: async (): Promise<CalendarEvent[]> => {
      const [bills, budgets, income, expenses] = await Promise.all([
        supabase
          .from("bills")
          .select("*")
          .eq("archived", false)
          .lte("due_date", range.end)
          .or(`frequency.neq.once,due_date.gte.${range.start}`),
        supabase
          .from("budgets")
          .select("*")
          .lte("start_date", range.end)
          .or(`end_date.is.null,end_date.gte.${range.start}`),
        supabase
          .from("income")
          .select("*")
          .gte("received_date", range.start)
          .lte("received_date", range.end),
        supabase
          .from("expenses")
          .select("*")
          .gte("expense_date", range.start)
          .lte("expense_date", range.end),
      ]);

      const firstError = bills.error || budgets.error || income.error || expenses.error;
      if (firstError) throw firstError;

      return buildFinanceEvents(
        {
          bills: (bills.data ?? []) as BillRow[],
          budgets: (budgets.data ?? []) as BudgetRow[],
          income: (income.data ?? []) as IncomeRow[],
          expenses: (expenses.data ?? []) as ExpenseRow[],
        },
        range,
      );
    },
  });
}
