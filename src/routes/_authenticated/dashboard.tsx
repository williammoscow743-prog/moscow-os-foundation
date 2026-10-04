import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  addDays,
  isPast,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Plus,
  FolderPlus,
  UserPlus,
  Calendar as CalIcon,
  Target,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAllMilestones } from "@/features/milestones/api";
import { useAllTasks } from "@/features/tasks/api";
import { format } from "date-fns";
import type { MilestoneStatus } from "@/features/milestones/types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const { data: notifications } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const { data: milestones = [] } = useAllMilestones();
  const { data: tasks = [] } = useAllTasks();

  const taskStats = useMemo(() => {
    const todayIso = format(new Date(), "yyyy-MM-dd");
    const weekIso = format(addDays(new Date(), 7), "yyyy-MM-dd");
    let overdue = 0, dueToday = 0, completed = 0;
    const upcoming: typeof tasks = [];
    for (const t of tasks) {
      if (t.status === "completed") { completed += 1; continue; }
      if (!t.due_date) continue;
      const d = t.due_date.slice(0, 10);
      if (d < todayIso) overdue += 1;
      else {
        if (d === todayIso) dueToday += 1;
        if (d <= weekIso) upcoming.push(t);
      }
    }
    upcoming.sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1));
    return { overdue, dueToday, completed, upcoming };
  }, [tasks]);

  const milestoneStats = useMemo(() => {
    const today = startOfDay(new Date());
    const inSevenDays = addDays(today, 7);
    let completed = 0;
    let dueThisWeek = 0;
    let overdue = 0;
    let upcoming = 0;
    for (const m of milestones) {
      const status = m.status as MilestoneStatus;
      if (status === "completed") {
        completed += 1;
        continue;
      }
      if (!m.due_date) continue;
      const due = new Date(m.due_date);
      if (isPast(due)) {
        overdue += 1;
      } else if (isWithinInterval(due, { start: today, end: inSevenDays })) {
        dueThisWeek += 1;
      } else {
        upcoming += 1;
      }
    }
    return { completed, dueThisWeek, overdue, upcoming };
  }, [milestones]);

  const greeting = greetingFor(new Date());
  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight sm:text-4xl">
            {greeting}, <span className="text-gradient-brand">{displayName}</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Here&apos;s a calm overview of your workspace today.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/reports" })}>
            <Sparkles className="mr-2 h-4 w-4" />
            Ask AI
          </Button>
          <Button size="sm" onClick={() => navigate({ to: "/projects" })}>
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      {/* Today's focus */}
      <Section title="Today's focus" subtitle="Three things worth your attention.">
        <div className="grid gap-4 md:grid-cols-3">
          <FocusCard
            label="Deep work"
            value="0h 00m"
            hint="No sessions started yet"
            icon={Zap}
          />
          <FocusCard
            label="Tasks due today"
            value={String(taskStats.dueToday)}
            hint={taskStats.dueToday ? "Due before the day ends" : "Nothing on fire — enjoy the calm"}
            icon={CheckCircle2}
          />
          <FocusCard
            label="Meetings"
            value="0"
            hint="Your calendar is clear"
            icon={Clock}
          />
        </div>
      </Section>

      {/* Tasks overview */}
      <Section title="Tasks" subtitle="Where your work stands.">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <FocusCard label="Overdue" value={String(taskStats.overdue)} hint="Past due, not complete" icon={AlertTriangle} />
          <FocusCard label="Upcoming" value={String(taskStats.upcoming.length)} hint="Due in the next 7 days" icon={CalendarClock} />
          <FocusCard label="Completed" value={String(taskStats.completed)} hint="Tasks marked complete" icon={CheckCircle2} />
        </div>
        <Button variant="link" size="sm" className="px-0" onClick={() => navigate({ to: "/tasks" })}>
          Go to tasks <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
      </Section>

      {/* Milestones overview */}
      <Section title="Milestones" subtitle="Progress across your projects.">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FocusCard
            label="Due this week"
            value={String(milestoneStats.dueThisWeek)}
            hint="Milestones landing in the next 7 days"
            icon={CalendarClock}
          />
          <FocusCard
            label="Completed"
            value={String(milestoneStats.completed)}
            hint="Milestones marked complete"
            icon={CheckCircle2}
          />
          <FocusCard
            label="Overdue"
            value={String(milestoneStats.overdue)}
            hint="Past due and not yet complete"
            icon={AlertTriangle}
          />
          <FocusCard
            label="Upcoming"
            value={String(milestoneStats.upcoming)}
            hint="Scheduled beyond this week"
            icon={Target}
          />
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Quick actions" subtitle="Jump in fast.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <QuickAction icon={FolderPlus} label="New project" onClick={() => navigate({ to: "/projects" })} />
              <QuickAction icon={CheckCircle2} label="New task" onClick={() => navigate({ to: "/tasks" })} />
              <QuickAction icon={UserPlus} label="Add client" onClick={() => navigate({ to: "/clients" })} />
              <QuickAction icon={CalIcon} label="Schedule" onClick={() => navigate({ to: "/calendar" })} />
            </div>
          </Section>

          <Section title="Recent activity" subtitle="What's happened lately.">
            <div className="surface divide-y divide-border">
              {notifications && notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-4">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{n.title}</p>
                      {n.message && (
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {n.message}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No activity yet"
                  description="Your recent actions and updates will appear here."
                />
              )}
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Upcoming tasks" subtitle="Next 7 days.">
            <div className="surface p-4">
              {taskStats.upcoming.length > 0 ? (
                <ul className="space-y-2">
                  {taskStats.upcoming.slice(0, 5).map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate font-medium">{t.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {format(new Date(t.due_date!.slice(0, 10) + "T00:00:00"), "EEE d MMM")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="Nothing scheduled"
                  description="Tasks you create will surface here."
                  compact
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full"
                onClick={() => navigate({ to: "/tasks" })}
              >
                View all tasks
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </Section>

          <Section title="Profile" subtitle="Your identity.">
            <div className="surface space-y-3 p-5">
              <Row label="Name" value={profile?.full_name || "—"} />
              <Row label="Email" value={user?.email || "—"} />
              <Row label="Business" value={profile?.business_name || "Not set"} />
              <Row label="Timezone" value={profile?.timezone || "UTC"} />
            </div>
          </Section>

          <Section title="Business" subtitle="At a glance.">
            <div className="surface p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold tracking-tight">
                    {profile?.business_name || "Untitled"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Sprint 01 · Foundation</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function greetingFor(d: Date) {
  const h = d.getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function FocusCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="surface p-5 transition-colors hover:border-primary/30">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="surface flex items-center gap-3 p-4 text-left transition-all hover:border-primary/40 hover:bg-accent"
    >
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <span className="truncate text-sm font-medium">{label}</span>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="truncate text-sm font-medium">{value}</span>
    </div>
  );
}

function EmptyState({
  title,
  description,
  compact,
}: {
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "py-6 text-center" : "py-12 text-center"}>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
