import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { DateRange } from "./finance-events";
import type { CalendarEvent, CalendarSource } from "./types";

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const iso = (d: Date) => format(d, "yyyy-MM-dd");

/** Visible date window of a month view (includes leading/trailing days). */
export function monthGridRange(month: Date): DateRange {
  return {
    start: iso(startOfWeek(startOfMonth(month), { weekStartsOn: 1 })),
    end: iso(endOfWeek(endOfMonth(month), { weekStartsOn: 1 })),
  };
}

export interface MonthDay {
  date: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
}

/** Build the 6x7 (or 5x7) day matrix for a month. */
export function buildMonthGrid(month: Date, today = new Date()): MonthDay[] {
  const range = monthGridRange(month);
  const days: MonthDay[] = [];
  const cursor = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const todayIso = iso(today);
  const monthKey = format(month, "yyyy-MM");
  for (let i = 0; ; i++) {
    const d = new Date(cursor);
    d.setDate(cursor.getDate() + i);
    const key = iso(d);
    if (key > range.end) break;
    days.push({
      date: key,
      day: d.getDate(),
      inMonth: key.slice(0, 7) === monthKey,
      isToday: key === todayIso,
    });
  }
  return days;
}

export function shiftMonth(month: Date, delta: number): Date {
  return startOfMonth(addMonths(month, delta));
}

/** Filter events by enabled sources; an empty set means "show nothing". */
export function filterEventsBySource(
  events: CalendarEvent[],
  sources: CalendarSource[] | Set<CalendarSource>,
): CalendarEvent[] {
  const set = sources instanceof Set ? sources : new Set(sources);
  return events.filter((e) => set.has(e.source));
}
