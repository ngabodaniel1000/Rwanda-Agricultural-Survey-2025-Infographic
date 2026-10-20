import { motion } from "framer-motion";
import { ArrowRight, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-farmers.jpg";
import { OVERVIEW_STATS, SEASON_INFO, SEASONS } from "@/data/survey";
import { CountUp, Reveal, SectionHeading } from "./shared";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <img src={hero} alt="Farmers cultivating terraced hillside fields in Rwanda" width={1600} height={1008} className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="hero-scrim absolute inset-0 -z-10" />
      <div className="sun-drift pointer-events-none absolute -right-20 -top-24 -z-10 h-96 w-96 rounded-full bg-rw-yellow/40 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-rw-yellow px-3 py-1 text-xs font-semibold uppercase tracking-widest text-deep">
            <Sprout className="h-3.5 w-3.5" /> Agricultural year 2024/2025
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] text-deep-foreground md:text-7xl">
            Understanding Rwanda's Agricultural Seasons
          </h1>
          <p className="mt-6 text-lg text-deep-foreground/85 md:text-xl">
            Explore the data behind agricultural land use, farming practices, and crop production in Rwanda during the 2024/2025 agricultural year.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="sun"><a href="#land-use">Explore Agricultural Data <ArrowRight /></a></Button>
            <Button asChild size="lg" variant="glass"><a href="#crops">View Crop Production</a></Button>
          </div>
          <p className="mt-10 text-xs text-deep-foreground/70">Source: NISR — Seasonal Agricultural Survey, Annual Report 2025</p>
        </motion.div>
      </div>
    </section>
  );
}

export function Overview() {
  return (
    <section id="overview" className="terrace-pattern bg-leaf-wash py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow="Survey overview" title="Three seasons, one agricultural year" subtitle="The survey measures land, practices and production across Rwanda's three farming seasons. Sampled segments are areas of land, not individual farmers." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {OVERVIEW_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="rounded-2xl border bg-card p-5 shadow-card">
              <p className="font-display text-4xl font-semibold text-rw-green md:text-5xl"><CountUp end={s.value} /></p>
              <p className="mt-2 text-sm font-medium text-deep">{s.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {SEASONS.map((s, i) => (
            <Reveal key={s} delay={i * 0.1} className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
              <span className={["bg-rw-green text-primary-foreground", "bg-rw-blue text-deep-foreground", "bg-rw-yellow text-deep"][i] + " flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-xl font-bold"}>{s}</span>
              <div>
                <p className="font-semibold text-deep">{SEASON_INFO[s].label}</p>
                <p className="text-sm text-muted-foreground">{SEASON_INFO[s].period}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
