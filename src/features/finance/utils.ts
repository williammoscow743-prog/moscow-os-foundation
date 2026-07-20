import { addWeeks, addMonths, addQuarters, addYears, differenceInCalendarDays, parseISO } from "date-fns";
import type { BillFrequency, BillRow, BillStatus } from "./types";

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function deriveBillStatus(bill: Pick<BillRow, "status" | "due_date">): BillStatus {
  if (bill.status === "paid" || bill.status === "cancelled") return bill.status;
  const days = differenceInCalendarDays(parseISO(bill.due_date), new Date());
  if (days < 0) return "overdue";
  if (days === 0) return "due_today";
  return "upcoming";
}

export function nextDueDate(from: string, frequency: BillFrequency): string | null {
  if (frequency === "once") return null;
  const d = parseISO(from);
  const map = {
    weekly: () => addWeeks(d, 1),
    monthly: () => addMonths(d, 1),
    quarterly: () => addQuarters(d, 1),
    yearly: () => addYears(d, 1),
  } as const;
  return map[frequency]().toISOString().slice(0, 10);
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Array.from(
    rows.reduce<Set<string>>((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set()),
  );
  const escape = (v: unknown) => {
    if (v == null) return "";
    const s = typeof v === "string" ? v : JSON.stringify(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => escape(r[h])).join(","));
  return lines.join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function monthKey(dateIso: string): string {
  return dateIso.slice(0, 7); // YYYY-MM
}
