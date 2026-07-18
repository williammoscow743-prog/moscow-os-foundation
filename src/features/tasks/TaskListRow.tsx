import { format, isPast } from "date-fns";
import { CheckCircle2, Circle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export function TaskListRow({ task, onOpen, onEdit, onDelete, onToggleComplete }: Props) {
  const status = (task.status as TaskStatus) ?? "todo";
  const priority = (task.priority as TaskPriority) ?? "medium";
  const completed = status === "completed";
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const overdue = dueDate && isPast(dueDate) && !completed;

  return (
    <div className="group flex items-center gap-3 border-b border-border/60 px-3 py-2.5 last:border-b-0 hover:bg-accent/40">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(task);
        }}
        className="shrink-0 rounded-full text-muted-foreground hover:text-primary"
        aria-label={completed ? "Mark as incomplete" : "Mark as completed"}
      >
        {completed ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onOpen(task)}
        className="min-w-0 flex-1 text-left"
      >
        <div
          className={cn(
            "truncate text-sm font-medium",
            completed && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </div>
      </button>

      <Badge variant="secondary" className={cn("hidden font-medium sm:inline-flex", TASK_STATUS_STYLES[status])}>
        {TASK_STATUS_LABELS[status]}
      </Badge>
      <Badge
        variant="secondary"
        className={cn("hidden font-medium capitalize md:inline-flex", TASK_PRIORITY_STYLES[priority])}
      >
        {priority}
      </Badge>
      <div
        className={cn(
          "hidden w-24 shrink-0 text-right text-xs sm:block",
          overdue ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {dueDate ? format(dueDate, "MMM d") : "—"}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Task actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onOpen(task)}>Open details</DropdownMenuItem>
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
  );
}
