/**
 * Central data module — NISR Seasonal Agricultural Survey (SAS), Annual Report 2025.
 * Source: National Institute of Statistics of Rwanda (NISR), December 2025.
 *
 * All values below were supplied in the project brief and MUST be checked
 * against the original report before publication.
 * Missing values are `null` (unavailable) — never 0.
 * Update figures here only; every chart, table, story and CSV export reads from this file.
 */

export type Season = "A" | "B" | "C";
export type Unit = "ha" | "t" | "%" | "count";
export type Value = number | null;

export const SEASONS: Season[] = ["A", "B", "C"];

export const SEASON_INFO: Record<Season, { label: string; period: string }> = {
  A: { label: "Season A", period: "September 2024 – February 2025" },
  B: { label: "Season B", period: "March 2025 – June 2025" },
  C: { label: "Season C", period: "July 2025 – September 2025" },
};

export const SOURCE_CITATION =
  "Source: National Institute of Statistics of Rwanda (NISR), Seasonal Agricultural Survey, Annual Report 2025, December 2025.";

export const OVERVIEW_STATS = [
  { label: "Agricultural seasons covered", value: 3, note: "Seasons A, B and C" },
  { label: "Sampled segments, Seasons A & B", value: 1200, note: "Area segments — not farmers" },
  { label: "Sampled segments, Season C", value: 946, note: "Area segments — not farmers" },
  { label: "Large-scale farmers visited, Season A", value: 382, note: "Farmers" },
  { label: "Large-scale farmers visited, Season B", value: 379, note: "Farmers" },
];

export interface Indicator {
  id: string;
  name: string;
  category: Category;
  unit: Unit;
  definition: string;
  values: Record<Season, Value>;
}

export type Category =
  | "Land Use"
  | "Inputs"
  | "Irrigation"
  | "Soil Conservation"
  | "Crop Production"
  | "Irish Potato Area";

export const CATEGORIES: Category[] = [
  "Land Use",
  "Inputs",
  "Irrigation",
  "Soil Conservation",
  "Crop Production",
  "Irish Potato Area",
];

/** Total land area reported for Seasons A and B (hectares). */
export const TOTAL_LAND_AREA_HA = 2_376_000;

// Land use in hectares. Season C not provided in supplied data → null.
export const LAND_USE: Indicator[] = [
  { id: "agri-land", name: "Agricultural land", category: "Land Use", unit: "ha",
    definition: "All land used for seasonal crops, permanent crops and permanent pasture.",
    values: { A: 1_399_000, B: 1_423_000, C: null } },
  { id: "seasonal-crops", name: "Seasonal crops area", category: "Land Use", unit: "ha",
    definition: "Land under crops planted and harvested within one agricultural season.",
    values: { A: 1_019_000, B: 1_022_000, C: null } },
  { id: "permanent-crops", name: "Permanent crops area", category: "Land Use", unit: "ha",
    definition: "Land under long-lived crops such as banana, coffee and tea that are not replanted each season.",
    values: { A: 492_000, B: 524_000, C: null } },
  { id: "pasture", name: "Permanent pasture", category: "Land Use", unit: "ha",
    definition: "Land used for growing herbaceous forage for livestock over a long period.",
    values: { A: 96_000, B: 100_000, C: null } },
];

export const INPUTS: Indicator[] = [
  { id: "improved-seeds", name: "Improved seeds", category: "Inputs", unit: "%",
    definition: "Percentage of farmers who used improved seeds.",
    values: { A: 37.3, B: 18.0, C: 18.9 } },
  { id: "organic-fert", name: "Organic fertilizer", category: "Inputs", unit: "%",
    definition: "Percentage of farmers who used organic fertilizer.",
    values: { A: 88.0, B: 80.8, C: 83.5 } },
  { id: "inorganic-fert", name: "Inorganic fertilizer", category: "Inputs", unit: "%",
    definition: "Percentage of farmers who used inorganic fertilizer.",
    values: { A: 63.2, B: 55.5, C: 65.8 } },
  { id: "pesticides", name: "Pesticides and fungicides", category: "Inputs", unit: "%",
    definition: "Percentage of farmers who used pesticides and/or fungicides.",
    values: { A: 41.9, B: 36.6, C: 67.0 } },
];

export const IRRIGATION: Indicator = {
  id: "irrigation", name: "Farmers who irrigated crops", category: "Irrigation", unit: "%",
  definition: "Percentage of farmers who irrigated their crops.",
  values: { A: 13.4, B: 11.5, C: 58.9 },
};

export const SOIL_CONSERVATION: Indicator = {
  id: "erosion-control", name: "Farmers who controlled soil erosion", category: "Soil Conservation", unit: "%",
  definition: "Percentage of farmers who applied soil erosion control.",
  values: { A: 90.3, B: 89.9, C: 94.7 },
};

export interface Crop {
  id: string;
  name: string;
  emoji: string;
  values: Record<Season, Value>; // metric tonnes
}

// Crop production in metric tonnes. Season C values not provided for some crops → null.
export const CROPS: Crop[] = [
  { id: "banana", name: "Banana", emoji: "🍌", values: { A: 1_278_234, B: 1_166_247, C: null } },
  { id: "cassava", name: "Cassava", emoji: "🌿", values: { A: 542_874, B: 852_541, C: null } },
  { id: "irish-potato", name: "Irish potato", emoji: "🥔", values: { A: 475_785, B: 314_093, C: 94_892 } },
  { id: "sweet-potato", name: "Sweet potato", emoji: "🍠", values: { A: 656_320, B: 652_515, C: 41_289 } },
  { id: "maize", name: "Maize", emoji: "🌽", values: { A: 481_246, B: 117_711, C: null } },
  { id: "paddy-rice", name: "Paddy rice", emoji: "🌾", values: { A: 69_680, B: 72_976, C: null } },
  { id: "beans", name: "Beans", emoji: "🫘", values: { A: 230_456, B: 240_721, C: 3_178 } },
];

export const IRISH_POTATO_AREA: Indicator = {
  id: "irish-potato-area", name: "Irish potato cultivated area", category: "Irish Potato Area", unit: "ha",
  definition: "Area cultivated with Irish potatoes, in hectares (not production).",
  values: { A: 54_485, B: 45_940, C: 10_389 },
};

export const CROP_INDICATORS: Indicator[] = CROPS.map((c) => ({
  id: `prod-${c.id}`,
  name: c.name,
  category: "Crop Production",
  unit: "t",
  definition: `Reported production of ${c.name.toLowerCase()} in metric tonnes.`,
  values: c.values,
}));

export const ALL_INDICATORS: Indicator[] = [
  ...LAND_USE,
  ...INPUTS,
  IRRIGATION,
  SOIL_CONSERVATION,
  ...CROP_INDICATORS,
  IRISH_POTATO_AREA,
];

export const SEASON_C_NOTE =
  "Season C is a shorter agricultural season with a different production context. Seasonal percentages should be interpreted in the context of the survey's seasonal coverage and should not automatically be treated as directly comparable measures of annual farming behavior.";
