// Resolve visitor geo (country/city/region) with a multi-provider fallback so
// we get accurate results even when one API is down or rate-limited.

export type Geo = {
  country: string | null; // ISO-2 uppercase
  city: string | null;
  region: string | null;
};

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

async function fetchJson(url: string, ms = 1500): Promise<Record<string, unknown> | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), ms);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "devowise-analytics/1.0", accept: "application/json" },
    });
    clearTimeout(t);
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function headerGeo(request: Request): Geo {
  const country =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-country-code");
  const city =
    request.headers.get("x-vercel-ip-city") || request.headers.get("cf-ipcity") || null;
  const region =
    request.headers.get("x-vercel-ip-country-region") ||
    request.headers.get("cf-region") ||
    null;
  return {
    country: country && country.length === 2 ? country.toUpperCase() : null,
    city: city ? safeDecode(city) : null,
    region: region ? safeDecode(region) : null,
  };
}

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

export async function resolveGeo(request: Request): Promise<Geo> {
  const base = headerGeo(request);
  if (base.country && base.city) return base;

  const ip = pickIp(request);
  if (!ip || isPrivateIp(ip)) return base;

  // Provider 1: ipwho.is
  const w = await fetchJson(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code,city,region`);
  if (w && w.success !== false && w.country_code) {
    return {
      country: base.country ?? String(w.country_code).toUpperCase(),
      city: base.city ?? (w.city as string | null) ?? null,
      region: base.region ?? (w.region as string | null) ?? null,
    };
  }

  // Provider 2: ip-api.com (non-commercial free)
  const a = await fetchJson(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode,city,regionName`);
  if (a && a.status === "success" && a.countryCode) {
    return {
      country: base.country ?? String(a.countryCode).toUpperCase(),
      city: base.city ?? (a.city as string | null) ?? null,
      region: base.region ?? (a.regionName as string | null) ?? null,
    };
  }

  // Provider 3: freeipapi.com
  const f = await fetchJson(`https://freeipapi.com/api/json/${encodeURIComponent(ip)}`);
  if (f && f.countryCode) {
    return {
      country: base.country ?? String(f.countryCode).toUpperCase(),
      city: base.city ?? (f.cityName as string | null) ?? null,
      region: base.region ?? (f.regionName as string | null) ?? null,
    };
  }

  // Provider 4: ipapi.co country-only
  try {
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/country/`, {
      headers: { "User-Agent": "devowise-analytics/1.0" },
    });
    if (res.ok) {
      const cc = (await res.text()).trim().toUpperCase();
      if (/^[A-Z]{2}$/.test(cc)) return { country: base.country ?? cc, city: base.city, region: base.region };
    }
  } catch {
    /* ignore */
  }

  return base;
}

export async function resolveCountry(request: Request): Promise<string | null> {
  return (await resolveGeo(request)).country;
}