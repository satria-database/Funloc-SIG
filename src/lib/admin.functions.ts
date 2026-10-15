import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_SUPABASE_ANON_KEY, DEFAULT_SUPABASE_URL } from "./supabase";

async function requireAdmin(accessToken: string) {
  const anon = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await anon.auth.getUser(accessToken);
  if (error || !data.user) throw new Error("Sesi tidak valid, silakan login ulang.");
  if (data.user.app_metadata?.["role"] !== "admin") throw new Error("Hanya admin yang diizinkan.");
  const key = process.env["FUNLOC_SUPABASE_SERVICE_ROLE_KEY"];
  if (!key) throw new Error("Service role key belum dikonfigurasi.");
  return {
    me: data.user,
    admin: createClient(DEFAULT_SUPABASE_URL, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  };
}

const roleSchema = z.enum(["admin", "view"]);

export const listUsers = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ token: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { admin } = await requireAdmin(data.token);
    const { data: res, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (error) throw new Error(error.message);
    return res.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      role: (u.app_metadata?.["role"] === "admin" ? "admin" : "view") as "admin" | "view",
      created_at: u.created_at,
    }));
  });

export const createUser = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        token: z.string().min(1),
        email: z.string().email().max(255),
        password: z.string().min(6).max(72),
        role: roleSchema,
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { admin } = await requireAdmin(data.token);
    const { error } = await admin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      app_metadata: { role: data.role },
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateUser = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        token: z.string().min(1),
        id: z.string().uuid(),
        role: roleSchema.optional(),
        password: z.string().min(6).max(72).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { admin, me } = await requireAdmin(data.token);
    if (data.id === me.id && data.role === "view") throw new Error("Tidak bisa menurunkan role akun sendiri.");
    const attrs: { app_metadata?: { role: string }; password?: string } = {};
    if (data.role) attrs.app_metadata = { role: data.role };
    if (data.password) attrs.password = data.password;
    const { error } = await admin.auth.admin.updateUserById(data.id, attrs);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ token: z.string().min(1), id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { admin, me } = await requireAdmin(data.token);
    if (data.id === me.id) throw new Error("Tidak bisa menghapus akun sendiri.");
    const { error } = await admin.auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
