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
import { ClientSelect } from "@/features/clients/ClientSelect";
import { cn } from "@/lib/utils";
import {
  PROJECT_CATEGORIES,
  PROJECT_COLORS,
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  type ProjectRow,
} from "./types";

type FormState = {
  name: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  progress: number;
  start_date: string;
  due_date: string;
  color: string;
  client_id: string | null;
};

const empty: FormState = {
  name: "",
  description: "",
  category: PROJECT_CATEGORIES[0],
  status: "active",
  priority: "medium",
  progress: 0,
  start_date: "",
  due_date: "",
  color: PROJECT_COLORS[5],
  client_id: null,
};

export type ProjectFormSubmit = {
  name: string;
  description: string | null;
  category: string | null;
  status: string;
  priority: string;
  progress: number;
  start_date: string | null;
  due_date: string | null;
  color: string | null;
  client_id: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: ProjectRow | null;
  onSubmit: (values: ProjectFormSubmit) => Promise<void> | void;
  saving?: boolean;
};

export function ProjectFormDialog({ open, onOpenChange, project, onSubmit, saving }: Props) {
  const [form, setForm] = useState<FormState>(empty);

  useEffect(() => {
    if (open) {
      setForm(
        project
          ? {
              name: project.name,
              description: project.description ?? "",
              category: project.category ?? PROJECT_CATEGORIES[0],
              status: project.status ?? "active",
              priority: project.priority ?? "medium",
              progress: project.progress ?? 0,
              start_date: project.start_date ?? "",
              due_date: project.due_date ?? "",
              color: project.color ?? PROJECT_COLORS[5],
              client_id: project.client_id ?? null,
            }
          : empty,
      );
    }
  }, [open, project]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || null,
      category: form.category || null,
      status: form.status,
      priority: form.priority,
      progress: form.progress,
      start_date: form.start_date || null,
      due_date: form.due_date || null,
      color: form.color || null,
      client_id: form.client_id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{project ? "Edit project" : "New project"}</DialogTitle>
          <DialogDescription>
            {project
              ? "Update the project details below."
              : "Set up a new project to organize your work."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="-mx-6 min-h-0 flex-1 space-y-4 overflow-y-auto px-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Website redesign"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What's this project about?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Client</Label>
            <ClientSelect
              value={form.client_id}
              onChange={(v) => setForm((f) => ({ ...f, client_id: v }))}
            />
            <p className="text-xs text-muted-foreground">
              Optional — link this project to an existing client.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                  {PROJECT_STATUSES.map((s) => (
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
                  {PROJECT_PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due date</Label>
              <Input
                id="due_date"
                type="date"
                value={form.due_date}
                onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start date</Label>
              <Input
                id="start_date"
                type="date"
                value={form.start_date}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PROJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c }))}
                    className={cn(
                      "h-6 w-6 rounded-full ring-offset-2 ring-offset-background transition-all",
                      form.color === c && "ring-2 ring-ring",
                    )}
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
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
          </div>

          <DialogFooter className="-mx-6 -mb-6 mt-4 border-t bg-background px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.name.trim()}>
              {saving ? "Saving…" : project ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
