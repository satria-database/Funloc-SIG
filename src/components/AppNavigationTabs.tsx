import React from 'react';
import {
  LayoutDashboard,
  Database,
  GitFork,
  Pencil,
  CheckCircle,
} from 'lucide-react';

export type ActiveNavMenu = 'dashboard' | 'funcloc' | 'costcenter';

interface AppNavigationTabsProps {
  activeMenu: ActiveNavMenu;
  onSelectMenu: (menu: ActiveNavMenu) => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  totalFunlocCount: number;
  totalCostCenterCount: number;
}

export const AppNavigationTabs: React.FC<AppNavigationTabsProps> = ({
  activeMenu,
  onSelectMenu,
  isEditMode,
  onToggleEditMode,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveNavMenu,
      title: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'funcloc' as ActiveNavMenu,
      title: 'Funcloc SIG',
      icon: Database,
    },
    {
      id: 'costcenter' as ActiveNavMenu,
      title: 'Cost Center/Mapping',
      icon: GitFork,
    },
  ];

  return (
    <div className="w-full my-2.5 select-none">
      {/* Top Folder-Style Nav Tabs without numbers, without sub-menus */}
      <div className="flex items-end justify-between px-2 sm:px-3 gap-2 flex-wrap border-b border-[#b8bfc8]">
        {/* Menu Tabs: Dashboard, Funcloc SIG, Cost Center/Mapping */}
        <div className="flex items-end gap-1 sm:gap-1.5 -mb-[1px]">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMenu(item.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-t-lg transition-all relative cursor-pointer border border-[#b8bfc8] ${
                  isActive
                    ? 'bg-white border-b-white shadow-[0_-2px_6px_rgba(0,0,0,0.08)] z-10 font-bold text-[#1a202c]'
                    : 'bg-[#dfe4eb] hover:bg-[#edf1f6] border-b-[#b8bfc8] text-[#525b68] hover:text-[#202631]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-emerald-700' : 'text-[#636c7a]'
                  }`}
                />
                <span className="text-xs sm:text-sm tracking-tight whitespace-nowrap">
                  {item.title}
                </span>

                {isActive && (
                  <div className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-white z-20" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
