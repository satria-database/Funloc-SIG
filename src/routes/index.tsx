import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppNavigationTabs, type ActiveNavMenu } from "@/components/AppNavigationTabs";
import { DashboardView } from "@/components/DashboardView";
import { FunlocDataView } from "@/components/FunlocDataView";
import { CostCenterMappingView } from "@/components/CostCenterMappingView";
import { SettingsModal } from "@/components/SettingsModal";
import { getLocalCostCenterData } from "@/data/costCenterData";
import {
  fetchLiveSupabaseData,
  getLocalFunlocData,
  getStoredSupabaseConfig,
  type FunlocRecord,
  KNOWN_DATABASE_TOTAL,
} from "@/lib/supabase";
import { CheckCircle, ShieldCheck, Settings as SettingsIcon, LogOut, Users } from "lucide-react";
import { LoginScreen } from "@/components/LoginScreen";
import { UserManagementModal } from "@/components/UserManagementModal";
import { emailToUsername, getAuthClient, getRole, useAuthSession } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FUNLOC SIG — Portal Data Master Functional Location & Cost Center" },
      {
        name: "description",
        content:
          "Portal Data Master Functional Location (PM) & Cost Center (CO) PT Semen Indonesia (Persero) Tbk. Jelajahi, cari, dan kelola 150.000+ data master Funloc SIG dan pemetaan Cost Center.",
      },
      {
        property: "og:title",
        content: "FUNLOC SIG — Portal Data Master Functional Location & Cost Center",
      },
      {
        property: "og:description",
        content:
          "Portal Data Master Functional Location (PM) & Cost Center (CO) PT Semen Indonesia (Persero) Tbk.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { session, loading } = useAuthSession();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-xs text-[#5a6370]">Memuat...</div>;
  if (!session) return <LoginScreen />;
  return <Portal userId={session.user.id} username={emailToUsername(session.user.email)} isAdmin={getRole(session) === "admin"} />;
}

function Portal({ userId, username, isAdmin }: { userId: string; username: string; isAdmin: boolean }) {
  const [showUsers, setShowUsers] = useState(false);
  // Navigation Menu State (Dashboard, Funcloc SIG, Cost Center/Mapping)
  const [activeMenu, setActiveMenu] = useState<ActiveNavMenu>("dashboard");

  // Global Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);

  // Cross-navigation filter state
  const [funlocFilterFromCC, setFunlocFilterFromCC] = useState<string>("");
  const [opcoFilterFromNav, setOpcoFilterFromNav] = useState<string>("Semua");
  const [departmentFilterFromNav, setDepartmentFilterFromNav] = useState<string>("Semua");

  // Setting Modal State
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Data & Funloc State
  const [funlocData, setFunlocData] = useState<FunlocRecord[]>([]);
  const [isLoadingFunloc, setIsLoadingFunloc] = useState(false);
  const [isConnectedLive, setIsConnectedLive] = useState(true);
  const [supabaseTableName, setSupabaseTableName] = useState("Funloc All SIG");
  const [totalFunlocCount, setTotalFunlocCount] = useState<number>(KNOWN_DATABASE_TOTAL);
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  // Cost Center count
  const [costCenterCount, setCostCenterCount] = useState<number>(() =>
    getLocalCostCenterData().length
  );

  // Toggle Edit Mode handler
  const handleToggleEditMode = () => {
    if (!isAdmin) {
      setBannerAlert("Akun Anda berrole View: hanya dapat melihat data, tidak dapat mengedit.");
      setTimeout(() => setBannerAlert(null), 3500);
      return;
    }
    setIsEditMode((prev) => {
      const next = !prev;
      setBannerAlert(
        next
          ? "Mode Edit Diaktifkan: Anda kini dapat mengedit seluruh data pada tabel dan formulir."
          : "Mode Edit Dinonaktifkan: Data master kembali ke mode tampilan baca."
      );
      setTimeout(() => setBannerAlert(null), 3500);
      return next;
    });
  };

  // Load Funloc Data
  const loadFunlocData = useCallback(async () => {
    setIsLoadingFunloc(true);
    const config = getStoredSupabaseConfig();
    setSupabaseTableName(config.tableName || "Funloc All SIG");

    if (config.url) {
      const res = await fetchLiveSupabaseData(config);
      if (res.success && res.data.length > 0) {
        setFunlocData(res.data);
        setIsConnectedLive(true);
        const total = res.count || KNOWN_DATABASE_TOTAL;
        setTotalFunlocCount(total);
        setBannerAlert(
          `Terhubung langsung ke database: seluruh ${total.toLocaleString(
            "id-ID"
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
            <span className="text-[#39414d]">{username} · <b>{isAdmin ? "Admin" : "View"}</b></span>
            {isAdmin && (
              <button
                onClick={() => setShowUsers(true)}
                className="skeuo-btn-convex px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-[#2c333e]"
              >
                <Users className="w-3.5 h-3.5 text-[#545e6d]" />
                <span>Kelola Akun</span>
              </button>
            )}
            {isAdmin && <button
              onClick={() => setShowSettingsModal(true)}
              className="skeuo-btn-convex px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-[#2c333e] hover:text-black hover:bg-black/5"
              title="Pengaturan Koneksi dan Sumber Data Master"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-[#545e6d]" />
              <span>Setting</span>
            </button>}
            <button
              onClick={() => getAuthClient().auth.signOut()}
              className="skeuo-btn-convex px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-[#2c333e]"
            >
              <LogOut className="w-3.5 h-3.5 text-[#545e6d]" />
              <span>Logout</span>
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
        isEditMode={isAdmin && isEditMode}
        onToggleEditMode={handleToggleEditMode}
        totalFunlocCount={totalFunlocCount}
        totalCostCenterCount={costCenterCount}
      />

      {/* Active Menu Content View */}
      <main className="w-full">
        {/* Dashboard View */}
        {activeMenu === "dashboard" && (
          <DashboardView
            totalFunlocCount={totalFunlocCount}
            totalCostCenterCount={costCenterCount}
            onNavigate={(target, filter) => {
              if (filter?.opco !== undefined) setOpcoFilterFromNav(filter.opco);
              if (filter?.department !== undefined)
                setDepartmentFilterFromNav(filter.department);
              if (filter?.funlocPrefix !== undefined)
                setFunlocFilterFromCC(filter.funlocPrefix);
              setActiveMenu(target);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            isEditMode={isAdmin && isEditMode}
            onToggleEditMode={handleToggleEditMode}
            onRefreshData={loadFunlocData}
            isLoading={isLoadingFunloc}
          />
        )}

        {/* Funcloc SIG View */}
        {activeMenu === "funcloc" && (
          <FunlocDataView
            data={funlocData}
            isLoading={isLoadingFunloc}
            onRefresh={loadFunlocData}
            isConnectedLive={isConnectedLive}
            tableName={supabaseTableName}
            isEditMode={isAdmin && isEditMode}
            onToggleEditMode={handleToggleEditMode}
            initialFunlocFilter={funlocFilterFromCC}
            initialOpcoFilter={opcoFilterFromNav}
            initialDepartmentFilter={departmentFilterFromNav}
          />
        )}

        {/* Cost Center/Mapping View */}
        {activeMenu === "costcenter" && (
          <CostCenterMappingView
            isEditMode={isAdmin && isEditMode}
            onToggleEditMode={handleToggleEditMode}
            onSwitchToFunlocWithFilter={(prefix) => {
              setFunlocFilterFromCC(prefix);
              setOpcoFilterFromNav("Semua");
              setDepartmentFilterFromNav("Semua");
              setActiveMenu("funcloc");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      <UserManagementModal isOpen={showUsers} onClose={() => setShowUsers(false)} myId={userId} />
      {/* Setting Modal Dialog */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onConfigSaved={loadFunlocData}
      />
    </div>
  );
}
