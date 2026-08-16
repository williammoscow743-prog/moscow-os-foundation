import type { Database } from "@/integrations/supabase/types";

export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];

/** Notification severity/type, aligned with the design system badge categories. */
export type NotificationType = "info" | "success" | "warning" | "danger";

/** High level module category used for filtering in the notification center. */
export type NotificationCategory = "general" | "finance" | "projects" | "tasks" | "clients";

/**
 * A notification that has been derived by a rule engine but not yet persisted.
 * `dedupe_key` guarantees the same condition is only ever stored once per user.
 */
export type DraftNotification = {
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  entity_id: string | null;
  link: string | null;
  dedupe_key: string;
};

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  general: "General",
  finance: "Finance",
  projects: "Projects",
  tasks: "Tasks",
  clients: "Clients",
};
