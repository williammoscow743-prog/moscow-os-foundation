import type { ClientRow, ClientStatus, ClientType } from "./types";

export function clientDisplayName(c: ClientRow): string {
  const name = `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim();
  return name || c.company_name || "Unnamed client";
}

export function clientInitials(c: ClientRow): string {
  const a = (c.first_name ?? "").trim()[0] ?? "";
  const b = (c.last_name ?? "").trim()[0] ?? "";
  return (a + b).toUpperCase() || (c.company_name ?? "?").trim()[0]?.toUpperCase() || "?";
}

export function matchesClientSearch(c: ClientRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [c.first_name, c.last_name, c.company_name, c.email, c.phone, c.alternative_phone]
    .filter(Boolean)
    .some((v) => String(v).toLowerCase().includes(q));
}

export const CLIENT_STATUS_STYLES: Record<ClientStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  inactive: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  archived: "bg-muted text-muted-foreground",
};

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  individual: "Individual",
  business: "Business",
};

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function formatClientAddress(c: ClientRow): string {
  return [c.address, c.city, c.province, c.postal_code, c.country].filter(Boolean).join(", ");
}
