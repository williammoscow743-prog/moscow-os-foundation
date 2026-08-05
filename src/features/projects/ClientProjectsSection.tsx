import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { FolderKanban } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { useProjectsByClient } from "./api";

export function ClientProjectsSection({ clientId }: { clientId: string }) {
  const { data: projects = [], isLoading } = useProjectsByClient(clientId);

  return (
    <section className="surface space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Projects</h2>
        <Badge variant="secondary" className="text-[11px]">
          {projects.length}
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <FolderKanban className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No projects linked to this client yet.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                to="/projects/$projectId"
                params={{ projectId: p.id }}
                className="flex flex-col gap-2 py-3 transition-colors hover:opacity-90"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{p.name}</span>
                  <Badge variant="secondary" className="text-[11px] capitalize">
                    {(p.status ?? "active").replace("_", " ")}
                  </Badge>
                  <Badge variant="outline" className="text-[11px] capitalize">
                    {p.priority ?? "medium"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    Due: {p.due_date ? format(new Date(p.due_date), "d MMM yyyy") : "—"}
                  </span>
                  <span>
                    Budget: {p.budget != null ? formatCurrency(Number(p.budget)) : "—"}
                  </span>
                  <span>Progress: {p.progress ?? 0}%</span>
                </div>
                <Progress value={p.progress ?? 0} className="h-1.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
