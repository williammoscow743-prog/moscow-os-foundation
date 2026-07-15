import type { Database } from "@/integrations/supabase/types";

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type ProjectStatus = "active" | "on_hold" | "completed" | "archived";
export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On hold" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export const PROJECT_PRIORITIES: { value: ProjectPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const PROJECT_CATEGORIES = [
  "Client Work",
  "Internal",
  "Marketing",
  "Product",
  "Operations",
  "Research",
  "Personal",
] as const;

export const PROJECT_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
] as const;

export const PRIORITY_RANK: Record<ProjectPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export type SortKey = "due_date" | "priority" | "created_at";
