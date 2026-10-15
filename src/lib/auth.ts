import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { DEFAULT_SUPABASE_ANON_KEY, DEFAULT_SUPABASE_URL } from "./supabase";

export type AppRole = "admin" | "view";

let authClient: SupabaseClient | null = null;

export function getAuthClient(): SupabaseClient {
  if (!authClient) {
    authClient = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: true,
        storageKey: "funloc_auth_session",
      },
    });
  }
  return authClient;
}

/** Username without "@" is mapped to a deterministic internal email. */
export function usernameToEmail(username: string): string {
  const u = username.trim().toLowerCase();
  return u.includes("@") ? u : `${u.replace(/[^a-z0-9._-]/g, "")}@funloc.local`;
}

export function emailToUsername(email: string | undefined): string {
  if (!email) return "";
  return email.endsWith("@funloc.local") ? email.replace("@funloc.local", "") : email;
}

export function getRole(session: Session | null): AppRole {
  return session?.user?.app_metadata?.["role"] === "admin" ? "admin" : "view";
}

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = getAuthClient();
    const { data } = client.auth.onAuthStateChange((_e, s) => setSession(s));
    client.auth.getSession().then(({ data: d }) => {
      setSession(d.session);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return { session, loading };
}
