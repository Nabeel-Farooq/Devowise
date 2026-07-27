import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { HubGrid } from "@/components/site/HubGrid";
import { PageCTA } from "@/components/site/PageCTA";
import { platforms } from "@/content/platforms";

export const Route = createFileRoute("/platforms/")({
  head: () => ({
    meta: [
      { title: "Platforms — Framer, Webflow, Shopify, Kajabi & More | Devowise" },
      { name: "description", content: "Certified experts across the platforms teams actually use: Framer, Webflow, Shopify, Kajabi, WordPress, and Figma." },
      { property: "og:title", content: "Devowise Platforms" },
      { property: "og:description", content: "Certified across Framer, Webflow, Shopify, Kajabi, WordPress, and Figma." },
      { property: "og:url", content: "/platforms" },
    ],
    links: [{ rel: "canonical", href: "/platforms" }],
  }),
  component: PlatformsHub,
});

function PlatformsHub() {
  return (
    <PageShell>
      <section className="pt-32 pb-10">
        <div className="mx-auto max-w-6xl px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Platforms" }]} />
          <h1 className="mt-8 text-4xl md:text-6xl font-semibold tracking-tight text-gradient max-w-3xl">Certified across the platforms your team already ships on.</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">Framer, Webflow, Shopify, Kajabi, WordPress, and Figma, engineered by a certified team.</p>
        </div>
      </section>
      <section className="pb-20"><div className="mx-auto max-w-6xl px-6"><HubGrid base="/platforms" items={platforms} /></div></section>
      <PageCTA />
    </PageShell>
  );
}