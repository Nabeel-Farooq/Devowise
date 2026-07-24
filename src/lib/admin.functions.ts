import { createServerFn } from "@tanstack/react-start";
import { createHash, timingSafeEqual } from "node:crypto";

function pwMatches(a: string, b: string) {
  const h1 = createHash("sha256").update(a, "utf8").digest();
  const h2 = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(h1, h2);
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { username: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { getAdminSession } = await import("./admin-session.server");
    const expectedUser = process.env.ADMIN_USERNAME ?? "";
    const expectedPass = process.env.ADMIN_PASSWORD ?? "";
    if (!expectedUser || !expectedPass) {
      return { ok: false as const, error: "Admin credentials not configured" };
    }
    const userOk = pwMatches(data.username, expectedUser);
    const passOk = pwMatches(data.password, expectedPass);
    if (!userOk || !passOk) return { ok: false as const, error: "Invalid credentials" };
    const session = await getAdminSession();
    await session.update({ authed: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { getAdminSession } = await import("./admin-session.server");
  const s = await getAdminSession();
  await s.clear();
  return { ok: true as const };
});

export const checkAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminSession } = await import("./admin-session.server");
  const s = await getAdminSession();
  return { authed: !!s.data.authed };
});

export type PdfRow = {
  id: string;
  name: string;
  slug: string | null;
  storage_path: string;
  size_bytes: number | null;
  link_opens: number;
  views: number;
  last_viewed_at: string | null;
  created_at: string;
};

export const listPdfs = createServerFn({ method: "GET" }).handler(async (): Promise<PdfRow[]> => {
  const { requireAdmin } = await import("./admin-session.server");
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("pdf_files" as never)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as unknown as PdfRow[];
  if (rows.length === 0) return rows;
  // Compute live counters from pdf_events so numbers always match reality,
  // even if the increment RPCs were skipped by public endpoints.
  const ids = rows.map((r) => r.id);
  const { data: evs, error: evErr } = await supabaseAdmin
    .from("pdf_events" as never)
    .select("pdf_id, event_type, created_at, is_bot")
    .in("pdf_id", ids);
  if (evErr) throw new Error(evErr.message);
  const agg = new Map<string, { opens: number; views: number; last: string | null }>();
  for (const e of (evs ?? []) as unknown as {
    pdf_id: string;
    event_type: "open" | "view";
    created_at: string;
    is_bot: boolean | null;
  }[]) {
    if (e.is_bot) continue;
    const cur = agg.get(e.pdf_id) ?? { opens: 0, views: 0, last: null };
    if (e.event_type === "open") cur.opens++;
    else if (e.event_type === "view") {
      cur.views++;
      if (!cur.last || e.created_at > cur.last) cur.last = e.created_at;
    }
    agg.set(e.pdf_id, cur);
  }
  return rows.map((r) => {
    const a = agg.get(r.id);
    if (!a) return r;
    return {
      ...r,
      link_opens: a.opens,
      views: a.views,
      last_viewed_at: a.last ?? r.last_viewed_at,
    };
  });
});

export const deletePdf = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error: fetchErr } = await supabaseAdmin
      .from("pdf_files" as never)
      .select("storage_path")
      .eq("id", data.id)
      .maybeSingle();
    if (fetchErr) throw new Error(fetchErr.message);
    if (!row) return { ok: false as const, error: "Not found" };
    const path = (row as { storage_path: string }).storage_path;
    await supabaseAdmin.storage.from("portfolio-pdfs").remove([path]);
    const { error: delErr } = await supabaseAdmin
      .from("pdf_files" as never)
      .delete()
      .eq("id", data.id);
    if (delErr) throw new Error(delErr.message);
    return { ok: true as const };
  });

export type BucketPoint = { bucket: string; opens: number; views: number };
export type CountryPoint = { country: string; opens: number; views: number };
export type CityPoint = { key: string; country: string; city: string; opens: number; views: number };
export type BreakdownPoint = { key: string; label: string; opens: number; views: number };
export type PdfAnalytics = {
  daily: BucketPoint[];
  weekly: BucketPoint[];
  countries: CountryPoint[];
  cities: CityPoint[];
  devices: BreakdownPoint[];
  browsers: BreakdownPoint[];
  os: BreakdownPoint[];
  referrers: BreakdownPoint[];
  utmSources: BreakdownPoint[];
  utmCampaigns: BreakdownPoint[];
  totals: { opens: number; views: number; bots: number };
};

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function dayKey(d: Date) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
function weekKey(d: Date) {
  // ISO week (UTC)
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+t - +yearStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${pad(week)}`;
}

export const getPdfAnalytics = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; days?: number; includeBots?: boolean }) => d)
  .handler(async ({ data }): Promise<PdfAnalytics> => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const days = data.days ?? 30;
    const since = new Date(Date.now() - days * 86400000);
    const { data: rows, error } = await supabaseAdmin
      .from("pdf_events" as never)
      .select("event_type, country, city, region, device_type, browser, os, referrer_source, utm_source, utm_campaign, is_bot, created_at")
      .eq("pdf_id", data.id)
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const allEvents = (rows ?? []) as unknown as {
      event_type: "open" | "view";
      country: string | null;
      city: string | null;
      region: string | null;
      device_type: string | null;
      browser: string | null;
      os: string | null;
      referrer_source: string | null;
      utm_source: string | null;
      utm_campaign: string | null;
      is_bot: boolean | null;
      created_at: string;
    }[];
    const botCount = allEvents.filter((e) => e.is_bot).length;
    const events = data.includeBots ? allEvents : allEvents.filter((e) => !e.is_bot);

    // Seed daily buckets so the chart shows a continuous timeline.
    const dailyMap = new Map<string, BucketPoint>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const k = dayKey(d);
      dailyMap.set(k, { bucket: k, opens: 0, views: 0 });
    }
    const weeklyMap = new Map<string, BucketPoint>();
    const weeksToShow = Math.max(1, Math.ceil(days / 7));
    for (let i = weeksToShow - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 7 * 86400000);
      const k = weekKey(d);
      if (!weeklyMap.has(k)) weeklyMap.set(k, { bucket: k, opens: 0, views: 0 });
    }
    const countryMap = new Map<string, CountryPoint>();
    const cityMap = new Map<string, CityPoint>();
    const devMap = new Map<string, BreakdownPoint>();
    const brMap = new Map<string, BreakdownPoint>();
    const osMap = new Map<string, BreakdownPoint>();
    const refMap = new Map<string, BreakdownPoint>();
    const utmSMap = new Map<string, BreakdownPoint>();
    const utmCMap = new Map<string, BreakdownPoint>();
    let totalOpens = 0;
    let totalViews = 0;

    const bump = (map: Map<string, BreakdownPoint>, key: string, label: string, type: "open" | "view") => {
      const cur = map.get(key) ?? { key, label, opens: 0, views: 0 };
      if (type === "open") cur.opens++;
      else cur.views++;
      map.set(key, cur);
    };

    for (const e of events) {
      const d = new Date(e.created_at);
      const dk = dayKey(d);
      const wk = weekKey(d);
      const day = dailyMap.get(dk) ?? { bucket: dk, opens: 0, views: 0 };
      const wk_ = weeklyMap.get(wk) ?? { bucket: wk, opens: 0, views: 0 };
      if (e.event_type === "open") {
        day.opens++;
        wk_.opens++;
        totalOpens++;
      } else {
        day.views++;
        wk_.views++;
        totalViews++;
      }
      dailyMap.set(dk, day);
      weeklyMap.set(wk, wk_);
      const c = (e.country || "??").toUpperCase();
      const cp = countryMap.get(c) ?? { country: c, opens: 0, views: 0 };
      if (e.event_type === "open") cp.opens++;
      else cp.views++;
      countryMap.set(c, cp);

      if (e.city) {
        const ck = `${c}::${e.city}`;
        const cur = cityMap.get(ck) ?? { key: ck, country: c, city: e.city, opens: 0, views: 0 };
        if (e.event_type === "open") cur.opens++;
        else cur.views++;
        cityMap.set(ck, cur);
      }

      bump(devMap, e.device_type || "unknown", e.device_type || "unknown", e.event_type);
      if (e.browser) bump(brMap, e.browser, e.browser, e.event_type);
      if (e.os) bump(osMap, e.os, e.os, e.event_type);
      bump(refMap, e.referrer_source || "direct", e.referrer_source || "Direct", e.event_type);
      if (e.utm_source) bump(utmSMap, e.utm_source, e.utm_source, e.event_type);
      if (e.utm_campaign) bump(utmCMap, e.utm_campaign, e.utm_campaign, e.event_type);
    }

    const daily = [...dailyMap.values()].sort((a, b) => a.bucket.localeCompare(b.bucket));
    const weekly = [...weeklyMap.values()].sort((a, b) => a.bucket.localeCompare(b.bucket));
    const countries = [...countryMap.values()].sort(
      (a, b) => b.opens + b.views - (a.opens + a.views),
    );
    const sortByTotal = (arr: BreakdownPoint[]) => arr.sort((a, b) => b.opens + b.views - (a.opens + a.views));
    return {
      daily,
      weekly,
      countries,
      cities: [...cityMap.values()].sort((a, b) => b.opens + b.views - (a.opens + a.views)).slice(0, 20),
      devices: sortByTotal([...devMap.values()]),
      browsers: sortByTotal([...brMap.values()]),
      os: sortByTotal([...osMap.values()]),
      referrers: sortByTotal([...refMap.values()]),
      utmSources: sortByTotal([...utmSMap.values()]),
      utmCampaigns: sortByTotal([...utmCMap.values()]),
      totals: { opens: totalOpens, views: totalViews, bots: botCount },
    };
  });