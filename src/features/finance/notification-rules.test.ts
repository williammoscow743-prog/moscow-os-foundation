import { describe, expect, it } from "vitest";
import {
  buildBillNotifications,
  buildBudgetNotifications,
  buildFinanceActivityNotifications,
  buildFinanceNotifications,
  budgetPeriodWindow,
} from "./notification-rules";
import type { BillRow, BudgetRow, ExpenseRow } from "./types";

const TODAY = new Date("2026-06-10T09:00:00.000Z");

function bill(overrides: Partial<BillRow> = {}): BillRow {
  return {
    id: "bill-1",
    user_id: "user-1",
    name: "Internet",
    description: null,
    amount: 999,
    currency: "ZAR",
    category: "internet",
    due_date: "2026-06-17",
    frequency: "once",
    status: "upcoming",
    paid_at: null,
    next_due_date: null,
    snoozed_until: null,
    vendor: null,
    notes: null,
    project_id: null,
    archived: false,
    created_at: "2026-06-01T00:00:00.000Z",
    updated_at: "2026-06-01T00:00:00.000Z",
    ...overrides,
  } as BillRow;
}

function budget(overrides: Partial<BudgetRow> = {}): BudgetRow {
  return {
    id: "budget-1",
    user_id: "user-1",
    category: "marketing",
    amount: 1000,
    currency: "ZAR",
    period: "monthly",
    start_date: "2026-06-01",
    end_date: "2026-06-30",
    alert_thresholds: [80, 90, 100],
    notes: null,
    created_at: "2026-06-01T00:00:00.000Z",
    updated_at: "2026-06-01T00:00:00.000Z",
    ...overrides,
  } as BudgetRow;
}

function expense(amount: number, overrides: Partial<ExpenseRow> = {}): ExpenseRow {
  return {
    id: `exp-${amount}`,
    user_id: "user-1",
    name: "Ads",
    description: null,
    amount,
    currency: "ZAR",
    category: "marketing",
    expense_date: "2026-06-05",
    payment_method: null,
    vendor: null,
    receipt_url: null,
    project_id: null,
    client_id: null,
    notes: null,
    tags: [],
    created_at: "2026-06-05T00:00:00.000Z",
    updated_at: "2026-06-05T00:00:00.000Z",
    ...overrides,
  } as ExpenseRow;
}

describe("bill notification rules", () => {
  it("notifies 7 days before the due date", () => {
    const [n] = buildBillNotifications([bill({ due_date: "2026-06-17" })], TODAY);
    expect(n!.title).toContain("due in 7 days");
    expect(n!.entity_id).toBe("bill-1");
    expect(n!.link).toBe("/finance/bills");
    expect(n!.category).toBe("finance");
  });

  it("notifies the day before the due date", () => {
    const [n] = buildBillNotifications([bill({ due_date: "2026-06-11" })], TODAY);
    expect(n!.title).toContain("due tomorrow");
    expect(n!.type).toBe("warning");
  });

  it("notifies on the due date", () => {
    const [n] = buildBillNotifications([bill({ due_date: "2026-06-10" })], TODAY);
    expect(n!.title).toContain("due today");
  });

  it("notifies when a bill is overdue", () => {
    const [n] = buildBillNotifications([bill({ due_date: "2026-06-08" })], TODAY);
    expect(n!.title).toContain("overdue");
    expect(n!.type).toBe("danger");
    expect(n!.message).toContain("2 days ago");
  });

  it("emits exactly one notification per bill condition and stable dedupe keys", () => {
    const b = bill({ due_date: "2026-06-17" });
    const first = buildBillNotifications([b], TODAY);
    const second = buildBillNotifications([b], TODAY);
    expect(first).toHaveLength(1);
    expect(first[0]!.dedupe_key).toBe(second[0]!.dedupe_key);
    expect(new Set(first.map((n) => n.dedupe_key)).size).toBe(1);
  });

  it("ignores paid, cancelled and archived bills", () => {
    expect(
      buildBillNotifications(
        [
          bill({ id: "a", status: "paid", due_date: "2026-06-01" }),
          bill({ id: "b", status: "cancelled", due_date: "2026-06-01" }),
          bill({ id: "c", archived: true, due_date: "2026-06-01" }),
        ],
        TODAY,
      ),
    ).toHaveLength(0);
  });

  it("uses ZAR formatting in the message", () => {
    const [n] = buildBillNotifications([bill({ due_date: "2026-06-10", amount: 1500 })], TODAY);
    expect(n!.message).toContain("R1,500.00");
  });
});

describe("budget notification rules", () => {
  const titles = (spent: number) =>
    buildBudgetNotifications([budget()], [expense(spent)], TODAY).map((n) => n.title);

  it("does not notify below 80%", () => {
    expect(titles(700)).toHaveLength(0);
  });

  it("notifies at 80%", () => {
    expect(titles(800).some((t) => t.includes("80%"))).toBe(true);
  });

  it("notifies at 90%", () => {
    const t = titles(900);
    expect(t.some((x) => x.includes("90%"))).toBe(true);
    expect(t.some((x) => x.includes("80%"))).toBe(true);
  });

  it("notifies at 100%", () => {
    expect(titles(1000).some((t) => t.includes("Budget reached"))).toBe(true);
  });

  it("notifies when over budget", () => {
    const n = buildBudgetNotifications([budget()], [expense(1200)], TODAY);
    const over = n.find((x) => x.title.startsWith("Over budget"));
    expect(over).toBeDefined();
    expect(over!.message).toContain("R200.00");
    expect(over!.type).toBe("danger");
  });

  it("scopes dedupe keys to the budget period so a threshold fires once per period", () => {
    const a = buildBudgetNotifications([budget()], [expense(1000)], TODAY);
    const b = buildBudgetNotifications([budget()], [expense(1000)], TODAY);
    expect(a.map((n) => n.dedupe_key)).toEqual(b.map((n) => n.dedupe_key));
    expect(new Set(a.map((n) => n.dedupe_key)).size).toBe(a.length);
    expect(a[0]!.dedupe_key).toContain("2026-06-01");
  });

  it("only counts expenses inside the period and matching category", () => {
    const out = buildBudgetNotifications(
      [budget()],
      [
        expense(900, { id: "old", expense_date: "2026-05-20" }),
        expense(900, { id: "other", category: "fuel" }),
      ],
      TODAY,
    );
    expect(out).toHaveLength(0);
  });

  it("rolls recurring budget windows forward to the active period", () => {
    const w = budgetPeriodWindow(budget({ start_date: "2026-01-01", end_date: null }), TODAY);
    expect(w.start).toBe("2026-06-01");
    expect(w.end).toBe("2026-06-30");
  });
});

describe("finance activity rules", () => {
  it("notifies once for a new recurring bill and never for one-off bills", () => {
    const out = buildFinanceActivityNotifications(
      [bill({ id: "r", frequency: "monthly" }), bill({ id: "o", frequency: "once" })],
      [],
      null,
    );
    expect(out).toHaveLength(1);
    expect(out[0]!.dedupe_key).toBe("finance:bill:r:recurring_created");
  });

  it("skips large expense alerts when no threshold is configured", () => {
    expect(buildFinanceActivityNotifications([], [expense(50000)], null)).toHaveLength(0);
  });

  it("flags large expenses when a threshold is configured", () => {
    const out = buildFinanceActivityNotifications([], [expense(50000)], 10000);
    expect(out).toHaveLength(1);
    expect(out[0]!.title).toContain("Large expense");
    expect(out[0]!.message).toContain("R50,000.00");
  });
});

describe("rule engine data scoping", () => {
  it("only builds notifications from the records it is given (RLS-scoped input)", () => {
    const out = buildFinanceNotifications({
      bills: [bill({ due_date: "2026-06-10" })],
      budgets: [budget()],
      expenses: [expense(1000)],
      today: TODAY,
    });
    expect(out.every((n) => n.category === "finance")).toBe(true);
    expect(out.every((n) => n.entity_id !== null)).toBe(true);
    // No user_id is ever assigned by the rules; persistence attaches the signed-in user.
    expect(out.every((n) => !("user_id" in n))).toBe(true);
  });
});
