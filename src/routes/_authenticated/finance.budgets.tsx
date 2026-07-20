import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { parseISO, startOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useBudgets,
  useCreateBudget,
  useDeleteBudget,
  useExpenses,
  useUpdateBudget,
} from "@/features/finance/api";
import { BudgetFormDialog } from "@/features/finance/BudgetFormDialog";
import { EXPENSE_CATEGORY_LABELS, type BudgetRow } from "@/features/finance/types";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/finance/budgets")({
  component: BudgetsPage,
});

function BudgetsPage() {
  const { data: budgets = [], isLoading } = useBudgets();
  const { data: expenses = [] } = useExpenses();
  const create = useCreateBudget();
  const update = useUpdateBudget();
  const remove = useDeleteBudget();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetRow | null>(null);

  const withUsage = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    return budgets.map((b) => {
      const spent = expenses
        .filter((e) => e.category === b.category && parseISO(e.expense_date) >= monthStart)
        .reduce((s, e) => s + Number(e.amount), 0);
      const pct = Number(b.amount) > 0 ? (spent / Number(b.amount)) * 100 : 0;
      return { ...b, spent, pct, remaining: Math.max(0, Number(b.amount) - spent) };
    });
  }, [budgets, expenses]);

  const handleSubmit = async (values: Parameters<Parameters<typeof BudgetFormDialog>[0]["onSubmit"]>[0]) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, patch: values });
        toast.success("Budget updated");
      } else {
        await create.mutateAsync(values);
        toast.success("Budget created");
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New budget
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && withUsage.length === 0 && (
        <div className="surface p-8 text-center">
          <p className="text-sm text-muted-foreground">No budgets yet. Set spending caps by category to stay on track.</p>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {withUsage.map((b) => {
          const tone =
            b.pct >= 100 ? "text-red-500" :
            b.pct >= 90 ? "text-red-400" :
            b.pct >= 75 ? "text-amber-500" :
            b.pct >= 50 ? "text-blue-500" : "text-emerald-500";
          const barColor =
            b.pct >= 100 ? "[&>div]:bg-red-500" :
            b.pct >= 75 ? "[&>div]:bg-amber-500" : "[&>div]:bg-primary";
          return (
            <div key={b.id} className="surface p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{EXPENSE_CATEGORY_LABELS[b.category] ?? b.category}</p>
                  <p className="text-xs text-muted-foreground capitalize">{b.period}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setEditing(b); setDialogOpen(true); }}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { if (confirm("Delete budget?")) remove.mutate(b.id); }} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-2xl font-semibold tracking-tight">{formatCurrency(b.spent, b.currency)}</span>
                <span className="text-sm text-muted-foreground">of {formatCurrency(Number(b.amount), b.currency)}</span>
              </div>
              <Progress value={Math.min(100, b.pct)} className={cn("h-2", barColor)} />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={cn("font-medium", tone)}>
                  {b.pct >= 100 && <AlertTriangle className="mr-1 inline h-3 w-3" />}
                  {b.pct.toFixed(0)}% used
                </span>
                <span className="text-muted-foreground">{formatCurrency(b.remaining, b.currency)} remaining</span>
              </div>
            </div>
          );
        })}
      </div>

      <BudgetFormDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}
        budget={editing}
        onSubmit={handleSubmit}
        saving={create.isPending || update.isPending}
      />
    </div>
  );
}
