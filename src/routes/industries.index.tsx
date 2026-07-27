import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { HubGrid } from "@/components/site/HubGrid";
import { PageCTA } from "@/components/site/PageCTA";
import { industries } from "@/content/industries";

export const Route = createFileRoute("/industries/")({
  head: () => ({
    meta: [
      { title: "Industries — SaaS, AI, Healthcare, Finance & More | Devowise" },
      { name: "description", content: "Industry-specific design and engineering for SaaS, AI startups, healthcare, finance, e-commerce, real estate, and more." },
      { property: "og:title", content: "Devowise Industries" },
      { property: "og:description", content: "Industry-specific product and web engineering." },
      { property: "og:url", content: "/industries" },
    ],
    links: [{ rel: "canonical", href: "/industries" }],
  }),
  component: IndustriesHub,
});

function IndustriesHub() {
  return (
    <PageShell>
      <section className="pt-32 pb-10">
        <div className="mx-auto max-w-6xl px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Industries" }]} />
          <h1 className="mt-8 text-4xl md:text-6xl font-semibold tracking-tight text-gradient max-w-3xl">Industry-tuned product & web engineering.</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">We build with the constraints, buyers, and regulations of your industry in mind, not a generic template.</p>
        </div>
      </section>
      <section className="pb-20"><div className="mx-auto max-w-6xl px-6"><HubGrid base="/industries" items={industries} /></div></section>
      <PageCTA />
    </PageShell>
  );
}