import { useSession } from "@tanstack/react-start/server";

export type AdminSession = { authed?: boolean };

export const adminSessionConfig = {
  password: process.env.ADMIN_SESSION_SECRET ?? "dev-insecure-fallback-please-set-ADMIN_SESSION_SECRET-32chars",
  name: "devowise-admin",
  maxAge: 60 * 60 * 24 * 7,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  },
};

export async function getAdminSession() {
  return useSession<AdminSession>(adminSessionConfig);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.data.authed) {
    throw new Error("Unauthorized");
  }
  return session;
}