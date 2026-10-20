import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/survey/Navbar";
import { Hero, Overview } from "@/components/survey/Hero";
import { InputsSection, LandUseSection } from "@/components/survey/LandAndInputs";
import { WaterSection } from "@/components/survey/Water";
import { CropsSection } from "@/components/survey/Crops";
import { ExplorerSection, StoriesSection } from "@/components/survey/StoriesExplorer";
import { Footer, MethodologySection } from "@/components/survey/MethodFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rwanda Seasonal Agricultural Survey 2025 — Interactive Infographic" },
      { name: "description", content: "Explore land use, farming inputs, irrigation and crop production across Rwanda's Seasons A, B and C, based on the NISR Seasonal Agricultural Survey 2025." },
      { property: "og:title", content: "Understanding Rwanda's Agricultural Seasons" },
      { property: "og:description", content: "An interactive data story built on the NISR Seasonal Agricultural Survey, Annual Report 2025." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <a href="#overview" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-card focus:p-2">Skip to content</a>
      <Navbar />
      <main>
        <Hero />
        <Overview />
        <LandUseSection />
        <InputsSection />
        <WaterSection />
        <CropsSection />
        <StoriesSection />
        <ExplorerSection />
        <MethodologySection />
      </main>
      <Footer />
    </>
  );
}
