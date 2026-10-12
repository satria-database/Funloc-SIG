import React, { useState } from 'react';
import { Check, Lock } from 'lucide-react';

interface SkeuoHeader3Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLoginSubmit?: (email: string, pass: string, mode: string) => void;
  isIdnMode?: boolean;
}

export const SkeuoHeader3: React.FC<SkeuoHeader3Props> = ({
  activeTab,
  onTabChange,
  onLoginSubmit,
  isIdnMode = false,
}) => {
  const [email, setEmail] = useState('auditor.sni@standarisasi.go.id');
  const [password, setPassword] = useState('••••••••');
  const [selectedOption, setSelectedOption] = useState<'remember' | 'register'>('remember');
  const [notif, setNotif] = useState<string | null>(null);

  const tabs = [
    { id: 'Home', label: 'Home', idn: 'Beranda', style: 'dark-lead' },
    { id: 'Services', label: 'Services', idn: 'Layanan', style: 'dark-sub' },
    { id: 'Company', label: 'Company', idn: 'Lembaga', style: 'dark-sub' },
    { id: 'Gallery', label: 'Gallery', idn: 'Katalog', style: 'light' },
    { id: 'News', label: 'News', idn: 'Berita', style: 'light' },
    { id: 'Contact us', label: 'Contact us', idn: 'Kontak', style: 'light' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginSubmit) onLoginSubmit(email, password, selectedOption);
    setNotif('Sesi Kredensial Standarisasi Aktif');
    setTimeout(() => setNotif(null), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 select-none">
      {/* Asymmetric / Angled Tabs Strip */}
      <div className="flex items-end pl-4 sm:pl-8 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isHome = tab.id === 'Home';

          let tabClasses = '';
          if (isHome) {
            tabClasses = 'skeuo-tab-dark rounded-tl-2xl rounded-tr-md text-base sm:text-lg font-semibold px-8 py-2.5';
          } else if (tab.style === 'dark-sub') {
            tabClasses = 'bg-gradient-to-b from-[#555d69] to-[#363c45] text-white border-t border-white/20 px-5 py-2 text-xs sm:text-sm font-medium rounded-t-md';
          } else {
            tabClasses = 'skeuo-tab-light text-[#575f6c] px-5 py-2 text-xs sm:text-sm font-medium rounded-t-md';
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`transition-all relative cursor-pointer ${tabClasses} ${
                isActive ? 'ring-1 ring-black/20 z-10 brightness-110' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <span>{isIdnMode ? tab.idn : tab.label}</span>
              {isActive && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white z-20" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Bar with Center Chrome Padlock and Form */}
      <div className="skeuo-curved-shadow relative z-10">
        <form
          onSubmit={handleSubmit}
          className="skeuo-panel-gloss rounded-lg px-4 sm:px-7 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm border border-[#b8bfc8]"
        >
          {/* Email Recessed Field */}
          <div className="relative flex-1 min-w-[150px] max-w-[210px]">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email address"
              className="skeuo-inset-input w-full px-3 py-1.5 pr-8 text-xs text-[#2e343c] placeholder-[#8c949f]"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5a8b5c]">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Chrome Padlock Icon between inputs */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#ffffff] via-[#e2e6eb] to-[#bcc2ca] border border-[#9fa6af] shadow-[0_1px_2px_rgba(0,0,0,0.25)] flex items-center justify-center shrink-0">
            <Lock className="w-3.5 h-3.5 text-[#3e4550] stroke-[2.5]" />
          </div>

          {/* Password Recessed Field */}
          <div className="relative flex-1 min-w-[150px] max-w-[210px]">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#727a85]">
              <Lock className="w-3 h-3 stroke-[2]" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="skeuo-inset-input w-full pl-8 pr-8 py-1.5 text-xs text-[#2e343c] placeholder-[#8c949f]"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5a8b5c]">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Stacked Radios */}
          <div className="flex flex-col gap-1 text-[11px] font-medium text-[#4f5661]">
            <label
              onClick={() => setSelectedOption('remember')}
              className="flex items-center gap-1.5 cursor-pointer select-none"
            >
              <div className={`skeuo-radio-box ${selectedOption === 'remember' ? 'active' : ''}`}>
                <div className="dot" />
              </div>
              <span>{isIdnMode ? 'Ingat saya' : 'Remember me'}</span>
            </label>
            <label
              onClick={() => setSelectedOption('register')}
              className="flex items-center gap-1.5 cursor-pointer select-none"
            >
              <div className={`skeuo-radio-box ${selectedOption === 'register' ? 'active' : ''}`}>
                <div className="dot" />
              </div>
              <span>{isIdnMode ? 'Daftar sekarang' : 'Register now'}</span>
            </label>
          </div>

          {/* Glossy Convex Login Button */}
          <button
            type="submit"
            className="skeuo-btn-convex px-7 py-2 text-sm font-bold min-w-[90px]"
          >
            {isIdnMode ? 'Masuk' : 'Login'}
          </button>
        </form>

        {notif && (
          <div className="absolute top-full right-4 mt-2 px-3 py-1 bg-[#282d35] text-white text-[11px] rounded shadow-md border border-white/20 z-30">
            {notif}
          </div>
        )}
      </div>
    </div>
  );
};
