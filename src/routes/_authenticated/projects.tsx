import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FolderKanban,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
} from "lucide-react";
import { isThisWeek } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@/features/projects/api";
import { ProjectCard } from "@/features/projects/ProjectCard";
import {
  ProjectFormDialog,
  type ProjectFormSubmit,
} from "@/features/projects/ProjectFormDialog";
import {
  PRIORITY_RANK,
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  type ProjectPriority,
  type ProjectRow,
  type SortKey,
} from "@/features/projects/types";

export const Route = createFileRoute("/_authenticated/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const createMut = useCreateProject();
  const updateMut = useUpdateProject();
  const deleteMut = useDeleteProject();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("created_at");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [deleting, setDeleting] = useState<ProjectRow | null>(null);

  const stats = useMemo(() => {
    const active = projects.filter((p) => p.status === "active").length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const dueThisWeek = projects.filter(
      (p) =>
        p.due_date &&
        p.status !== "completed" &&
        p.status !== "archived" &&
        isThisWeek(new Date(p.due_date), { weekStartsOn: 1 }),
    ).length;
    const highPriority = projects.filter(
      (p) =>
        (p.priority === "high" || p.priority === "urgent") &&
        p.status !== "completed" &&
        p.status !== "archived",
    ).length;
    return { active, completed, dueThisWeek, highPriority };
  }, [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (categoryFilter !== "all" && (p.category ?? "") !== categoryFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "due_date") {
        const av = a.due_date ? new Date(a.due_date).getTime() : Number.POSITIVE_INFINITY;
        const bv = b.due_date ? new Date(b.due_date).getTime() : Number.POSITIVE_INFINITY;
        return av - bv;
      }
      if (sortBy === "priority") {
        return (
          PRIORITY_RANK[(a.priority as ProjectPriority) ?? "medium"] -
          PRIORITY_RANK[(b.priority as ProjectPriority) ?? "medium"]
        );
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return list;
  }, [projects, search, statusFilter, categoryFilter, sortBy]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: ProjectRow) => {
    setEditing(p);
    setFormOpen(true);
  };

  const handleSubmit = async (values: ProjectFormSubmit) => {
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, patch: values });
        toast.success("Project updated");
      } else {
        await createMut.mutateAsync(values);
        toast.success("Project created");
      }
      setFormOpen(false);
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save project");
    }
  };

  const handleArchive = async (p: ProjectRow) => {
    try {
      await updateMut.mutateAsync({ id: p.id, patch: { status: "archived" } });
      toast.success("Project archived");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to archive");
    }
  };

  const handleComplete = async (p: ProjectRow) => {
    try {
      await updateMut.mutateAsync({
        id: p.id,
        patch: { status: "completed", progress: 100 },
      });
      toast.success("Project marked completed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Project deleted");
      setDeleting(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Plan, ship and track every project across your business.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New project
        </Button>
      </div>

      {/* Stat widgets */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active" value={stats.active} icon={Layers} tint="text-emerald-500" />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          tint="text-primary"
        />
        <StatCard
          label="Due this week"
          value={stats.dueThisWeek}
          icon={Clock}
          tint="text-orange-500"
        />
        <StatCard
          label="High priority"
          value={stats.highPriority}
          icon={Flame}
          tint="text-red-500"
        />
      </div>

      {/* Toolbar */}
      <div className="surface flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 md:flex md:items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {PROJECT_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {PROJECT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Newest first</SelectItem>
              <SelectItem value="due_date">Sort by due date</SelectItem>
              <SelectItem value="priority">Sort by priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasProjects={projects.length > 0} onCreate={openCreate} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={openEdit}
              onDelete={setDeleting}
              onArchive={handleArchive}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}

      <ProjectFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        project={editing}
        onSubmit={handleSubmit}
        saving={createMut.isPending || updateMut.isPending}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleting?.name}</strong>. This action cannot be
              undone.
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

function StatCard({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
}) {
  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <Icon className={`h-4 w-4 ${tint}`} />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function EmptyState({
  hasProjects,
  onCreate,
}: {
  hasProjects: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="surface flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card">
        <FolderKanban className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">
        {hasProjects ? "No matching projects" : "No projects yet"}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {hasProjects
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Create your first project to start organizing your work."}
      </p>
      {!hasProjects && (
        <Button className="mt-5" onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New project
        </Button>
      )}
    </div>
  );
}
