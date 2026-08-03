import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Download, FileText, FileSpreadsheet } from "lucide-react";
import { useFinancePdfExport } from "@/features/finance/use-pdf-export";
import type { PdfExportOptions } from "@/features/finance/pdf-export";
import { useFinanceExcelExport } from "@/features/finance/hooks/useFinanceExcelExport";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  useCreateIncome,
  useDeleteIncome,
  useIncome,
  useUpdateIncome,
} from "@/features/finance/api";
import { INCOME_CATEGORIES, INCOME_CATEGORY_LABELS, type IncomeRow } from "@/features/finance/types";
import { IncomeFormDialog } from "@/features/finance/IncomeFormDialog";
import { downloadCsv, toCsv } from "@/features/finance/utils";
import { formatCurrency, formatDate } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/finance/income")({
  component: IncomePage,
});

function IncomePage() {
  const { data: income = [], isLoading } = useIncome();
  const create = useCreateIncome();
  const update = useUpdateIncome();
  const remove = useDeleteIncome();
  const exportPdf = useFinancePdfExport();
  const exportExcel = useFinanceExcelExport();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IncomeRow | null>(null);

  const filtered = useMemo(() => {
    let list = income;
    if (category !== "all") list = list.filter((i) => i.category === category);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((i) => [i.source, i.description, i.notes].some((f) => f?.toLowerCase().includes(s)));
    }
    return list;
  }, [income, q, category]);

  const total = filtered.reduce((s, i) => s + Number(i.amount), 0);

  const handleSubmit = async (values: Parameters<Parameters<typeof IncomeFormDialog>[0]["onSubmit"]>[0]) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, patch: values });
        toast.success("Income updated");
      } else {
        await create.mutateAsync(values);
        toast.success("Income recorded");
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleExport = () => {
    const rows = filtered.map((i) => ({
      source: i.source,
      amount: i.amount,
      currency: i.currency,
      category: INCOME_CATEGORY_LABELS[i.category] ?? i.category,
      received_date: i.received_date,
      notes: i.notes,
    }));
    downloadCsv(`income-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  };

  const buildReport = (): Omit<PdfExportOptions, "userName" | "filename"> => ({
      title: "Income Report",
      subtitle: category === "all" ? "All categories" : `Category: ${INCOME_CATEGORY_LABELS[category] ?? category}`,
      periodLabel: "All time",
      columns: [
        { header: "Source", key: "source" },
        { header: "Category", key: "category_label" },
        { header: "Date", key: "received_date", format: "date" },
        { header: "Amount", key: "amount", format: "currency", currencyKey: "currency", align: "right" },
      ],
      rows: filtered.map((i) => ({
        ...i,
        category_label: INCOME_CATEGORY_LABELS[i.category] ?? i.category,
      })),
      totals: [
        { label: "Entries", value: String(filtered.length) },
        { label: "Total income", value: formatCurrency(total) },
      ],
    });

  const handleExportPdf = () => exportPdf({ ...buildReport(), filename: `income-${new Date().toISOString().slice(0, 10)}.pdf` });
  const handleExportExcel = () => { void exportExcel({ ...buildReport(), filename: `income-${new Date().toISOString().slice(0, 10)}.xlsx` }); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search income…" className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {INCOME_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{INCOME_CATEGORY_LABELS[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> CSV
        </Button>
        <Button variant="outline" onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
        </Button>
        <Button variant="outline" onClick={handleExportPdf}>
          <FileText className="mr-2 h-4 w-4" /> PDF
        </Button>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add income
        </Button>
      </div>

      <div className="surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-sm">
          <span className="text-muted-foreground">{filtered.length} entries</span>
          <span className="font-mono text-emerald-500">Total: {formatCurrency(total)}</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No income entries.</TableCell></TableRow>
            )}
            {filtered.map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  <p className="font-medium">{i.source}</p>
                  {i.description && <p className="text-xs text-muted-foreground line-clamp-1">{i.description}</p>}
                </TableCell>
                <TableCell><Badge variant="secondary">{INCOME_CATEGORY_LABELS[i.category] ?? i.category}</Badge></TableCell>
                <TableCell className="text-sm">{formatDate(i.received_date)}</TableCell>
                <TableCell className="text-right font-mono text-emerald-500">
                  +{formatCurrency(Number(i.amount), i.currency)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setEditing(i); setDialogOpen(true); }}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { if (confirm("Delete income?")) remove.mutate(i.id); }} className="text-destructive">
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

      <IncomeFormDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}
        income={editing}
        onSubmit={handleSubmit}
        saving={create.isPending || update.isPending}
      />
    </div>
  );
}
