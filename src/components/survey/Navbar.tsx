import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const NAV = [
  { id: "overview", label: "Overview" },
  { id: "land-use", label: "Land Use" },
  { id: "inputs", label: "Farming Inputs" },
  { id: "irrigation", label: "Irrigation" },
  { id: "crops", label: "Crop Production" },
  { id: "insights", label: "Insights" },
  { id: "sources", label: "Sources" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur">
      <div className="flag-stripe h-1" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8" aria-label="Main">
        <a href="#top" className="flex items-center gap-3">
          <img
            src="/nisr-logo.png"
            alt="NISR logo"
            className="h-12 w-auto"
          />
          <span className="hidden text-sm font-semibold leading-tight text-deep sm:block">
            Seasonal Agricultural<br />Survey 2025
          </span>
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                aria-current={active === n.id ? "true" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-deep",
                  active === n.id ? "text-deep" : "text-muted-foreground",
                )}
              >
                {n.label}
                {active === n.id && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-rw-yellow" />}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex"><a href="#explorer">Explore the Data</a></Button>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>
      {open && (
        <ul className="border-t bg-card px-4 pb-4 lg:hidden">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)} className={cn("block rounded-md px-3 py-2.5 text-sm font-medium", active === n.id ? "bg-secondary text-deep" : "text-foreground")}>{n.label}</a>
            </li>
          ))}
          <li className="mt-2"><Button asChild className="w-full"><a href="#explorer" onClick={() => setOpen(false)}>Explore the Data</a></Button></li>
        </ul>
      )}
    </header>
  );
}