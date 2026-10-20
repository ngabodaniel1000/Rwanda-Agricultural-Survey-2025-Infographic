import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpDown, BarChart3, Download, RotateCcw, Search, Table2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALL_INDICATORS, CATEGORIES, SEASON_C_NOTE, SEASON_INFO, SEASONS, type Category, type Season } from "@/data/survey";
import { UNIT_LABEL, downloadCsv, formatValue, toCsv } from "@/lib/survey-utils";
import { cn } from "@/lib/utils";
import { Card, ChartTooltip, Pill, Reveal, SEASON_COLORS, SectionHeading } from "./shared";

const STORIES = [
  { title: "Cassava changes between Seasons A and B", values: ["Season A: 542,874 t", "Season B: 852,541 t"], note: "Calculated change: +57.0%", href: "#crops", color: "bg-rw-green" },
  { title: "Banana remains a major reported crop", values: ["Season A: 1,278,234 t", "Season B: 1,166,247 t"], note: "Calculated change: −8.8%", href: "#crops", color: "bg-rw-yellow" },
  { title: "Irish potato production varies by season", values: ["Production — A: 475,785 t · B: 314,093 t · C: 94,892 t", "Area — A: 54,485 ha · B: 45,940 ha · C: 10,389 ha"], note: "Production and area are separate measures.", href: "#crops", color: "bg-deep" },
  { title: "Irrigation differs across seasons", values: ["Season A: 13.4% · Season B: 11.5%", "Season C: 58.9% of farmers"], note: "Season C is shorter and has a different production context.", href: "#irrigation", color: "bg-rw-blue" },
];

export function StoriesSection() {
  return (
    <section id="insights" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow="Key findings" title="Stories in the numbers" subtitle="Each finding is drawn directly from the reported figures. No causes are implied." tone="yellow" />
        <div className="grid gap-5 md:grid-cols-2">
          {STORIES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <Card className="flex h-full flex-col transition-transform hover:-translate-y-1">
                <span className={cn("mb-4 h-1.5 w-12 rounded-full", s.color)} />
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <ul className="mt-3 space-y-1 text-sm">{s.values.map((v) => <li key={v}>{v}</li>)}</ul>
                <p className="mt-3 text-xs text-muted-foreground">{s.note}</p>
                <a href={s.href} className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-rw-green hover:underline">Explore the chart <ArrowRight className="h-4 w-4" /></a>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExplorerSection() {
  const [cat, setCat] = useState<Category>("Crop Production");
  const [seasons, setSeasons] = useState<Season[]>(SEASONS);
  const [q, setQ] = useState("");
  const [view, setView] = useState<"table" | "chart">("table");
  const [sort, setSort] = useState<{ key: "name" | Season; dir: 1 | -1 }>({ key: "name", dir: 1 });

  const rows = useMemo(() => {
    const r = ALL_INDICATORS.filter((i) => i.category === cat && i.name.toLowerCase().includes(q.trim().toLowerCase()));
    return r.sort((a, b) => {
      if (sort.key === "name") return a.name.localeCompare(b.name) * sort.dir;
      const av = a.values[sort.key], bv = b.values[sort.key];
      if (av == null) return 1; if (bv == null) return -1;
      return (av - bv) * sort.dir;
    });
  }, [cat, q, sort]);

  const unit = rows[0]?.unit;
  const toggle = (s: Season) => setSeasons((c) => (c.includes(s) ? (c.length > 1 ? c.filter((x) => x !== s) : c) : ([...c, s].sort() as Season[])));
  const reset = () => { setCat("Crop Production"); setSeasons(SEASONS); setQ(""); setView("table"); setSort({ key: "name", dir: 1 }); };
  const sortBtn = (key: "name" | Season, label: string) => (
    <button type="button" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (-s.dir as 1 | -1) : 1 }))} className="inline-flex items-center gap-1 font-semibold">{label}<ArrowUpDown className="h-3.5 w-3.5" aria-hidden /></button>
  );

  return (
    <section id="explorer" className="bg-leaf-wash py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow="Data explorer" title="Explore every indicator" subtitle="Filter, sort and download the figures used throughout this page. Missing values are exported as NA." />
        <Card>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Category">{CATEGORIES.map((c) => <Pill key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Pill>)}</div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-48 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search indicators or crops…" className="pl-9" aria-label="Search indicators" />
            </div>
            <div className="flex gap-1" role="group" aria-label="Seasons">{SEASONS.map((s) => <Pill key={s} active={seasons.includes(s)} onClick={() => toggle(s)}>{s}</Pill>)}</div>
            <div className="flex rounded-lg border p-0.5">
              <Button size="sm" variant={view === "table" ? "deep" : "ghost"} onClick={() => setView("table")} aria-pressed={view === "table"}><Table2 /> Table</Button>
              <Button size="sm" variant={view === "chart" ? "deep" : "ghost"} onClick={() => setView("chart")} aria-pressed={view === "chart"}><BarChart3 /> Chart</Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => downloadCsv(`nisr-sas-2025-${cat.toLowerCase().replace(/\s+/g, "-")}.csv`, toCsv(rows, seasons))} disabled={!rows.length}><Download /> Export current view</Button>
            <Button size="sm" variant="outline" onClick={() => downloadCsv("nisr-sas-2025-full-dataset.csv", toCsv(ALL_INDICATORS))}><Download /> Export full dataset</Button>
            <Button size="sm" variant="ghost" onClick={reset}><RotateCcw /> Reset</Button>
          </div>

          {rows.length === 0 ? (
            <p className="mt-8 rounded-xl bg-muted p-8 text-center text-muted-foreground">No indicators match your search.</p>
          ) : view === "table" ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-deep"><th className="py-2">{sortBtn("name", "Indicator")}</th>{seasons.map((s) => <th key={s} className="py-2 text-right">{sortBtn(s, SEASON_INFO[s].label)}</th>)}<th className="py-2 pl-4">Unit</th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 align-top hover:bg-muted">
                      <td className="py-2.5"><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.definition}</p></td>
                      {seasons.map((s) => <td key={s} className={cn("py-2.5 text-right tabular-nums", r.values[s] == null && "italic text-muted-foreground")}>{formatValue(r.values[s], r.unit)}</td>)}
                      <td className="py-2.5 pl-4 text-xs text-muted-foreground">{UNIT_LABEL[r.unit]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 h-96">
              <ResponsiveContainer>
                <BarChart data={rows.map((r) => ({ name: r.name, ...Object.fromEntries(seasons.map((s) => [SEASON_INFO[s].label, r.values[s]])) }))}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--foreground)" }} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => (v >= 10000 ? `${(v / 1000).toFixed(0)}k` : String(v))} />
                  <Tooltip cursor={{ fill: "var(--sky-wash)" }} content={<ChartTooltip format={(v) => formatValue(v, unit!)} />} />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  {seasons.map((s) => <Bar key={s} dataKey={SEASON_INFO[s].label} fill={SEASON_COLORS[s]} radius={[5, 5, 0, 0]} />)}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {(cat === "Irrigation" || cat === "Inputs" || cat === "Soil Conservation") && seasons.includes("C") && <p className="mt-4 text-xs text-muted-foreground">{SEASON_C_NOTE}</p>}
        </Card>
      </div>
    </section>
  );
}
