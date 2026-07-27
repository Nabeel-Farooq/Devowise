import { ArrowRight } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/nabeelfarooq1515/30min";

export function PageCTA({ title, sub }: { title?: string; sub?: string }) {
  return (
    <section className="py-24 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-80 pointer-events-none" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gradient">
          {title ?? "Let's build something exceptional."}
        </h2>
        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          {sub ?? "Have an idea or product? We help turn it into a scalable digital system."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition-colors">
            Book a Call <ArrowRight className="h-4 w-4" />
          </a>
          <a href="mailto:contact@devowise.com" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-5 py-3 text-sm font-medium hover:bg-card transition-colors">
            contact@devowise.com
          </a>
        </div>
      </div>
    </section>
  );
}