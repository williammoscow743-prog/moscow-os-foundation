import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { TaskRow, TaskStatus } from "@/features/tasks/types";
import { TASK_STATUS_LABELS } from "@/features/tasks/types";
import type { DateRange } from "./finance-events";
import type { CalendarEvent } from "./types";
import { CALENDAR_KEY } from "./api";

type TaskLike = Pick<TaskRow, "id" | "title" | "due_date" | "status" | "priority">;

/** Map tasks with a due date to calendar events. Stable id per task (dedupe). */
export function buildTaskEvents(
  tasks: TaskLike[],
  range: DateRange,
  today: string = new Date().toISOString().slice(0, 10),
): CalendarEvent[] {
  const seen = new Set<string>();
  const out: CalendarEvent[] = [];
  for (const t of tasks) {
    if (!t.due_date) continue;
    const date = t.due_date.slice(0, 10);
    if (date < range.start || date > range.end) continue;
    const id = `task:${t.id}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const status = t.status as TaskStatus;
    const overdue = status !== "completed" && date < today;
    out.push({
      id,
      source: "task",
      recordId: t.id,
      title: t.title,
      date,
      category: t.priority,
      status: overdue ? "Overdue" : (TASK_STATUS_LABELS[status] ?? t.status),
      link: `/tasks?task=${t.id}`,
    });
  }
  return out;
}

/** Tasks due inside the visible range only; RLS scopes rows to the user. */
export function useTaskCalendarEvents(range: DateRange) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...CALENDAR_KEY, "tasks", user?.id, range.start, range.end],
    enabled: !!user,
    queryFn: async (): Promise<CalendarEvent[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id,title,due_date,status,priority")
        .not("due_date", "is", null)
        .gte("due_date", range.start)
        .lte("due_date", `${range.end}T23:59:59`);
      if (error) throw error;
      return buildTaskEvents((data ?? []) as TaskLike[], range);
    },
  });
}
