import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TASK_PRIORITIES, TASK_STATUSES, type TaskRow } from "./types";
import {
  buildTaskSubmit,
  emptyTaskForm,
  isTaskFormValid,
  taskToFormState,
  type TaskFormState,
  type TaskFormSubmit,
} from "./task-form";
import { useMilestones } from "@/features/milestones/api";
import { useProjects } from "@/features/projects/api";
import { useAuth } from "@/hooks/use-auth";

export type { TaskFormSubmit } from "./task-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskRow | null;
  defaultProjectId?: string;
  defaultMilestoneId?: string;
  lockProject?: boolean;
  onSubmit: (values: TaskFormSubmit) => Promise<void> | void;
  saving?: boolean;
};

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  defaultProjectId,
  defaultMilestoneId,
  lockProject,
  onSubmit,
  saving,
}: Props) {
  const [form, setForm] = useState<TaskFormState>(emptyTaskForm);
  const { user } = useAuth();
  const { data: projects = [] } = useProjects();
  const { data: milestones = [] } = useMilestones(form.project_id || undefined);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setForm(taskToFormState(task));
    } else {
      setForm({
        ...emptyTaskForm,
        project_id: defaultProjectId ?? "",
        milestone_id: defaultMilestoneId ?? "",
        assigned_to: user?.id ?? "",
      });
    }
  }, [open, task, defaultProjectId, defaultMilestoneId, user?.id]);

  const valid = isTaskFormValid(form);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    await onSubmit(buildTaskSubmit(form));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update the task details below."
              : "Capture a task with the context it needs to get done."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="-mx-6 min-h-0 flex-1 space-y-4 overflow-y-auto px-6">
            <div className="space-y-2">
              <Label htmlFor="t-title">Title</Label>
              <Input
                id="t-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Write the launch email"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="t-description">Description</Label>
              <Textarea
                id="t-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Add any relevant context…"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Project</Label>
                <Select
                  value={form.project_id}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, project_id: v, milestone_id: "" }))
                  }
                  disabled={lockProject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Milestone</Label>
                <Select
                  value={form.milestone_id || "__none"}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, milestone_id: v === "__none" ? "" : v }))
                  }
                  disabled={!form.project_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No milestone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">No milestone</SelectItem>
                    {milestones.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                >
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

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}
                >
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="t-due">Due date</Label>
                <Input
                  id="t-due"
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-est">Estimate (hrs)</Label>
                <Input
                  id="t-est"
                  type="number"
                  min="0"
                  step="0.25"
                  value={form.estimated_hours}
                  onChange={(e) => setForm((f) => ({ ...f, estimated_hours: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={form.assigned_to || "__none"}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, assigned_to: v === "__none" ? "" : v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Unassigned</SelectItem>
                  {user && (
                    <SelectItem value={user.id}>
                      {user.email ? `Me (${user.email})` : "Me"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Progress</Label>
                <span className="text-xs text-muted-foreground">{form.progress}%</span>
              </div>
              <Slider
                value={[form.progress]}
                onValueChange={([v]) => setForm((f) => ({ ...f, progress: v ?? 0 }))}
                min={0}
                max={100}
                step={5}
              />
            </div>
          </div>

          <DialogFooter className="-mx-6 -mb-6 mt-4 border-t bg-background px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !valid}>
              {saving ? "Saving…" : task ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
