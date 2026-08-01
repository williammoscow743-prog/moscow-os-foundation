import jsPDF from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";
import { formatCurrency, formatDate } from "@/utils/format";
import { DEFAULT_CURRENCY_LABEL } from "@/constants/app";

export type PdfColumn = {
  header: string;
  key: string;
  align?: "left" | "right" | "center";
  format?: "currency" | "date" | "text";
  currencyKey?: string; // when format=currency, resolve currency from another field
};

export type PdfExportOptions = {
  title: string;
  subtitle?: string;
  userName?: string;
  periodLabel?: string;
  columns: PdfColumn[];
  rows: Record<string, unknown>[];
  totals?: { label: string; value: string }[];
  filename?: string;
};

const BRAND = "Moscow OS";
const PRIMARY: [number, number, number] = [79, 107, 255]; // #4F6BFF
const MUTED: [number, number, number] = [110, 118, 135];
const TEXT: [number, number, number] = [17, 24, 39];

function drawLogo(doc: jsPDF, x: number, y: number) {
  // Simple monogram square as logo placeholder
  doc.setFillColor(...PRIMARY);
  doc.roundedRect(x, y - 8, 10, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("M", x + 5, y - 1.2, { align: "center" });
}

function drawHeader(doc: jsPDF, opts: PdfExportOptions) {
  const pageWidth = doc.internal.pageSize.getWidth();
  drawLogo(doc, 14, 20);
  doc.setTextColor(...TEXT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(BRAND, 27, 19);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("Finance report", 27, 24);

  // Title
  doc.setTextColor(...TEXT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(opts.title, 14, 40);

  // Meta lines (right aligned)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const generated = `Generated: ${formatDate(new Date(), "MMM d, yyyy p")}`;
  const rightX = pageWidth - 14;
  doc.text(generated, rightX, 20, { align: "right" });
  if (opts.userName) doc.text(`User: ${opts.userName}`, rightX, 25, { align: "right" });
  if (opts.periodLabel) doc.text(`Period: ${opts.periodLabel}`, rightX, 30, { align: "right" });
  doc.text(`Currency: ${DEFAULT_CURRENCY_LABEL}`, rightX, opts.periodLabel ? 35 : 30, { align: "right" });

  if (opts.subtitle) {
    doc.setTextColor(...MUTED);
    doc.setFontSize(10);
    doc.text(opts.subtitle, 14, 46);
  }
}

function drawFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(230, 232, 240);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`${BRAND} · Confidential`, 14, pageHeight - 8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: "right" });
  }
}

function formatCell(value: unknown, col: PdfColumn, row: Record<string, unknown>): string {
  if (value == null || value === "") return "—";
  if (col.format === "currency") {
    const currency = (col.currencyKey ? (row[col.currencyKey] as string) : "ZAR") || "ZAR";
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? formatCurrency(n, currency) : String(value);
  }
  if (col.format === "date") return formatDate(String(value));
  return String(value);
}

export function exportFinancePdf(opts: PdfExportOptions): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  drawHeader(doc, opts);

  const body: RowInput[] = opts.rows.map((r) =>
    opts.columns.map((c) => formatCell(r[c.key], c, r)),
  );

  autoTable(doc, {
    startY: opts.subtitle ? 52 : 48,
    head: [opts.columns.map((c) => c.header)],
    body,
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, textColor: TEXT },
    headStyles: { fillColor: PRIMARY, textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [246, 247, 251] },
    columnStyles: opts.columns.reduce<Record<number, { halign: "left" | "right" | "center" }>>(
      (acc, c, i) => {
        acc[i] = { halign: c.align ?? (c.format === "currency" ? "right" : "left") };
        return acc;
      },
      {},
    ),
    margin: { left: 14, right: 14, bottom: 20 },
  });

  if (opts.totals && opts.totals.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable?.finalY ?? 60;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = finalY + 8;
    doc.setDrawColor(230, 232, 240);
    doc.line(pageWidth - 90, y - 4, pageWidth - 14, y - 4);
    doc.setFontSize(10);
    for (const t of opts.totals) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      doc.text(t.label, pageWidth - 90, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...TEXT);
      doc.text(t.value, pageWidth - 14, y, { align: "right" });
      y += 6;
    }
  }

  drawFooter(doc);
  const filename =
    opts.filename ??
    `${opts.title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
