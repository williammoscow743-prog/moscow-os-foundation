import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guardrail tests: every money value in Finance, Projects and the Dashboard must
 * flow through the shared formatCurrency helper (ZAR / R), never a hardcoded
 * dollar sign or USD default.
 */

const ROOT = process.cwd();

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [full] : [];
  });
}

const FILES = [
  ...walk(join(ROOT, "src/features/finance")),
  ...walk(join(ROOT, "src/features/projects")),
  ...walk(join(ROOT, "src/lib/mcp")),
  join(ROOT, "src/routes/_authenticated/dashboard.tsx"),
  ...readdirSync(join(ROOT, "src/routes/_authenticated"))
    .filter((f) => f.startsWith("finance") || f.startsWith("projects") || f === "reports.tsx")
    .map((f) => join(ROOT, "src/routes/_authenticated", f)),
];

const sources = FILES.map((f) => [f.replace(`${ROOT}/`, ""), readFileSync(f, "utf8")] as const);

describe("currency usage across Finance, Projects and Dashboard", () => {
  it("has files to inspect", () => {
    expect(sources.length).toBeGreaterThan(10);
  });

  it("never hardcodes USD as a currency value", () => {
    const offenders = sources
      .filter(([, src]) => /["']USD["']/.test(src))
      .map(([path]) => path);
    expect(offenders).toEqual([]);
  });

  it("never hardcodes a $ amount in JSX or template strings", () => {
    const offenders = sources
      .filter(([, src]) => /\$\s*\{?\s*(\d|[A-Za-z_]+\.(amount|total|budget))/.test(src))
      .map(([path]) => path);
    expect(offenders).toEqual([]);
  });

  it("uses ZAR as the default currency wherever a currency default is declared", () => {
    for (const [path, src] of sources) {
      const defaults = src.match(/currency[^\n]*?["']([A-Z]{3})["']/g) ?? [];
      for (const d of defaults) {
        expect(`${path}: ${d}`).toContain("ZAR");
      }
    }
  });

  it("routes money rendering through the shared formatCurrency helper", () => {
    const moneyPages = sources.filter(([path]) =>
      /routes\/_authenticated\/finance\..*\.tsx$/.test(path),
    );
    expect(moneyPages.length).toBeGreaterThan(3);
    const missing = moneyPages
      .filter(([, src]) => /amount|total|budget|balance/i.test(src))
      .filter(([, src]) => !src.includes("formatCurrency"))
      .map(([path]) => path);
    expect(missing).toEqual([]);
  });
});

describe("shared formatter configuration", () => {
  it("formatCurrency is defined once in src/utils/format.ts", () => {
    const definitions = sources.filter(([, src]) => /export function formatCurrency/.test(src));
    expect(definitions).toEqual([]);
    expect(readFileSync(join(ROOT, "src/utils/format.ts"), "utf8")).toMatch(
      /export function formatCurrency/,
    );
  });
});
