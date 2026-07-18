import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { differenceInDays, isPast, startOfToday } from "date-fns";
import {
  CheckSquare,
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  AlertTriangle,
  Timer,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { cn } from "@/lib/utils";

import { useProjects } from "@/features/projects/api";
import {
  useAllTasks,
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
} from "@/features/tasks/api";
import { TaskFormDialog, type TaskFormSubmit } from "@/features/tasks/TaskFormDialog";
import { TaskCard } from "@/features/tasks/TaskCard";
import { TaskListRow } from "@/features/tasks/TaskListRow";
import { TaskDrawer } from "@/features/tasks/TaskDrawer";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_RANK,
  TASK_STATUSES,
  type TaskPriority,
  type TaskRow,
  type TaskStatus,
} from "@/features/tasks/types";

export const Route = createFileRoute("/_authenticated/tasks")({
  component: TasksPage,
});

function TasksPage() {
  const { data: tasks = [], isLoading } = useAllTasks();
  const { data: projects = [] } = useProjects();
  const createMut = useCreateTask();
  const updateMut = useUpdateTask();
  const deleteMut = useDeleteTask();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [projectId, setProjectId] = useState<string>("all");
  const [view, setView] = useState<"grid" | "list">("list");

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<TaskRow | null>(null);
  const [deleting, setDeleting] = useState<TaskRow | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const projectMap = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p.name])),
    [projects],
  );

  const stats = useMemo(() => {
    const today = startOfToday();
    let open = 0;
    let inProgress = 0;
    let completed = 0;
    let overdue = 0;
    let dueSoon = 0;
    let urgent = 0;
    for (const t of tasks) {
      const s = (t.status as TaskStatus) ?? "todo";
      const p = (t.priority as TaskPriority) ?? "medium";
      if (s === "completed") completed++;
      else open++;
      if (s === "in_progress") inProgress++;
      if (p === "urgent" && s !== "completed") urgent++;
      if (t.due_date && s !== "completed") {
        const d = new Date(t.due_date);
        if (isPast(d) && d < today) overdue++;
        else {
          const days = differenceInDays(d, today);
          if (days >= 0 && days <= 7) dueSoon++;
        }
      }
    }
    return { open, inProgress, completed, overdue, dueSoon, urgent, total: tasks.length };
  }, [tasks]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = tasks.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (projectId !== "all" && t.project_id !== projectId) return false;
      if (!query) return true;
      return (
        t.title.toLowerCase().includes(query) ||
        (t.description ?? "").toLowerCase().includes(query)
      );
    });
    return list.sort((a, b) => {
      const ac = a.status === "completed" ? 1 : 0;
      const bc = b.status === "completed" ? 1 : 0;
      if (ac !== bc) return ac - bc;
      const ap = TASK_PRIORITY_RANK[(a.priority as TaskPriority) ?? "medium"];
      const bp = TASK_PRIORITY_RANK[(b.priority as TaskPriority) ?? "medium"];
      if (ap !== bp) return ap - bp;
      const ad = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const bd = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      return ad - bd;
    });
  }, [tasks, q, status, priority, projectId]);

  const create = async (values: TaskFormSubmit) => {
    try {
      await createMut.mutateAsync(values);
      toast.success("Task created");
      setOpenForm(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create task");
    }
  };

  const update = async (values: TaskFormSubmit) => {
    if (!editing) return;
    try {
      await updateMut.mutateAsync({ id: editing.id, patch: values });
      toast.success("Task updated");
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update task");
    }
  };

  const toggleComplete = async (t: TaskRow) => {
    const isCompleted = t.status === "completed";
    const nextStatus: TaskStatus = isCompleted ? "todo" : "completed";
    try {
      await updateMut.mutateAsync({
        id: t.id,
        patch: {
          status: nextStatus,
          completed_at: nextStatus === "completed" ? new Date().toISOString() : null,
          progress: nextStatus === "completed" ? 100 : t.progress,
        },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const remove = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Task deleted");
      setDeleting(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Tasks</h1>
              <p className="text-sm text-muted-foreground">
                Everything that needs your attention, across every project.
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOpenForm(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> New task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="Open"
          value={stats.open}
          hint={`${stats.inProgress} in progress`}
          icon={<Timer className="h-4 w-4" />}
        />
        <Stat
          label="Due this week"
          value={stats.dueSoon}
          icon={<CheckSquare className="h-4 w-4" />}
          tone="info"
        />
        <Stat
          label="Overdue"
          value={stats.overdue}
          icon={<AlertTriangle className="h-4 w-4" />}
          tone={stats.overdue > 0 ? "danger" : "default"}
        />
        <Stat
          label="Completed"
          value={stats.completed}
          hint={`${stats.total} total`}
          icon={<CheckCircle2 className="h-4 w-4" />}
          tone="success"
        />
      </div>

      {stats.urgent > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm">
          <Flame className="h-4 w-4 text-red-500" />
          <span>
            <strong className="text-red-600 dark:text-red-400">{stats.urgent}</strong> urgent
            {stats.urgent === 1 ? " task needs" : " tasks need"} attention.
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="surface flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tasks…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {TASK_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {TASK_PRIORITIES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex overflow-hidden rounded-md border border-border/60">
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "grid h-9 w-9 place-items-center text-muted-foreground hover:bg-accent",
                view === "list" && "bg-accent text-foreground",
              )}
              aria-label="List view"
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn(
                "grid h-9 w-9 place-items-center text-muted-foreground hover:bg-accent",
                view === "grid" && "bg-accent text-foreground",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface flex flex-col items-center justify-center px-6 py-16 text-center">
          <CheckSquare className="h-8 w-8 text-muted-foreground" />
          <h3 className="mt-3 text-base font-semibold tracking-tight">
            {tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {tasks.length === 0
              ? "Create your first task to start tracking work across projects."
              : "Try adjusting your filters or search."}
          </p>
          {tasks.length === 0 && (
            <Button className="mt-5" onClick={() => setOpenForm(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> New task
            </Button>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <div key={t.id} className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {projectMap[t.project_id] ?? "—"}
              </p>
              <TaskCard
                task={t}
                onOpen={(x) => setOpenTaskId(x.id)}
                onEdit={setEditing}
                onDelete={setDeleting}
                onToggleComplete={toggleComplete}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="surface overflow-hidden p-0">
          <div className="border-b border-border/60 bg-muted/40 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "task" : "tasks"}
          </div>
          {filtered.map((t) => (
            <TaskListRow
              key={t.id}
              task={t}
              onOpen={(x) => setOpenTaskId(x.id)}
              onEdit={setEditing}
              onDelete={setDeleting}
              onToggleComplete={toggleComplete}
            />
          ))}
        </div>
      )}

      <TaskFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={create}
        saving={createMut.isPending}
      />
      <TaskFormDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        task={editing}
        onSubmit={update}
        saving={updateMut.isPending}
      />

      <TaskDrawer
        taskId={openTaskId}
        open={!!openTaskId}
        onOpenChange={(o) => !o && setOpenTaskId(null)}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleting?.title}</strong>. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={remove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: number;
  hint?: string;
  icon: React.ReactNode;
  tone?: "default" | "success" | "danger" | "info";
}) {
  const toneStyles: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };
  return (
    <div className="surface p-4">
      <div className="flex items-center gap-2">
        <div className={cn("grid h-7 w-7 place-items-center rounded-md", toneStyles[tone])}>
          {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
