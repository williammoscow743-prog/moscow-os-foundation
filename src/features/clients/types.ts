import type { Database } from "@/integrations/supabase/types";

export type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

export type ClientStatus = "active" | "inactive" | "archived";
export type ClientType = "individual" | "business";

export const CLIENT_STATUSES: { value: ClientStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
];

export const CLIENT_TYPES: { value: ClientType; label: string }[] = [
  { value: "individual", label: "Individual" },
  { value: "business", label: "Business" },
];

export type ClientSortKey = "created_at" | "name" | "company";
