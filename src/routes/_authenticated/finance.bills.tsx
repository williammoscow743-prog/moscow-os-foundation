import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, MoreHorizontal, Copy, Pencil, Trash2, Check, Archive, CalendarPlus, FileText } from "lucide-react";
import { useFinancePdfExport } from "@/features/finance/use-pdf-export";
import { toast } from "sonner";
import { addDays } from "date-fns";
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
  useBills,
  useCreateBill,
  useDeleteBill,
  useMarkBillPaid,
  useUpdateBill,
} from "@/features/finance/api";
import {
  BILL_STATUS_LABELS,
  BILL_STATUS_STYLES,
  EXPENSE_CATEGORY_LABELS,
  type BillRow,
} from "@/features/finance/types";
import { BillFormDialog } from "@/features/finance/BillFormDialog";
import { deriveBillStatus } from "@/features/finance/utils";
import { formatCurrency, formatDate } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/finance/bills")({
  component: BillsPage,
});

function BillsPage() {
  const { data: bills = [], isLoading } = useBills();
  const create = useCreateBill();
  const update = useUpdateBill();
  const markPaid = useMarkBillPaid();
  const remove = useDeleteBill();
  const exportPdf = useFinancePdfExport();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BillRow | null>(null);

  const enriched = useMemo(
    () => bills.map((b) => ({ ...b, derived: deriveBillStatus(b) })),
    [bills],
  );

  const filtered = useMemo(() => {
    let list = enriched.filter((b) => !b.archived);
    if (status !== "all") list = list.filter((b) => b.derived === status);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((b) => [b.name, b.description, b.vendor].some((f) => f?.toLowerCase().includes(s)));
    }
    return list;
  }, [enriched, q, status]);

  const handleSubmit = async (values: Parameters<Parameters<typeof BillFormDialog>[0]["onSubmit"]>[0]) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, patch: values });
        toast.success("Bill updated");
      } else {
        await create.mutateAsync(values);
        toast.success("Bill added");
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleSnooze = async (b: BillRow, days: number) => {
    const newDue = addDays(new Date(b.due_date), days).toISOString().slice(0, 10);
    await update.mutateAsync({ id: b.id, patch: { due_date: newDue, snoozed_until: newDue } });
    toast.success(`Snoozed ${days}d`);
  };

  const handleArchive = async (b: BillRow) => {
    await update.mutateAsync({ id: b.id, patch: { archived: true } });
    toast.success("Archived");
  };

  const handleDuplicate = async (b: BillRow) => {
    await create.mutateAsync({
      name: `${b.name} (copy)`,
      description: b.description,
      amount: b.amount,
      currency: b.currency,
      category: b.category,
      due_date: b.due_date,
      frequency: b.frequency,
      vendor: b.vendor,
      notes: b.notes,
    });
    toast.success("Duplicated");
  };

  const totalOutstanding = filtered
    .filter((b) => b.derived !== "paid" && b.derived !== "cancelled")
    .reduce((s, b) => s + Number(b.amount), 0);

  const handleExportPdf = () => {
    exportPdf({
      title: "Bills Report",
      subtitle: status === "all" ? "All statuses" : `Status: ${BILL_STATUS_LABELS[status as keyof typeof BILL_STATUS_LABELS] ?? status}`,
      periodLabel: "All bills",
      columns: [
        { header: "Name", key: "name" },
        { header: "Status", key: "derived_label" },
        { header: "Frequency", key: "frequency" },
        { header: "Due", key: "due_date", format: "date" },
        { header: "Category", key: "category_label" },
        { header: "Amount", key: "amount", format: "currency", currencyKey: "currency", align: "right" },
      ],
      rows: filtered.map((b) => ({
        ...b,
        derived_label: BILL_STATUS_LABELS[b.derived],
        category_label: EXPENSE_CATEGORY_LABELS[b.category] ?? b.category,
      })),
      totals: [
        { label: "Entries", value: String(filtered.length) },
        { label: "Outstanding", value: formatCurrency(totalOutstanding) },
      ],
      filename: `bills-${new Date().toISOString().slice(0, 10)}.pdf`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bills…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="due_today">Due today</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExportPdf}>
          <FileText className="mr-2 h-4 w-4" /> PDF
        </Button>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add bill
        </Button>
      </div>

      <div className="surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No bills yet.</TableCell></TableRow>
            )}
            {filtered.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <p className="font-medium">{b.name}</p>
                  {b.vendor && <p className="text-xs text-muted-foreground">{b.vendor}</p>}
                </TableCell>
                <TableCell>
                  <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-medium", BILL_STATUS_STYLES[b.derived])}>
                    {BILL_STATUS_LABELS[b.derived]}
                  </span>
                </TableCell>
                <TableCell className="text-sm capitalize">{b.frequency}</TableCell>
                <TableCell className="text-sm">{formatDate(b.due_date)}</TableCell>
                <TableCell><Badge variant="secondary">{EXPENSE_CATEGORY_LABELS[b.category] ?? b.category}</Badge></TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(Number(b.amount), b.currency)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {b.derived !== "paid" ? (
                      <Button size="sm" variant="outline" onClick={() => markPaid.mutate({ bill: b, paid: true })}>
                        <Check className="mr-1 h-3.5 w-3.5" /> Paid
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => markPaid.mutate({ bill: b, paid: false })}>
                        Undo
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditing(b); setDialogOpen(true); }}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(b)}>
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSnooze(b, 7)}>
                          <CalendarPlus className="mr-2 h-4 w-4" /> Snooze 7 days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchive(b)}>
                          <Archive className="mr-2 h-4 w-4" /> Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { if (confirm("Delete bill?")) remove.mutate(b.id); }} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BillFormDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}
        bill={editing}
        onSubmit={handleSubmit}
        saving={create.isPending || update.isPending}
      />
    </div>
  );
}
