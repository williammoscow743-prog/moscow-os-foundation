import { format, isPast } from "date-fns";
import {
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar as CalIcon,
  Flag,
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
  TASK_PRIORITY_STYLES,
  TASK_STATUS_LABELS,
  TASK_STATUS_STYLES,
  type TaskPriority,
  type TaskRow,
  type TaskStatus,
} from "./types";

type Props = {
  task: TaskRow;
  onOpen: (t: TaskRow) => void;
  onEdit: (t: TaskRow) => void;
  onDelete: (t: TaskRow) => void;
  onToggleComplete: (t: TaskRow) => void;
};

export function TaskCard({ task, onOpen, onEdit, onDelete, onToggleComplete }: Props) {
  const status = (task.status as TaskStatus) ?? "todo";
  const priority = (task.priority as TaskPriority) ?? "medium";
  const completed = status === "completed";
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const overdue = dueDate && isPast(dueDate) && !completed;

  return (
    <div className="surface flex items-start gap-3 p-4">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(task);
        }}
        aria-label={completed ? "Mark as incomplete" : "Mark as completed"}
        className="mt-0.5 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {completed ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onOpen(task)}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4
              className={cn(
                "truncate text-sm font-semibold tracking-tight",
                completed && "text-muted-foreground line-through",
              )}
            >
              {task.title}
            </h4>
            {task.description && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Task actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => onOpen(task)}>
                  Open details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleComplete(task)}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {completed ? "Mark incomplete" : "Mark completed"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(task)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className={cn("font-medium", TASK_STATUS_STYLES[status])}>
            {TASK_STATUS_LABELS[status]}
          </Badge>
          <Badge
            variant="secondary"
            className={cn("font-medium capitalize", TASK_PRIORITY_STYLES[priority])}
          >
            <Flag className="mr-1 h-3 w-3" />
            {priority}
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
            <span className="font-medium text-foreground">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="mt-1.5 h-1.5" />
        </div>
      </button>
    </div>
  );
}
