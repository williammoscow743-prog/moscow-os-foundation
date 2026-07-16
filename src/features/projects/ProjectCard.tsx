import { format, isPast, isThisWeek } from "date-fns";
import { Link } from "@tanstack/react-router";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Archive,
  CheckCircle2,
  Calendar as CalIcon,
  FolderKanban,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ProjectPriority, ProjectRow, ProjectStatus } from "./types";

type Props = {
  project: ProjectRow;
  onEdit: (p: ProjectRow) => void;
  onDelete: (p: ProjectRow) => void;
  onArchive: (p: ProjectRow) => void;
  onComplete: (p: ProjectRow) => void;
};

const PRIORITY_STYLES: Record<ProjectPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  urgent: "bg-red-500/10 text-red-600 dark:text-red-400",
};

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

export function ProjectCard({ project, onEdit, onDelete, onArchive, onComplete }: Props) {
  const status = (project.status as ProjectStatus) ?? "active";
  const priority = (project.priority as ProjectPriority) ?? "medium";
  const dueDate = project.due_date ? new Date(project.due_date) : null;
  const overdue =
    dueDate && isPast(dueDate) && status !== "completed" && status !== "archived";
  const dueSoon = dueDate && isThisWeek(dueDate, { weekStartsOn: 1 });

  return (
    <div className="surface group relative flex flex-col overflow-hidden p-5 transition-colors hover:border-primary/40">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: project.color ?? "hsl(var(--primary))" }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white shadow-sm"
            style={{ backgroundColor: project.color ?? "hsl(var(--primary))" }}
          >
            <FolderKanban className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <Link
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className="block truncate text-sm font-semibold tracking-tight hover:text-primary focus:outline-none focus-visible:text-primary"
            >
              {project.name}
            </Link>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {project.category || "Uncategorized"}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Project actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onEdit(project)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            {status !== "completed" && (
              <DropdownMenuItem onClick={() => onComplete(project)}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Mark completed
              </DropdownMenuItem>
            )}
            {status !== "archived" && (
              <DropdownMenuItem onClick={() => onArchive(project)}>
                <Archive className="mr-2 h-4 w-4" /> Archive
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(project)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {project.description && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary" className={cn("font-medium", STATUS_STYLES[status])}>
          {STATUS_LABELS[status]}
        </Badge>
        <Badge variant="secondary" className={cn("font-medium capitalize", PRIORITY_STYLES[priority])}>
          {priority}
        </Badge>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium text-foreground">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="mt-1.5 h-1.5" />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div
          className={cn(
            "flex items-center gap-1.5",
            overdue
              ? "text-destructive"
              : dueSoon
                ? "text-orange-600 dark:text-orange-400"
                : "text-muted-foreground",
          )}
        >
          <CalIcon className="h-3.5 w-3.5" />
          {dueDate ? format(dueDate, "MMM d, yyyy") : "No due date"}
        </div>
      </div>
    </div>
  );
}
