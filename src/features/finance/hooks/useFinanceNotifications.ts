import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useBills, useBudgets, useExpenses } from "@/features/finance/api";
import { buildFinanceNotifications } from "@/features/finance/notification-rules";
import { useCreateNotifications } from "@/features/notifications/api";

/**
 * Evaluates the Finance notification rules against the signed-in user's data and
 * persists any new conditions. Duplicates are prevented at the database level by
 * the (user_id, dedupe_key) unique index, so re-running this on every mount is safe.
 */
export function useFinanceNotifications() {
  const { user } = useAuth();
  const { data: bills = [], isSuccess: billsReady } = useBills();
  const { data: budgets = [], isSuccess: budgetsReady } = useBudgets();
  const { data: expenses = [], isSuccess: expensesReady } = useExpenses();
  const create = useCreateNotifications();
  const ranFor = useRef<string | null>(null);

  const { data: settings } = useQuery({
    queryKey: ["settings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!user || !billsReady || !budgetsReady || !expensesReady) return;
    if (ranFor.current === user.id) return;
    ranFor.current = user.id;

    const prefs = (settings?.preferences ?? {}) as Record<string, unknown>;
    const rawThreshold = prefs["large_expense_threshold"];
    const largeExpenseThreshold = typeof rawThreshold === "number" ? rawThreshold : null;

    const drafts = buildFinanceNotifications({
      bills,
      budgets,
      expenses,
      largeExpenseThreshold,
    });
    if (drafts.length === 0) return;

    create.mutate(drafts, {
      onSuccess: (created) => {
        if (created.length === 0) return;
        if (settings && settings.push_notifications === false) return;
        const first = created[0]!;
        toast(first.title, {
          description:
            created.length > 1
              ? `${first.message ?? ""} +${created.length - 1} more finance alert${created.length > 2 ? "s" : ""}.`
              : (first.message ?? undefined),
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, billsReady, budgetsReady, expensesReady, settings]);
}
