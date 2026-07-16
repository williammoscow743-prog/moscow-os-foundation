import { useState } from "react";
import { Plus, Target } from "lucide-react";
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
  useCreateMilestone,
  useDeleteMilestone,
  useMilestones,
  useUpdateMilestone,
} from "./api";
import { MilestoneCard } from "./MilestoneCard";
import {
  MilestoneFormDialog,
  type MilestoneFormSubmit,
} from "./MilestoneFormDialog";
import type { MilestoneRow } from "./types";

type Props = {
  projectId: string;
};

export function MilestonesPanel({ projectId }: Props) {
  const { data: milestones = [], isLoading } = useMilestones(projectId);
  const createMut = useCreateMilestone();
  const updateMut = useUpdateMilestone();
  const deleteMut = useDeleteMilestone();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MilestoneRow | null>(null);
  const [deleting, setDeleting] = useState<MilestoneRow | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (m: MilestoneRow) => {
    setEditing(m);
    setFormOpen(true);
  };

  const handleSubmit = async (values: MilestoneFormSubmit) => {
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, patch: values });
        toast.success("Milestone updated");
      } else {
        await createMut.mutateAsync({ ...values, project_id: projectId });
        toast.success("Milestone created");
      }
      setFormOpen(false);
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save milestone");
    }
  };

  const handleToggleComplete = async (m: MilestoneRow) => {
    const completed = m.status === "completed";
    try {
      await updateMut.mutateAsync({
        id: m.id,
        patch: {
          status: completed ? "in_progress" : "completed",
          progress: completed ? Math.min(m.progress, 99) : 100,
        },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Milestone deleted");
      setDeleting(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Milestones</h2>
          <p className="text-sm text-muted-foreground">
            Break the project into meaningful checkpoints.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New milestone
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : milestones.length === 0 ? (
        <div className="surface flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-5 text-lg font-semibold tracking-tight">No milestones yet</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Add milestones to track meaningful progress on this project.
          </p>
          <Button className="mt-5" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New milestone
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {milestones.map((m) => (
            <MilestoneCard
              key={m.id}
              milestone={m}
              onEdit={openEdit}
              onDelete={setDeleting}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}

      <MilestoneFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        milestone={editing}
        onSubmit={handleSubmit}
        saving={createMut.isPending || updateMut.isPending}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this milestone?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleting?.title}</strong>. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
