import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { HubGrid } from "@/components/site/HubGrid";
import { PageCTA } from "@/components/site/PageCTA";
import { resources } from "@/content/resources";

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      { title: "Resources, Guides & Checklists | Devowise" },
      { name: "description", content: "Playbooks, guides, and checklists from the Devowise studio: Framer vs Webflow, launch checklists, SEO, CRO, and more." },
      { property: "og:title", content: "Devowise Resources" },
      { property: "og:description", content: "Guides and checklists from a shipping product studio." },
      { property: "og:url", content: "/resources" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: ResourcesHub,
});

function ResourcesHub() {
  return (
    <PageShell>
      <section className="pt-32 pb-10">
        <div className="mx-auto max-w-6xl px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources" }]} />
          <h1 className="mt-8 text-4xl md:text-6xl font-semibold tracking-tight text-gradient max-w-3xl">Playbooks, checklists, and honest comparisons.</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">Field notes from a studio that ships every week, written for teams making real decisions.</p>
        </div>
      </section>
      <section className="pb-20"><div className="mx-auto max-w-6xl px-6"><HubGrid base="/resources" items={resources} /></div></section>
      <PageCTA />
    </PageShell>
  );
}