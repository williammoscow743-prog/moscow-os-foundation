import { describe, expect, it } from "vitest";
import {
  buildMonthGrid,
  filterEventsBySource,
  monthGridRange,
  shiftMonth,
} from "./month-grid";
import {
  billEvents,
  billOccurrences,
  buildFinanceEvents,
  budgetEvents,
  expenseEvents,
  groupEventsByDate,
  incomeEvents,
} from "./finance-events";
import type { CalendarEvent } from "./types";

const range = { start: "2026-01-01", end: "2026-03-31" };

const bill = (over: Record<string, unknown> = {}) =>
  ({
    id: "b1",
    name: "Fibre",
    amount: 899,
    currency: "ZAR",
    category: "Utilities",
    due_date: "2026-01-10",
    frequency: "monthly",
    status: "unpaid",
    archived: false,
    ...over,
  }) as never;

describe("month grid", () => {
  it("covers whole weeks around the month", () => {
    const r = monthGridRange(new Date(2026, 0, 15));
    expect(r.start).toBe("2025-12-29");
    expect(r.end).toBe("2026-02-01");
  });

  it("builds contiguous days flagged in/out of month", () => {
    const days = buildMonthGrid(new Date(2026, 0, 15), new Date(2026, 0, 15));
    expect(days.length % 7).toBe(0);
    expect(days[0].date).toBe("2025-12-29");
    expect(days[0].inMonth).toBe(false);
    expect(days.find((d) => d.date === "2026-01-15")?.isToday).toBe(true);
    expect(days.filter((d) => d.inMonth)).toHaveLength(31);
  });

  it("navigates months forward and back", () => {
    const base = new Date(2026, 0, 15);
    expect(shiftMonth(base, 1).getMonth()).toBe(1);
    expect(shiftMonth(base, -1).getFullYear()).toBe(2025);
    expect(monthGridRange(shiftMonth(base, 1)).start).toBe("2026-01-26");
  });
});

describe("finance events in the calendar", () => {
  it("expands recurring bills with stable, deduped ids", () => {
    const dates = billOccurrences(bill(), range);
    expect(dates).toEqual(["2026-01-10", "2026-02-10", "2026-03-10"]);
    const events = billEvents([bill(), bill()], range);
    const unique = new Set(events.map((e) => e.id));
    expect(unique.size).toBe(3);
    expect(events[0].id).toBe("bill:b1:2026-01-10");
    expect(events[1].recurring).toBe(true);
  });

  it("marks overdue bills", () => {
    const events = billEvents([bill({ frequency: "once", due_date: "2026-01-05" })], range);
    expect(events).toHaveLength(1);
    expect(String(events[0].status).toLowerCase()).toContain("overdue");
  });

  it("adds budget period start and end", () => {
    const events = budgetEvents(
      [
        {
          id: "bu1",
          category: "Software",
          amount: 2000,
          currency: "ZAR",
          start_date: "2026-01-01",
          end_date: "2026-01-31",
        } as never,
      ],
      range,
    );
    expect(events.map((e) => e.id)).toEqual(["budget:bu1:start", "budget:bu1:end"]);
  });

  it("maps income and expense dates", () => {
    const inc = incomeEvents(
      [
        {
          id: "i1",
          source: "Retainer",
          amount: 5000,
          currency: "ZAR",
          category: "Client",
          received_date: "2026-01-20",
        } as never,
      ],
      range,
    );
    const exp = expenseEvents(
      [
        {
          id: "e1",
          name: "Adobe",
          amount: 699,
          currency: "ZAR",
          category: "Software",
          expense_date: "2026-01-21",
        } as never,
      ],
      range,
    );
    expect(inc[0].date).toBe("2026-01-20");
    expect(exp[0].date).toBe("2026-01-21");
  });

  it("links every event back to its finance record", () => {
    const events = buildFinanceEvents({ bills: [bill()] }, range);
    expect(events.every((e) => e.link.startsWith("/finance/"))).toBe(true);
    expect(events[0].link).toContain("record=b1");
  });

  it("groups by date and never duplicates", () => {
    const events = buildFinanceEvents({ bills: [bill(), bill()] }, range);
    expect(events).toHaveLength(3);
    const grouped = groupEventsByDate(events);
    expect(Object.keys(grouped)).toHaveLength(3);
  });
});

describe("source filtering", () => {
  const events = [
    { id: "1", source: "bill" },
    { id: "2", source: "budget" },
    { id: "3", source: "income" },
    { id: "4", source: "expense" },
  ] as CalendarEvent[];

  it("keeps only enabled sources", () => {
    expect(filterEventsBySource(events, ["bill", "income"]).map((e) => e.id)).toEqual(["1", "3"]);
  });

  it("shows nothing when all sources are off", () => {
    expect(filterEventsBySource(events, [])).toHaveLength(0);
  });
});
