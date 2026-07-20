import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addDays, format, parseISO, startOfMonth, subMonths } from "date-fns";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { formatCurrency, formatDate } from "@/utils/format";
import { useBills, useBudgets, useExpenses, useIncome } from "@/features/finance/api";
import { deriveBillStatus } from "@/features/finance/utils";
import { EXPENSE_CATEGORY_LABELS } from "@/features/finance/types";

export const Route = createFileRoute("/_authenticated/finance/")({
  component: FinanceDashboard,
});

const CHART_COLORS = ["#4F6BFF", "#00C2A8", "#F5A623", "#F04848", "#A855F7", "#22C55E", "#FF6B9D", "#38BDF8"];

function FinanceDashboard() {
  const { data: expenses = [] } = useExpenses();
  const { data: bills = [] } = useBills();
  const { data: income = [] } = useIncome();
  const { data: budgets = [] } = useBudgets();

  const now = new Date();
  const monthStart = startOfMonth(now);

  const monthExpenses = expenses.filter((e) => parseISO(e.expense_date) >= monthStart);
  const monthIncome = income.filter((i) => parseISO(i.received_date) >= monthStart);

  const totalExpenses = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = monthIncome.reduce((s, i) => s + Number(i.amount), 0);

  const outstandingBills = bills.filter((b) => {
    const s = deriveBillStatus(b);
    return s === "upcoming" || s === "due_today" || s === "overdue";
  });
  const paidBillsThisMonth = bills.filter(
    (b) => b.status === "paid" && b.paid_at && parseISO(b.paid_at) >= monthStart,
  );
  const outstandingTotal = outstandingBills.reduce((s, b) => s + Number(b.amount), 0);
  const paidTotal = paidBillsThisMonth.reduce((s, b) => s + Number(b.amount), 0);

  const budgetTotal = budgets.reduce((s, b) => s + Number(b.amount), 0);
  const budgetSpent = monthExpenses
    .filter((e) => budgets.some((b) => b.category === e.category))
    .reduce((s, e) => s + Number(e.amount), 0);
  const budgetRemaining = Math.max(0, budgetTotal - budgetSpent);

  const upcoming30 = useMemo(() => {
    const cutoff = addDays(now, 30);
    return outstandingBills
      .filter((b) => parseISO(b.due_date) <= cutoff)
      .sort((a, b) => a.due_date.localeCompare(b.due_date))
      .slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bills]);

  // Monthly series — last 6 months
  const monthly = useMemo(() => {
    const buckets: Record<string, { month: string; income: number; expenses: number; net: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const key = format(d, "yyyy-MM");
      buckets[key] = { month: format(d, "MMM"), income: 0, expenses: 0, net: 0 };
    }
    expenses.forEach((e) => {
      const k = e.expense_date.slice(0, 7);
      if (buckets[k]) buckets[k].expenses += Number(e.amount);
    });
    income.forEach((i) => {
      const k = i.received_date.slice(0, 7);
      if (buckets[k]) buckets[k].income += Number(i.amount);
    });
    Object.values(buckets).forEach((b) => (b.net = b.income - b.expenses));
    return Object.values(buckets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, income]);

  // Category breakdown (this month)
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    monthExpenses.forEach((e) => {
      map[e.category] = (map[e.category] ?? 0) + Number(e.amount);
    });
    return Object.entries(map)
      .map(([category, value]) => ({ category: EXPENSE_CATEGORY_LABELS[category] ?? category, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses]);

  const recentTx = useMemo(() => {
    const tx = [
      ...expenses.map((e) => ({
        id: `e-${e.id}`,
        kind: "expense" as const,
        name: e.name,
        date: e.expense_date,
        amount: -Number(e.amount),
        currency: e.currency,
        category: e.category,
      })),
      ...income.map((i) => ({
        id: `i-${i.id}`,
        kind: "income" as const,
        name: i.source,
        date: i.received_date,
        amount: Number(i.amount),
        currency: i.currency,
        category: i.category,
      })),
    ];
    return tx.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  }, [expenses, income]);

  const net = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Income (mo)" value={formatCurrency(totalIncome)} icon={<TrendingUp className="h-4 w-4" />} tone="success" />
        <StatCard label="Expenses (mo)" value={formatCurrency(totalExpenses)} icon={<TrendingDown className="h-4 w-4" />} tone="danger" />
        <StatCard
          label="Net cash flow"
          value={formatCurrency(net)}
          tone={net >= 0 ? "success" : "danger"}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          label="Budget remaining"
          value={formatCurrency(budgetRemaining)}
          hint={budgetTotal ? `${Math.round((budgetSpent / budgetTotal) * 100)}% used` : "No budgets set"}
          tone="info"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Outstanding bills" value={outstandingBills.length} hint={formatCurrency(outstandingTotal)} tone="warning" icon={<AlertCircle className="h-4 w-4" />} />
        <StatCard label="Paid (mo)" value={paidBillsThisMonth.length} hint={formatCurrency(paidTotal)} tone="success" icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Upcoming 30d" value={upcoming30.length} icon={<CalendarClock className="h-4 w-4" />} />
        <StatCard label="Active budgets" value={budgets.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Income vs expenses</h3>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#F04848" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Cash flow trend</h3>
            <span className="text-xs text-muted-foreground">Net (last 6 mo)</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="net" stroke="#4F6BFF" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Expense categories</h3>
            <span className="text-xs text-muted-foreground">This month</span>
          </div>
          <div className="h-64">
            {byCategory.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">No expenses yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="category" innerRadius={50} outerRadius={90}>
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Upcoming bills (30d)</h3>
            <span className="text-xs text-muted-foreground">{upcoming30.length} due</span>
          </div>
          <div className="space-y-2">
            {upcoming30.length === 0 && <p className="text-sm text-muted-foreground">Nothing due — all clear.</p>}
            {upcoming30.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(b.due_date)}</p>
                </div>
                <span className="font-mono text-sm">{formatCurrency(Number(b.amount), b.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recent transactions</h3>
          <span className="text-xs text-muted-foreground">Latest 8</span>
        </div>
        {recentTx.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-border/50">
            {recentTx.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 text-sm">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-md ${
                      t.kind === "income"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {t.kind === "income" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {EXPENSE_CATEGORY_LABELS[t.category] ?? t.category} · {formatDate(t.date)}
                    </p>
                  </div>
                </div>
                <span className={`font-mono ${t.amount < 0 ? "text-red-500" : "text-emerald-500"}`}>
                  {t.amount < 0 ? "−" : "+"}
                  {formatCurrency(Math.abs(t.amount), t.currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
