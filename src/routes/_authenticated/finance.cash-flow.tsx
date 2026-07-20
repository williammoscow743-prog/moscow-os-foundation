import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO, startOfWeek, startOfMonth, startOfYear, subDays, subMonths, subYears, addDays, addMonths, addYears } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/common/StatCard";
import { formatCurrency } from "@/utils/format";
import { useExpenses, useIncome } from "@/features/finance/api";

type Range = "weekly" | "monthly" | "yearly";

export const Route = createFileRoute("/_authenticated/finance/cash-flow")({
  component: CashFlowPage,
});

function CashFlowPage() {
  const [range, setRange] = useState<Range>("monthly");
  const { data: expenses = [] } = useExpenses();
  const { data: income = [] } = useIncome();

  const series = useMemo(() => {
    const now = new Date();
    const buckets: { label: string; start: Date; end: Date }[] = [];

    if (range === "weekly") {
      for (let i = 11; i >= 0; i--) {
        const start = startOfWeek(subDays(now, i * 7));
        buckets.push({ label: format(start, "MMM d"), start, end: addDays(start, 7) });
      }
    } else if (range === "monthly") {
      for (let i = 11; i >= 0; i--) {
        const start = startOfMonth(subMonths(now, i));
        buckets.push({ label: format(start, "MMM yy"), start, end: addMonths(start, 1) });
      }
    } else {
      for (let i = 4; i >= 0; i--) {
        const start = startOfYear(subYears(now, i));
        buckets.push({ label: format(start, "yyyy"), start, end: addYears(start, 1) });
      }
    }

    let running = 0;
    return buckets.map((b) => {
      const inc = income.filter((i) => {
        const d = parseISO(i.received_date);
        return d >= b.start && d < b.end;
      }).reduce((s, i) => s + Number(i.amount), 0);
      const exp = expenses.filter((e) => {
        const d = parseISO(e.expense_date);
        return d >= b.start && d < b.end;
      }).reduce((s, e) => s + Number(e.amount), 0);
      const opening = running;
      running = opening + inc - exp;
      return {
        label: b.label,
        opening,
        income: inc,
        expenses: exp,
        net: inc - exp,
        closing: running,
      };
    });
  }, [expenses, income, range]);

  const latest = series[series.length - 1];
  const totalIncome = series.reduce((s, r) => s + r.income, 0);
  const totalExpenses = series.reduce((s, r) => s + r.expenses, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Running balance from all recorded income and expenses.</p>
        <Select value={range} onValueChange={(v) => setRange(v as Range)}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Opening balance" value={formatCurrency(latest?.opening ?? 0)} />
        <StatCard label="Total income" value={formatCurrency(totalIncome)} tone="success" />
        <StatCard label="Total expenses" value={formatCurrency(totalExpenses)} tone="danger" />
        <StatCard label="Closing balance" value={formatCurrency(latest?.closing ?? 0)} tone={(latest?.closing ?? 0) >= 0 ? "success" : "danger"} />
      </div>

      <div className="surface p-5">
        <h3 className="mb-4 text-sm font-semibold">Running balance</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F6BFF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#4F6BFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="label" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="closing" stroke="#4F6BFF" fill="url(#cf)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="surface p-5">
        <h3 className="mb-4 text-sm font-semibold">Net per period</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="label" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="net" radius={[4, 4, 0, 0]}>
                {series.map((r, i) => (
                  <rect key={i} fill={r.net >= 0 ? "#22C55E" : "#F04848"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
