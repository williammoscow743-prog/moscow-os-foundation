import type { TaskRow, TaskUpdate, TaskPriority, TaskStatus } from "./types";

/** Shape submitted by the task form to create/update hooks. */
export type TaskFormSubmit = {
  title: string;
  description: string | null;
  status: string;
  priority: string;
  progress: number;
  due_date: string | null;
  estimated_hours: number | null;
  project_id: string;
  milestone_id: string | null;
  assigned_to: string | null;
};

export type TaskFormState = {
  title: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  due_date: string;
  estimated_hours: string;
  project_id: string;
  milestone_id: string;
  assigned_to: string;
};

export const emptyTaskForm: TaskFormState = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  progress: 0,
  due_date: "",
  estimated_hours: "",
  project_id: "",
  milestone_id: "",
  assigned_to: "",
};

/** Populate the form from an existing task (edit mode). */
export function taskToFormState(task: TaskRow): TaskFormState {
  return {
    title: task.title,
    description: task.description ?? "",
    status: task.status ?? "todo",
    priority: task.priority ?? "medium",
    progress: task.progress ?? 0,
    due_date: task.due_date ?? "",
    estimated_hours: task.estimated_hours != null ? String(task.estimated_hours) : "",
    project_id: task.project_id,
    milestone_id: task.milestone_id ?? "",
    assigned_to: task.assigned_to ?? "",
  };
}

/** A task always needs a title and a parent project. */
export function isTaskFormValid(form: TaskFormState): boolean {
  return form.title.trim().length > 0 && form.project_id.length > 0;
}

/** Normalize raw form values into the payload sent to the database. */
export function buildTaskSubmit(form: TaskFormState): TaskFormSubmit {
  const estimate = form.estimated_hours.trim();
  const parsed = estimate === "" ? null : Number(estimate);
  return {
    title: form.title.trim(),
    description: form.description.trim() || null,
    status: form.status || "todo",
    priority: form.priority || "medium",
    progress: Math.min(100, Math.max(0, Math.round(form.progress ?? 0))),
    due_date: form.due_date || null,
    estimated_hours: parsed != null && Number.isFinite(parsed) ? parsed : null,
    project_id: form.project_id,
    milestone_id: form.milestone_id || null,
    assigned_to: form.assigned_to || null,
  };
}

/** Patch for a status change; completing a task stamps completion + 100% progress. */
export function statusChangePatch(task: TaskRow, status: TaskStatus, now = new Date()): TaskUpdate {
  return {
    status,
    completed_at: status === "completed" ? now.toISOString() : null,
    progress: status === "completed" ? 100 : task.progress,
  };
}

/** Patch that flips a task between completed and to-do. */
export function toggleCompletePatch(task: TaskRow, now = new Date()): TaskUpdate {
  const next: TaskStatus = task.status === "completed" ? "todo" : "completed";
  return statusChangePatch(task, next, now);
}

export function priorityChangePatch(priority: TaskPriority): TaskUpdate {
  return { priority };
}

export function dueDatePatch(value: string): TaskUpdate {
  return { due_date: value || null };
}
