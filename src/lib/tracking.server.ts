// Lightweight, dependency-free helpers to enrich tracking events with device,
// browser, OS, bot detection, referrer source and UTM parameters.

export type UAInfo = {
  device_type: "mobile" | "tablet" | "desktop" | "bot" | "unknown";
  browser: string | null;
  os: string | null;
  is_bot: boolean;
};

const BOT_RE = /(bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|linkedinbot|slackbot|discordbot|twitterbot|embedly|preview|fetch|python-requests|curl|wget|httpclient|axios|monitor|pingdom|uptimerobot|headlesschrome|puppeteer|playwright)/i;

export function parseUserAgent(ua: string | null | undefined): UAInfo {
  if (!ua) return { device_type: "unknown", browser: null, os: null, is_bot: false };
  const is_bot = BOT_RE.test(ua);

  // Device type
  let device_type: UAInfo["device_type"] = "desktop";
  if (is_bot) device_type = "bot";
  else if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) device_type = "tablet";
  else if (/Mobile|iPhone|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(ua)) device_type = "mobile";

  // OS
  let os: string | null = null;
  if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = /iPhone|iPad|iPod/.test(ua) ? "iOS" : "macOS";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/CrOS/i.test(ua)) os = "ChromeOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  // Browser (order matters: check Edge/Opera/Brave before Chrome/Safari)
  let browser: string | null = null;
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/i.test(ua)) browser = "Opera";
  else if (/Brave/i.test(ua)) browser = "Brave";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/SamsungBrowser/i.test(ua)) browser = "Samsung";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua)) browser = "Safari";
  else if (is_bot) browser = "Bot";

  return { device_type, browser, os, is_bot };
}

export function classifyReferrer(ref: string | null | undefined): { referrer: string | null; source: string } {
  if (!ref) return { referrer: null, source: "direct" };
  let host = "";
  try {
    host = new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return { referrer: ref, source: "other" };
  }
  const map: Record<string, string> = {
    "linkedin.com": "LinkedIn",
    "lnkd.in": "LinkedIn",
    "twitter.com": "Twitter/X",
    "x.com": "Twitter/X",
    "t.co": "Twitter/X",
    "facebook.com": "Facebook",
    "l.facebook.com": "Facebook",
    "instagram.com": "Instagram",
    "l.instagram.com": "Instagram",
    "whatsapp.com": "WhatsApp",
    "api.whatsapp.com": "WhatsApp",
    "web.whatsapp.com": "WhatsApp",
    "wa.me": "WhatsApp",
    "t.me": "Telegram",
    "telegram.org": "Telegram",
    "reddit.com": "Reddit",
    "youtube.com": "YouTube",
    "youtu.be": "YouTube",
    "github.com": "GitHub",
    "medium.com": "Medium",
    "producthunt.com": "Product Hunt",
    "dribbble.com": "Dribbble",
    "behance.net": "Behance",
    "contra.com": "Contra",
    "google.com": "Google",
    "bing.com": "Bing",
    "duckduckgo.com": "DuckDuckGo",
    "mail.google.com": "Gmail",
    "outlook.live.com": "Outlook",
    "outlook.office.com": "Outlook",
    "yahoo.com": "Yahoo",
    "devowise.com": "Direct (site)",
  };
  for (const key of Object.keys(map)) {
    if (host === key || host.endsWith("." + key)) return { referrer: ref, source: map[key] };
  }
  return { referrer: ref, source: host };
}

export function parseUtm(url: string): { utm_source: string | null; utm_medium: string | null; utm_campaign: string | null } {
  try {
    const u = new URL(url);
    const g = (k: string) => u.searchParams.get(k)?.slice(0, 120) || null;
    return { utm_source: g("utm_source"), utm_medium: g("utm_medium"), utm_campaign: g("utm_campaign") };
  } catch {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }
}

export async function buildEventEnrichment(request: Request) {
  const { resolveGeo } = await import("./geo.server");
  const geo = await resolveGeo(request);
  const ua = request.headers.get("user-agent");
  const uaInfo = parseUserAgent(ua);
  const ref = classifyReferrer(request.headers.get("referer"));
  const utm = parseUtm(request.url);
  return {
    country: geo.country,
    city: geo.city,
    region: geo.region,
    user_agent: ua?.slice(0, 500) ?? null,
    device_type: uaInfo.device_type,
    browser: uaInfo.browser,
    os: uaInfo.os,
    is_bot: uaInfo.is_bot,
    referrer: ref.referrer?.slice(0, 500) ?? null,
    referrer_source: ref.source,
    ...utm,
  };
}