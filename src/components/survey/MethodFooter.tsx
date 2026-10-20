import { ArrowUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SEASON_INFO, SEASONS, SOURCE_CITATION } from "@/data/survey";
import { Reveal, SectionHeading } from "./shared";

const ITEMS = [
  { q: "Publication", a: <>Publisher: National Institute of Statistics of Rwanda (NISR). Report: Seasonal Agricultural Survey, Annual Report 2025. Reference period: agricultural year 2024/2025.</> },
  { q: "Seasons covered", a: <ul className="space-y-1">{SEASONS.map((s) => <li key={s}><strong>{SEASON_INFO[s].label}:</strong> {SEASON_INFO[s].period}</li>)}</ul> },
  { q: "About this presentation", a: <>This website is an interactive presentation of selected indicators from the report. It does not reproduce the full report or its methodology.</> },
  { q: "Reported values vs. calculated comparisons", a: <>All figures are as reported in the source. Percentage changes (e.g. cassava +57.0% from Season A to B) are calculated by this website from the reported values and are labelled "calculated". They describe seasonal production, not yield per hectare.</> },
  { q: "Missing values", a: <>Where a figure is not provided in the supplied data (for example Season C land use, or Season C production for banana, cassava, maize and paddy rice), it is shown as "Not available" and exported as NA. Missing values are never treated as zero.</> },
  { q: "Units and definitions", a: <ul className="space-y-1"><li><strong>Hectares (ha):</strong> land area; 1 ha = 10,000 m².</li><li><strong>Metric tonnes (t):</strong> production weight; 1 t = 1,000 kg.</li><li><strong>% of farmers:</strong> share of farmers reporting a practice or input. Indicators are not mutually exclusive.</li><li><strong>Sampled segments:</strong> areas of land selected for the survey, not individual farmers.</li></ul> },
  { q: "Verification before publication", a: <>All values on this website should be checked against the original NISR report before publication or competition submission.</> },
];

export function MethodologySection() {
  return (
    <section id="sources" className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <SectionHeading eyebrow="Methodology & sources" title="Where these numbers come from" tone="blue" />
        <Reveal>
          <Accordion type="multiple" defaultValue={["Publication"]} className="rounded-2xl border bg-card px-6 shadow-card">
            {ITEMS.map((it) => (
              <AccordionItem key={it.q} value={it.q}>
                <AccordionTrigger className="text-left font-display text-lg text-deep">{it.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed">{it.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-deep text-deep-foreground">
      <div className="flag-stripe h-1.5" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          {/* Official NISR logo slot — use only with authorisation. */}
          <span className="rounded-md bg-rw-yellow px-2 py-1 font-display text-sm font-bold text-deep">NISR</span>
          <p className="mt-4 font-display text-2xl">Seasonal Agricultural Survey 2025</p>
          <p className="mt-2 text-sm text-deep-foreground/70">An interactive data-storytelling presentation based on the NISR report. Not an official NISR product and not endorsed by NISR.</p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-widest text-rw-yellow">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[["overview", "Overview"], ["crops", "Crop Production"], ["explorer", "Data Explorer"], ["sources", "Methodology"]].map(([id, l]) => (
              <li key={id}><a href={`#${id}`} className="hover:text-rw-yellow">{l}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rw-yellow">Citation</p>
          <p className="mt-3 text-sm text-deep-foreground/80">{SOURCE_CITATION}</p>
          <Button variant="sun" className="mt-6" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ArrowUp /> Back to top</Button>
        </div>
      </div>
    </footer>
  );
}
