import { describe, expect, it } from "vitest";
import {
  buildTaskSubmit,
  dueDatePatch,
  emptyTaskForm,
  isTaskFormValid,
  priorityChangePatch,
  statusChangePatch,
  taskToFormState,
  toggleCompletePatch,
} from "./task-form";
import type { TaskRow } from "./types";

const task: TaskRow = {
  id: "t1",
  user_id: "u1",
  project_id: "p1",
  milestone_id: "m1",
  title: "Write launch email",
  description: "Draft copy",
  status: "todo",
  priority: "high",
  estimated_hours: 2,
  actual_hours: null,
  progress: 40,
  start_date: null,
  due_date: "2026-01-15",
  completed_at: null,
  assigned_to: "u1",
  labels: [],
  archived: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("task creation", () => {
  it("requires a title and a project", () => {
    expect(isTaskFormValid(emptyTaskForm)).toBe(false);
    expect(isTaskFormValid({ ...emptyTaskForm, title: "  " , project_id: "p1" })).toBe(false);
    expect(isTaskFormValid({ ...emptyTaskForm, title: "Do it", project_id: "p1" })).toBe(true);
  });

  it("builds a normalized create payload with all supported fields", () => {
    const out = buildTaskSubmit({
      ...emptyTaskForm,
      title: "  Do it  ",
      description: "  ctx  ",
      project_id: "p1",
      milestone_id: "m1",
      status: "in_progress",
      priority: "urgent",
      due_date: "2026-02-01",
      estimated_hours: "3.5",
      progress: 20,
      assigned_to: "u1",
    });
    expect(out).toEqual({
      title: "Do it",
      description: "ctx",
      status: "in_progress",
      priority: "urgent",
      progress: 20,
      due_date: "2026-02-01",
      estimated_hours: 3.5,
      project_id: "p1",
      milestone_id: "m1",
      assigned_to: "u1",
    });
  });

  it("turns blank optional values into null and clamps progress", () => {
    const out = buildTaskSubmit({
      ...emptyTaskForm,
      title: "T",
      project_id: "p1",
      progress: 140,
    });
    expect(out.description).toBeNull();
    expect(out.due_date).toBeNull();
    expect(out.milestone_id).toBeNull();
    expect(out.assigned_to).toBeNull();
    expect(out.estimated_hours).toBeNull();
    expect(out.progress).toBe(100);
  });
});

describe("task editing", () => {
  it("round-trips an existing task through the form", () => {
    const state = taskToFormState(task);
    expect(state.title).toBe("Write launch email");
    expect(state.project_id).toBe("p1");
    expect(state.milestone_id).toBe("m1");
    expect(state.due_date).toBe("2026-01-15");
    expect(state.estimated_hours).toBe("2");
    expect(state.assigned_to).toBe("u1");
    expect(buildTaskSubmit(state).project_id).toBe("p1");
  });

  it("keeps the project association when edited", () => {
    const state = { ...taskToFormState(task), title: "Renamed" };
    expect(buildTaskSubmit(state)).toMatchObject({ title: "Renamed", project_id: "p1" });
  });

  it("clears the milestone when removed", () => {
    const state = { ...taskToFormState(task), milestone_id: "" };
    expect(buildTaskSubmit(state).milestone_id).toBeNull();
  });
});

describe("status, priority and due date changes", () => {
  const now = new Date("2026-03-01T10:00:00Z");

  it("stamps completion and full progress when completed", () => {
    expect(statusChangePatch(task, "completed", now)).toEqual({
      status: "completed",
      completed_at: "2026-03-01T10:00:00.000Z",
      progress: 100,
    });
  });

  it("clears completion when moved back to an open status", () => {
    expect(statusChangePatch({ ...task, status: "completed" }, "in_review", now)).toEqual({
      status: "in_review",
      completed_at: null,
      progress: 40,
    });
  });

  it("toggles between completed and to-do", () => {
    expect(toggleCompletePatch(task, now).status).toBe("completed");
    expect(toggleCompletePatch({ ...task, status: "completed" }, now).status).toBe("todo");
  });

  it("changes priority only", () => {
    expect(priorityChangePatch("low")).toEqual({ priority: "low" });
  });

  it("sets and clears the due date", () => {
    expect(dueDatePatch("2026-04-02")).toEqual({ due_date: "2026-04-02" });
    expect(dueDatePatch("")).toEqual({ due_date: null });
  });
});

describe("authorization scoping", () => {
  it("never carries an owner id in the form payload (server sets it from the session)", () => {
    const out = buildTaskSubmit({ ...emptyTaskForm, title: "T", project_id: "p1" });
    expect(Object.keys(out)).not.toContain("user_id");
  });
});
