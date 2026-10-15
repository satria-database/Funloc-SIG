import { useState } from "react";
import { ShieldCheck, LogIn } from "lucide-react";
import { getAuthClient, usernameToEmail } from "@/lib/auth";

export function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await getAuthClient().auth.signInWithPassword({
      email: usernameToEmail(username),
      password,
    });
    setBusy(false);
    if (error) setError("Username/email atau password salah.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="skeuo-panel-gloss bg-white rounded-xl border border-[#b8bfc8] shadow-md w-full max-w-sm p-6 space-y-4"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <ShieldCheck className="w-8 h-8 text-[#39414d]" />
          <h1 className="font-bold text-[#2b313a] text-base">PORTAL DATA MASTER FUNLOC SIG</h1>
          <p className="text-xs text-[#5a6370]">Silakan login untuk melanjutkan</p>
        </div>
        <label className="block text-xs font-semibold text-[#39414d]">
          Email / Username
          <input
            className="skeuo-input mt-1 w-full px-3 py-2 text-sm rounded-md border border-[#b8bfc8]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="block text-xs font-semibold text-[#39414d]">
          Password
          <input
            type="password"
            className="skeuo-input mt-1 w-full px-3 py-2 text-sm rounded-md border border-[#b8bfc8]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="text-xs text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="skeuo-btn-convex w-full py-2 text-sm font-semibold flex items-center justify-center gap-2 text-[#2c333e] cursor-pointer disabled:opacity-60"
        >
          <LogIn className="w-4 h-4" />
          {busy ? "Memproses..." : "Login"}
        </button>
        <p className="text-[11px] text-center text-[#6b7480]">
          Pendaftaran akun mandiri dinonaktifkan. Hubungi admin untuk mendapatkan akun.
        </p>
      </form>
    </div>
  );
}
