import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Users } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useClients,
  useCreateClient,
  useDeleteClient,
  useUpdateClient,
} from "@/features/clients/api";
import { ClientRowItem } from "@/features/clients/ClientRowItem";
import {
  ClientFormDialog,
  type ClientFormSubmit,
} from "@/features/clients/ClientFormDialog";
import {
  CLIENT_STATUSES,
  CLIENT_TYPES,
  type ClientRow,
  type ClientSortKey,
} from "@/features/clients/types";
import { clientDisplayName, matchesClientSearch } from "@/features/clients/utils";

export const Route = createFileRoute("/_authenticated/clients/")({
  component: ClientsPage,
});

function ClientsPage() {
  const { data: clients = [], isLoading } = useClients();
  const createMut = useCreateClient();
  const updateMut = useUpdateClient();
  const deleteMut = useDeleteClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<ClientSortKey>("created_at");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ClientRow | null>(null);
  const [deleting, setDeleting] = useState<ClientRow | null>(null);

  const filtered = useMemo(() => {
    let list = clients.filter((c) => {
      if (statusFilter === "all") {
        if (c.status === "archived") return false;
      } else if (c.status !== statusFilter) return false;
      if (typeFilter !== "all" && c.client_type !== typeFilter) return false;
      return matchesClientSearch(c, search);
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "name") return clientDisplayName(a).localeCompare(clientDisplayName(b));
      if (sortBy === "company")
        return (a.company_name ?? "").localeCompare(b.company_name ?? "");
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return list;
  }, [clients, search, statusFilter, typeFilter, sortBy]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleSubmit = async (values: ClientFormSubmit) => {
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, patch: values });
        toast.success("Client updated");
      } else {
        await createMut.mutateAsync(values);
        toast.success("Client created");
      }
      setFormOpen(false);
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save client");
    }
  };

  const handleArchive = async (c: ClientRow) => {
    try {
      await updateMut.mutateAsync({
        id: c.id,
        patch: { status: "archived", archived_at: new Date().toISOString() },
      });
      toast.success("Client archived");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to archive");
    }
  };

  const handleRestore = async (c: ClientRow) => {
    try {
      await updateMut.mutateAsync({ id: c.id, patch: { status: "active", archived_at: null } });
      toast.success("Client restored");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to restore");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Client deleted");
      setDeleting(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Clients</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Keep every client contact, company and note in one place.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add client
        </Button>
      </div>

      <div className="surface flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, company, email or phone…"
            className="pl-9"
            aria-label="Search clients"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 md:flex md:items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All (non-archived)</SelectItem>
              {CLIENT_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {CLIENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as ClientSortKey)}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Newest first</SelectItem>
              <SelectItem value="name">Sort by name</SelectItem>
              <SelectItem value="company">Sort by company</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "client" : "clients"}
      </p>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-base font-medium">
            {clients.length === 0 ? "No clients yet" : "No clients match your filters"}
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {clients.length === 0
              ? "Add your first client to start building your book of business."
              : "Try a different search term, status or client type."}
          </p>
          {clients.length === 0 && (
            <Button onClick={openCreate} className="mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Add client
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <ClientRowItem
              key={c.id}
              client={c}
              onEdit={(client) => {
                setEditing(client);
                setFormOpen(true);
              }}
              onArchive={handleArchive}
              onRestore={handleRestore}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <ClientFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        client={editing}
        onSubmit={handleSubmit}
        saving={createMut.isPending || updateMut.isPending}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this client?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes{" "}
              <strong>{deleting ? clientDisplayName(deleting) : ""}</strong>. This action cannot be
              undone — archive instead if you may need them later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
