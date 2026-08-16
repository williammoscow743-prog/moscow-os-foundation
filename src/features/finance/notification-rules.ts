import {
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  parseISO,
} from "date-fns";
import type { BillRow, BudgetRow, ExpenseRow } from "./types";
import type { DraftNotification } from "@/features/notifications/types";
import { formatCurrency } from "@/utils/format";

export type FinanceNotificationInput = {
  bills: BillRow[];
  budgets: BudgetRow[];
  expenses: ExpenseRow[];
  /** Reference date (defaults to now). */
  today?: Date;
  /** Optional configured threshold (ZAR). Large-expense alerts are skipped when undefined/null. */
  largeExpenseThreshold?: number | null;
};

const BILLS_LINK = "/finance/bills";
const BUDGETS_LINK = "/finance/budgets";
const EXPENSES_LINK = "/finance/expenses";

export const BUDGET_THRESHOLDS = [80, 90, 100] as const;

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Resolve the active period window for a budget.
 * Recurring budgets roll forward from start_date until the window contains `today`.
 */
export function budgetPeriodWindow(budget: BudgetRow, today: Date): { start: string; end: string } {
  const start = parseISO(budget.start_date);
  if (budget.end_date) return { start: iso(start), end: budget.end_date };

  const step = (d: Date): Date => {
    switch (budget.period) {
      case "weekly":
        return addWeeks(d, 1);
      case "quarterly":
        return addQuarters(d, 1);
      case "yearly":
        return addYears(d, 1);
      case "monthly":
      default:
        return addMonths(d, 1);
    }
  };

  let windowStart = start;
  let windowEnd = step(windowStart);
  let guard = 0;
  while (windowEnd <= today && guard < 1000) {
    windowStart = windowEnd;
    windowEnd = step(windowStart);
    guard += 1;
  }
  return { start: iso(windowStart), end: iso(new Date(windowEnd.getTime() - 86_400_000)) };
}

export function budgetSpend(
  budget: BudgetRow,
  expenses: ExpenseRow[],
  window: { start: string; end: string },
): number {
  return expenses
    .filter(
      (e) =>
        e.category === budget.category &&
        e.expense_date >= window.start &&
        e.expense_date <= window.end,
    )
    .reduce((sum, e) => sum + Number(e.amount ?? 0), 0);
}

function billNotification(
  bill: BillRow,
  condition: "due_7_days" | "due_tomorrow" | "due_today" | "overdue",
  daysOverdue: number,
): DraftNotification {
  const amount = formatCurrency(Number(bill.amount), bill.currency);
  const base = {
    category: "finance" as const,
    entity_id: bill.id,
    link: BILLS_LINK,
    dedupe_key: `finance:bill:${bill.id}:${condition}:${bill.due_date}`,
  };
  switch (condition) {
    case "due_7_days":
      return {
        ...base,
        type: "info",
        title: `${bill.name} is due in 7 days`,
        message: `${amount} due on ${bill.due_date}.`,
      };
    case "due_tomorrow":
      return {
        ...base,
        type: "warning",
        title: `${bill.name} is due tomorrow`,
        message: `${amount} due on ${bill.due_date}.`,
      };
    case "due_today":
      return {
        ...base,
        type: "warning",
        title: `${bill.name} is due today`,
        message: `${amount} due today.`,
      };
    case "overdue":
    default:
      return {
        ...base,
        type: "danger",
        title: `${bill.name} is overdue`,
        message: `${amount} was due on ${bill.due_date} (${daysOverdue} day${daysOverdue === 1 ? "" : "s"} ago).`,
      };
  }
}

/** Bill due-date rules: 7 days out, tomorrow, today, overdue. One notification per condition. */
export function buildBillNotifications(bills: BillRow[], today: Date): DraftNotification[] {
  const out: DraftNotification[] = [];
  for (const bill of bills) {
    if (bill.archived) continue;
    if (bill.status === "paid" || bill.status === "cancelled") continue;
    const days = differenceInCalendarDays(parseISO(bill.due_date), today);
    if (days === 7) out.push(billNotification(bill, "due_7_days", 0));
    else if (days === 1) out.push(billNotification(bill, "due_tomorrow", 0));
    else if (days === 0) out.push(billNotification(bill, "due_today", 0));
    else if (days < 0) out.push(billNotification(bill, "overdue", Math.abs(days)));
  }
  return out;
}

/** Budget utilisation rules: 80%, 90%, 100% and over-budget — once per budget period. */
export function buildBudgetNotifications(
  budgets: BudgetRow[],
  expenses: ExpenseRow[],
  today: Date,
): DraftNotification[] {
  const out: DraftNotification[] = [];
  for (const budget of budgets) {
    const limit = Number(budget.amount ?? 0);
    if (limit <= 0) continue;
    const window = budgetPeriodWindow(budget, today);
    const spent = budgetSpend(budget, expenses, window);
    const pct = (spent / limit) * 100;
    if (pct < 80) continue;

    const base = {
      category: "finance" as const,
      entity_id: budget.id,
      link: BUDGETS_LINK,
    };
    const spendText = `${formatCurrency(spent, budget.currency)} of ${formatCurrency(limit, budget.currency)} spent.`;

    for (const threshold of BUDGET_THRESHOLDS) {
      if (pct >= threshold) {
        out.push({
          ...base,
          type: threshold === 100 ? "danger" : "warning",
          title:
            threshold === 100
              ? `Budget reached for ${budget.category}`
              : `${budget.category} budget at ${threshold}%`,
          message: spendText,
          dedupe_key: `finance:budget:${budget.id}:${window.start}:threshold_${threshold}`,
        });
      }
    }

    if (spent > limit) {
      out.push({
        ...base,
        type: "danger",
        title: `Over budget on ${budget.category}`,
        message: `${spendText} Over by ${formatCurrency(spent - limit, budget.currency)}.`,
        dedupe_key: `finance:budget:${budget.id}:${window.start}:exceeded`,
      });
    }
  }
  return out;
}

/** Finance activity rules: new recurring bills and (when configured) large expenses. */
export function buildFinanceActivityNotifications(
  bills: BillRow[],
  expenses: ExpenseRow[],
  largeExpenseThreshold?: number | null,
): DraftNotification[] {
  const out: DraftNotification[] = [];

  for (const bill of bills) {
    if (bill.archived || bill.frequency === "once") continue;
    out.push({
      category: "finance",
      type: "info",
      title: `Recurring bill created: ${bill.name}`,
      message: `${formatCurrency(Number(bill.amount), bill.currency)} ${bill.frequency}, next due ${bill.due_date}.`,
      entity_id: bill.id,
      link: BILLS_LINK,
      dedupe_key: `finance:bill:${bill.id}:recurring_created`,
    });
  }

  if (typeof largeExpenseThreshold === "number" && largeExpenseThreshold > 0) {
    for (const expense of expenses) {
      if (Number(expense.amount ?? 0) < largeExpenseThreshold) continue;
      out.push({
        category: "finance",
        type: "warning",
        title: `Large expense recorded: ${expense.name}`,
        message: `${formatCurrency(Number(expense.amount), expense.currency)} on ${expense.expense_date} exceeds your ${formatCurrency(largeExpenseThreshold, expense.currency)} threshold.`,
        entity_id: expense.id,
        link: EXPENSES_LINK,
        dedupe_key: `finance:expense:${expense.id}:large`,
      });
    }
  }

  return out;
}

/** Evaluate every Finance notification rule for the current data set. */
export function buildFinanceNotifications({
  bills,
  budgets,
  expenses,
  today = new Date(),
  largeExpenseThreshold,
}: FinanceNotificationInput): DraftNotification[] {
  return [
    ...buildBillNotifications(bills, today),
    ...buildBudgetNotifications(budgets, expenses, today),
    ...buildFinanceActivityNotifications(bills, expenses, largeExpenseThreshold),
  ];
}
