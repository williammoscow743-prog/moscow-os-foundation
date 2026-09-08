import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format, startOfMonth } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";

import { useFinanceCalendarEvents } from "@/features/calendar/api";
import { groupEventsByDate } from "@/features/calendar/finance-events";
import {
  WEEKDAY_LABELS,
  buildMonthGrid,
  filterEventsBySource,
  monthGridRange,
  shiftMonth,
} from "@/features/calendar/month-grid";
import {
  CALENDAR_OVERDUE_STYLE,
  CALENDAR_SOURCE_LABELS,
  CALENDAR_SOURCE_STYLES,
  type CalendarEvent,
  type CalendarSource,
} from "@/features/calendar/types";

export const Route = createFileRoute("/_authenticated/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Moscow OS" },
      {
        name: "description",
        content: "Bills, budgets, income and expenses on one month calendar.",
      },
      { property: "og:title", content: "Calendar — Moscow OS" },
      {
        property: "og:description",
        content: "Bills, budgets, income and expenses on one month calendar.",
      },
    ],
  }),
  component: CalendarPage,
});

const ALL_SOURCES: CalendarSource[] = ["bill", "budget", "income", "expense"];

const SOURCE_ROUTE: Record<CalendarSource, string> = {
  bill: "/finance/bills",
  budget: "/finance/budgets",
  income: "/finance/income",
  expense: "/finance/expenses",
};

function CalendarPage() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [sources, setSources] = useState<CalendarSource[]>(ALL_SOURCES);

  const range = useMemo(() => monthGridRange(month), [month]);
  const days = useMemo(() => buildMonthGrid(month), [month]);
  const { data, isLoading, isError } = useFinanceCalendarEvents(range);

  const byDate = useMemo(
    () => groupEventsByDate(filterEventsBySource(data ?? [], sources)),
    [data, sources],
  );

  const toggleSource = (s: CalendarSource) =>
    setSources((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const openEvent = (event: CalendarEvent) => {
    navigate({
      to: SOURCE_ROUTE[event.source],
      search: { record: event.recordId },
    } as never);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Bills, budgets, income and expenses across the month."
        icon={<CalendarDays className="h-5 w-5" />}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setMonth(startOfMonth(new Date()))}>
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous month"
              onClick={() => setMonth((m) => shiftMonth(m, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-36 text-center text-sm font-medium">
              {format(month, "MMMM yyyy")}
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next month"
              onClick={() => setMonth((m) => shiftMonth(m, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {ALL_SOURCES.map((s) => {
          const active = sources.includes(s);
          return (
            <button
              key={s}
              type="button"
              aria-pressed={active}
              onClick={() => toggleSource(s)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? CALENDAR_SOURCE_STYLES[s]
                  : "border-border/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {CALENDAR_SOURCE_LABELS[s]}
            </button>
          );
        })}
      </div>

      {isError && (
        <p className="text-sm text-destructive">Could not load calendar events.</p>
      )}

      <div className="surface overflow-hidden rounded-xl border border-border/60">
        <div className="grid grid-cols-7 border-b border-border/60 bg-muted/30">
          {WEEKDAY_LABELS.map((d) => (
            <div
              key={d}
              className="px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-7">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="border-b border-r border-border/40 p-2">
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {days.map((day) => {
              const events = byDate[day.date] ?? [];
              return (
                <div
                  key={day.date}
                  className={cn(
                    "min-h-28 border-b border-r border-border/40 p-1.5 align-top",
                    !day.inMonth && "bg-muted/20 text-muted-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "mb-1 inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-xs",
                      day.isToday && "bg-primary text-primary-foreground font-semibold",
                    )}
                  >
                    {day.day}
                  </div>
                  <div className="space-y-1">
                    {events.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => openEvent(event)}
                        title={`${event.title}${event.status ? ` — ${event.status}` : ""}`}
                        className={cn(
                          "block w-full truncate rounded-md border px-1.5 py-1 text-left text-[11px] transition-opacity hover:opacity-80",
                          event.status?.toLowerCase().includes("overdue")
                            ? CALENDAR_OVERDUE_STYLE
                            : CALENDAR_SOURCE_STYLES[event.source],
                        )}
                      >
                        <span className="font-medium">{event.title}</span>
                        {typeof event.amount === "number" && (
                          <span className="ml-1 opacity-80">
                            {formatCurrency(event.amount, event.currency ?? undefined)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
