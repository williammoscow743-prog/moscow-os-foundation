import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS, type BudgetRow } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  budget?: BudgetRow | null;
  onSubmit: (values: {
    category: string;
    amount: number;
    currency: string;
    period: "weekly" | "monthly" | "quarterly" | "yearly";
    start_date: string;
  }) => Promise<void> | void;
  saving?: boolean;
};

export function BudgetFormDialog({ open, onOpenChange, budget, onSubmit, saving }: Props) {
  const monthStart = new Date().toISOString().slice(0, 7) + "-01";
  const [form, setForm] = useState({
    category: "other",
    amount: "",
    currency: "ZAR",
    period: "monthly" as "weekly" | "monthly" | "quarterly" | "yearly",
    start_date: monthStart,
  });

  useEffect(() => {
    if (!open) return;
    if (budget) {
      setForm({
        category: budget.category,
        amount: String(budget.amount),
        currency: budget.currency,
        period: budget.period as never,
        start_date: budget.start_date,
      });
    } else {
      setForm({ category: "other", amount: "", currency: "ZAR", period: "monthly", start_date: monthStart });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, budget]);

  const handleSave = () => {
    onSubmit({
      category: form.category,
      amount: Number(form.amount) || 0,
      currency: form.currency,
      period: form.period,
      start_date: form.start_date,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{budget ? "Edit budget" : "New budget"}</DialogTitle>
          <DialogDescription>Cap spending for a category.</DialogDescription>
        </DialogHeader>

        <div className="-mx-6 grid min-h-0 flex-1 gap-4 overflow-y-auto px-6 py-2">
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{EXPENSE_CATEGORY_LABELS[c]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Amount</Label>
              <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Currency</Label>
              <Input value={form.currency} maxLength={3} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Period</Label>
              <Select value={form.period} onValueChange={(v) => setForm({ ...form, period: v as never })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Start date</Label>
              <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
          </div>
        </div>

        <DialogFooter className="-mx-6 -mb-6 mt-auto border-t bg-background px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.amount}>
            {saving ? "Saving…" : budget ? "Save changes" : "Add budget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
