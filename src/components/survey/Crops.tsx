import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, BarChart3, RotateCcw, Search, Table2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CROPS, IRISH_POTATO_AREA, SEASON_INFO, SEASONS, type Season } from "@/data/survey";
import { formatNumber, pctChange } from "@/lib/survey-utils";
import { cn } from "@/lib/utils";
import { Card, ChartTooltip, Pill, Reveal, SEASON_COLORS, SectionHeading, SourceNote } from "./shared";

type UnitMode = "t" | "kt";
const DEFAULT_SEASONS: Season[] = ["A", "B"];

export function CropsSection() {
  const [seasons, setSeasons] = useState<Season[]>(DEFAULT_SEASONS);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"chart" | "table">("chart");
  const [unit, setUnit] = useState<UnitMode>("t");
  const [selected, setSelected] = useState<string>("cassava");
  const [sort, setSort] = useState<{ key: "name" | Season; dir: 1 | -1 }>({ key: "A", dir: -1 });

  const div = unit === "kt" ? 1000 : 1;
  const fmt = (v: number | null) => (v == null ? "Not available" : unit === "kt" ? `${formatNumber(v, 1)} thousand t` : `${formatNumber(v)} t`);

  const filtered = useMemo(() => CROPS.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort.key === "name") return a.name.localeCompare(b.name) * sort.dir;
      const av = a.values[sort.key], bv = b.values[sort.key];
      if (av == null) return 1;
      if (bv == null) return -1;
      return (av - bv) * sort.dir;
    });
  }, [filtered, sort]);

  const chartData = sorted.map((c) => {
    const row: Record<string, string | number | null> = { name: c.name };
    seasons.forEach((s) => (row[SEASON_INFO[s].label] = c.values[s] == null ? null : c.values[s]! / div));
    return row;
  });

  const toggleSeason = (s: Season) =>
    setSeasons((cur) => (cur.includes(s) ? (cur.length > 1 ? cur.filter((x) => x !== s) : cur) : ([...cur, s].sort() as Season[])));
  const reset = () => { setSeasons(DEFAULT_SEASONS); setQuery(""); setUnit("t"); setView("chart"); setSort({ key: "A", dir: -1 }); };
  const crop = CROPS.find((c) => c.id === selected)!;
  const missingC = seasons.includes("C") ? filtered.filter((c) => c.values.C == null) : [];

  const sortBtn = (key: "name" | Season, label: string) => (
    <button type="button" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (-s.dir as 1 | -1) : -1 }))} className="inline-flex items-center gap-1 font-semibold">
      {label} <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">{sort.key === key ? (sort.dir === 1 ? "sorted ascending" : "sorted descending") : "sort"}</span>
    </button>
  );

  return (
    <section id="crops" className="relative overflow-hidden bg-deep py-20 text-deep-foreground md:py-28">
      <div className="terrace-pattern absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="mb-10 max-w-3xl">
          <div className="mb-3 flex items-center gap-3"><span className="h-1 w-10 rounded-full bg-rw-yellow" /><span className="text-xs font-semibold uppercase tracking-[0.2em] text-deep-foreground/70">Crop production</span></div>
          <h2 className="text-3xl font-semibold leading-tight text-deep-foreground md:text-5xl">Rwanda's Harvest: Which Crops Lead Each Season?</h2>
          <p className="mt-4 text-lg text-deep-foreground/80">Compare reported crop production across the agricultural seasons of 2024/2025.</p>
        </Reveal>

        {/* Crop cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CROPS.map((c) => (
            <button key={c.id} type="button" onClick={() => setSelected(c.id)} aria-pressed={selected === c.id}
              className={cn("rounded-2xl border p-4 text-left transition-all", selected === c.id ? "border-rw-yellow bg-rw-yellow text-deep shadow-lift" : "border-deep-foreground/20 bg-deep-foreground/5 hover:bg-deep-foreground/10")}>
              <span className="text-3xl" aria-hidden>{c.emoji}</span>
              <p className="mt-2 text-sm font-semibold">{c.name}</p>
              <p className="text-xs opacity-75">A: {formatNumber(c.values.A)} t</p>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Detail */}
          <AnimatePresence mode="wait">
            <motion.div key={crop.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
              className="rounded-2xl bg-card p-6 text-card-foreground shadow-lift">
              <p className="text-4xl" aria-hidden>{crop.emoji}</p>
              <h3 className="mt-2 text-2xl font-semibold">{crop.name}</h3>
              <p className="text-xs text-muted-foreground">Reported production, metric tonnes</p>
              <dl className="mt-4 space-y-3">
                {SEASONS.map((s) => (
                  <div key={s} className="flex items-baseline justify-between border-b pb-2">
                    <dt className="text-sm">{SEASON_INFO[s].label}</dt>
                    <dd className={cn("font-display text-xl font-semibold", crop.values[s] == null ? "text-sm font-normal italic text-muted-foreground" : "text-deep")}>
                      {crop.values[s] == null ? "Not available" : `${formatNumber(crop.values[s])} t`}
                    </dd>
                  </div>
                ))}
              </dl>
              {pctChange(crop.values.A, crop.values.B) != null && (
                <p className="mt-4 rounded-lg bg-sun-wash p-3 text-sm text-deep">
                  <strong>Calculated:</strong> {pctChange(crop.values.A, crop.values.B)! > 0 ? "+" : ""}{pctChange(crop.values.A, crop.values.B)!.toFixed(1)}% from Season A to Season B.
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Explorer */}
          <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-lift lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-48 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search crops…" className="pl-9" aria-label="Search crops" />
              </div>
              <div className="flex gap-1" role="group" aria-label="Seasons">{SEASONS.map((s) => <Pill key={s} active={seasons.includes(s)} onClick={() => toggleSeason(s)}>{s}</Pill>)}</div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border p-0.5" role="group" aria-label="View">
                <Button size="sm" variant={view === "chart" ? "deep" : "ghost"} onClick={() => setView("chart")} aria-pressed={view === "chart"}><BarChart3 /> Chart</Button>
                <Button size="sm" variant={view === "table" ? "deep" : "ghost"} onClick={() => setView("table")} aria-pressed={view === "table"}><Table2 /> Table</Button>
              </div>
              <div className="flex rounded-lg border p-0.5" role="group" aria-label="Unit">
                <Button size="sm" variant={unit === "t" ? "deep" : "ghost"} onClick={() => setUnit("t")} aria-pressed={unit === "t"}>Tonnes</Button>
                <Button size="sm" variant={unit === "kt" ? "deep" : "ghost"} onClick={() => setUnit("kt")} aria-pressed={unit === "kt"}>Thousand t</Button>
              </div>
              <Button size="sm" variant="outline" onClick={reset} className="ml-auto"><RotateCcw /> Reset filters</Button>
            </div>

            {filtered.length === 0 ? (
              <p className="mt-10 rounded-xl bg-muted p-8 text-center text-muted-foreground">No crops match "{query}". Try another name or reset the filters.</p>
            ) : view === "chart" ? (
              <div className="mt-4 h-96">
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--foreground)" }} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => (unit === "kt" ? `${v}` : `${(v / 1000).toFixed(0)}k`)} label={{ value: unit === "kt" ? "thousand t" : "tonnes", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <Tooltip cursor={{ fill: "var(--sky-wash)" }} content={<ChartTooltip format={fmt} />} />
                    <Legend wrapperStyle={{ fontSize: 13 }} />
                    {seasons.map((s) => <Bar key={s} dataKey={SEASON_INFO[s].label} fill={SEASON_COLORS[s]} radius={[5, 5, 0, 0]} animationDuration={700} />)}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-deep"><th className="py-2">{sortBtn("name", "Crop")}</th>{seasons.map((s) => <th key={s} className="py-2 text-right">{sortBtn(s, SEASON_INFO[s].label)}</th>)}</tr></thead>
                  <tbody>
                    {sorted.map((c) => (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-muted">
                        <td className="py-2.5 font-medium">{c.emoji} {c.name}</td>
                        {seasons.map((s) => <td key={s} className={cn("py-2.5 text-right tabular-nums", c.values[s] == null && "italic text-muted-foreground")}>{fmt(c.values[s])}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {missingC.length > 0 && (
              <p className="mt-3 rounded-lg bg-sun-wash p-3 text-xs text-deep">Season C values are not provided for: {missingC.map((c) => c.name).join(", ")}. These are shown as unavailable, not zero.</p>
            )}
          </div>
        </div>

        <Reveal className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-deep-foreground/20 bg-deep-foreground/5 p-6 lg:col-span-2">
            <p className="font-display text-xl text-deep-foreground">Different crops show different seasonal production patterns. Explore the figures to see how bananas, cassava, Irish potatoes, and other crops vary between reported seasons.</p>
            <ul className="mt-4 grid gap-3 text-sm text-deep-foreground/85 sm:grid-cols-3">
              <li><strong className="text-rw-yellow">Cassava +57.0%</strong><br />542,874 t (A) → 852,541 t (B)</li>
              <li><strong className="text-rw-yellow">Irish potato −34.0%</strong><br />475,785 t (A) → 314,093 t (B); 94,892 t (C)</li>
              <li><strong className="text-rw-yellow">Banana −8.8%</strong><br />1,278,234 t (A) → 1,166,247 t (B)</li>
            </ul>
            <p className="mt-4 text-xs text-deep-foreground/60">Percentages are calculated comparisons from reported values, not quoted NISR statistics. They describe seasonal production, not annual productivity or yield per hectare.</p>
          </div>
          <IrishPotatoArea />
        </Reveal>
      </div>
    </section>
  );
}

function IrishPotatoArea() {
  const data = SEASONS.map((s) => ({ season: SEASON_INFO[s].label, ha: IRISH_POTATO_AREA.values[s] }));
  return (
    <Card className="text-card-foreground">
      <p className="font-display text-lg font-semibold text-deep">🥔 Irish potato cultivated area</p>
      <p className="text-xs text-muted-foreground">Hectares — area, not production</p>
      <div className="mt-3 h-44">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="season" tick={{ fontSize: 11, fill: "var(--foreground)" }} />
            <YAxis hide />
            <Tooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltip format={(v) => (v == null ? "Not available" : `${formatNumber(v)} ha`)} />} />
            <Bar dataKey="ha" name="Cultivated area" fill="var(--rw-green)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <SourceNote>A: 54,485 ha · B: 45,940 ha · C: 10,389 ha</SourceNote>
    </Card>
  );
}
