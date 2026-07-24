import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Download, FileText, MoreHorizontal, Copy, Pencil, Trash2 } from "lucide-react";
import { useFinancePdfExport } from "@/features/finance/use-pdf-export";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  useCreateExpense,
  useDeleteExpense,
  useExpenses,
  useUpdateExpense,
} from "@/features/finance/api";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS, type ExpenseRow } from "@/features/finance/types";
import { ExpenseFormDialog } from "@/features/finance/ExpenseFormDialog";
import { downloadCsv, toCsv } from "@/features/finance/utils";
import { formatCurrency, formatDate } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/finance/expenses")({
  component: ExpensesPage,
});

function ExpensesPage() {
  const { data: expenses = [], isLoading } = useExpenses();
  const create = useCreateExpense();
  const update = useUpdateExpense();
  const remove = useDeleteExpense();
  const exportPdf = useFinancePdfExport();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<"date" | "amount">("date");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseRow | null>(null);

  const filtered = useMemo(() => {
    let list = expenses;
    if (category !== "all") list = list.filter((e) => e.category === category);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((e) =>
        [e.name, e.description, e.vendor, e.notes].some((f) => f?.toLowerCase().includes(s)),
      );
    }
    return [...list].sort((a, b) =>
      sort === "amount" ? Number(b.amount) - Number(a.amount) : b.expense_date.localeCompare(a.expense_date),
    );
  }, [expenses, q, category, sort]);

  const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

  const handleSubmit = async (values: Parameters<Parameters<typeof ExpenseFormDialog>[0]["onSubmit"]>[0]) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, patch: values });
        toast.success("Expense updated");
      } else {
        await create.mutateAsync(values);
        toast.success("Expense added");
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleDuplicate = async (e: ExpenseRow) => {
    try {
      await create.mutateAsync({
        name: `${e.name} (copy)`,
        description: e.description,
        amount: e.amount,
        currency: e.currency,
        category: e.category,
        expense_date: e.expense_date,
        payment_method: e.payment_method,
        vendor: e.vendor,
        project_id: e.project_id,
        notes: e.notes,
        tags: e.tags,
      });
      toast.success("Duplicated");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    await remove.mutateAsync(id);
    toast.success("Expense deleted");
  };

  const handleExport = () => {
    const rows = filtered.map((e) => ({
      name: e.name,
      amount: e.amount,
      currency: e.currency,
      category: EXPENSE_CATEGORY_LABELS[e.category] ?? e.category,
      date: e.expense_date,
      vendor: e.vendor,
      payment_method: e.payment_method,
      notes: e.notes,
    }));
    downloadCsv(`expenses-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  };

  const handleExportPdf = () => {
    exportPdf({
      title: "Expense Report",
      subtitle: category === "all" ? "All categories" : `Category: ${EXPENSE_CATEGORY_LABELS[category] ?? category}`,
      periodLabel: "All time",
      columns: [
        { header: "Name", key: "name" },
        { header: "Category", key: "category" },
        { header: "Vendor", key: "vendor" },
        { header: "Date", key: "expense_date", format: "date" },
        { header: "Amount", key: "amount", format: "currency", currencyKey: "currency", align: "right" },
      ],
      rows: filtered.map((e) => ({
        ...e,
        category: EXPENSE_CATEGORY_LABELS[e.category] ?? e.category,
        vendor: e.vendor ?? "—",
      })),
      totals: [
        { label: "Entries", value: String(filtered.length) },
        { label: "Total", value: formatCurrency(total) },
      ],
      filename: `expenses-${new Date().toISOString().slice(0, 10)}.pdf`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search expenses…" className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {EXPENSE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{EXPENSE_CATEGORY_LABELS[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as never)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Newest first</SelectItem>
            <SelectItem value="amount">Largest first</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> CSV
        </Button>
        <Button variant="outline" onClick={handleExportPdf}>
          <FileText className="mr-2 h-4 w-4" /> PDF
        </Button>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add expense
        </Button>
      </div>

      <div className="surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-sm">
          <span className="text-muted-foreground">{filtered.length} expenses</span>
          <span className="font-mono">Total: {formatCurrency(total)}</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No expenses. Add your first one.</TableCell></TableRow>
            )}
            {filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{e.name}</p>
                    {e.description && <p className="text-xs text-muted-foreground line-clamp-1">{e.description}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{EXPENSE_CATEGORY_LABELS[e.category] ?? e.category}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{e.vendor ?? "—"}</TableCell>
                <TableCell className="text-sm">{formatDate(e.expense_date)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(Number(e.amount), e.currency)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setEditing(e); setDialogOpen(true); }}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(e)}>
                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(e.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ExpenseFormDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}
        expense={editing}
        onSubmit={handleSubmit}
        saving={create.isPending || update.isPending}
      />
    </div>
  );
}
