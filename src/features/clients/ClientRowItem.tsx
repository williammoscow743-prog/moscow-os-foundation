import { Link } from "@tanstack/react-router";
import { Building2, Mail, MoreHorizontal, Pencil, Phone, Trash2, Archive, RotateCcw, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ClientRow, ClientStatus, ClientType } from "./types";
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_STYLES,
  CLIENT_TYPE_LABELS,
  clientDisplayName,
  clientInitials,
} from "./utils";

type Props = {
  client: ClientRow;
  onEdit: (c: ClientRow) => void;
  onArchive: (c: ClientRow) => void;
  onRestore: (c: ClientRow) => void;
  onDelete: (c: ClientRow) => void;
};

export function ClientRowItem({ client, onEdit, onArchive, onRestore, onDelete }: Props) {
  const status = (client.status as ClientStatus) ?? "active";
  const type = (client.client_type as ClientType) ?? "individual";

  return (
    <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
      <Link
        to="/clients/$clientId"
        params={{ clientId: client.id }}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {clientInitials(client)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{clientDisplayName(client)}</p>
          <p className="truncate text-xs text-muted-foreground">
            {client.company_name || CLIENT_TYPE_LABELS[type]}
          </p>
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
        {client.email && (
          <span className="flex min-w-0 items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{client.email}</span>
          </span>
        )}
        {client.phone && (
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            {client.phone}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1 text-[11px] font-medium">
          {type === "business" ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
          {CLIENT_TYPE_LABELS[type]}
        </Badge>
        <Badge className={cn("text-[11px] font-medium", CLIENT_STATUS_STYLES[status])}>
          {CLIENT_STATUS_LABELS[status]}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={`Actions for ${clientDisplayName(client)}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(client)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            {status === "archived" ? (
              <DropdownMenuItem onClick={() => onRestore(client)}>
                <RotateCcw className="mr-2 h-4 w-4" /> Restore
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onArchive(client)}>
                <Archive className="mr-2 h-4 w-4" /> Archive
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(client)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
