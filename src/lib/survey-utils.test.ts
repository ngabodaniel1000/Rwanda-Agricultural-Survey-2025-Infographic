import { describe, expect, it } from "vitest";
import { pctChange, toCsv } from "./survey-utils";
import { CROPS, IRRIGATION, CROP_INDICATORS } from "@/data/survey";

const crop = (id: string) => CROPS.find((c) => c.id === id)!;

describe("calculated comparisons", () => {
  it("cassava A→B ≈ +57.0%", () => {
    expect(pctChange(crop("cassava").values.A, crop("cassava").values.B)!.toFixed(1)).toBe("57.0");
  });
  it("irish potato A→B ≈ -34.0%", () => {
    expect(pctChange(crop("irish-potato").values.A, crop("irish-potato").values.B)!.toFixed(1)).toBe("-34.0");
  });
  it("banana A→B ≈ -8.8%", () => {
    expect(pctChange(crop("banana").values.A, crop("banana").values.B)!.toFixed(1)).toBe("-8.8");
  });
  it("returns null when a value is missing", () => {
    expect(pctChange(crop("banana").values.A, crop("banana").values.C)).toBeNull();
  });
});

describe("csv export", () => {
  it("exports missing values as NA, never 0", () => {
    const csv = toCsv(CROP_INDICATORS);
    expect(csv).toContain("Banana,Season C,July 2025 – September 2025,NA,metric tonnes");
  });
  it("keeps exact irrigation value for Season C", () => {
    expect(toCsv([IRRIGATION])).toContain("Season C,July 2025 – September 2025,58.9,% of farmers");
  });
});
