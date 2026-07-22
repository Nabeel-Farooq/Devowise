import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/stats-dw-9f2a7c")({
  head: () => ({
    meta: [
      { title: "Stats" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StatsPage,
});

type Pdf = {
  id: string;
  name: string;
  views: number;
  link_opens: number;
  last_viewed_at: string | null;
  created_at: string;
};

type Ev = {
  pdf_id: string;
  event_type: string;
  country: string | null;
  created_at: string;
};

function StatsPage() {
  const [pdfs, setPdfs] = useState<Pdf[] | null>(null);
  const [events, setEvents] = useState<Ev[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: p, error: e1 }, { data: ev, error: e2 }] = await Promise.all([
        supabase
          .from("pdf_files")
          .select("id,name,views,link_opens,last_viewed_at,created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("pdf_events")
          .select("pdf_id,event_type,country,created_at")
          .order("created_at", { ascending: false })
          .limit(5000),
      ]);
      if (e1 || e2) {
        setErr(e1?.message || e2?.message || "Failed to load");
        return;
      }
      const evs = (ev as Ev[]) || [];
      // Derive live counters from pdf_events so numbers match reality even
      // when the pdf_files counters are stale on production.
      const agg = new Map<string, { opens: number; views: number; last: string | null }>();
      for (const e of evs) {
        const cur = agg.get(e.pdf_id) ?? { opens: 0, views: 0, last: null };
        if (e.event_type === "open") cur.opens++;
        else if (e.event_type === "view") {
          cur.views++;
          if (!cur.last || e.created_at > cur.last) cur.last = e.created_at;
        }
        agg.set(e.pdf_id, cur);
      }
      const merged = ((p as Pdf[]) || []).map((row) => {
        const a = agg.get(row.id);
        if (!a) return row;
        return {
          ...row,
          link_opens: a.opens,
          views: a.views,
          last_viewed_at: a.last ?? row.last_viewed_at,
        };
      });
      setPdfs(merged);
      setEvents(evs);
    })();
  }, []);

  const totals = useMemo(() => {
    if (!pdfs) return { opens: 0, views: 0, files: 0 };
    return pdfs.reduce(
      (a, p) => ({
        opens: a.opens + (p.link_opens || 0),
        views: a.views + (p.views || 0),
        files: a.files + 1,
      }),
      { opens: 0, views: 0, files: 0 },
    );
  }, [pdfs]);

  const topViewed = useMemo(
    () => (pdfs ? [...pdfs].sort((a, b) => b.views - a.views).slice(0, 5) : []),
    [pdfs],
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">PDF Analytics</h1>
            <p className="text-sm text-neutral-500">Read-only view</p>
          </div>
        </header>

        {err && (
          <div className="mb-6 rounded border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
            {err}
          </div>
        )}

        <div className="mb-8 grid grid-cols-3 gap-3">
          <Stat label="Files" value={totals.files} />
          <Stat label="Link opens" value={totals.opens} />
          <Stat label="Views" value={totals.views} />
        </div>

        {topViewed.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
              Most viewed
            </h2>
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/40">
              {topViewed.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b border-neutral-800 px-4 py-2 last:border-0"
                >
                  <span className="truncate text-sm text-neutral-300">
                    {i + 1}. {p.name}
                  </span>
                  <span className="text-sm tabular-nums text-neutral-400">
                    {p.views} views
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
            All files
          </h2>
          {pdfs === null ? (
            <div className="text-sm text-neutral-500">Loading...</div>
          ) : pdfs.length === 0 ? (
            <div className="text-sm text-neutral-500">No files yet.</div>
          ) : (
            <div className="space-y-2">
              {pdfs.map((p) => (
                <PdfCard
                  key={p.id}
                  pdf={p}
                  events={events.filter((e) => e.pdf_id === p.id)}
                  open={expanded === p.id}
                  onToggle={() => setExpanded(expanded === p.id ? null : p.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
      <div className="text-xs uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value.toLocaleString()}</div>
    </div>
  );
}

function PdfCard({
  pdf,
  events,
  open,
  onToggle,
}: {
  pdf: Pdf;
  events: Ev[];
  open: boolean;
  onToggle: () => void;
}) {
  const shareUrl = `https://www.devowise.com/p/${pdf.id}`;
  const [copied, setCopied] = useState(false);
  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };
  const daily = useMemo(() => bucketBy(events, 14, "day"), [events]);
  const weekly = useMemo(() => bucketBy(events, 12, "week"), [events]);
  const countries = useMemo(() => {
    const m = new Map<string, number>();
    events
      .filter((e) => e.event_type === "view" || e.event_type === "open")
      .forEach((e) => {
        const c = e.country || "Unknown";
        m.set(c, (m.get(c) || 0) + 1);
      });
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [events]);
  const totalCountry = countries.reduce((a, [, v]) => a + v, 0);

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-neutral-900"
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-neutral-100">{pdf.name}</div>
          <div className="mt-1 text-xs text-neutral-500">
            {pdf.link_opens} opens · {pdf.views} views ·{" "}
            {pdf.last_viewed_at
              ? `last ${new Date(pdf.last_viewed_at).toLocaleString()}`
              : "never viewed"}
          </div>
        </div>
        <span className="ml-4 text-neutral-500">{open ? "−" : "+"}</span>
      </button>

      <div className="flex items-center gap-2 border-t border-neutral-800 px-4 py-2">
        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="min-w-0 flex-1 truncate text-xs text-neutral-400 hover:text-neutral-200"
        >
          {shareUrl}
        </a>
        <button
          onClick={copy}
          className="shrink-0 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-[10px] uppercase tracking-wider text-neutral-300 hover:bg-neutral-800"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-800 p-4 space-y-6">
          <Chart title="Last 14 days" points={daily} />
          <Chart title="Last 12 weeks" points={weekly} />
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">
              Countries
            </div>
            {countries.length === 0 ? (
              <div className="text-xs text-neutral-500">No data yet.</div>
            ) : (
              <div className="space-y-1">
                {countries.map(([c, n]) => (
                  <div key={c} className="flex items-center gap-2 text-xs">
                    <span className="w-24 shrink-0 text-neutral-400">{c}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded bg-neutral-800">
                      <div
                        className="h-full bg-neutral-400"
                        style={{ width: `${(n / totalCountry) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right tabular-nums text-neutral-400">
                      {n}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type Bucket = { label: string; opens: number; views: number };

function bucketBy(events: Ev[], count: number, unit: "day" | "week"): Bucket[] {
  const now = new Date();
  const buckets: Bucket[] = [];
  const dayMs = 86400000;
  const step = unit === "day" ? dayMs : dayMs * 7;
  for (let i = count - 1; i >= 0; i--) {
    const end = new Date(now.getTime() - i * step);
    const start = new Date(end.getTime() - step);
    const label =
      unit === "day"
        ? end.toLocaleDateString(undefined, { month: "short", day: "numeric" })
        : `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
    let opens = 0;
    let views = 0;
    for (const e of events) {
      const t = new Date(e.created_at).getTime();
      if (t >= start.getTime() && t < end.getTime()) {
        if (e.event_type === "open") opens++;
        else if (e.event_type === "view") views++;
      }
    }
    buckets.push({ label, opens, views });
  }
  return buckets;
}

function Chart({ title, points }: { title: string; points: Bucket[] }) {
  const max = Math.max(1, ...points.map((p) => Math.max(p.opens, p.views)));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-neutral-500">{title}</div>
        <div className="flex gap-3 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-neutral-500" /> opens
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-emerald-500" /> views
          </span>
        </div>
      </div>
      <div className="flex h-24 items-end gap-1">
        {points.map((p, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-20 w-full items-end gap-[2px]">
              <div
                className="flex-1 rounded-t bg-neutral-500"
                style={{ height: `${(p.opens / max) * 100}%` }}
                title={`${p.opens} opens`}
              />
              <div
                className="flex-1 rounded-t bg-emerald-500"
                style={{ height: `${(p.views / max) * 100}%` }}
                title={`${p.views} views`}
              />
            </div>
            <div className="text-[9px] text-neutral-600">{p.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}