import type { Database } from "@/integrations/supabase/types";

export type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

export type SubtaskRow = Database["public"]["Tables"]["subtasks"]["Row"];
export type SubtaskInsert = Database["public"]["Tables"]["subtasks"]["Insert"];
export type SubtaskUpdate = Database["public"]["Tables"]["subtasks"]["Update"];

export type TaskCommentRow = Database["public"]["Tables"]["task_comments"]["Row"];
export type TaskCommentInsert = Database["public"]["Tables"]["task_comments"]["Insert"];

export type TaskActivityRow = Database["public"]["Tables"]["task_activity"]["Row"];

export type TaskStatus = "todo" | "in_progress" | "in_review" | "completed" | "blocked";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "in_review", label: "In review" },
  { value: "completed", label: "Completed" },
  { value: "blocked", label: "Blocked" },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  in_review: "In review",
  completed: "Completed",
  blocked: "Blocked",
};

export const TASK_STATUS_STYLES: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  in_review: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  blocked: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export const TASK_PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  urgent: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export const TASK_PRIORITY_RANK: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};
