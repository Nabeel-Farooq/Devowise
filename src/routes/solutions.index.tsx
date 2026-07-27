import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { HubGrid } from "@/components/site/HubGrid";
import { PageCTA } from "@/components/site/PageCTA";
import { solutions } from "@/content/solutions";

export const Route = createFileRoute("/solutions/")({
  head: () => ({
    meta: [
      { title: "Solutions — Redesign, Conversion, Speed, Migration | Devowise" },
      { name: "description", content: "Outcome-focused solutions: website redesigns, conversion rate optimization, performance, migrations, and MVP builds." },
      { property: "og:title", content: "Devowise Solutions" },
      { property: "og:description", content: "Outcome-focused solutions for growing teams." },
      { property: "og:url", content: "/solutions" },
    ],
    links: [{ rel: "canonical", href: "/solutions" }],
  }),
  component: SolutionsHub,
});

function SolutionsHub() {
  return (
    <PageShell>
      <section className="pt-32 pb-10">
        <div className="mx-auto max-w-6xl px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Solutions" }]} />
          <h1 className="mt-8 text-4xl md:text-6xl font-semibold tracking-tight text-gradient max-w-3xl">Solutions organised around outcomes, not job titles.</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">Redesigns, CRO, performance work, migrations, and MVPs, scoped to move the number you care about.</p>
        </div>
      </section>
      <section className="pb-20"><div className="mx-auto max-w-6xl px-6"><HubGrid base="/solutions" items={solutions} /></div></section>
      <PageCTA />
    </PageShell>
  );
}