import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import devowiseLogo from "@/assets/devowise-logo.png";
import { services } from "@/content/services";
import { platforms } from "@/content/platforms";
import { industries } from "@/content/industries";
import { solutions } from "@/content/solutions";
import { resources } from "@/content/resources";
import { blogCategories } from "@/content/categories";

const CALENDLY_URL = "https://calendly.com/nabeelfarooq1515/30min";

type MenuCol = { title: string; items: { label: string; href: string }[] };

const menus: { label: string; hub: string; cols: MenuCol[] }[] = [
  {
    label: "Services",
    hub: "/services",
    cols: [
      { title: "Brand", items: services.slice(0, 4).map((s) => ({ label: s.h1, href: `/services/${s.slug}` })) },
      { title: "Web", items: services.slice(4, 10).map((s) => ({ label: s.h1, href: `/services/${s.slug}` })) },
      { title: "Growth & Ops", items: services.slice(10).map((s) => ({ label: s.h1, href: `/services/${s.slug}` })) },
    ],
  },
  {
    label: "Platforms",
    hub: "/platforms",
    cols: [{ title: "Platforms", items: platforms.map((p) => ({ label: p.h1, href: `/platforms/${p.slug}` })) }],
  },
  {
    label: "Industries",
    hub: "/industries",
    cols: [
      { title: "Tech & AI", items: industries.slice(0, 4).map((i) => ({ label: i.eyebrow, href: `/industries/${i.slug}` })) },
      { title: "Commerce & Services", items: industries.slice(4, 9).map((i) => ({ label: i.eyebrow, href: `/industries/${i.slug}` })) },
      { title: "Local & Creative", items: industries.slice(9).map((i) => ({ label: i.eyebrow, href: `/industries/${i.slug}` })) },
    ],
  },
  {
    label: "Solutions",
    hub: "/solutions",
    cols: [{ title: "Solutions", items: solutions.map((s) => ({ label: s.h1, href: `/solutions/${s.slug}` })) }],
  },
  {
    label: "Resources",
    hub: "/resources",
    cols: [
      { title: "Guides & Checklists", items: resources.map((r) => ({ label: r.h1, href: `/resources/${r.slug}` })) },
      { title: "Blog", items: [{ label: "All articles", href: "/blog" }, ...blogCategories.slice(0, 6).map((c) => ({ label: c.name, href: `/blog/category/${c.slug}` }))] },
    ],
  },
];

export function SiteNav() {
  const [openMobile, setOpenMobile] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [mobileOpenIdx, setMobileOpenIdx] = useState<number | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex h-10 items-center gap-2 font-semibold tracking-tight shrink-0">
          <img src={devowiseLogo} alt="Devowise" className="h-5 max-h-5 w-auto max-w-[112px] object-contain logo-animated" />
        </Link>
        <nav
          className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground"
          onMouseLeave={() => setHoverIdx(null)}
        >
          {menus.map((m, idx) => (
            <div key={m.label} className="relative" onMouseEnter={() => setHoverIdx(idx)}>
              <a
                href={m.hub}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 hover:text-foreground transition-colors"
              >
                {m.label}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </a>
              {hoverIdx === idx && (
                <div className="absolute left-1/2 top-full pt-3 -translate-x-1/2 z-50">
                  <div className="rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl p-6 min-w-[560px] flex gap-8">
                    {m.cols.map((col) => (
                      <div key={col.title} className="min-w-[180px]">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{col.title}</div>
                        <ul className="flex flex-col gap-1.5">
                          {col.items.map((it) => (
                            <li key={it.href}>
                              <a
                                href={it.href}
                                className="text-sm text-foreground/80 hover:text-foreground block truncate"
                              >
                                {it.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <a href="/case-studies" className="rounded-full px-3 py-1.5 hover:text-foreground transition-colors">Case Studies</a>
          <a href="/blog" className="rounded-full px-3 py-1.5 hover:text-foreground transition-colors">Blog</a>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Book a Call <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden inline-flex items-center gap-1 rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Book <ArrowRight className="h-3 w-3" />
          </a>
          <button
            type="button"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label={openMobile ? "Close menu" : "Open menu"}
            aria-expanded={openMobile}
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-border text-foreground/80 hover:text-foreground"
          >
            {openMobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {openMobile && (
        <nav className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1 text-sm">
            {menus.map((m, idx) => {
              const isOpen = mobileOpenIdx === idx;
              return (
                <div key={m.label} className="border-b border-border/40 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setMobileOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between py-3 text-foreground"
                    aria-expanded={isOpen}
                  >
                    <span>{m.label}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="pb-3 pl-2 flex flex-col gap-1.5">
                      <a href={m.hub} onClick={() => setOpenMobile(false)} className="py-1 text-muted-foreground hover:text-foreground">All {m.label}</a>
                      {m.cols.flatMap((c) => c.items).map((it) => (
                        <a
                          key={it.href}
                          href={it.href}
                          onClick={() => setOpenMobile(false)}
                          className="py-1 text-muted-foreground hover:text-foreground"
                        >
                          {it.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <a href="/case-studies" onClick={() => setOpenMobile(false)} className="py-3 text-foreground">Case Studies</a>
            <a href="/blog" onClick={() => setOpenMobile(false)} className="py-3 text-foreground">Blog</a>
          </div>
        </nav>
      )}
    </header>
  );
}