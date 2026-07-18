import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Plus, Send, Trash2, X, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
  useCreateSubtask,
  useCreateTaskComment,
  useDeleteSubtask,
  useDeleteTaskComment,
  useSubtasks,
  useTask,
  useTaskActivity,
  useTaskComments,
  useUpdateSubtask,
  useUpdateTask,
} from "./api";
import {
  TASK_PRIORITY_STYLES,
  TASK_STATUS_LABELS,
  TASK_STATUS_STYLES,
  TASK_STATUSES,
  TASK_PRIORITIES,
  type TaskPriority,
  type TaskStatus,
} from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TaskDrawer({ taskId, open, onOpenChange }: Props) {
  const { data: task } = useTask(taskId ?? undefined);
  const updateMut = useUpdateTask();

  const status = (task?.status as TaskStatus) ?? "todo";
  const priority = (task?.priority as TaskPriority) ?? "medium";

  const setStatus = async (v: TaskStatus) => {
    if (!task) return;
    await updateMut.mutateAsync({
      id: task.id,
      patch: {
        status: v,
        completed_at: v === "completed" ? new Date().toISOString() : null,
        progress: v === "completed" ? 100 : task.progress,
      },
    });
  };

  const setPriority = async (v: TaskPriority) => {
    if (!task) return;
    await updateMut.mutateAsync({ id: task.id, patch: { priority: v } });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {task ? (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SheetTitle className="text-lg font-semibold tracking-tight">
                    {task.title}
                  </SheetTitle>
                  <SheetDescription>
                    Created {formatDistanceToNow(new Date(task.created_at))} ago
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className={cn("font-medium", TASK_STATUS_STYLES[status])}>
                {TASK_STATUS_LABELS[status]}
              </Badge>
              <Badge
                variant="secondary"
                className={cn("font-medium capitalize", TASK_PRIORITY_STYLES[priority])}
              >
                {priority}
              </Badge>
              {task.due_date && (
                <span className="text-xs text-muted-foreground">
                  Due {format(new Date(task.due_date), "MMM d, yyyy")}
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Priority</label>
                <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span className="font-medium text-foreground">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="mt-1.5 h-1.5" />
            </div>

            {task.description && (
              <div className="mt-5 rounded-lg border border-border/60 bg-muted/40 p-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Description
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}

            <Separator className="my-5" />

            <Tabs defaultValue="subtasks" className="space-y-4">
              <TabsList>
                <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="subtasks">
                <SubtasksSection taskId={task.id} />
              </TabsContent>
              <TabsContent value="comments">
                <CommentsSection taskId={task.id} />
              </TabsContent>
              <TabsContent value="activity">
                <ActivitySection taskId={task.id} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <SheetHeader>
            <SheetTitle>Task</SheetTitle>
            <SheetDescription>Loading…</SheetDescription>
          </SheetHeader>
        )}
      </SheetContent>
    </Sheet>
  );
}

function SubtasksSection({ taskId }: { taskId: string }) {
  const { data: subtasks = [] } = useSubtasks(taskId);
  const createMut = useCreateSubtask();
  const updateMut = useUpdateSubtask();
  const deleteMut = useDeleteSubtask();
  const [title, setTitle] = useState("");

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createMut.mutateAsync({
        task_id: taskId,
        title: title.trim(),
        position: subtasks.length,
      });
      setTitle("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add subtask");
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={add} className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a subtask…"
          className="h-9"
        />
        <Button type="submit" size="sm" disabled={!title.trim() || createMut.isPending}>
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </form>

      {subtasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No subtasks yet.</p>
      ) : (
        <ul className="space-y-1.5">
          {subtasks.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-2 rounded-md border border-border/60 bg-card px-2.5 py-2"
            >
              <button
                type="button"
                onClick={() =>
                  updateMut.mutate({
                    id: s.id,
                    patch: {
                      completed: !s.completed,
                      status: !s.completed ? "completed" : "todo",
                    },
                  })
                }
                aria-label="Toggle subtask"
                className="text-muted-foreground hover:text-primary"
              >
                {s.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </button>
              <span
                className={cn(
                  "flex-1 text-sm",
                  s.completed && "text-muted-foreground line-through",
                )}
              >
                {s.title}
              </span>
              <button
                type="button"
                onClick={() => deleteMut.mutate({ id: s.id, taskId })}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Delete subtask"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CommentsSection({ taskId }: { taskId: string }) {
  const { data: comments = [] } = useTaskComments(taskId);
  const createMut = useCreateTaskComment();
  const deleteMut = useDeleteTaskComment();
  const [body, setBody] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    try {
      await createMut.mutateAsync({ task_id: taskId, body: body.trim() });
      setBody("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post comment");
    }
  };

  return (
    <div className="space-y-3">
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg border border-border/60 bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="whitespace-pre-wrap text-sm">{c.body}</p>
                <button
                  type="button"
                  onClick={() => deleteMut.mutate({ id: c.id, taskId })}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Delete comment"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(c.created_at))} ago
              </p>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={send} className="space-y-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment…"
          rows={2}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!body.trim() || createMut.isPending}>
            <Send className="mr-1 h-4 w-4" /> Post
          </Button>
        </div>
      </form>
    </div>
  );
}

function ActivitySection({ taskId }: { taskId: string }) {
  const { data: activity = [] } = useTaskActivity(taskId);
  if (activity.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {activity.map((a) => (
        <li key={a.id} className="flex items-start gap-3 text-sm">
          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <div className="min-w-0 flex-1">
            <p className="capitalize">{a.action.replace(/_/g, " ")}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(a.created_at))} ago
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
