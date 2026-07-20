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
import {
  BILL_FREQUENCIES,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  type BillFrequency,
  type BillRow,
} from "./types";
import { todayIso } from "./utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bill?: BillRow | null;
  onSubmit: (values: {
    name: string;
    description: string | null;
    amount: number;
    currency: string;
    category: string;
    due_date: string;
    frequency: BillFrequency;
    vendor: string | null;
    notes: string | null;
  }) => Promise<void> | void;
  saving?: boolean;
};

export function BillFormDialog({ open, onOpenChange, bill, onSubmit, saving }: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    amount: "",
    currency: "USD",
    category: "other",
    due_date: todayIso(),
    frequency: "monthly" as BillFrequency,
    vendor: "",
    notes: "",
  });

  useEffect(() => {
    if (!open) return;
    if (bill) {
      setForm({
        name: bill.name,
        description: bill.description ?? "",
        amount: String(bill.amount),
        currency: bill.currency,
        category: bill.category,
        due_date: bill.due_date,
        frequency: bill.frequency as BillFrequency,
        vendor: bill.vendor ?? "",
        notes: bill.notes ?? "",
      });
    } else {
      setForm({
        name: "",
        description: "",
        amount: "",
        currency: "USD",
        category: "other",
        due_date: todayIso(),
        frequency: "monthly",
        vendor: "",
        notes: "",
      });
    }
  }, [open, bill]);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    await onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || null,
      amount: Number(form.amount) || 0,
      currency: form.currency,
      category: form.category,
      due_date: form.due_date,
      frequency: form.frequency,
      vendor: form.vendor.trim() || null,
      notes: form.notes.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{bill ? "Edit bill" : "New bill"}</DialogTitle>
          <DialogDescription>Recurring or one-off bill to track.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{EXPENSE_CATEGORY_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Frequency</Label>
              <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v as BillFrequency })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BILL_FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Due date</Label>
              <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Vendor</Label>
              <Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
            </div>
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
          <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
            {saving ? "Saving…" : bill ? "Save changes" : "Add bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
