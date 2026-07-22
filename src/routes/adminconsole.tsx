import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Fragment, useEffect, useState } from "react";
import {
  adminLogin,
  adminLogout,
  checkAdminSession,
  deletePdf,
  getPdfAnalytics,
  listPdfs,
  type PdfAnalytics,
  type BucketPoint,
  type PdfRow,
} from "@/lib/admin.functions";
import {
  adminListPosts,
  adminSavePost,
  adminDeletePost,
  type BlogPost,
  type BlogPostInput,
} from "@/lib/blog.functions";

export const Route = createFileRoute("/adminconsole")({
  head: () => ({
    meta: [
      { title: "Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const check = useServerFn(checkAdminSession);
  useEffect(() => {
    check().then((r) => setAuthed(r.authed)).catch(() => setAuthed(false));
  }, [check]);
  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-400">
        Loading...
      </div>
    );
  }
  return authed ? (
    <Dashboard onLogout={() => setAuthed(false)} />
  ) : (
    <LoginForm onSuccess={() => setAuthed(true)} />
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const login = useServerFn(adminLogin);
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await login({ data: { username, password } });
      if (res.ok) onSuccess();
      else setErr(res.error);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 backdrop-blur"
      >
        <h1 className="text-xl font-semibold text-white">Admin sign in</h1>
        <p className="mt-1 text-sm text-neutral-400">Restricted area</p>
        <div className="mt-6 space-y-3">
          <input
            autoFocus
            autoComplete="username"
            value={username}
            onChange={(e) => setU(e.target.value)}
            placeholder="Username"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setP(e.target.value)}
            placeholder="Password"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
          />
        </div>
        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-md bg-white px-3 py-2 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();
  const load = useServerFn(listPdfs);
  const del = useServerFn(deletePdf);
  const logout = useServerFn(adminLogout);
  const [rows, setRows] = useState<PdfRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      setRows(await load());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) alert(`Upload failed for ${file.name}: ${await res.text()}`);
      }
      await refresh();
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await del({ data: { id } });
    await refresh();
  }

  async function copyLink(id: string) {
    const url = `${origin}/p/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500);
    } catch {
      prompt("Copy this link:", url);
    }
  }

  async function doLogout() {
    await logout();
    onLogout();
    router.invalidate();
  }

  const topViewed = [...rows]
    .filter((r) => r.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  const totalOpens = rows.reduce((s, r) => s + r.link_opens, 0);
  const totalViews = rows.reduce((s, r) => s + r.views, 0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tab, setTab] = useState<"pdfs" | "blog">("pdfs");

  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-10 text-neutral-100">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Portfolio admin</h1>
            <p className="text-sm text-neutral-400">Upload, share and monitor your PDFs.</p>
          </div>
          <button
            onClick={doLogout}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 inline-flex rounded-lg border border-neutral-800 bg-neutral-900/60 p-1 text-sm">
          <button
            onClick={() => setTab("pdfs")}
            className={`rounded-md px-4 py-1.5 ${tab === "pdfs" ? "bg-white text-black" : "text-neutral-300 hover:text-white"}`}
          >
            PDFs
          </button>
          <button
            onClick={() => setTab("blog")}
            className={`rounded-md px-4 py-1.5 ${tab === "blog" ? "bg-white text-black" : "text-neutral-300 hover:text-white"}`}
          >
            Blog
          </button>
        </div>

        {tab === "blog" ? (
          <BlogManager />
        ) : (
        <>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="PDFs" value={rows.length} />
          <StatCard label="Total link opens" value={totalOpens} />
          <StatCard label="Total views" value={totalViews} />
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-medium">Upload PDF</h2>
              <p className="text-sm text-neutral-400">Only PDF files. You can select multiple.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200">
              {uploading ? "Uploading..." : "Choose files"}
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={onUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {topViewed.length > 0 && (
          <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
            <h2 className="text-lg font-medium">Most viewed</h2>
            <ul className="mt-3 divide-y divide-neutral-800">
              {topViewed.map((r, i) => (
                <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="truncate">
                    <span className="text-neutral-500">{i + 1}.</span> {r.name}
                  </span>
                  <span className="text-neutral-400">{r.views} views</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <div className="flex items-center justify-between p-6 pb-3">
            <h2 className="text-lg font-medium">All PDFs</h2>
            {loading && <span className="text-xs text-neutral-500">Loading...</span>}
          </div>
          {rows.length === 0 && !loading ? (
            <p className="px-6 pb-6 text-sm text-neutral-400">No PDFs uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-neutral-500">
                  <tr className="border-t border-neutral-800">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Opens</th>
                    <th className="px-4 py-3 font-medium">Views</th>
                    <th className="px-4 py-3 font-medium">Last viewed</th>
                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <Fragment key={r.id}>
                    <tr className="border-t border-neutral-800/60">
                      <td className="max-w-[280px] truncate px-6 py-3">
                        <a
                          href={`/p/${r.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-100 hover:underline"
                        >
                          {r.name}
                        </a>
                        <div className="text-xs text-neutral-500">
                          {new Date(r.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-neutral-300">{r.link_opens}</td>
                      <td className="px-4 py-3 tabular-nums text-neutral-300">{r.views}</td>
                      <td className="px-4 py-3 text-neutral-400">
                        {r.last_viewed_at ? new Date(r.last_viewed_at).toLocaleString() : "—"}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => setExpanded((c) => (c === r.id ? null : r.id))}
                            className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs hover:bg-neutral-800"
                          >
                            {expanded === r.id ? "Hide analytics" : "Analytics"}
                          </button>
                          <button
                            onClick={() => copyLink(r.id)}
                            className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs hover:bg-neutral-800"
                          >
                            {copiedId === r.id ? "Copied" : "Copy link"}
                          </button>
                          <button
                            onClick={() => onDelete(r.id, r.name)}
                            className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-950/70"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded === r.id && (
                      <tr className="border-t border-neutral-800/40 bg-neutral-950/60">
                        <td colSpan={5} className="px-6 py-5">
                          <AnalyticsPanel pdfId={r.id} />
                        </td>
                      </tr>
                    )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
      <div className="text-xs uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", GB: "United Kingdom", CA: "Canada", AU: "Australia",
  IN: "India", PK: "Pakistan", DE: "Germany", FR: "France", NL: "Netherlands",
  ES: "Spain", IT: "Italy", BR: "Brazil", MX: "Mexico", JP: "Japan",
  CN: "China", SG: "Singapore", AE: "United Arab Emirates", SA: "Saudi Arabia",
  ZA: "South Africa", NG: "Nigeria", KE: "Kenya", TR: "Turkey", RU: "Russia",
  UA: "Ukraine", PL: "Poland", SE: "Sweden", NO: "Norway", DK: "Denmark",
  FI: "Finland", IE: "Ireland", CH: "Switzerland", AT: "Austria", BE: "Belgium",
  PT: "Portugal", GR: "Greece", CZ: "Czechia", RO: "Romania", HU: "Hungary",
  KR: "South Korea", TH: "Thailand", VN: "Vietnam", ID: "Indonesia",
  MY: "Malaysia", PH: "Philippines", NZ: "New Zealand", IL: "Israel",
  EG: "Egypt", AR: "Argentina", CL: "Chile", CO: "Colombia",
};
function flag(cc: string) {
  if (!cc || cc.length !== 2 || cc === "??") return "🌐";
  const A = 0x1f1e6;
  return String.fromCodePoint(A + cc.charCodeAt(0) - 65, A + cc.charCodeAt(1) - 65);
}

function AnalyticsPanel({ pdfId }: { pdfId: string }) {
  const load = useServerFn(getPdfAnalytics);
  const [data, setData] = useState<PdfAnalytics | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    load({ data: { id: pdfId, days } })
      .then((r) => alive && setData(r))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [pdfId, days, load]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-neutral-200">Trends & locations</h3>
        <div className="inline-flex rounded-md border border-neutral-800 bg-neutral-900 p-0.5 text-xs">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded px-2.5 py-1 ${days === d ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"}`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>
      {loading || !data ? (
        <div className="text-xs text-neutral-500">Loading analytics...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BarChart title="Per day" points={data.daily} labelFormatter={fmtDay} />
          <BarChart title="Per week" points={data.weekly} labelFormatter={(s) => s} />
          <div className="lg:col-span-2">
            <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">
              By country
            </div>
            {data.countries.length === 0 ? (
              <div className="text-xs text-neutral-500">No traffic yet.</div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {data.countries.map((c) => {
                  const total = c.opens + c.views;
                  const max = Math.max(
                    ...data.countries.map((x) => x.opens + x.views),
                    1,
                  );
                  const pct = (total / max) * 100;
                  return (
                    <div
                      key={c.country}
                      className="rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-200">
                          <span className="mr-2 text-base leading-none">{flag(c.country)}</span>
                          {COUNTRY_NAMES[c.country] || (c.country === "??" ? "Unknown" : c.country)}
                        </span>
                        <span className="tabular-nums text-neutral-400">
                          {c.opens} opens · {c.views} views
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 overflow-hidden rounded bg-neutral-800">
                        <div
                          className="h-full bg-neutral-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function fmtDay(k: string) {
  const [, m, d] = k.split("-");
  return `${m}/${d}`;
}

function BarChart({
  title,
  points,
  labelFormatter,
}: {
  title: string;
  points: BucketPoint[];
  labelFormatter: (k: string) => string;
}) {
  const max = Math.max(1, ...points.map((p) => Math.max(p.opens, p.views)));
  const totalOpens = points.reduce((s, p) => s + p.opens, 0);
  const totalViews = points.reduce((s, p) => s + p.views, 0);
  // Show at most ~20 labels for readability
  const labelEvery = Math.max(1, Math.ceil(points.length / 10));
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-neutral-500">{title}</div>
        <div className="flex items-center gap-3 text-[11px] text-neutral-400">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-sky-400" /> opens {totalOpens}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-400" /> views {totalViews}
          </span>
        </div>
      </div>
      <div className="mt-4 flex h-32 items-end gap-0.5">
        {points.map((p) => (
          <div key={p.bucket} className="group flex flex-1 flex-col items-center gap-0.5">
            <div
              title={`${labelFormatter(p.bucket)} · ${p.opens} opens · ${p.views} views`}
              className="flex w-full items-end justify-center gap-0.5"
              style={{ height: "100%" }}
            >
              <div
                className="w-1/2 rounded-sm bg-sky-400/80 group-hover:bg-sky-300"
                style={{ height: `${(p.opens / max) * 100}%` }}
              />
              <div
                className="w-1/2 rounded-sm bg-emerald-400/80 group-hover:bg-emerald-300"
                style={{ height: `${(p.views / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-0.5 text-[10px] text-neutral-500">
        {points.map((p, i) => (
          <div key={p.bucket} className="flex-1 text-center">
            {i % labelEvery === 0 ? labelFormatter(p.bucket) : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
function emptyDraft(): BlogPostInput {
  return {
    slug: "",
    title: "",
    summary: "",
    cover_image: "",
    external_url: "",
    overview: "",
    challenge: "",
    solution: "",
    process: "",
    tools: [],
    results: "",
    gallery: [],
    tags: [],
    published: true,
    sort_order: 0,
  };
}

function BlogManager() {
  const list = useServerFn(adminListPosts);
  const save = useServerFn(adminSavePost);
  const del = useServerFn(adminDeletePost);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<BlogPostInput | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setPosts(await list());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startNew() {
    setEditingId("__new__");
    setDraft(emptyDraft());
    setErr(null);
  }
  function startEdit(p: BlogPost) {
    setEditingId(p.id);
    setErr(null);
    setDraft({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      cover_image: p.cover_image ?? "",
      external_url: p.external_url ?? "",
      overview: p.overview ?? "",
      challenge: p.challenge ?? "",
      solution: p.solution ?? "",
      process: p.process ?? "",
      tools: p.tools ?? [],
      results: p.results ?? "",
      gallery: p.gallery ?? [],
      tags: p.tags ?? [],
      published: p.published,
      sort_order: p.sort_order,
    });
  }
  function cancel() {
    setEditingId(null);
    setDraft(null);
    setErr(null);
  }
  async function onSave() {
    if (!draft) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await save({
        data: {
          id: editingId && editingId !== "__new__" ? editingId : undefined,
          input: draft,
        },
      });
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      cancel();
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }
  async function onDelete(p: BlogPost) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const res = await del({ data: { id: p.id } });
    if (!res.ok) alert(res.error);
    else await refresh();
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Blog posts</h2>
          <p className="text-sm text-neutral-400">Manage the case studies shown at /blog.</p>
        </div>
        <button
          onClick={startNew}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
        >
          New post
        </button>
      </div>

      {draft && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
          <h3 className="text-base font-medium">
            {editingId === "__new__" ? "New post" : "Edit post"}
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Title">
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder="my-project"
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Cover image URL">
              <input
                value={draft.cover_image ?? ""}
                onChange={(e) => setDraft({ ...draft, cover_image: e.target.value })}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="External URL (Contra, live site)">
              <input
                value={draft.external_url ?? ""}
                onChange={(e) => setDraft({ ...draft, external_url: e.target.value })}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Tags (comma-separated)">
              <input
                value={(draft.tags ?? []).join(", ")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Tools (comma-separated)">
              <input
                value={(draft.tools ?? []).join(", ")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    tools: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Gallery images (one URL per line)" full>
              <textarea
                value={(draft.gallery ?? []).join("\n")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    gallery: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                  })
                }
                rows={3}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Summary (used in listing & SEO description)" full>
              <textarea
                value={draft.summary}
                onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                rows={2}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Overview" full>
              <textarea
                value={draft.overview ?? ""}
                onChange={(e) => setDraft({ ...draft, overview: e.target.value })}
                rows={4}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Challenge" full>
              <textarea
                value={draft.challenge ?? ""}
                onChange={(e) => setDraft({ ...draft, challenge: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Solution" full>
              <textarea
                value={draft.solution ?? ""}
                onChange={(e) => setDraft({ ...draft, solution: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Process" full>
              <textarea
                value={draft.process ?? ""}
                onChange={(e) => setDraft({ ...draft, process: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Results" full>
              <textarea
                value={draft.results ?? ""}
                onChange={(e) => setDraft({ ...draft, results: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                value={draft.sort_order ?? 0}
                onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Published">
              <label className="inline-flex items-center gap-2 text-sm text-neutral-300">
                <input
                  type="checkbox"
                  checked={draft.published ?? true}
                  onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                />
                Visible on /blog
              </label>
            </Field>
          </div>
          {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
          <div className="mt-5 flex gap-2">
            <button
              onClick={onSave}
              disabled={busy}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-60"
            >
              {busy ? "Saving..." : "Save"}
            </button>
            <button
              onClick={cancel}
              className="rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm hover:bg-neutral-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex items-center justify-between p-6 pb-3">
          <h3 className="text-base font-medium">All posts</h3>
          {loading && <span className="text-xs text-neutral-500">Loading...</span>}
        </div>
        {posts.length === 0 && !loading ? (
          <p className="px-6 pb-6 text-sm text-neutral-400">No posts yet.</p>
        ) : (
          <ul className="divide-y divide-neutral-800">
            {posts.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-6 py-3">
                {p.cover_image ? (
                  <img
                    src={p.cover_image}
                    alt=""
                    className="h-12 w-16 rounded object-cover"
                  />
                ) : (
                  <div className="h-12 w-16 rounded bg-neutral-800" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-sm font-medium text-neutral-100 hover:underline"
                    >
                      {p.title}
                    </a>
                    {!p.published && (
                      <span className="rounded-full border border-neutral-700 px-1.5 py-0.5 text-[10px] text-neutral-400">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-neutral-500">/blog/{p.slug}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs hover:bg-neutral-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-950/70"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">{label}</span>
      {children}
    </label>
  );
}
