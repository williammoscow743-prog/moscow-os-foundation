/** Global app-level constants. */

export const APP_NAME = "Moscow OS";
export const APP_TAGLINE = "Operate your business, elegantly.";
export const SUPPORT_EMAIL = "support@moscow-os.app";

export const DEFAULT_LOCALE = "en-ZA";
export const DEFAULT_CURRENCY = "ZAR";
export const DEFAULT_CURRENCY_SYMBOL = "R";
export const DEFAULT_CURRENCY_NAME = "South African Rand";
export const DEFAULT_CURRENCY_LABEL = "South African Rand (ZAR)";
export const DEFAULT_TIMEZONE = "UTC";

/** Query cache freshness windows. */
export const STALE_TIME = {
  short: 30_000,
  medium: 60_000,
  long: 5 * 60_000,
} as const;
