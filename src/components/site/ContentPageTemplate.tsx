import { ArrowRight, Check, Plus } from "lucide-react";
import { useState } from "react";
import type { ContentPage } from "@/content/types";
import { services } from "@/content/services";
import { platforms } from "@/content/platforms";
import { industries } from "@/content/industries";
import { solutions } from "@/content/solutions";
import { resources } from "@/content/resources";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { PageCTA } from "./PageCTA";

const CALENDLY_URL = "https://calendly.com/nabeelfarooq1515/30min";

const finders = { services, platforms, industries, solutions, resources } as const;

type RelatedKey = keyof typeof finders;

function findByKey(key: RelatedKey, slug: string) {
  return finders[key].find((p) => p.slug === slug);
}

export function ContentPageTemplate({ page, crumbs }: { page: ContentPage; crumbs: Crumb[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <>
      <section className="relative pt-32 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {page.eyebrow}
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-gradient">
              {page.heroTitle}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {page.heroSub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition-colors">
                Book a Call <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#overview" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-5 py-3 text-sm font-medium hover:bg-card transition-colors">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="py-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-10">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Overview</div>
          <div className="md:col-span-2 space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            {page.overview.map((p, i) => (<p key={i}>{p}</p>))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Benefits</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Why teams choose us for this.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {page.benefits.map((b) => (
              <div key={b.title} className="bg-background p-7">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/60 text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <h3 className="mt-5 text-lg font-medium">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Process</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">A structured path from brief to launch.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {page.process.map((p) => (
              <div key={p.step} className="relative pt-6 border-t border-border">
                <div className="absolute -top-px left-0 h-px w-12 bg-primary" />
                <div className="text-xs text-muted-foreground font-mono">{p.step}</div>
                <h3 className="mt-3 text-lg font-medium">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">What's included</div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Features & deliverables</h2>
          </div>
          <ul className="md:col-span-2 grid sm:grid-cols-2 gap-3">
            {page.features.map((f) => (
              <li key={f} className="flex items-start gap-3 rounded-xl border border-border bg-card/40 p-4">
                <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span className="text-sm text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {page.industries && page.industries.length > 0 && (
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 max-w-2xl">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Industries Served</div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Teams and sectors we ship this for.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {page.industries.map((i) => (
                <span key={i} className="rounded-full border border-border bg-card/40 px-4 py-1.5 text-sm text-foreground/80">{i}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-10 max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">FAQ</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Questions, answered.</h2>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {page.faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-5 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base md:text-lg font-medium group-hover:text-primary transition-colors">{f.q}</span>
                    <Plus className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-45 text-primary" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {page.related && (
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 max-w-2xl">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Related</div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Explore adjacent work.</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(["services", "platforms", "industries", "solutions", "resources"] as RelatedKey[]).flatMap((key) =>
                (page.related?.[key] ?? []).map((slug) => {
                  const p = findByKey(key, slug);
                  if (!p) return null;
                  const path = `/${key}/${p.slug}`;
                  return (
                    <a
                      key={path}
                      href={path}
                      className="group rounded-2xl border border-border bg-card/40 p-6 hover:border-primary/40 hover:bg-card transition-colors"
                    >
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{key}</div>
                      <div className="text-base font-medium text-foreground">{p.h1}</div>
                      <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.heroSub}</div>
                      <div className="mt-4 inline-flex items-center gap-1 text-sm text-foreground">
                        Learn more <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                      </div>
                    </a>
                  );
                }),
              )}
            </div>
          </div>
        </section>
      )}

      <PageCTA title={page.ctaTitle} sub={page.ctaSub} />
    </>
  );
}