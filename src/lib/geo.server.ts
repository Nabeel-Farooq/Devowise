// Resolve country code (ISO-2) for a request, using CDN headers first and
// falling back to a free IP geolocation API (ipapi.co, no key required).

function pickIp(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-vercel-forwarded-for") ||
    null
  );
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip) ||
    ip.startsWith("fc") ||
    ip.startsWith("fd")
  );
}

export async function resolveCountry(request: Request): Promise<string | null> {
  const headerCountry =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-country-code");
  if (headerCountry && headerCountry.length === 2) return headerCountry.toUpperCase();

  const ip = pickIp(request);
  if (!ip || isPrivateIp(ip)) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/country/`, {
      signal: controller.signal,
      headers: { "User-Agent": "devowise-analytics/1.0" },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const text = (await res.text()).trim().toUpperCase();
    if (/^[A-Z]{2}$/.test(text)) return text;
    return null;
  } catch {
    return null;
  }
}