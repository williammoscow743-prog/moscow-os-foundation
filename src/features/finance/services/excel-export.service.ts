import type { PdfColumn } from "@/features/finance/pdf-export";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
  BRAND_TEXT,
  BRAND_MUTED,
  BRAND_ZEBRA,
  autoSizeColumns,
  styleTableHeader,
  writeBrandedHeader,
} from "@/features/finance/utils/excelTemplates";

/** Excel export reuses the exact column/row contract of the PDF exporter. */
export type ExcelColumn = PdfColumn;

export type ExcelExportOptions = {
  title: string;
  subtitle?: string;
  userName?: string;
  periodLabel?: string;
  sheetName?: string;
  columns: ExcelColumn[];
  rows: Record<string, unknown>[];
  totals?: { label: string; value: string }[];
  filename?: string;
};

function cellValue(value: unknown, col: ExcelColumn): string | number | Date | null {
  if (value == null || value === "") return null;
  if (col.format === "currency") {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : String(value);
  }
  if (col.format === "date") {
    const d = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(d.getTime()) ? String(value) : d;
  }
  return typeof value === "number" ? value : String(value);
}

/** Builds and downloads a branded .xlsx workbook for a Finance dataset. */
export async function exportFinanceExcel(opts: ExcelExportOptions): Promise<void> {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Moscow OS";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet((opts.sheetName ?? opts.title).slice(0, 31), {
    views: [{ state: "frozen" }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  const colCount = opts.columns.length;
  const headerRowIndex = writeBrandedHeader(
    sheet,
    { title: opts.title, subtitle: opts.subtitle, userName: opts.userName, periodLabel: opts.periodLabel },
    colCount,
  );

  sheet.getRow(headerRowIndex).values = opts.columns.map((c) => c.header);
  styleTableHeader(sheet, headerRowIndex, colCount);

  opts.rows.forEach((r, i) => {
    const rowIndex = headerRowIndex + 1 + i;
    const row = sheet.getRow(rowIndex);
    opts.columns.forEach((c, ci) => {
      const cell = row.getCell(ci + 1);
      cell.value = cellValue(r[c.key], c);
      cell.font = { size: 10, color: { argb: BRAND_TEXT } };
      cell.alignment = {
        horizontal: c.align ?? (c.format === "currency" ? "right" : "left"),
        vertical: "middle",
      };
      if (c.format === "currency") cell.numFmt = CURRENCY_FORMAT;
      if (c.format === "date") cell.numFmt = DATE_FORMAT;
      if (i % 2 === 1) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_ZEBRA } };
      }
    });
    row.commit();
  });

  const lastDataRow = headerRowIndex + opts.rows.length;

  // Auto filter + frozen header row
  sheet.autoFilter = {
    from: { row: headerRowIndex, column: 1 },
    to: { row: Math.max(lastDataRow, headerRowIndex), column: colCount },
  };
  sheet.views = [{ state: "frozen", ySplit: headerRowIndex }];

  // Totals block
  if (opts.totals?.length) {
    let y = lastDataRow + 2;
    for (const t of opts.totals) {
      sheet.getCell(y, 1).value = t.label;
      sheet.getCell(y, 1).font = { size: 10, color: { argb: BRAND_MUTED } };
      const valueCell = sheet.getCell(y, Math.max(colCount, 2));
      valueCell.value = t.value;
      valueCell.font = { bold: true, size: 10, color: { argb: BRAND_TEXT } };
      valueCell.alignment = { horizontal: "right" };
      y += 1;
    }
  }

  autoSizeColumns(sheet, headerRowIndex, colCount);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const filename =
    opts.filename ??
    `${opts.title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
