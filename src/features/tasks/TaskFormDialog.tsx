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
import { useMilestones } from "@/features/milestones/api";
import { useProjects } from "@/features/projects/api";

type FormState = {
  title: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  due_date: string;
  estimated_hours: string;
  project_id: string;
  milestone_id: string;
};

const empty: FormState = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  progress: 0,
  due_date: "",
  estimated_hours: "",
  project_id: "",
  milestone_id: "",
};

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
};

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
  const [form, setForm] = useState<FormState>(empty);
  const { data: projects = [] } = useProjects();
  const { data: milestones = [] } = useMilestones(form.project_id || undefined);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? "",
        status: task.status ?? "todo",
        priority: task.priority ?? "medium",
        progress: task.progress ?? 0,
        due_date: task.due_date ?? "",
        estimated_hours: task.estimated_hours != null ? String(task.estimated_hours) : "",
        project_id: task.project_id,
        milestone_id: task.milestone_id ?? "",
      });
    } else {
      setForm({
        ...empty,
        project_id: defaultProjectId ?? "",
        milestone_id: defaultMilestoneId ?? "",
      });
    }
  }, [open, task, defaultProjectId, defaultMilestoneId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.project_id) return;
    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      priority: form.priority,
      progress: form.progress,
      due_date: form.due_date || null,
      estimated_hours: form.estimated_hours ? Number(form.estimated_hours) : null,
      project_id: form.project_id,
      milestone_id: form.milestone_id || null,
    });
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

        <form onSubmit={submit} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-3">
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

          <div className="grid grid-cols-2 gap-3">
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

          <div className="grid grid-cols-2 gap-3">
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

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !form.title.trim() || !form.project_id}
            >
              {saving ? "Saving…" : task ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
