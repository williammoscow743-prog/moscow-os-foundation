import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type {
  BillInsert,
  BillRow,
  BillUpdate,
  BudgetInsert,
  BudgetRow,
  BudgetUpdate,
  ExpenseCategoryRow,
  ExpenseInsert,
  ExpenseRow,
  ExpenseUpdate,
  IncomeInsert,
  IncomeRow,
  IncomeUpdate,
  FinanceReportRow,
} from "./types";
import { nextDueDate } from "./utils";

const KEY = ["finance"] as const;

// ---------- Expenses ----------
export function useExpenses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "expenses", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<ExpenseRow[]> => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("expense_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ExpenseRow[];
    },
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Omit<ExpenseInsert, "user_id">) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("expenses")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as ExpenseRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: ExpenseUpdate }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as ExpenseRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

// ---------- Bills ----------
export function useBills() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "bills", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<BillRow[]> => {
      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .order("due_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as BillRow[];
    },
  });
}

export function useCreateBill() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Omit<BillInsert, "user_id">) => {
      if (!user) throw new Error("Not signed in");
      const payload = {
        ...input,
        user_id: user.id,
        next_due_date:
          input.next_due_date ?? nextDueDate(input.due_date as string, (input.frequency as never) ?? "once"),
      };
      const { data, error } = await supabase.from("bills").insert(payload).select().single();
      if (error) throw error;
      return data as BillRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateBill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: BillUpdate }) => {
      const { data, error } = await supabase
        .from("bills")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as BillRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteBill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bills").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

/**
 * Mark a bill as paid, and if it's recurring, roll its due_date to the next occurrence.
 */
export function useMarkBillPaid() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ bill, paid }: { bill: BillRow; paid: boolean }) => {
      if (!paid) {
        const { data, error } = await supabase
          .from("bills")
          .update({ status: "upcoming", paid_at: null })
          .eq("id", bill.id)
          .select()
          .single();
        if (error) throw error;
        return data as BillRow;
      }

      const isRecurring = bill.frequency !== "once";
      if (!isRecurring) {
        const { data, error } = await supabase
          .from("bills")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", bill.id)
          .select()
          .single();
        if (error) throw error;
        return data as BillRow;
      }

      // Recurring: create a paid clone, roll original forward
      if (!user) throw new Error("Not signed in");
      await supabase.from("bills").insert({
        user_id: user.id,
        name: bill.name,
        description: bill.description,
        amount: bill.amount,
        currency: bill.currency,
        category: bill.category,
        due_date: bill.due_date,
        frequency: "once",
        status: "paid",
        paid_at: new Date().toISOString(),
        vendor: bill.vendor,
        notes: bill.notes,
        project_id: bill.project_id,
      });
      const rolled = nextDueDate(bill.due_date, bill.frequency as never)!;
      const { data, error } = await supabase
        .from("bills")
        .update({
          due_date: rolled,
          next_due_date: nextDueDate(rolled, bill.frequency as never),
          status: "upcoming",
        })
        .eq("id", bill.id)
        .select()
        .single();
      if (error) throw error;
      return data as BillRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

// ---------- Income ----------
export function useIncome() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "income", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<IncomeRow[]> => {
      const { data, error } = await supabase
        .from("income")
        .select("*")
        .order("received_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as IncomeRow[];
    },
  });
}

export function useCreateIncome() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Omit<IncomeInsert, "user_id">) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("income")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as IncomeRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: IncomeUpdate }) => {
      const { data, error } = await supabase
        .from("income")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as IncomeRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteIncome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("income").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

// ---------- Budgets ----------
export function useBudgets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "budgets", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<BudgetRow[]> => {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as BudgetRow[];
    },
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Omit<BudgetInsert, "user_id">) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("budgets")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as BudgetRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: BudgetUpdate }) => {
      const { data, error } = await supabase
        .from("budgets")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as BudgetRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

// ---------- Custom Expense Categories ----------
export function useExpenseCategories() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "categories", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<ExpenseCategoryRow[]> => {
      const { data, error } = await supabase
        .from("expense_categories")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ExpenseCategoryRow[];
    },
  });
}

export function useCreateExpenseCategory() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { name: string; color?: string; icon?: string }) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("expense_categories")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as ExpenseCategoryRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [...KEY, "categories"] }),
  });
}

export function useDeleteExpenseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expense_categories").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [...KEY, "categories"] }),
  });
}

// ---------- Reports ----------
export function useFinanceReports() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, "reports", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<FinanceReportRow[]> => {
      const { data, error } = await supabase
        .from("finance_reports")
        .select("*")
        .order("generated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as FinanceReportRow[];
    },
  });
}

export function useSaveFinanceReport() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      type: "expense" | "income" | "cash_flow" | "budget" | "outstanding_bills" | "monthly_summary";
      period_start?: string | null;
      period_end?: string | null;
      filters?: Record<string, unknown>;
      summary?: Record<string, unknown>;
    }) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("finance_reports")
        .insert({
          user_id: user.id,
          name: input.name,
          type: input.type,
          period_start: input.period_start ?? null,
          period_end: input.period_end ?? null,
          filters: (input.filters ?? {}) as never,
          summary: (input.summary ?? {}) as never,
        })
        .select()
        .single();
      if (error) throw error;
      return data as FinanceReportRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [...KEY, "reports"] }),
  });
}
