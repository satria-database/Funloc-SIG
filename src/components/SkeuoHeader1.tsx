import React from 'react';

interface SkeuoHeader1Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLoginSubmit?: (email: string, pass: string, mode: string) => void;
  isIdnMode?: boolean;
}

export const SkeuoHeader1: React.FC<SkeuoHeader1Props> = ({
  activeTab,
  onTabChange,
  isIdnMode = false,
}) => {
  const tabs = [
    { id: 'Funloc SIG', label: 'Funloc SIG', dark: true },
    { id: 'Standarisasi', label: isIdnMode ? 'Pangkalan SNI & ISO' : 'Standards Database', dark: true },
    { id: 'Services', label: isIdnMode ? 'Layanan SIG' : 'Services', dark: true },
    { id: 'Company', label: isIdnMode ? 'Semen Indonesia Group' : 'Company', dark: false },
    { id: 'Gallery', label: isIdnMode ? 'Katalog Peralatan' : 'Catalog', dark: false },
    { id: 'Contact us', label: isIdnMode ? 'Kontak & Dukungan' : 'Contact us', dark: false },
  ];

  return (
    <div className="w-full my-2">
      {/* Upper Tab Bar */}
      <div className="flex items-end pl-4 sm:pl-8 gap-[3px] select-none overflow-x-auto border-b-2 border-[#b0b8c4] pb-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all rounded-t-lg relative cursor-pointer shrink-0 ${
                tab.dark
                  ? 'skeuo-tab-dark hover:brightness-110'
                  : 'skeuo-tab-light hover:brightness-105'
              } ${isActive ? 'ring-1 ring-black/20 z-10 translate-y-[2px]' : 'opacity-90 hover:opacity-100'}`}
            >
              <span className="relative z-10">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-[#dde1e7] z-20" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

