import type { ReactNode } from "react";
import { AmbientBg } from "./AmbientBg";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AmbientBg />
      <SiteNav />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}