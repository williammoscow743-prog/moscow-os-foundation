import { beforeEach, describe, expect, it, vi } from "vitest";

/** Captured drawing calls from the mocked jsPDF instance. */
const texts: string[] = [];
const tables: { head: string[][]; body: string[][] }[] = [];
let saved: string | undefined;

vi.mock("jspdf", () => {
  class FakeDoc {
    internal = {
      pageSize: { getWidth: () => 210, getHeight: () => 297 },
    };
    setFillColor() {}
    setDrawColor() {}
    setTextColor() {}
    setFont() {}
    setFontSize() {}
    roundedRect() {}
    line() {}
    setPage() {}
    getNumberOfPages() {
      return 1;
    }
    text(value: string) {
      texts.push(String(value));
    }
    save(filename: string) {
      saved = filename;
    }
  }
  return { default: FakeDoc };
});

vi.mock("jspdf-autotable", () => ({
  default: (_doc: unknown, opts: { head: string[][]; body: string[][] }) => {
    tables.push({ head: opts.head, body: opts.body });
  },
}));

const { exportFinancePdf } = await import("@/features/finance/pdf-export");
const { DEFAULT_CURRENCY_LABEL } = await import("@/constants/app");

function run(overrides: Partial<Parameters<typeof exportFinancePdf>[0]> = {}) {
  exportFinancePdf({
    title: "Expense Report",
    userName: "Test User",
    periodLabel: "Jan 2026",
    columns: [
      { header: "Description", key: "description" },
      { header: "Date", key: "date", format: "date" },
      { header: "Amount", key: "amount", format: "currency", currencyKey: "currency" },
    ],
    rows: [
      { description: "Hosting", date: "2026-01-15", amount: 1500, currency: "ZAR" },
      { description: "Design", date: "2026-01-20", amount: 249.5 },
      { description: "Blank", date: null, amount: null },
    ],
    totals: [{ label: "Total", value: "R1,749.50" }],
    ...overrides,
  });
}

describe("finance PDF export", () => {
  beforeEach(() => {
    texts.length = 0;
    tables.length = 0;
    saved = undefined;
  });

  it("prints the South African Rand currency label in the header", () => {
    run();
    expect(texts).toContain(`Currency: ${DEFAULT_CURRENCY_LABEL}`);
  });

  it("includes branding, title, user and period metadata", () => {
    run();
    expect(texts).toContain("Moscow OS");
    expect(texts).toContain("Expense Report");
    expect(texts).toContain("User: Test User");
    expect(texts).toContain("Period: Jan 2026");
    expect(texts.some((t) => t.startsWith("Generated: "))).toBe(true);
    expect(texts.some((t) => /^Page 1 of 1$/.test(t))).toBe(true);
  });

  it("renders currency cells with the R symbol", () => {
    run();
    const body = tables[0]!.body;
    expect(body[0]![2]).toBe("R1,500.00");
    expect(body[1]![2]).toBe("R249.50");
  });

  it("defaults missing per-row currency to ZAR and never emits $", () => {
    run();
    const flat = tables[0]!.body.flat().join(" ");
    expect(flat).not.toContain("$");
    expect(flat).not.toContain("USD");
  });

  it("renders empty cells as an em dash", () => {
    run();
    expect(tables[0]!.body[2]![2]).toBe("—");
  });

  it("prints totals in ZAR and saves with the given filename", () => {
    run({ filename: "expenses-2026-01-31.pdf" });
    expect(texts).toContain("R1,749.50");
    expect(saved).toBe("expenses-2026-01-31.pdf");
  });
});
