import { ArrowRight } from "lucide-react";
import type { ContentPage } from "@/content/types";

export function HubGrid({ base, items }: { base: string; items: ContentPage[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((p) => (
        <a
          key={p.slug}
          href={`${base}/${p.slug}`}
          className="group rounded-2xl border border-border bg-card/40 p-6 hover:border-primary/40 hover:bg-card transition-colors flex flex-col"
        >
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{p.eyebrow}</div>
          <h3 className="text-lg font-medium text-foreground">{p.h1}</h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{p.heroSub}</p>
          <div className="mt-5 inline-flex items-center gap-1 text-sm text-foreground">
            Learn more <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </div>
        </a>
      ))}
    </div>
  );
}