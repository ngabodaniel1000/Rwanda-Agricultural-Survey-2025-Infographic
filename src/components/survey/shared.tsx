import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, tone = "green" }: { eyebrow: string; title: string; subtitle?: string; tone?: "green" | "blue" | "yellow" }) {
  const bar = { green: "bg-rw-green", blue: "bg-rw-blue", yellow: "bg-rw-yellow" }[tone];
  return (
    <Reveal className="mb-10 max-w-3xl">
      <div className="mb-3 flex items-center gap-3">
        <span className={cn("h-1 w-10 rounded-full", bar)} />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</span>
      </div>
      <h2 className="text-3xl font-semibold leading-tight md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </Reveal>
  );
}

export function CountUp({ end, duration = 1600 }: { end: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setVal(end); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration, reduce]);
  return <span ref={ref} aria-label={end.toLocaleString("en-US")}>{val.toLocaleString("en-US")}</span>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border bg-card p-6 shadow-card", className)}>{children}</div>;
}

export function Pill({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: ReactNode; label?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active ? "border-deep bg-deep text-deep-foreground" : "border-border bg-card text-foreground hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}

export function SourceNote({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-xs text-muted-foreground">{children}</p>;
}

export function ChartTooltip({ active, payload, label, format }: { active?: boolean; payload?: Array<{ name: string; value: number | null; color: string }>; label?: string; format: (v: number | null) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-lift">
      <p className="font-semibold text-deep">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} />
          {p.name}: <strong>{format(p.value)}</strong>
        </p>
      ))}
    </div>
  );
}

export const SEASON_COLORS = { A: "var(--rw-green)", B: "var(--rw-blue)", C: "var(--chart-3)" } as const;
