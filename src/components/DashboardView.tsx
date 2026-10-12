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
  onNavigate: (
    menu: ActiveNavMenu,
    filter?: { opco?: string; department?: string; funlocPrefix?: string }
  ) => void;
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
  // OpCo breakdown data grounded on exact Supabase database counts (Total 150,322)
  // SBI: Solusi Bangun Indonesia
  const opcoStats = [
    {
      name: 'SBI NAROGONG',
      label: 'Solusi Bangun Indonesia (Plant Narogong)',
      count: 59117,
      pct: 39.3,
      color: 'bg-emerald-600',
    },
    {
      name: 'SBI CILACAP',
      label: 'Solusi Bangun Indonesia (Plant Cilacap)',
      count: 31661,
      pct: 21.1,
      color: 'bg-blue-600',
    },
    {
      name: 'SBI TQ',
      label: 'Solusi Bangun Indonesia (Tuban Quarry)',
      count: 22515,
      pct: 15.0,
      color: 'bg-amber-600',
    },
    {
      name: 'GHOPO',
      label: 'Group Head of Plant Operation (Gresik & Tuban)',
      count: 12928,
      pct: 8.6,
      color: 'bg-indigo-600',
    },
    {
      name: 'SBA LHOKNGA',
      label: 'Solusi Bangun Andalas (Plant Lhoknga)',
      count: 9403,
      pct: 6.3,
      color: 'bg-teal-600',
    },
    {
      name: 'ST',
      label: 'PT Semen Tonasa (Pangkep & Biringkassi)',
      count: 7966,
      pct: 5.3,
      color: 'bg-cyan-600',
    },
    {
      name: 'SP',
      label: 'PT Semen Padang (Indarung)',
      count: 4444,
      pct: 3.0,
      color: 'bg-rose-600',
    },
    {
      name: 'SG',
      label: 'PT Semen Gresik (Pabrik Rembang)',
      count: 1260,
      pct: 0.8,
      color: 'bg-purple-600',
    },
    {
      name: 'TLCC',
      label: 'Thang Long Cement Company (Vietnam)',
      count: 869,
      pct: 0.6,
      color: 'bg-violet-600',
    },
    {
      name: 'SMBR',
      label: 'PT Semen Baturaja Tbk (Pabrik Baturaja)',
      count: 159,
      pct: 0.1,
      color: 'bg-slate-600',
    },
  ];

  // Departmen & Technical Clusters grounded on real database counts
  const techGroupStats = [
    {
      name: 'CLINKER PRODUCTION',
      label: 'Pyroprocess, Kiln Feed, Clinker Conveying & Coal',
      count: 34871,
      pct: 23.2,
      icon: Wrench,
      color: 'bg-amber-600',
    },
    {
      name: 'CEMENT PRODUCTION',
      label: 'Cement Grinding Mill, Additives & Cement Transport',
      count: 23854,
      pct: 15.9,
      icon: Server,
      color: 'bg-indigo-600',
    },
    {
      name: 'CEMENT PACKING & SHIPPING',
      label: 'Rotary Packer, Silo Cement, Bulk Loader & Port',
      count: 23734,
      pct: 15.8,
      icon: Building2,
      color: 'bg-orange-600',
    },
    {
      name: 'TAMBANG',
      label: 'Limestone Crushing, Clay Crushing & Quarry Fleet',
      count: 17055,
      pct: 11.3,
      icon: Factory,
      color: 'bg-blue-600',
    },
    {
      name: 'RAW MEAL PREPARATION',
      label: 'Raw Material Feeding, Reclaim, Raw Mill & Transport',
      count: 15699,
      pct: 10.4,
      icon: Factory,
      color: 'bg-emerald-600',
    },
    {
      name: 'UTILITIES & ELECTRICAL',
      label: 'Power Plant, Substation, PLTU AB, WHRPG & Kompresor',
      count: 12515,
      pct: 8.3,
      icon: ShieldCheck,
      color: 'bg-teal-600',
    },
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

            {/* Live Status Indicator */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>150.322 Data Aktif</span>
              </span>
            </div>
          </div>

          {/* KPI Summary Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3.5 pb-2">
            <div className="p-3 bg-white rounded-lg border border-[#c2c8d2] shadow-xs">
              <span className="text-[10.5px] uppercase font-bold text-[#727a87] tracking-wider block">
                Total Master Funloc
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-[#1f252f] mt-0.5">
                {totalFunlocCount.toLocaleString('id-ID')}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">
                100% Terintegrasi Supabase
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#c2c8d2] shadow-xs">
              <span className="text-[10.5px] uppercase font-bold text-[#727a87] tracking-wider block">
                Operating Companies
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-[#1f252f] mt-0.5">
                10 OpCo
              </div>
              <span className="text-[10px] text-[#636c79] font-medium">
                SBI, SBA, GHOPO, ST, SP, SG, TLCC, SMBR
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#c2c8d2] shadow-xs">
              <span className="text-[10.5px] uppercase font-bold text-[#727a87] tracking-wider block">
                Departemen Pabrik
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-[#1f252f] mt-0.5">
                12 Departemen
              </div>
              <span className="text-[10px] text-[#636c79] font-medium">
                Clinker, Semen, Packing, Tambang, dll
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#c2c8d2] shadow-xs">
              <span className="text-[10.5px] uppercase font-bold text-[#727a87] tracking-wider block">
                Mapping Cost Center CO
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-[#1f252f] mt-0.5">
                {totalCostCenterCount} Klaster
              </div>
              <span className="text-[10px] text-blue-700 font-medium">
                Standardisasi Master Data SIG
              </span>
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
                      Jelajahi dan filter seluruh 150.322 data Functional Location dengan filter bertingkat OpCo, Line Plant, Departemen, dan Technical Group.
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
                      Kelola pemetaan pusat biaya SAP CO terhadap aset Funloc, ubah data secara langsung, dan alokasikan kode aktivitas standar.
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
                <span className="text-[10.5px] text-[#6e7784]">
                  Total 150.322 Data
                </span>
              </div>

              <div className="my-3 space-y-2.5">
                {opcoStats.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => onNavigate('funcloc', { opco: item.name })}
                    className="p-1.5 -mx-1.5 rounded hover:bg-black/5 transition-colors cursor-pointer group"
                    title={`Klik untuk melihat data ${item.name} di tabel Funloc SIG`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-[#242a33] group-hover:text-emerald-800 transition-colors">
                          {item.name}
                        </span>
                        <span className="font-normal text-[11px] text-[#6d7683] truncate">
                          ({item.label})
                        </span>
                      </div>
                      <span className="text-[11.5px] text-[#333a44] font-semibold shrink-0 ml-2">
                        {item.count.toLocaleString('id-ID')} ({item.pct}%)
                      </span>
                    </div>
                    {/* Progress Bar with Bevel */}
                    <div className="w-full h-2 rounded-full bg-[#dbe0e7] overflow-hidden p-0.5 border border-[#c1c8d2] shadow-inner">
                      <div
                        className={`h-full rounded-full ${item.color} shadow-xs transition-all duration-500`}
                        style={{ width: `${Math.min(100, item.pct * 2.5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#cbd1d8] text-[11px] text-[#6d7684] flex items-center justify-between">
              <span className="text-[10.5px] text-[#717b87]">
                Klik OpCo di atas untuk filter langsung ke Funloc
              </span>
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
                    Klaster Departemen & Unit Kerja Utama
                  </h3>
                </div>
                <span className="text-[10.5px] text-[#6e7784]">
                  6 Klaster Terbesar
                </span>
              </div>

              <div className="my-3 space-y-2.5">
                {techGroupStats.map((tg) => {
                  const Icon = tg.icon;
                  return (
                    <div
                      key={tg.name}
                      onClick={() => onNavigate('funcloc', { department: tg.name })}
                      className="p-2.5 bg-white/80 rounded-md border border-[#ccd2da] hover:border-[#8e98a6] hover:bg-white shadow-xs cursor-pointer group transition-all"
                      title={`Klik untuk filter departemen ${tg.name} di tabel Funloc SIG`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-1.5 rounded bg-[#ebf0f6] text-[#3b434e] border border-[#cbd2db] shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11.5px] font-bold text-[#272e38] group-hover:text-blue-800 transition-colors truncate">
                              {tg.name}
                            </div>
                            <div className="text-[10.5px] text-[#656e7b] truncate">
                              {tg.label}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-3">
                          <div className="text-xs font-bold text-[#242b35]">
                            {tg.count.toLocaleString('id-ID')} unit
                          </div>
                          <div className="text-[10px] text-[#717a86]">
                            {tg.pct}% total aset
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-[#e3e7ed] overflow-hidden mt-2">
                        <div
                          className={`h-full rounded-full ${tg.color}`}
                          style={{ width: `${tg.pct * 3.5}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-[#cbd1d8] text-[11px] text-[#6d7684] flex items-center justify-between">
              <span className="text-[10.5px] text-[#717b87]">
                Klik klaster di atas untuk filter langsung ke Funloc
              </span>
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
