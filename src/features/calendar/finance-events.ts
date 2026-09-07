import { addWeeks, addMonths, addQuarters, addYears, parseISO } from "date-fns";
import type {
  BillRow,
  BudgetRow,
  ExpenseRow,
  IncomeRow,
  BillFrequency,
} from "@/features/finance/types";
import { deriveBillStatus } from "@/features/finance/utils";
import type { CalendarEvent } from "./types";

const iso = (d: Date) => d.toISOString().slice(0, 10);

const STEP: Record<Exclude<BillFrequency, "once">, (d: Date, n: number) => Date> = {
  weekly: (d, n) => addWeeks(d, n),
  monthly: (d, n) => addMonths(d, n),
  quarterly: (d, n) => addQuarters(d, n),
  yearly: (d, n) => addYears(d, n),
};

/** Hard cap so a bad frequency/range can never produce unbounded events. */
const MAX_OCCURRENCES = 400;

export interface DateRange {
  /** yyyy-MM-dd inclusive */
  start: string;
  /** yyyy-MM-dd inclusive */
  end: string;
}

/**
 * Expand a bill into its occurrence dates inside the range.
 * Ids are deterministic (`bill:<id>:<date>`) so refreshing or revisiting the
 * calendar can never create duplicate events.
 */
export function billOccurrences(bill: BillRow, range: DateRange): string[] {
  const dates: string[] = [];
  const frequency = (bill.frequency ?? "once") as BillFrequency;
  if (frequency === "once" || !(frequency in STEP)) {
    if (bill.due_date >= range.start && bill.due_date <= range.end) dates.push(bill.due_date);
    return dates;
  }
  const step = STEP[frequency as Exclude<BillFrequency, "once">];
  const base = parseISO(bill.due_date);
  for (let n = 0; n < MAX_OCCURRENCES; n++) {
    const d = iso(step(base, n));
    if (d > range.end) break;
    if (d >= range.start) dates.push(d);
  }
  return dates;
}

export function billEvents(bills: BillRow[], range: DateRange): CalendarEvent[] {
  const out: CalendarEvent[] = [];
  for (const bill of bills) {
    for (const date of billOccurrences(bill, range)) {
      const status = deriveBillStatus({ status: bill.status, due_date: date });
      out.push({
        id: `bill:${bill.id}:${date}`,
        source: "bill",
        recordId: bill.id,
        title: bill.name,
        date,
        category: bill.category,
        amount: Number(bill.amount),
        currency: bill.currency,
        status,
        link: `/finance/bills?record=${bill.id}`,
        recurring: date !== bill.due_date,
      });
    }
  }
  return out;
}

export function budgetEvents(budgets: BudgetRow[], range: DateRange): CalendarEvent[] {
  const out: CalendarEvent[] = [];
  for (const b of budgets) {
    const points: Array<[string, string | null]> = [
      ["start", b.start_date],
      ["end", b.end_date],
    ];
    for (const [kind, date] of points) {
      if (!date || date < range.start || date > range.end) continue;
      out.push({
        id: `budget:${b.id}:${kind}`,
        source: "budget",
        recordId: b.id,
        title: `${b.category} budget ${kind === "start" ? "starts" : "ends"}`,
        date,
        category: b.category,
        amount: Number(b.amount),
        currency: b.currency,
        status: kind === "start" ? "Period start" : "Period end",
        link: `/finance/budgets?record=${b.id}`,
      });
    }
  }
  return out;
}

export function incomeEvents(income: IncomeRow[], range: DateRange): CalendarEvent[] {
  return income
    .filter((i) => !!i.received_date && i.received_date >= range.start && i.received_date <= range.end)
    .map((i) => ({
      id: `income:${i.id}`,
      source: "income" as const,
      recordId: i.id,
      title: i.source,
      date: i.received_date,
      category: i.category,
      amount: Number(i.amount),
      currency: i.currency,
      status: i.received_date > new Date().toISOString().slice(0, 10) ? "Scheduled" : "Received",
      link: `/finance/income?record=${i.id}`,
    }));
}

export function expenseEvents(expenses: ExpenseRow[], range: DateRange): CalendarEvent[] {
  return expenses
    .filter((e) => !!e.expense_date && e.expense_date >= range.start && e.expense_date <= range.end)
    .map((e) => ({
      id: `expense:${e.id}`,
      source: "expense" as const,
      recordId: e.id,
      title: e.name,
      date: e.expense_date,
      category: e.category,
      amount: Number(e.amount),
      currency: e.currency,
      status: null,
      link: `/finance/expenses?record=${e.id}`,
    }));
}

export interface FinanceCalendarInput {
  bills?: BillRow[];
  budgets?: BudgetRow[];
  income?: IncomeRow[];
  expenses?: ExpenseRow[];
}

/** Build the full finance event set for a range, deduped by stable id. */
export function buildFinanceEvents(
  input: FinanceCalendarInput,
  range: DateRange,
): CalendarEvent[] {
  const all = [
    ...billEvents(input.bills ?? [], range),
    ...budgetEvents(input.budgets ?? [], range),
    ...incomeEvents(input.income ?? [], range),
    ...expenseEvents(input.expenses ?? [], range),
  ];
  const byId = new Map<string, CalendarEvent>();
  for (const e of all) byId.set(e.id, e);
  return Array.from(byId.values()).sort((a, b) =>
    a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date),
  );
}

export function groupEventsByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  return events.reduce<Record<string, CalendarEvent[]>>((acc, e) => {
    (acc[e.date] ??= []).push(e);
    return acc;
  }, {});
}
