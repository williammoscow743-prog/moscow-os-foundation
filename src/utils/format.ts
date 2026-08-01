import { format, formatDistanceToNowStrict } from "date-fns";

/** Formatting helpers used across modules. */

export function formatDate(input: string | Date | null | undefined, pattern = "MMM d, yyyy") {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, pattern);
}

export function formatRelative(input: string | Date | null | undefined) {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  return formatDistanceToNowStrict(d, { addSuffix: true });
}

/**
 * Formats a monetary value. Defaults to South African Rand, rendered as R1,500.00.
 * This is the single shared currency formatter for the app.
 */
export function formatCurrency(
  value: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
) {
  const code = (currency || DEFAULT_CURRENCY).toUpperCase();
  if (code === "ZAR") {
    // Intl's en-ZA output uses spaces/commas; the Moscow OS standard is R1,500.00.
    return `${DEFAULT_CURRENCY_SYMBOL}${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`;
  }
  return new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(value);
}

export function formatNumber(value: number, locale: string = DEFAULT_LOCALE) {
  return new Intl.NumberFormat(locale).format(value);
}

export function truncate(text: string, max = 80) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
