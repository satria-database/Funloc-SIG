import React from 'react';
import {
  LayoutDashboard,
  Database,
  GitFork,
  Pencil,
  Building2,
  Factory,
  Wrench,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Server,
} from 'lucide-react';
import { ActiveNavMenu } from './AppNavigationTabs.tsx';

interface DashboardViewProps {
  totalFunlocCount: number;
  totalCostCenterCount: number;
  onNavigate: (menu: ActiveNavMenu) => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onRefreshData: () => void;
  isLoading: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  totalFunlocCount,
  totalCostCenterCount,
  onNavigate,
  isEditMode,
  onToggleEditMode,
  onRefreshData,
  isLoading,
}) => {
  // OpCo breakdown data
  const opcoStats = [
    { name: 'GHOPO', label: 'Gresik & Tuban Infra', count: 48620, pct: 32.3, color: 'bg-blue-600' },
    { name: 'SMBR', label: 'Semen Baturaja (Pabrik 1 & 2)', count: 32410, pct: 21.6, color: 'bg-emerald-600' },
    { name: 'SBI TQ', label: 'Semen Bangun Indonesia (TQ 1 & 2)', count: 28950, pct: 19.3, color: 'bg-amber-600' },
    { name: 'SBI', label: 'Semen Bangun Indonesia (Cigading/Narogong)', count: 18230, pct: 12.1, color: 'bg-indigo-600' },
    { name: 'SP', label: 'Semen Padang (Indarung V & VI)', count: 12560, pct: 8.4, color: 'bg-rose-600' },
    { name: 'ST', label: 'Semen Tonasa (Pangkep & Biringkassi)', count: 9552, pct: 6.3, color: 'bg-teal-600' },
  ];

  // Technical Group breakdown
  const techGroupStats = [
    { name: 'DERMAGA & JETTY', count: 18450, icon: Factory },
    { name: 'SILO CEMENT & BULK', count: 24200, icon: Server },
    { name: 'PACKING PLANT & LOADER', count: 31280, icon: Building2 },
    { name: 'KILN & COAL MILL', count: 38940, icon: Wrench },
    { name: 'RAW MILL & CRUSHER', count: 22890, icon: Factory },
    { name: 'UTILITIES & ELECTRICAL', count: 14562, icon: ShieldCheck },
  ];

  return (
    <div className="w-full my-2 select-none space-y-4">
      {/* Top Banner & Control Strip */}
      <div className="skeuo-curved-shadow w-full">
        <div className="skeuo-panel-gloss rounded-lg p-4 sm:p-6 border border-[#b8bfc8]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#cbd1d8]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gradient-to-b from-[#3b434e] to-[#252a32] text-white shadow-md border border-white/20">
                <LayoutDashboard className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#242b35] tracking-tight">
                  Dashboard Master Data SAP Plant Maintenance
                </h2>
                <p className="text-xs text-[#6e7784] mt-0.5">
                  PT Semen Indonesia (Persero) Tbk · Integrasi Functional Location (PM) & Cost Center (CO)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Navigational Launchpads (Jalan Pintas ke Menu 2 & Menu 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {/* Shortcut to Funcloc SIG */}
            <div
              onClick={() => onNavigate('funcloc')}
              className="p-3.5 rounded-lg bg-white border border-[#bcc3cc] hover:border-[#8f9aa8] shadow-xs cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2b323c] flex items-center justify-center text-emerald-400 font-bold text-xs shadow">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#232932] group-hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                      <span>Buka Funcloc SIG</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-1 transition-transform" />
                    </h4>
                    <p className="text-[11px] text-[#6b7582]">
                      Jelajahi dan filter seluruh data Functional Location dengan filter bertingkat dan pencarian global.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shortcut to Cost Center/Mapping */}
            <div
              onClick={() => onNavigate('costcenter')}
              className="p-3.5 rounded-lg bg-white border border-[#bcc3cc] hover:border-[#8f9aa8] shadow-xs cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2b323c] flex items-center justify-center text-blue-400 font-bold text-xs shadow">
                    <GitFork className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#232932] group-hover:text-blue-800 transition-colors flex items-center gap-1.5">
                      <span>Buka Cost Center/Mapping</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-700 group-hover:translate-x-1 transition-transform" />
                    </h4>
                    <p className="text-[11px] text-[#6b7582]">
                      Kelola pemetaan pusat biaya SAP CO terhadap aset Funloc, ubah data secara langsung, dan tambahkan mapping baru.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Visual Breakdown Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel 1: Distribusi per Operating Company (OpCo) */}
        <div className="skeuo-curved-shadow">
          <div className="skeuo-panel-gloss rounded-lg p-4 sm:p-5 border border-[#b8bfc8] h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#cbd1d8]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#3c4451]" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#252c36]">
                    Distribusi Funloc per Operating Company (OpCo)
                  </h3>
                </div>
                <span className="text-[10.5px] text-[#6e7784] font-mono">
                  Total 150.322
                </span>
              </div>

              <div className="my-4 space-y-3">
                {opcoStats.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold font-mono text-[#242a33]">
                        {item.name}{' '}
                        <span className="font-normal font-sans text-[11px] text-[#6d7683]">
                          ({item.label})
                        </span>
                      </span>
                      <span className="font-mono text-[11.5px] text-[#333a44] font-semibold">
                        {item.count.toLocaleString('id-ID')} ({item.pct}%)
                      </span>
                    </div>
                    {/* Progress Bar with Bevel */}
                    <div className="w-full h-2.5 rounded-full bg-[#dbe0e7] overflow-hidden p-0.5 border border-[#c1c8d2] shadow-inner">
                      <div
                        className={`h-full rounded-full ${item.color} shadow-xs transition-all duration-500`}
                        style={{ width: `${item.pct * 1.8}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#cbd1d8] text-[11px] text-[#6d7684] flex items-center justify-between">
              <span>Sumber Data: Master Tabel SAP PM</span>
              <button
                onClick={() => onNavigate('funcloc')}
                className="text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                Lihat di Tabel Funloc →
              </button>
            </div>
          </div>
        </div>

        {/* Panel 2: Technical Group Breakdown & Master Data Guidelines */}
        <div className="skeuo-curved-shadow">
          <div className="skeuo-panel-gloss rounded-lg p-4 sm:p-5 border border-[#b8bfc8] h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#cbd1d8]">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#3c4451]" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#252c36]">
                    Kelompok Teknis Peralatan (Technical Group)
                  </h3>
                </div>
                <span className="text-[10.5px] text-[#6e7784] font-mono">
                  6 Klaster Utama
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 my-4">
                {techGroupStats.map((tg) => {
                  const Icon = tg.icon;
                  return (
                    <div
                      key={tg.name}
                      className="p-2.5 bg-white/70 rounded-md border border-[#ccd2da] flex items-center gap-2.5 shadow-xs"
                    >
                      <div className="p-1.5 rounded bg-[#ebf0f6] text-[#3b434e] border border-[#cbd2db]">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10.5px] font-bold text-[#272e38] truncate">
                          {tg.name}
                        </div>
                        <div className="text-[11px] font-mono text-[#5b6472] font-semibold">
                          ~{tg.count.toLocaleString('id-ID')} unit
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SAP Integration Notice Box */}
              <div className="p-3 bg-gradient-to-r from-[#eef2f7] to-[#e4e9f0] rounded-md border border-[#c6cdd7] text-xs text-[#444c57] space-y-1">
                <div className="font-bold text-[#272e38] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Petunjuk Pemeliharaan Master Data (SOP):</span>
                </div>
                <p className="text-[11px] text-[#636c79] leading-relaxed">
                  Semua Functional Location harus terikat pada Cost Center aktif. Gunakan menu <strong>Mode Edit di atas</strong> untuk memutakhirkan data, memperbarui penomoran hierarki SAP PM, atau mengalokasikan pusat biaya baru.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#cbd1d8] text-[11px] text-[#6d7684] flex items-center justify-between">
              <span>SOP Standar: SIG-PM-SOP-004</span>
              <button
                onClick={() => onNavigate('costcenter')}
                className="text-blue-800 font-bold hover:underline cursor-pointer"
              >
                Lihat Cost Center / Mapping →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
