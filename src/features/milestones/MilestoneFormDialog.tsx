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
import { MILESTONE_STATUSES, type MilestoneRow } from "./types";

type FormState = {
  title: string;
  description: string;
  status: string;
  progress: number;
  due_date: string;
};

const empty: FormState = {
  title: "",
  description: "",
  status: "pending",
  progress: 0,
  due_date: "",
};

export type MilestoneFormSubmit = {
  title: string;
  description: string | null;
  status: string;
  progress: number;
  due_date: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone?: MilestoneRow | null;
  onSubmit: (values: MilestoneFormSubmit) => Promise<void> | void;
  saving?: boolean;
};

export function MilestoneFormDialog({
  open,
  onOpenChange,
  milestone,
  onSubmit,
  saving,
}: Props) {
  const [form, setForm] = useState<FormState>(empty);

  useEffect(() => {
    if (open) {
      setForm(
        milestone
          ? {
              title: milestone.title,
              description: milestone.description ?? "",
              status: milestone.status ?? "pending",
              progress: milestone.progress ?? 0,
              due_date: milestone.due_date ?? "",
            }
          : empty,
      );
    }
  }, [open, milestone]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      progress: form.progress,
      due_date: form.due_date || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{milestone ? "Edit milestone" : "New milestone"}</DialogTitle>
          <DialogDescription>
            {milestone
              ? "Update the milestone details below."
              : "Add a milestone to break this project into meaningful checkpoints."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="-mx-6 min-h-0 flex-1 space-y-4 overflow-y-auto px-6">
          <div className="space-y-2">
            <Label htmlFor="m-title">Title</Label>
            <Input
              id="m-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Launch beta"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="m-description">Description</Label>
            <Textarea
              id="m-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What defines this milestone?"
              rows={3}
            />
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
                  {MILESTONE_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="m-due">Due date</Label>
              <Input
                id="m-due"
                type="date"
                value={form.due_date}
                onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
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
          </div>

          <DialogFooter className="-mx-6 -mb-6 mt-4 border-t bg-background px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.title.trim()}>
              {saving ? "Saving…" : milestone ? "Save changes" : "Create milestone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
