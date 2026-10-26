import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { INPUTS, LAND_USE, SEASON_INFO, SEASONS, TOTAL_LAND_AREA_HA, type Season } from "@/data/survey";
import { formatMillionHa } from "@/lib/survey-utils";
import { Card, ChartTooltip, Pill, Reveal, SEASON_COLORS, SectionHeading, SourceNote } from "./shared";

export function LandUseSection() {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const data = LAND_USE.map((l) => ({ name: l.name, "Season A": l.values.A! / 1e6, "Season B": l.values.B! / 1e6 }));
  const toggle = (key: string) => setHidden((h) => ({ ...h, [key]: !h[key] }));

  return (
    <section id="land-use" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow="Land use" title="How Is Rwanda's Land Used?" subtitle={`Of a reported total land area of ${formatMillionHa(TOTAL_LAND_AREA_HA)} for Seasons A and B, about 1.4 million hectares is agricultural land.`} />
        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <Card>
              <p className="mb-1 text-sm font-semibold text-deep">Land use by season (million hectares)</p>
              <p className="mb-4 text-xs text-muted-foreground">Click a legend item to show or hide a season. Season C land-use figures are not provided.</p>
              <div className="h-80">
                <ResponsiveContainer>
                  <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--foreground)" }} interval={0} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} label={{ value: "million ha", angle: -90, position: "insideLeft", fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <Tooltip cursor={{ fill: "var(--sky-wash)" }} content={<ChartTooltip format={(v) => (v == null ? "Not available" : `${v.toFixed(3)} million ha`)} />} />
                    <Legend onClick={(e) => toggle(String(e.dataKey))} wrapperStyle={{ cursor: "pointer", fontSize: 13 }} formatter={(v) => <span style={{ opacity: hidden[v] ? 0.4 : 1 }}>{v}</span>} />
                    <Bar dataKey="Season A" fill={SEASON_COLORS.A} radius={[6, 6, 0, 0]} hide={hidden["Season A"]} animationDuration={700}>
                      <LabelList dataKey="Season A" position="top" fontSize={11} formatter={(v: number) => v.toFixed(3)} />
                    </Bar>
                    <Bar dataKey="Season B" fill={SEASON_COLORS.B} radius={[6, 6, 0, 0]} hide={hidden["Season B"]} animationDuration={700}>
                      <LabelList dataKey="Season B" position="top" fontSize={11} formatter={(v: number) => v.toFixed(3)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <SourceNote>Values shown in millions of hectares, rounded to three decimals as reported.</SourceNote>
            </Card>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
            {LAND_USE.map((l, i) => (
              <Reveal key={l.id} delay={i * 0.06} className="rounded-2xl bg-leaf-wash p-4">
                <p className="font-semibold text-deep">{l.name}</p>
                <p className="mt-1 text-sm">A: <strong>{formatMillionHa(l.values.A)}</strong> · B: <strong>{formatMillionHa(l.values.B)}</strong></p>
                <p className="mt-1 text-xs text-muted-foreground">{l.definition}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const INPUT_OBS: Record<string, string> = {
  "improved-seeds": "Reported use was highest in Season A (37.3%), about double the Season B (18.0%) and Season C (18.9%) shares.",
  "organic-fert": "The most widely reported input: above 80% of farmers in every season.",
  "inorganic-fert": "Reported use ranged from 55.5% in Season B to 65.8% in Season C.",
  pesticides: "Season C shows the highest reported share at 67.0%, compared with 41.9% (A) and 36.6% (B).",
};

export function InputsSection() {
  const [seasons, setSeasons] = useState<Season[]>(SEASONS);
  const toggle = (s: Season) => setSeasons((cur) => (cur.includes(s) ? (cur.length > 1 ? cur.filter((x) => x !== s) : cur) : [...cur, s].sort() as Season[]));

  return (
    <section id="inputs" className="bg-sky-wash py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading tone="blue" eyebrow="Farming inputs" title="What Inputs Do Farmers Use?" subtitle="Percentage of farmers reporting each input. Each indicator is separate — farmers can use several inputs, so shares do not add up to 100%." />
        <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter seasons">
          <span className="mr-2 text-sm font-medium text-deep">Seasons:</span>
          {SEASONS.map((s) => <Pill key={s} active={seasons.includes(s)} onClick={() => toggle(s)}>{SEASON_INFO[s].label}</Pill>)}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {INPUTS.map((ind, i) => {
            const data = seasons.map((s) => ({ season: SEASON_INFO[s].label, key: s, value: ind.values[s] }));
            return (
              <Reveal key={ind.id} delay={i * 0.06}>
                <Card>
                  <p className="font-display text-xl font-semibold text-deep">{ind.name}</p>
                  <div className="mt-4 h-52">
                    <ResponsiveContainer>
                      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 40 }}>
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} unit="%" />
                        <YAxis type="category" dataKey="season" width={80} tick={{ fontSize: 12, fill: "var(--foreground)" }} />
                        <Tooltip cursor={{ fill: "var(--sky-wash)" }} content={<ChartTooltip format={(v) => (v == null ? "Not available" : `${v.toFixed(1)}% of farmers`)} />} />
                        <Bar dataKey="value" name={ind.name} radius={[0, 6, 6, 0]} animationDuration={600}>
                          {data.map((d) => <Cell key={d.key} fill={SEASON_COLORS[d.key]} />)}
                          <LabelList dataKey="value" position="right" fontSize={12} fontWeight={600} formatter={(v: number) => `${v.toFixed(1)}%`} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-2 border-t pt-3 text-sm text-muted-foreground">{INPUT_OBS[ind.id]}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
