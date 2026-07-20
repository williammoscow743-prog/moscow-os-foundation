import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const TABS: { label: string; to: string; exact?: boolean }[] = [
  { label: "Dashboard", to: "/finance", exact: true },
  { label: "Expenses", to: "/finance/expenses" },
  { label: "Bills", to: "/finance/bills" },
  { label: "Income", to: "/finance/income" },
  { label: "Budgets", to: "/finance/budgets" },
  { label: "Categories", to: "/finance/categories" },
  { label: "Cash flow", to: "/finance/cash-flow" },
  { label: "Reports", to: "/finance/reports" },
];

export const Route = createFileRoute("/_authenticated/finance")({
  component: FinanceLayout,
});

function FinanceLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Finance</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Money in, money out</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Expenses, bills, income and cash flow — all in one place.
        </p>
      </div>

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-border/60">
        {TABS.map((t) => {
          const active = t.exact ? pathname === t.to : pathname === t.to || pathname.startsWith(t.to + "/");
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}
