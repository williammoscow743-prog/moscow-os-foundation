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
import { INCOME_CATEGORIES, INCOME_CATEGORY_LABELS, type IncomeRow } from "./types";
import { todayIso } from "./utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  income?: IncomeRow | null;
  onSubmit: (values: {
    source: string;
    description: string | null;
    amount: number;
    currency: string;
    category: string;
    received_date: string;
    project_id: string | null;
    notes: string | null;
  }) => Promise<void> | void;
  saving?: boolean;
};

export function IncomeFormDialog({ open, onOpenChange, income, onSubmit, saving }: Props) {
  const { data: projects = [] } = useProjects();
  const [form, setForm] = useState({
    source: "",
    description: "",
    amount: "",
    currency: "USD",
    category: "other",
    received_date: todayIso(),
    project_id: "none",
    notes: "",
  });

  useEffect(() => {
    if (!open) return;
    if (income) {
      setForm({
        source: income.source,
        description: income.description ?? "",
        amount: String(income.amount),
        currency: income.currency,
        category: income.category,
        received_date: income.received_date,
        project_id: income.project_id ?? "none",
        notes: income.notes ?? "",
      });
    } else {
      setForm({
        source: "",
        description: "",
        amount: "",
        currency: "USD",
        category: "other",
        received_date: todayIso(),
        project_id: "none",
        notes: "",
      });
    }
  }, [open, income]);

  const handleSave = async () => {
    if (!form.source.trim()) return;
    await onSubmit({
      source: form.source.trim(),
      description: form.description.trim() || null,
      amount: Number(form.amount) || 0,
      currency: form.currency,
      category: form.category,
      received_date: form.received_date,
      project_id: form.project_id === "none" ? null : form.project_id,
      notes: form.notes.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{income ? "Edit income" : "New income"}</DialogTitle>
          <DialogDescription>Record money received.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Source</Label>
            <Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Client, employer…" />
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
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INCOME_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{INCOME_CATEGORY_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Received</Label>
              <Input type="date" value={form.received_date} onChange={(e) => setForm({ ...form, received_date: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Project (optional)</Label>
            <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
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
            <Label>Notes</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.source.trim()}>
            {saving ? "Saving…" : income ? "Save changes" : "Add income"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
