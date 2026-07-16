import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar as CalIcon,
  FolderKanban,
  Pencil,
  Trash2,
  Archive,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  useDeleteProject,
  useUpdateProject,
} from "@/features/projects/api";
import {
  ProjectFormDialog,
  type ProjectFormSubmit,
} from "@/features/projects/ProjectFormDialog";
import type {
  ProjectPriority,
  ProjectRow,
  ProjectStatus,
} from "@/features/projects/types";
import { MilestonesPanel } from "@/features/milestones/MilestonesPanel";

export const Route = createFileRoute("/_authenticated/projects/$projectId")({
  component: ProjectDetailsPage,
});

const STATUS_STYLES: Record<ProjectStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  on_hold: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  completed: "bg-primary/10 text-primary",
  archived: "bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Active",
  on_hold: "On hold",
  completed: "Completed",
  archived: "Archived",
};

const PRIORITY_STYLES: Record<ProjectPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  urgent: "bg-red-500/10 text-red-600 dark:text-red-400",
};

function ProjectDetailsPage() {
  const { projectId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const updateMut = useUpdateProject();
  const deleteMut = useDeleteProject();

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["projects", "detail", projectId, user?.id],
    enabled: !!user,
    queryFn: async (): Promise<ProjectRow | null> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();
      if (error) throw error;
      return data as ProjectRow | null;
    },
  });

  const handleSubmit = async (values: ProjectFormSubmit) => {
    if (!project) return;
    try {
      await updateMut.mutateAsync({ id: project.id, patch: values });
      toast.success("Project updated");
      setEditing(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save project");
    }
  };

  const handleArchive = async () => {
    if (!project) return;
    try {
      await updateMut.mutateAsync({
        id: project.id,
        patch: { status: "archived" },
      });
      toast.success("Project archived");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to archive");
    }
  };

  const handleComplete = async () => {
    if (!project) return;
    try {
      await updateMut.mutateAsync({
        id: project.id,
        patch: { status: "completed", progress: 100 },
      });
      toast.success("Project marked completed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    try {
      await deleteMut.mutateAsync(project.id);
      toast.success("Project deleted");
      navigate({ to: "/projects" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="surface flex flex-col items-center justify-center px-6 py-20 text-center">
        <h2 className="text-lg font-semibold tracking-tight">Project not found</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This project doesn't exist or you don't have access.
        </p>
        <Button asChild className="mt-5">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
          </Link>
        </Button>
      </div>
    );
  }

  const status = (project.status as ProjectStatus) ?? "active";
  const priority = (project.priority as ProjectPriority) ?? "medium";
  const dueDate = project.due_date ? new Date(project.due_date) : null;
  const startDate = project.start_date ? new Date(project.start_date) : null;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> All projects
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="surface relative overflow-hidden p-6">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: project.color ?? "hsl(var(--primary))" }}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-sm"
              style={{ backgroundColor: project.color ?? "hsl(var(--primary))" }}
            >
              <FolderKanban className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {project.category || "Uncategorized"}
              </p>
              <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                {project.name}
              </h1>
              {project.description && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {project.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className={cn("font-medium", STATUS_STYLES[status])}>
                  {STATUS_LABELS[status]}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn("font-medium capitalize", PRIORITY_STYLES[priority])}
                >
                  {priority}
                </Badge>
                {dueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalIcon className="h-3.5 w-3.5" />
                    Due {format(dueDate, "MMM d, yyyy")}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            {status !== "completed" && (
              <Button variant="outline" size="sm" onClick={handleComplete}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
              </Button>
            )}
            {status !== "archived" && (
              <Button variant="outline" size="sm" onClick={handleArchive}>
                <Archive className="mr-2 h-4 w-4" /> Archive
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium text-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="mt-1.5 h-2" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <DetailBlock label="Status" value={STATUS_LABELS[status]} />
            <DetailBlock label="Priority" value={priority} className="capitalize" />
            <DetailBlock label="Category" value={project.category || "—"} />
            <DetailBlock
              label="Start date"
              value={startDate ? format(startDate, "MMM d, yyyy") : "—"}
            />
            <DetailBlock
              label="Due date"
              value={dueDate ? format(dueDate, "MMM d, yyyy") : "—"}
            />
            <DetailBlock label="Progress" value={`${project.progress}%`} />
          </div>
          {project.description && (
            <div className="surface p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </p>
              <p className="mt-2 text-sm leading-relaxed">{project.description}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="milestones">
          <MilestonesPanel projectId={project.id} />
        </TabsContent>

        <TabsContent value="tasks">
          <ComingSoonPanel
            title="Tasks"
            description="Break this project down into actionable tasks. Coming soon."
          />
        </TabsContent>

        <TabsContent value="notes">
          <ComingSoonPanel
            title="Notes"
            description="Capture context, decisions and next steps. Coming soon."
          />
        </TabsContent>

        <TabsContent value="files">
          <ComingSoonPanel
            title="Files"
            description="Upload assets and deliverables. Coming soon."
          />
        </TabsContent>

        <TabsContent value="activity">
          <ComingSoonPanel
            title="Activity"
            description="Track every change and update on this project. Coming soon."
          />
        </TabsContent>
      </Tabs>

      <ProjectFormDialog
        open={editing}
        onOpenChange={setEditing}
        project={project}
        onSubmit={handleSubmit}
        saving={updateMut.isPending}
      />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{project.name}</strong> and all of its
              milestones. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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

function DetailBlock({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="surface p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-2 text-sm font-medium", className)}>{value}</p>
    </div>
  );
}

function ComingSoonPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="surface flex flex-col items-center justify-center px-6 py-14 text-center">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
