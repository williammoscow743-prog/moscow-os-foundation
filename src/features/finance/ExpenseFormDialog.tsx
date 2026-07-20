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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/features/projects/api";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  type ExpenseRow,
} from "./types";
import { todayIso } from "./utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  expense?: ExpenseRow | null;
  defaultProjectId?: string;
  onSubmit: (values: {
    name: string;
    description: string | null;
    amount: number;
    currency: string;
    category: string;
    expense_date: string;
    payment_method: string | null;
    vendor: string | null;
    project_id: string | null;
    notes: string | null;
    tags: string[];
  }) => Promise<void> | void;
  saving?: boolean;
};

export function ExpenseFormDialog({ open, onOpenChange, expense, defaultProjectId, onSubmit, saving }: Props) {
  const { data: projects = [] } = useProjects();
  const [form, setForm] = useState({
    name: "",
    description: "",
    amount: "",
    currency: "USD",
    category: "other",
    expense_date: todayIso(),
    payment_method: "none",
    vendor: "",
    project_id: defaultProjectId ?? "none",
    notes: "",
    tags: "",
  });

  useEffect(() => {
    if (!open) return;
    if (expense) {
      setForm({
        name: expense.name,
        description: expense.description ?? "",
        amount: String(expense.amount ?? ""),
        currency: expense.currency ?? "USD",
        category: expense.category ?? "other",
        expense_date: expense.expense_date,
        payment_method: expense.payment_method ?? "none",
        vendor: expense.vendor ?? "",
        project_id: expense.project_id ?? "none",
        notes: expense.notes ?? "",
        tags: (expense.tags ?? []).join(", "),
      });
    } else {
      setForm((f) => ({ ...f, project_id: defaultProjectId ?? "none" }));
    }
  }, [open, expense, defaultProjectId]);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    await onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || null,
      amount: Number(form.amount) || 0,
      currency: form.currency,
      category: form.category,
      expense_date: form.expense_date,
      payment_method: form.payment_method === "none" ? null : form.payment_method,
      vendor: form.vendor.trim() || null,
      project_id: form.project_id === "none" ? null : form.project_id,
      notes: form.notes.trim() || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{expense ? "Edit expense" : "New expense"}</DialogTitle>
          <DialogDescription>Track a business or personal expense.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Office rent, AWS…" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Currency</Label>
              <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} maxLength={3} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input type="date" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Payment method</Label>
              <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
                <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  {PAYMENT_METHODS.map((p) => (
                    <SelectItem key={p} value={p}>{PAYMENT_METHOD_LABELS[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Vendor</Label>
              <Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} placeholder="Acme Inc." />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Project (optional)</Label>
            <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
              <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid gap-2">
            <Label>Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="q1, recurring" />
          </div>

          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
            {saving ? "Saving…" : expense ? "Save changes" : "Add expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
