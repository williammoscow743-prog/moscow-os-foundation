import type { Worksheet } from "exceljs";
import { DEFAULT_CURRENCY_LABEL, DEFAULT_CURRENCY_SYMBOL, APP_NAME } from "@/constants/app";
import { formatDate } from "@/utils/format";

/** Shared workbook styling tokens (mirrors the Finance PDF branding). */
export const BRAND_PRIMARY = "FF4F6BFF";
export const BRAND_TEXT = "FF111827";
export const BRAND_MUTED = "FF6E7687";
export const BRAND_ZEBRA = "FFF6F7FB";

/** Excel number format producing R1,500.00 / (R1,500.00). */
export const CURRENCY_FORMAT = `"${DEFAULT_CURRENCY_SYMBOL}"#,##0.00;("${DEFAULT_CURRENCY_SYMBOL}"#,##0.00)`;
export const DATE_FORMAT = "yyyy-mm-dd";

export type ExcelHeaderMeta = {
  title: string;
  subtitle?: string;
  userName?: string;
  periodLabel?: string;
};

/**
 * Writes the branded header block (brand, title, generated date, user, period,
 * currency) at the top of a sheet and returns the next free row index.
 */
export function writeBrandedHeader(
  sheet: Worksheet,
  meta: ExcelHeaderMeta,
  columnCount: number,
): number {
  const lastCol = Math.max(columnCount, 3);
  const merge = (row: number) => sheet.mergeCells(row, 1, row, lastCol);

  const brandRow = sheet.getRow(1);
  brandRow.getCell(1).value = APP_NAME;
  brandRow.getCell(1).font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  brandRow.height = 22;
  merge(1);
  sheet.getCell(1, 1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: BRAND_PRIMARY },
  };
  sheet.getCell(1, 1).alignment = { vertical: "middle", horizontal: "left" };

  sheet.getCell(2, 1).value = meta.title;
  sheet.getCell(2, 1).font = { bold: true, size: 13, color: { argb: BRAND_TEXT } };
  merge(2);

  let row = 3;
  if (meta.subtitle) {
    sheet.getCell(row, 1).value = meta.subtitle;
    sheet.getCell(row, 1).font = { size: 10, color: { argb: BRAND_MUTED } };
    merge(row);
    row += 1;
  }

  const metaLines: string[] = [
    `Generated: ${formatDate(new Date(), "MMM d, yyyy p")}`,
    `User: ${meta.userName || "—"}`,
    `Period: ${meta.periodLabel || "All time"}`,
    `Currency: ${DEFAULT_CURRENCY_LABEL}`,
  ];
  for (const line of metaLines) {
    sheet.getCell(row, 1).value = line;
    sheet.getCell(row, 1).font = { size: 10, color: { argb: BRAND_MUTED } };
    merge(row);
    row += 1;
  }

  row += 1; // spacer before the table
  return row;
}

/** Applies header-row styling to the table header at `rowIndex`. */
export function styleTableHeader(sheet: Worksheet, rowIndex: number, columnCount: number) {
  const header = sheet.getRow(rowIndex);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.alignment = { vertical: "middle" };
  header.height = 18;
  for (let c = 1; c <= columnCount; c++) {
    header.getCell(c).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: BRAND_PRIMARY },
    };
  }
}

/** Sizes each column to its widest rendered value (bounded). */
export function autoSizeColumns(sheet: Worksheet, headerRowIndex: number, columnCount: number) {
  for (let c = 1; c <= columnCount; c++) {
    let width = 10;
    sheet.eachRow((row, idx) => {
      if (idx < headerRowIndex) return; // ignore merged meta block
      const v = row.getCell(c).value;
      const text = v == null ? "" : v instanceof Date ? "0000-00-00" : String(v);
      width = Math.max(width, text.length + 4);
    });
    sheet.getColumn(c).width = Math.min(width, 48);
  }
}
