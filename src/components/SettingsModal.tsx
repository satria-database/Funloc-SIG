import React, { useState } from 'react';
import {
  X,
  Settings as SettingsIcon,
  Database,
  CheckCircle2,
  RefreshCw,
  Server,
  Layers,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  SupabaseConfig,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_TABLE,
} from '../lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  if (!isOpen) return null;

  const currentConfig = getStoredSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url || DEFAULT_SUPABASE_URL);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey || '');
  const [tableName, setTableName] = useState(
    currentConfig.tableName || DEFAULT_SUPABASE_TABLE
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: SupabaseConfig = {
      url: url.trim(),
      anonKey: anonKey.trim(),
      tableName: tableName.trim() || DEFAULT_SUPABASE_TABLE,
    };
    saveStoredSupabaseConfig(newConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onConfigSaved();
      onClose();
    }, 900);
  };

  const handleReset = () => {
    setUrl(DEFAULT_SUPABASE_URL);
    setTableName(DEFAULT_SUPABASE_TABLE);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#b8bfc8] overflow-hidden">
        {/* Header Modal */}
        <div className="bg-[#242a33] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#3b434e]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-white/10 text-emerald-400">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Setting</h3>
              <p className="text-[11px] text-[#9ba4b2]">
                Konfigurasi Koneksi & Sumber Data Master
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs text-[#2c333e]">
          {savedSuccess && (
            <div className="p-2.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pengaturan berhasil disimpan. Memuat ulang data...</span>
            </div>
          )}

          <div>
            <label className="block font-bold mb-1 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#5a6472]" />
              <span>Endpoint URL Database</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-[#ccd2da] rounded-md font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-[#f8fafc]"
              required
            />
            <p className="text-[10.5px] text-[#717b88] mt-1">
              Alamat host endpoint server data master.
            </p>
          </div>

          <div>
            <label className="block font-bold mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#5a6472]" />
              <span>Nama Tabel Master Data</span>
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Funloc All SIG"
              className="w-full px-3 py-2 border border-[#ccd2da] rounded-md font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-[#f8fafc]"
              required
            />
            <p className="text-[10.5px] text-[#717b88] mt-1">
              Nama tabel data master functional location (default: Funloc All SIG).
            </p>
          </div>

          <div>
            <label className="block font-bold mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#5a6472]" />
              <span>API Key / Access Token</span>
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="Token akses database..."
              className="w-full px-3 py-2 border border-[#ccd2da] rounded-md font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-[#f8fafc]"
            />
            <p className="text-[10.5px] text-[#717b88] mt-1">
              Kunci autentikasi publik untuk sinkronisasi data langsung.
            </p>
          </div>

          <div className="pt-2 border-t border-[#d8dde4] flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-[#656e7b] hover:text-[#222] font-semibold text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-md border border-[#c3c9d2] text-[#434b57] hover:bg-gray-100 cursor-pointer font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-md bg-[#232932] hover:bg-[#151a21] text-white font-bold cursor-pointer shadow-xs"
              >
                Simpan Pengaturan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
