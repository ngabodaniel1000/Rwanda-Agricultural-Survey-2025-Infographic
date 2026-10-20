import { useState } from "react";
import { Droplets, Info, Mountain } from "lucide-react";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { IRRIGATION, SEASON_C_NOTE, SEASON_INFO, SEASONS, SOIL_CONSERVATION, type Indicator, type Season } from "@/data/survey";
import { Card, ChartTooltip, Reveal, SectionHeading } from "./shared";

function PctChart({ ind, color, icon }: { ind: Indicator; color: string; icon: React.ReactNode }) {
  const [sel, setSel] = useState<Season | null>(null);
  const data = SEASONS.map((s) => ({ season: SEASON_INFO[s].label, key: s, value: ind.values[s] }));
  return (
    <Card>
      <div className="flex items-center gap-3">{icon}<p className="font-display text-xl font-semibold text-deep">{ind.name}</p></div>
      <p className="mt-1 text-xs text-muted-foreground">Click a bar to highlight it.</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 24 }}>
            <XAxis dataKey="season" tick={{ fontSize: 12, fill: "var(--foreground)" }} />
            <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltip format={(v) => (v == null ? "Not available" : `${v.toFixed(1)}% of farmers`)} />} />
            <Bar dataKey="value" name="% of farmers" radius={[8, 8, 0, 0]} onClick={(d: { key: Season }) => setSel(sel === d.key ? null : d.key)} className="cursor-pointer">
              {data.map((d) => <Cell key={d.key} fill={sel === d.key ? "var(--rw-yellow)" : color} />)}
              <LabelList dataKey="value" position="top" fontSize={13} fontWeight={700} fill="var(--deep)" formatter={(v: number) => `${v.toFixed(1)}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function WaterSection() {
  return (
    <section id="irrigation" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading tone="blue" eyebrow="Irrigation & soil" title="Water Management and Soil Protection" />
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal><PctChart ind={IRRIGATION} color="var(--rw-blue)" icon={<Droplets className="h-6 w-6 text-rw-blue" />} /></Reveal>
          <Reveal delay={0.1}><PctChart ind={SOIL_CONSERVATION} color="var(--rw-green)" icon={<Mountain className="h-6 w-6 text-rw-green" />} /></Reveal>
        </div>
        <Reveal className="mt-6 flex gap-3 rounded-2xl border border-rw-yellow bg-sun-wash p-5">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-deep" />
          <p className="text-sm text-deep">{SEASON_C_NOTE}</p>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-sky-wash p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Measured in the survey</p>
            <p className="mt-2 text-sm">Irrigating farmers: 13.4% (A), 11.5% (B), 58.9% (C). Farmers controlling soil erosion: 90.3% (A), 89.9% (B), 94.7% (C).</p>
          </div>
          <div className="rounded-2xl bg-leaf-wash p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">General context (not a survey result)</p>
            <p className="mt-2 text-sm">Irrigation can reduce dependence on rainfall, and erosion control — such as terraces and ditches — helps keep fertile topsoil on Rwanda's steep slopes.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
