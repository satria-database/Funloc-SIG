import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, UserPlus, X, KeyRound } from "lucide-react";
import { createUser, deleteUser, listUsers, updateUser } from "@/lib/admin.functions";
import { emailToUsername, getAuthClient, usernameToEmail, type AppRole } from "@/lib/auth";

type U = { id: string; email: string; role: AppRole; created_at: string };

async function token() {
  const { data } = await getAuthClient().auth.getSession();
  return data.session?.access_token ?? "";
}

export function UserManagementModal({ isOpen, onClose, myId }: { isOpen: boolean; onClose: () => void; myId: string }) {
  const listFn = useServerFn(listUsers);
  const createFn = useServerFn(createUser);
  const updateFn = useServerFn(updateUser);
  const deleteFn = useServerFn(deleteUser);

  const [users, setUsers] = useState<U[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", role: "view" as AppRole });

  const run = async (fn: () => Promise<unknown>, ok?: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      if (ok) setMsg(ok);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Terjadi kesalahan.");
    }
    setBusy(false);
  };

  const refresh = useCallback(
    () => run(async () => setUsers(await listFn({ data: { token: await token() } }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen, refresh]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#b8bfc8] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#2b313a]">Kelola Akun Pengguna</h2>
          <button onClick={onClose} className="cursor-pointer p-1"><X className="w-4 h-4" /></button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await createFn({ data: { token: await token(), email: usernameToEmail(form.username), password: form.password, role: form.role } });
              setForm({ username: "", password: "", role: "view" });
              setUsers(await listFn({ data: { token: await token() } }));
            }, "Akun berhasil dibuat.");
          }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end p-3 rounded-md border border-[#d3d8de] bg-[#f5f6f8]"
        >
          <label className="font-semibold">Username / Email
            <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="mt-1 w-full px-2 py-1.5 rounded border border-[#b8bfc8] bg-white" />
          </label>
          <label className="font-semibold">Password
            <input required minLength={6} type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full px-2 py-1.5 rounded border border-[#b8bfc8] bg-white" />
          </label>
          <label className="font-semibold">Role
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AppRole })} className="mt-1 w-full px-2 py-1.5 rounded border border-[#b8bfc8] bg-white">
              <option value="view">View (hanya lihat)</option>
              <option value="admin">Admin (bisa edit)</option>
            </select>
          </label>
          <button disabled={busy} className="skeuo-btn-convex py-1.5 font-semibold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-60">
            <UserPlus className="w-3.5 h-3.5" /> Buat Akun
          </button>
        </form>

        {msg && <p className="p-2 rounded bg-[#eef1f4] text-[#2b313a]">{msg}</p>}

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-[#d3d8de]">
              <th className="py-1.5">Username</th><th>Role</th><th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#eceff2]">
                <td className="py-1.5">{emailToUsername(u.email)}{u.id === myId && " (Anda)"}</td>
                <td>
                  <select
                    disabled={busy || u.id === myId}
                    value={u.role}
                    onChange={(e) => {
                      const role = e.target.value as AppRole;
                      run(async () => {
                        await updateFn({ data: { token: await token(), id: u.id, role } });
                        setUsers((p) => p.map((x) => (x.id === u.id ? { ...x, role } : x)));
                      }, "Role diperbarui.");
                    }}
                    className="px-1.5 py-1 rounded border border-[#b8bfc8]"
                  >
                    <option value="view">View</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="text-right space-x-1">
                  <button
                    title="Ganti password"
                    disabled={busy}
                    onClick={() => {
                      const pw = window.prompt(`Password baru untuk ${emailToUsername(u.email)} (min. 6 karakter):`);
                      if (pw) run(async () => updateFn({ data: { token: await token(), id: u.id, password: pw } }), "Password diperbarui.");
                    }}
                    className="p-1 cursor-pointer"
                  ><KeyRound className="w-3.5 h-3.5 inline" /></button>
                  {u.id !== myId && (
                    <button
                      title="Hapus akun"
                      disabled={busy}
                      onClick={() => {
                        if (window.confirm(`Hapus akun ${emailToUsername(u.email)}?`))
                          run(async () => {
                            await deleteFn({ data: { token: await token(), id: u.id } });
                            setUsers((p) => p.filter((x) => x.id !== u.id));
                          }, "Akun dihapus.");
                      }}
                      className="p-1 cursor-pointer text-red-700"
                    ><Trash2 className="w-3.5 h-3.5 inline" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
