import { format, isPast } from "date-fns";
import {
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar as CalIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  MILESTONE_STATUS_LABELS,
  MILESTONE_STATUS_STYLES,
  type MilestoneRow,
  type MilestoneStatus,
} from "./types";

type Props = {
  milestone: MilestoneRow;
  onEdit: (m: MilestoneRow) => void;
  onDelete: (m: MilestoneRow) => void;
  onToggleComplete: (m: MilestoneRow) => void;
};

export function MilestoneCard({ milestone, onEdit, onDelete, onToggleComplete }: Props) {
  const status = (milestone.status as MilestoneStatus) ?? "pending";
  const completed = status === "completed";
  const dueDate = milestone.due_date ? new Date(milestone.due_date) : null;
  const overdue = dueDate && isPast(dueDate) && !completed;

  return (
    <div className="surface flex items-start gap-3 p-4">
      <button
        type="button"
        onClick={() => onToggleComplete(milestone)}
        aria-label={completed ? "Mark as incomplete" : "Mark as completed"}
        className="mt-0.5 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {completed ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4
              className={cn(
                "truncate text-sm font-semibold tracking-tight",
                completed && "text-muted-foreground line-through",
              )}
            >
              {milestone.title}
            </h4>
            {milestone.description && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {milestone.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Milestone actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit(milestone)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleComplete(milestone)}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {completed ? "Mark incomplete" : "Mark completed"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(milestone)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className={cn("font-medium", MILESTONE_STATUS_STYLES[status])}>
            {MILESTONE_STATUS_LABELS[status]}
          </Badge>
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs",
              overdue ? "text-destructive" : "text-muted-foreground",
            )}
          >
            <CalIcon className="h-3.5 w-3.5" />
            {dueDate ? format(dueDate, "MMM d, yyyy") : "No due date"}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium text-foreground">{milestone.progress}%</span>
          </div>
          <Progress value={milestone.progress} className="mt-1.5 h-1.5" />
        </div>
      </div>
    </div>
  );
}
