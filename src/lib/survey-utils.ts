import { SEASON_INFO, SEASONS, type Indicator, type Season, type Unit, type Value } from "@/data/survey";

export const UNIT_LABEL: Record<Unit, string> = {
  ha: "hectares",
  t: "metric tonnes",
  "%": "% of farmers",
  count: "count",
};

/** Percentage change between two values; null when either is unavailable. */
export function pctChange(from: Value, to: Value): number | null {
  if (from == null || to == null || from === 0) return null;
  return ((to - from) / from) * 100;
}

export function formatNumber(v: Value, digits = 0): string {
  if (v == null) return "Not available";
  return v.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

export function formatValue(v: Value, unit: Unit): string {
  if (v == null) return "Not available";
  if (unit === "%") return `${v.toFixed(1)}%`;
  if (unit === "ha") return `${formatNumber(v)} ha`;
  if (unit === "t") return `${formatNumber(v)} t`;
  return formatNumber(v);
}

export function formatMillionHa(v: Value): string {
  if (v == null) return "Not available";
  return `${(v / 1_000_000).toFixed(3)} million ha`;
}

function csvCell(s: string | number): string {
  const str = String(s);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/** Builds CSV with one row per indicator × season. Missing values exported as "NA". */
export function toCsv(indicators: Indicator[], seasons: Season[] = SEASONS): string {
  const header = ["Category", "Indicator", "Season", "Period", "Value", "Unit", "Definition"];
  const rows = indicators.flatMap((ind) =>
    seasons.map((s) => [
      ind.category,
      ind.name,
      SEASON_INFO[s].label,
      SEASON_INFO[s].period,
      ind.values[s] == null ? "NA" : ind.values[s]!,
      UNIT_LABEL[ind.unit],
      ind.definition,
    ]),
  );
  return [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
