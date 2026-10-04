import { describe, expect, it } from "vitest";
import { buildTaskEvents } from "./task-events";
import { filterEventsBySource } from "./month-grid";

const range = { start: "2026-10-01", end: "2026-10-31" };
const t = (id: string, due: string | null, status = "todo") => ({
  id,
  title: `Task ${id}`,
  due_date: due,
  status,
  priority: "high",
});

describe("task calendar events", () => {
  it("maps due tasks with stable ids and task info", () => {
    const [e] = buildTaskEvents([t("a", "2026-10-10")], range, "2026-10-05");
    expect(e).toMatchObject({ id: "task:a", source: "task", recordId: "a", date: "2026-10-10", category: "high", status: "To do" });
  });
  it("skips tasks without due date or outside range", () => {
    expect(buildTaskEvents([t("a", null), t("b", "2026-11-02")], range)).toHaveLength(0);
  });
  it("flags overdue but not completed tasks", () => {
    const ev = buildTaskEvents([t("a", "2026-10-01"), t("b", "2026-10-01", "completed")], range, "2026-10-05");
    expect(ev.map((e) => e.status)).toEqual(["Overdue", "Completed"]);
  });
  it("dedupes repeated rows across refreshes", () => {
    const rows = [t("a", "2026-10-10"), t("a", "2026-10-10")];
    expect(buildTaskEvents(rows, range)).toHaveLength(1);
    expect(buildTaskEvents(rows, range)[0].id).toBe(buildTaskEvents(rows, range)[0].id);
  });
  it("task source filter works alongside finance events", () => {
    const ev = buildTaskEvents([t("a", "2026-10-10")], range);
    expect(filterEventsBySource(ev, ["bill"])).toHaveLength(0);
    expect(filterEventsBySource(ev, ["task"])).toHaveLength(1);
  });
});
