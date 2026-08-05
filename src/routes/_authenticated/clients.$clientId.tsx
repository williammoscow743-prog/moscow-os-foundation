import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Archive,
  Building2,
  Globe,
  Mail,
  Pencil,
  Phone,
  RotateCcw,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { cn } from "@/lib/utils";
import { useClient, useDeleteClient, useUpdateClient } from "@/features/clients/api";
import {
  ClientFormDialog,
  type ClientFormSubmit,
} from "@/features/clients/ClientFormDialog";
import { ClientProjectsSection } from "@/features/projects/ClientProjectsSection";
import type { ClientStatus, ClientType } from "@/features/clients/types";
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_STYLES,
  CLIENT_TYPE_LABELS,
  clientDisplayName,
  clientInitials,
  formatClientAddress,
} from "@/features/clients/utils";

export const Route = createFileRoute("/_authenticated/clients/$clientId")({
  component: ClientProfilePage,
});

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="text-sm">{value || <span className="text-muted-foreground">—</span>}</p>
    </div>
  );
}

function ClientProfilePage() {
  const { clientId } = Route.useParams();
  const navigate = useNavigate();
  const { data: client, isLoading } = useClient(clientId);
  const updateMut = useUpdateClient();
  const deleteMut = useDeleteClient();
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="surface flex flex-col items-center gap-3 px-6 py-16 text-center">
        <h1 className="text-lg font-medium">Client not found</h1>
        <p className="text-sm text-muted-foreground">
          This client may have been deleted or you don't have access to it.
        </p>
        <Button asChild variant="secondary">
          <Link to="/clients">Back to clients</Link>
        </Button>
      </div>
    );
  }

  const status = (client.status as ClientStatus) ?? "active";
  const type = (client.client_type as ClientType) ?? "individual";

  const handleSubmit = async (values: ClientFormSubmit) => {
    try {
      await updateMut.mutateAsync({ id: client.id, patch: values });
      toast.success("Client updated");
      setFormOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save client");
    }
  };

  const toggleArchive = async () => {
    try {
      await updateMut.mutateAsync({
        id: client.id,
        patch:
          status === "archived"
            ? { status: "active", archived_at: null }
            : { status: "archived", archived_at: new Date().toISOString() },
      });
      toast.success(status === "archived" ? "Client restored" : "Client archived");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const doDelete = async () => {
    try {
      await deleteMut.mutateAsync(client.id);
      toast.success("Client deleted");
      navigate({ to: "/clients" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-8">
      <Link
        to="/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Clients
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {clientInitials(client)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {clientDisplayName(client)}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1 text-[11px]">
                {type === "business" ? (
                  <Building2 className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                {CLIENT_TYPE_LABELS[type]}
              </Badge>
              <Badge className={cn("text-[11px]", CLIENT_STATUS_STYLES[status])}>
                {CLIENT_STATUS_LABELS[status]}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setFormOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="secondary" onClick={toggleArchive} disabled={updateMut.isPending}>
            {status === "archived" ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4" /> Restore
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" /> Archive
              </>
            )}
          </Button>
          <Button variant="ghost" className="text-destructive" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface space-y-4 p-5">
          <h2 className="text-sm font-medium">Contact information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Email"
              value={
                client.email ? (
                  <a
                    href={`mailto:${client.email}`}
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {client.email}
                  </a>
                ) : null
              }
            />
            <Field
              label="Phone"
              value={
                client.phone ? (
                  <a
                    href={`tel:${client.phone}`}
                    className="inline-flex items-center gap-1.5 hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {client.phone}
                  </a>
                ) : null
              }
            />
            <Field label="Alternative phone" value={client.alternative_phone} />
            <Field
              label="Website"
              value={
                client.website ? (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {client.website}
                  </a>
                ) : null
              }
            />
          </div>
        </section>

        <section className="surface space-y-4 p-5">
          <h2 className="text-sm font-medium">Company</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name" value={client.company_name} />
            <Field label="Client type" value={CLIENT_TYPE_LABELS[type]} />
            <Field label="Status" value={CLIENT_STATUS_LABELS[status]} />
            <Field
              label="Archived"
              value={client.archived_at ? format(new Date(client.archived_at), "d MMM yyyy") : null}
            />
          </div>
        </section>

        <section className="surface space-y-4 p-5">
          <h2 className="text-sm font-medium">Address</h2>
          <Field label="Full address" value={formatClientAddress(client)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" value={client.city} />
            <Field label="Province" value={client.province} />
            <Field label="Postal code" value={client.postal_code} />
            <Field label="Country" value={client.country} />
          </div>
        </section>

        <section className="surface space-y-4 p-5">
          <h2 className="text-sm font-medium">Notes & record</h2>
          <Field label="Notes" value={client.notes} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Created" value={format(new Date(client.created_at), "d MMM yyyy, HH:mm")} />
            <Field
              label="Last updated"
              value={format(new Date(client.updated_at), "d MMM yyyy, HH:mm")}
            />
          </div>
        </section>
      </div>

      <ClientProjectsSection clientId={client.id} />

      <ClientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        client={client}
        onSubmit={handleSubmit}
        saving={updateMut.isPending}
      />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this client?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes <strong>{clientDisplayName(client)}</strong>. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
