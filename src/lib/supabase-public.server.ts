import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: string, fallbackName?: string) {
  const value = process.env[name] || (fallbackName ? process.env[fallbackName] : undefined);
  if (!value) {
    throw new Error(`Missing backend environment variable: ${name}${fallbackName ? ` or ${fallbackName}` : ""}`);
  }
  return value;
}

function isOpaqueSupabaseKey(value: string) {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, header) => headers.set(header, value));
    }

    if (isOpaqueSupabaseKey(key) && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }

    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

export function createSupabasePublicClient() {
  const url = requiredEnv("SUPABASE_URL", "VITE_SUPABASE_URL");
  const key = requiredEnv("SUPABASE_PUBLISHABLE_KEY", "VITE_SUPABASE_PUBLISHABLE_KEY");

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: createSupabaseFetch(key) },
  });
}