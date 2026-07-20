import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateExpenseCategory,
  useDeleteExpenseCategory,
  useExpenseCategories,
} from "@/features/finance/api";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS } from "@/features/finance/types";

export const Route = createFileRoute("/_authenticated/finance/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories = [] } = useExpenseCategories();
  const create = useCreateExpenseCategory();
  const remove = useDeleteExpenseCategory();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4F6BFF");

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await create.mutateAsync({ name: name.trim(), color });
      toast.success("Category added");
      setOpen(false);
      setName("");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="surface p-5">
        <h3 className="mb-3 text-sm font-semibold">Built-in categories</h3>
        <div className="flex flex-wrap gap-2">
          {EXPENSE_CATEGORIES.map((c) => (
            <span key={c} className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 text-xs">
              {EXPENSE_CATEGORY_LABELS[c]}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">These are always available across expenses, bills and budgets.</p>
      </section>

      <section className="surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Custom categories</h3>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> New
          </Button>
        </div>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No custom categories yet.</p>
        ) : (
          <ul className="divide-y divide-border/50">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: c.color ?? "#4F6BFF" }} />
                  <span className="text-sm">{c.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) remove.mutate(c.id); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New category</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Utilities" />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-20 p-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || create.isPending}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
