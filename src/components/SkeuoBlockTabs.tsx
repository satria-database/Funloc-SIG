import React from 'react';

interface SkeuoBlockTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeBlock: number;
  onBlockSelect: (block: number) => void;
  isIdnMode?: boolean;
}

export const SkeuoBlockTabs: React.FC<SkeuoBlockTabsProps> = ({
  activeTab,
  onTabChange,
  activeBlock,
  onBlockSelect,
  isIdnMode = false,
}) => {
  const tabs = [
    { id: 'Home', label: 'Home', idn: 'Beranda', dark: true },
    { id: 'Services', label: 'Services', idn: 'Layanan', dark: false },
    { id: 'Company', label: 'Company', idn: 'Lembaga', dark: true },
    { id: 'Gallery', label: 'Gallery', idn: 'Katalog', dark: false },
    { id: 'News', label: 'News', idn: 'Berita', dark: false },
    { id: 'Contact us', label: 'Contact us', idn: 'Kontak', dark: false },
  ];

  const blocks = [
    {
      num: 1,
      title: isIdnMode ? 'Pencarian & Seleksi' : 'Home page',
      sub: isIdnMode ? 'Katalog SNI & Regulasi' : 'lorem ipsum dolore',
    },
    {
      num: 2,
      title: isIdnMode ? 'Validasi Spesifikasi' : 'About us',
      sub: isIdnMode ? 'Laboratorium Uji KAN' : 'lorem ipsum dolore',
    },
    {
      num: 3,
      title: isIdnMode ? 'Sertifikasi Terbit' : 'What we do for you',
      sub: isIdnMode ? 'Unduh Berkas Resmi' : 'lorem ipsum dolore',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-6 select-none">
      {/* Top Block Tabs */}
      <div className="flex items-end pl-4 sm:pl-8 gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-all relative cursor-pointer ${
                tab.dark
                  ? 'skeuo-tab-dark hover:brightness-110'
                  : 'skeuo-tab-light hover:brightness-105'
              } ${isActive ? 'ring-1 ring-black/20 z-10 brightness-105' : 'opacity-90'}`}
            >
              <span>{isIdnMode ? tab.idn : tab.label}</span>
              {isActive && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white z-20" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Base Bar with the 3 Square Badge Modules */}
      <div className="skeuo-curved-shadow relative z-10">
        <div className="skeuo-panel-gloss rounded-lg px-4 sm:px-8 py-4 grid grid-cols-3 divide-x divide-[#c7ced6] border border-[#b8bfc8]">
          {blocks.map((b) => {
            const isSelected = activeBlock === b.num;
            return (
              <div
                key={b.num}
                onClick={() => onBlockSelect(b.num)}
                className={`flex items-center gap-3 px-3 sm:px-6 cursor-pointer group transition-all ${
                  isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-95'
                }`}
              >
                {/* Recessed Square Bevel Badge */}
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center shrink-0 text-sm font-bold transition-transform ${
                    isSelected
                      ? 'skeuo-step-badge-square ring-2 ring-white/70 scale-105 shadow-md'
                      : 'bg-gradient-to-b from-[#6b7381] to-[#434954] text-white/90 shadow'
                  }`}
                >
                  {b.num}
                </div>

                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-[#3e4652] group-hover:text-black transition-colors truncate">
                    {b.title}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#717b88] truncate">
                    {b.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
