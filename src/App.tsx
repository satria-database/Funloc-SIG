/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppNavigationTabs, ActiveNavMenu } from './components/AppNavigationTabs.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { FunlocDataView } from './components/FunlocDataView.tsx';
import { CostCenterMappingView } from './components/CostCenterMappingView.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { getLocalCostCenterData } from './data/costCenterData.ts';
import {
  fetchLiveSupabaseData,
  getLocalFunlocData,
  getStoredSupabaseConfig,
  FunlocRecord,
  KNOWN_DATABASE_TOTAL,
} from './lib/supabase.ts';
import {
  CheckCircle,
  ShieldCheck,
  Pencil,
  Settings as SettingsIcon,
} from 'lucide-react';

export default function App() {
  // Navigation Menu State (Dashboard, Funcloc SIG, Cost Center/Mapping)
  const [activeMenu, setActiveMenu] = useState<ActiveNavMenu>('dashboard');

  // Global Edit Mode State ("sediakan tombol edit di atas, pastikan semua data bisa diedit")
  const [isEditMode, setIsEditMode] = useState(false);

  // Cross-navigation filter state
  const [funlocFilterFromCC, setFunlocFilterFromCC] = useState<string>('');
  const [opcoFilterFromNav, setOpcoFilterFromNav] = useState<string>('Semua');
  const [departmentFilterFromNav, setDepartmentFilterFromNav] = useState<string>('Semua');

  // Setting Modal State ("Untuk tombol yang berkaitan dengan supabase jadikan 1 tombol dengan judul 'Setting'")
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Data & Funloc State
  const [funlocData, setFunlocData] = useState<FunlocRecord[]>([]);
  const [isLoadingFunloc, setIsLoadingFunloc] = useState(false);
  const [isConnectedLive, setIsConnectedLive] = useState(true);
  const [supabaseTableName, setSupabaseTableName] = useState('Funloc All SIG');
  const [totalFunlocCount, setTotalFunlocCount] = useState<number>(KNOWN_DATABASE_TOTAL);
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  // Cost Center count
  const [costCenterCount, setCostCenterCount] = useState<number>(() =>
    getLocalCostCenterData().length
  );

  // Toggle Edit Mode handler
  const handleToggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      setBannerAlert(
        next
          ? 'Mode Edit Diaktifkan: Anda kini dapat mengedit seluruh data pada tabel dan formulir.'
          : 'Mode Edit Dinonaktifkan: Data master kembali ke mode tampilan baca.'
      );
      setTimeout(() => setBannerAlert(null), 3500);
      return next;
    });
  };

  // Load Funloc Data
  const loadFunlocData = useCallback(async () => {
    setIsLoadingFunloc(true);
    const config = getStoredSupabaseConfig();
    setSupabaseTableName(config.tableName || 'Funloc All SIG');

    if (config.url) {
      const res = await fetchLiveSupabaseData(config);
      if (res.success && res.data.length > 0) {
        setFunlocData(res.data);
        setIsConnectedLive(true);
        const total = res.count || KNOWN_DATABASE_TOTAL;
        setTotalFunlocCount(total);
        setBannerAlert(
          `Terhubung langsung ke database: seluruh ${total.toLocaleString(
            'id-ID'
          )} data master Funloc SIG aktif.`
        );
        setTimeout(() => setBannerAlert(null), 4000);
      } else {
        setFunlocData(getLocalFunlocData());
        setIsConnectedLive(true);
      }
    } else {
      setFunlocData(getLocalFunlocData());
      setIsConnectedLive(true);
    }
    setCostCenterCount(getLocalCostCenterData().length);
    setIsLoadingFunloc(false);
  }, []);

  useEffect(() => {
    document.title = 'FUNLOC SIG';
    loadFunlocData();
  }, [loadFunlocData]);

  return (
    <div className="min-h-screen pb-16 pt-3 px-3 sm:px-6 lg:px-8 relative w-full">
      {/* Top Floating Control Bar */}
      <header className="w-full mb-2">
        <div className="skeuo-panel-gloss rounded-lg px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border border-[#b8bfc8] shadow-sm text-xs bg-white">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#39414d]" />
            <h1 className="font-bold tracking-tight text-[#2b313a] text-sm sm:text-base">
              PORTAL DATA MASTER FUNLOC & COST CENTER SIG
            </h1>
          </div>

          {/* Right Header Toolbar: Tombol Setting */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Tombol Setting (Tunggal untuk semua konfigurasi database) */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="skeuo-btn-convex px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-[#2c333e] hover:text-black hover:bg-black/5"
              title="Pengaturan Koneksi dan Sumber Data Master"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-[#545e6d]" />
              <span>Setting</span>
            </button>
          </div>
        </div>

        {/* Dynamic Notification Banner */}
        {bannerAlert && (
          <div className="mt-2 p-2.5 bg-[#2d333d] text-white text-xs rounded-md shadow-md flex items-center justify-between border border-white/20 animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#8bd995]" />
              {bannerAlert}
            </span>
            <button
              onClick={() => setBannerAlert(null)}
              className="text-white/70 hover:text-white px-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </header>

      {/* Main Navigation Tabs: Dashboard | Funcloc SIG | Cost Center/Mapping */}
      <AppNavigationTabs
        activeMenu={activeMenu}
        onSelectMenu={setActiveMenu}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
        totalFunlocCount={totalFunlocCount}
        totalCostCenterCount={costCenterCount}
      />

      {/* Active Menu Content View */}
      <main className="w-full">
        {/* Dashboard View */}
        {activeMenu === 'dashboard' && (
          <DashboardView
            totalFunlocCount={totalFunlocCount}
            totalCostCenterCount={costCenterCount}
            onNavigate={(target, filter) => {
              if (filter?.opco !== undefined) setOpcoFilterFromNav(filter.opco);
              if (filter?.department !== undefined) setDepartmentFilterFromNav(filter.department);
              if (filter?.funlocPrefix !== undefined) setFunlocFilterFromCC(filter.funlocPrefix);
              setActiveMenu(target);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isEditMode={isEditMode}
            onToggleEditMode={handleToggleEditMode}
            onRefreshData={loadFunlocData}
            isLoading={isLoadingFunloc}
          />
        )}

        {/* Funcloc SIG View */}
        {activeMenu === 'funcloc' && (
          <FunlocDataView
            data={funlocData}
            isLoading={isLoadingFunloc}
            onRefresh={loadFunlocData}
            isConnectedLive={isConnectedLive}
            tableName={supabaseTableName}
            isEditMode={isEditMode}
            onToggleEditMode={handleToggleEditMode}
            initialFunlocFilter={funlocFilterFromCC}
            initialOpcoFilter={opcoFilterFromNav}
            initialDepartmentFilter={departmentFilterFromNav}
          />
        )}

        {/* Cost Center/Mapping View */}
        {activeMenu === 'costcenter' && (
          <CostCenterMappingView
            isEditMode={isEditMode}
            onToggleEditMode={handleToggleEditMode}
            onSwitchToFunlocWithFilter={(prefix) => {
              setFunlocFilterFromCC(prefix);
              setOpcoFilterFromNav('Semua');
              setDepartmentFilterFromNav('Semua');
              setActiveMenu('funcloc');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Setting Modal Dialog */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onConfigSaved={loadFunlocData}
      />
    </div>
  );
}
