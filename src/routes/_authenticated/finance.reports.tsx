import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Sparkles, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { parseISO, startOfMonth, subMonths } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBills, useBudgets, useExpenses, useFinanceReports, useIncome, useSaveFinanceReport } from "@/features/finance/api";
import { deriveBillStatus, downloadCsv, toCsv } from "@/features/finance/utils";
import { EXPENSE_CATEGORY_LABELS } from "@/features/finance/types";
import { formatCurrency, formatDate } from "@/utils/format";

type ReportType = "expense" | "income" | "cash_flow" | "budget" | "outstanding_bills" | "monthly_summary";

export const Route = createFileRoute("/_authenticated/finance/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const [type, setType] = useState<ReportType>("monthly_summary");
  const { data: expenses = [] } = useExpenses();
  const { data: income = [] } = useIncome();
  const { data: bills = [] } = useBills();
  const { data: budgets = [] } = useBudgets();
  const saveReport = useSaveFinanceReport();

  const insights = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    const lastMonthStart = subMonths(monthStart, 1);
    const thisMo = expenses.filter((e) => parseISO(e.expense_date) >= monthStart);
    const lastMo = expenses.filter((e) => {
      const d = parseISO(e.expense_date);
      return d >= lastMonthStart && d < monthStart;
    });
    const totalThis = thisMo.reduce((s, e) => s + Number(e.amount), 0);
    const totalLast = lastMo.reduce((s, e) => s + Number(e.amount), 0);
    const change = totalLast > 0 ? ((totalThis - totalLast) / totalLast) * 100 : 0;

    const byCat: Record<string, number> = {};
    thisMo.forEach((e) => (byCat[e.category] = (byCat[e.category] ?? 0) + Number(e.amount)));
    const largest = Object.entries(byCat).sort(([, a], [, b]) => b - a)[0];

    const monthlyIncome = income
      .filter((i) => parseISO(i.received_date) >= monthStart)
      .reduce((s, i) => s + Number(i.amount), 0);

    const overBudgets = budgets
      .map((b) => {
        const spent = thisMo.filter((e) => e.category === b.category).reduce((s, e) => s + Number(e.amount), 0);
        return { ...b, spent, pct: (spent / Number(b.amount)) * 100 };
      })
      .filter((b) => b.pct >= 90);

    return { totalThis, totalLast, change, largest, monthlyIncome, overBudgets };
  }, [expenses, income, budgets]);

  const handleExport = () => {
    let rows: Record<string, unknown>[] = [];
    let name = "";
    switch (type) {
      case "expense":
        rows = expenses.map((e) => ({ ...e, category: EXPENSE_CATEGORY_LABELS[e.category] ?? e.category }));
        name = "expense-report";
        break;
      case "income":
        rows = income;
        name = "income-report";
        break;
      case "outstanding_bills":
        rows = bills
          .filter((b) => !["paid", "cancelled"].includes(b.status) && !b.archived)
          .map((b) => ({ ...b, status: deriveBillStatus(b) }));
        name = "outstanding-bills";
        break;
      case "budget":
        rows = budgets;
        name = "budget-report";
        break;
      case "cash_flow": {
        rows = [
          ...income.map((i) => ({ date: i.received_date, kind: "income", label: i.source, amount: i.amount, currency: i.currency })),
          ...expenses.map((e) => ({ date: e.expense_date, kind: "expense", label: e.name, amount: -Number(e.amount), currency: e.currency })),
        ].sort((a, b) => (a.date as string).localeCompare(b.date as string));
        name = "cash-flow";
        break;
      }
      case "monthly_summary":
        rows = [
          { metric: "Total income (mo)", value: insights.monthlyIncome },
          { metric: "Total expenses (mo)", value: insights.totalThis },
          { metric: "Net (mo)", value: insights.monthlyIncome - insights.totalThis },
          { metric: "vs last month %", value: insights.change.toFixed(1) },
        ];
        name = "monthly-summary";
        break;
    }
    if (rows.length === 0) {
      toast.error("Nothing to export for this report.");
      return;
    }
    downloadCsv(`${name}-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
    saveReport
      .mutateAsync({
        name: `${name.replace(/-/g, " ")} ${new Date().toISOString().slice(0, 10)}`,
        type,
        period_start: startOfMonth(new Date()).toISOString().slice(0, 10),
        period_end: new Date().toISOString().slice(0, 10),
        summary: { rowCount: rows.length },
      })
      .catch(() => {});
    toast.success("Exported");
  };

  return (
    <div className="space-y-6">
      <div className="surface p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" /> AI insights
        </h3>
        <ul className="space-y-2 text-sm">
          {insights.largest && (
            <li className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 text-blue-500" />
              <span>
                Largest spending category this month: <b>{EXPENSE_CATEGORY_LABELS[insights.largest[0]] ?? insights.largest[0]}</b> — {formatCurrency(insights.largest[1])}.
              </span>
            </li>
          )}
          <li className="flex items-start gap-2">
            {insights.change >= 0 ? (
              <TrendingUp className="mt-0.5 h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="mt-0.5 h-4 w-4 text-emerald-500" />
            )}
            <span>
              Spending is <b>{Math.abs(insights.change).toFixed(1)}%</b> {insights.change >= 0 ? "higher" : "lower"} than last month.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <TrendingUp className="mt-0.5 h-4 w-4 text-emerald-500" />
            <span>
              Cash flow forecast (this month): <b>{formatCurrency(insights.monthlyIncome - insights.totalThis)}</b>.
            </span>
          </li>
          {insights.overBudgets.length > 0 && (
            <li className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
              <span>
                {insights.overBudgets.length} budget(s) at 90%+ used: {insights.overBudgets.map((b) => EXPENSE_CATEGORY_LABELS[b.category] ?? b.category).join(", ")}.
              </span>
            </li>
          )}
          <li className="flex items-start gap-2 text-muted-foreground">
            <Sparkles className="mt-0.5 h-4 w-4" />
            <span>Consider reviewing recurring bills quarterly — they compound to <b>{formatCurrency(bills.filter((b) => b.frequency !== "once").reduce((s, b) => s + Number(b.amount), 0))}</b> per cycle.</span>
          </li>
        </ul>
      </div>

      <div className="surface p-5">
        <h3 className="mb-4 text-sm font-semibold">Generate report</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid gap-1.5">
            <label className="text-xs text-muted-foreground">Report type</label>
            <Select value={type} onValueChange={(v) => setType(v as ReportType)}>
              <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly_summary">Monthly summary</SelectItem>
                <SelectItem value="expense">Expense report</SelectItem>
                <SelectItem value="income">Income report</SelectItem>
                <SelectItem value="cash_flow">Cash flow report</SelectItem>
                <SelectItem value="budget">Budget report</SelectItem>
                <SelectItem value="outstanding_bills">Outstanding bills</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          CSV opens in Excel and Google Sheets. PDF export coming soon.
        </p>
      </div>

      <SavedReports />
    </div>
  );
}

function SavedReports() {
  const { data: reports = [] } = useFinanceReports();
  if (reports.length === 0) return null;
  return (
    <div className="surface p-5">
      <h3 className="mb-3 text-sm font-semibold">Recent report generations</h3>
      <ul className="divide-y divide-border/50">
        {reports.slice(0, 10).map((r) => (
          <li key={r.id} className="flex items-center justify-between py-2 text-sm">
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{r.type.replace(/_/g, " ")} · {formatDate(r.generated_at)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
