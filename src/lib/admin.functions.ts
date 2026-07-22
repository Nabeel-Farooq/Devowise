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
  return (data ?? []) as unknown as PdfRow[];
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
export type PdfAnalytics = {
  daily: BucketPoint[];
  weekly: BucketPoint[];
  countries: CountryPoint[];
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
  .inputValidator((d: { id: string; days?: number }) => d)
  .handler(async ({ data }): Promise<PdfAnalytics> => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const days = data.days ?? 30;
    const since = new Date(Date.now() - days * 86400000);
    const { data: rows, error } = await supabaseAdmin
      .from("pdf_events" as never)
      .select("event_type, country, created_at")
      .eq("pdf_id", data.id)
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const events = (rows ?? []) as unknown as {
      event_type: "open" | "view";
      country: string | null;
      created_at: string;
    }[];

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

    for (const e of events) {
      const d = new Date(e.created_at);
      const dk = dayKey(d);
      const wk = weekKey(d);
      const day = dailyMap.get(dk) ?? { bucket: dk, opens: 0, views: 0 };
      const wk_ = weeklyMap.get(wk) ?? { bucket: wk, opens: 0, views: 0 };
      if (e.event_type === "open") {
        day.opens++;
        wk_.opens++;
      } else {
        day.views++;
        wk_.views++;
      }
      dailyMap.set(dk, day);
      weeklyMap.set(wk, wk_);
      const c = (e.country || "??").toUpperCase();
      const cp = countryMap.get(c) ?? { country: c, opens: 0, views: 0 };
      if (e.event_type === "open") cp.opens++;
      else cp.views++;
      countryMap.set(c, cp);
    }

    const daily = [...dailyMap.values()].sort((a, b) => a.bucket.localeCompare(b.bucket));
    const weekly = [...weeklyMap.values()].sort((a, b) => a.bucket.localeCompare(b.bucket));
    const countries = [...countryMap.values()].sort(
      (a, b) => b.opens + b.views - (a.opens + a.views),
    );
    return { daily, weekly, countries };
  });