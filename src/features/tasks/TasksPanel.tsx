import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

import {
  useCreateTask,
  useDeleteTask,
  useProjectTasks,
  useUpdateTask,
} from "./api";
import { TaskFormDialog, type TaskFormSubmit } from "./TaskFormDialog";
import { TaskCard } from "./TaskCard";
import { TaskDrawer } from "./TaskDrawer";
import type { TaskRow, TaskStatus } from "./types";
import { TASK_PRIORITY_RANK } from "./types";

type Props = { projectId: string; milestoneId?: string };

export function TasksPanel({ projectId, milestoneId }: Props) {
  const { data: tasks = [], isLoading } = useProjectTasks(projectId);
  const createMut = useCreateTask();
  const updateMut = useUpdateTask();
  const deleteMut = useDeleteTask();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<TaskRow | null>(null);
  const [deleting, setDeleting] = useState<TaskRow | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = milestoneId ? tasks.filter((t) => t.milestone_id === milestoneId) : tasks;
    return [...list].sort((a, b) => {
      const ap = TASK_PRIORITY_RANK[(a.priority as keyof typeof TASK_PRIORITY_RANK) ?? "medium"];
      const bp = TASK_PRIORITY_RANK[(b.priority as keyof typeof TASK_PRIORITY_RANK) ?? "medium"];
      return ap - bp;
    });
  }, [tasks, milestoneId]);

  const create = async (values: TaskFormSubmit) => {
    try {
      await createMut.mutateAsync({ ...values, milestone_id: values.milestone_id ?? milestoneId ?? null });
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Tasks</h3>
          <p className="text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "task" : "tasks"}
          </p>
        </div>
        <Button size="sm" onClick={() => setOpenForm(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> New task
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface flex flex-col items-center justify-center px-6 py-12 text-center">
          <h4 className="text-sm font-semibold">No tasks yet</h4>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Break this project down into concrete work you can finish.
          </p>
          <Button size="sm" className="mt-4" onClick={() => setOpenForm(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> New task
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((t) => (
            <TaskCard
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
        defaultProjectId={projectId}
        defaultMilestoneId={milestoneId}
        lockProject
        onSubmit={create}
        saving={createMut.isPending}
      />
      <TaskFormDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        task={editing}
        lockProject
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
              This will permanently delete <strong>{deleting?.title}</strong> and its subtasks,
              comments, and activity.
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
