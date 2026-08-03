// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from "vitest";
import ExcelJS from "exceljs";
import { exportFinanceExcel } from "./services/excel-export.service";

// Capture the generated workbook bytes instead of downloading them.
let lastBlobParts: BlobPart[] = [];
beforeEach(() => {
  lastBlobParts = [];
  vi.stubGlobal(
    "Blob",
    class {
      constructor(parts: BlobPart[]) {
        lastBlobParts = parts;
      }
    },
  );
  vi.stubGlobal("URL", { createObjectURL: () => "blob:x", revokeObjectURL: () => {} });
});

async function generate() {
  await exportFinanceExcel({
    title: "Expense Report",
    userName: "Test User",
    periodLabel: "All time",
    columns: [
      { header: "Name", key: "name" },
      { header: "Date", key: "expense_date", format: "date" },
      { header: "Amount", key: "amount", format: "currency", currencyKey: "currency", align: "right" },
    ],
    rows: [
      { name: "Hosting", expense_date: "2026-01-15", amount: 1500, currency: "ZAR" },
      { name: "Design", expense_date: "2026-02-01", amount: 2500, currency: "ZAR" },
    ],
    totals: [{ label: "Total", value: "R4,000.00" }],
  });
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(lastBlobParts[0] as ArrayBuffer);
  return wb.worksheets[0]!;
}

describe("finance excel export", () => {
  it("includes Moscow OS branding, user, period and ZAR currency label", async () => {
    const sheet = await generate();
    const text = (sheet.getSheetValues() as unknown[]).map((r) => JSON.stringify(r)).join(" ");
    expect(text).toContain("Moscow OS");
    expect(text).toContain("Expense Report");
    expect(text).toContain("Test User");
    expect(text).toContain("All time");
    expect(text).toContain("South African Rand (ZAR)");
  });

  it("formats amounts as ZAR numbers, freezes the header and sets an auto filter", async () => {
    const sheet = await generate();
    const headerRow = sheet.autoFilter as { from: { row: number } };
    const rowIndex = headerRow.from.row + 1;
    const amountCell = sheet.getCell(rowIndex, 3);
    expect(amountCell.value).toBe(1500);
    expect(amountCell.numFmt).toContain('"R"#,##0.00');
    expect(sheet.views[0]?.state).toBe("frozen");
    expect(sheet.autoFilter).toBeTruthy();
    expect(sheet.getColumn(1).width).toBeGreaterThan(0);
  });
});
