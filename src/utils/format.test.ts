import { describe, expect, it } from "vitest";
import { formatCurrency, formatNumber } from "@/utils/format";
import {
  DEFAULT_CURRENCY,
  DEFAULT_CURRENCY_LABEL,
  DEFAULT_CURRENCY_NAME,
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_LOCALE,
} from "@/constants/app";

describe("currency configuration", () => {
  it("defaults to South African Rand", () => {
    expect(DEFAULT_CURRENCY).toBe("ZAR");
    expect(DEFAULT_CURRENCY_SYMBOL).toBe("R");
    expect(DEFAULT_LOCALE).toBe("en-ZA");
    expect(DEFAULT_CURRENCY_NAME).toBe("South African Rand");
    expect(DEFAULT_CURRENCY_LABEL).toBe("South African Rand (ZAR)");
  });
});

describe("formatCurrency", () => {
  it("renders ZAR as R1,500.00 by default", () => {
    expect(formatCurrency(1500)).toBe("R1,500.00");
  });

  it("always shows two decimals", () => {
    expect(formatCurrency(0)).toBe("R0.00");
    expect(formatCurrency(9.5)).toBe("R9.50");
    expect(formatCurrency(1234.567)).toBe("R1,234.57");
  });

  it("groups thousands and millions", () => {
    expect(formatCurrency(1_234_567.89)).toBe("R1,234,567.89");
  });

  it("handles negative values", () => {
    expect(formatCurrency(-2500)).toBe("-R2,500.00");
  });

  it("treats an explicit or lowercase ZAR the same as the default", () => {
    expect(formatCurrency(100, "ZAR")).toBe("R100.00");
    expect(formatCurrency(100, "zar")).toBe("R100.00");
  });

  it("falls back to the default currency for empty input", () => {
    expect(formatCurrency(100, "")).toBe("R100.00");
  });

  it("never renders a dollar sign for default values", () => {
    expect(formatCurrency(42)).not.toContain("$");
  });

  it("still supports other currency codes when explicitly passed", () => {
    expect(formatCurrency(100, "USD", "en-US")).toContain("$");
  });
});

describe("formatNumber", () => {
  it("formats using the en-ZA locale", () => {
    expect(formatNumber(1000)).toBe(new Intl.NumberFormat("en-ZA").format(1000));
  });
});
