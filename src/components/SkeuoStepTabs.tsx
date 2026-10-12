import React from 'react';

interface SkeuoStepTabsProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  isIdnMode?: boolean;
}

export const SkeuoStepTabs: React.FC<SkeuoStepTabsProps> = ({
  currentStep,
  onSelectStep,
  isIdnMode = false,
}) => {
  const steps = [
    {
      num: 1,
      title: isIdnMode ? 'Pencarian & Seleksi' : 'Home page',
      sub: isIdnMode ? 'Katalog SNI & Standar' : 'lorem ipsum dolore',
      stepLabel: 'STEP 1',
      stepSub: isIdnMode ? 'Pilih Komoditas' : 'lorem ipsum dolore',
    },
    {
      num: 2,
      title: isIdnMode ? 'Validasi Parameter' : 'About us',
      sub: isIdnMode ? 'Uji Batas Toleransi' : 'lorem ipsum dolore',
      stepLabel: 'STEP 2',
      stepSub: isIdnMode ? 'Simulasi Uji Mutu' : 'lorem ipsum dolore',
    },
    {
      num: 3,
      title: isIdnMode ? 'Penetapan & Sertifikasi' : 'What we do for you',
      sub: isIdnMode ? 'Unduh Berkas Resmi' : 'lorem ipsum dolore',
      stepLabel: 'STEP 3',
      stepSub: isIdnMode ? 'Terbit Akreditasi KAN' : 'lorem ipsum dolore',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-6 select-none">
      {/* Sculpted Folder-Style Top Tabs */}
      <div className="grid grid-cols-3 gap-2 px-3 sm:px-6">
        {steps.map((st) => {
          const isActive = currentStep === st.num;
          return (
            <button
              key={st.num}
              onClick={() => onSelectStep(st.num)}
              className={`text-center py-2.5 px-3 rounded-t-2xl transition-all relative cursor-pointer border border-b-0 border-[#bcc2cb] ${
                isActive
                  ? 'bg-gradient-to-b from-[#ffffff] via-[#f7f8fa] to-[#eceef2] shadow-[0_-2px_6px_rgba(0,0,0,0.08)] z-10'
                  : 'bg-gradient-to-b from-[#e8ecf0] to-[#d6dbe2] hover:from-[#f0f3f7] opacity-85 hover:opacity-100 z-0'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold text-[#434b55] leading-tight">
                {st.title}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#78828e] font-normal leading-none mt-0.5">
                {st.sub}
              </div>
              {isActive && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#eceef2] z-20" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Base Bar with the 3 STEP modules and realistic curved shadow */}
      <div className="skeuo-curved-shadow relative z-10">
        <div className="skeuo-panel-gloss rounded-lg px-4 sm:px-8 py-5 grid grid-cols-3 divide-x divide-[#c7ced6] border border-[#b8bfc8]">
          {steps.map((st) => {
            const isActive = currentStep === st.num;
            return (
              <div
                key={st.num}
                onClick={() => onSelectStep(st.num)}
                className={`flex items-center gap-2.5 sm:gap-4 px-2 sm:px-4 cursor-pointer group transition-all ${
                  isActive ? 'opacity-100' : 'opacity-70 hover:opacity-95'
                }`}
              >
                {/* Metallic Circular Step Badge */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-xs sm:text-sm transition-transform ${
                    isActive
                      ? 'skeuo-step-badge scale-105 ring-2 ring-white/60 shadow-md'
                      : 'bg-gradient-to-b from-[#5c6471] to-[#3a4049] text-white/90 shadow'
                  }`}
                >
                  {st.num}
                </div>

                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold tracking-wider text-[#3e4652] group-hover:text-black transition-colors flex items-center gap-1.5">
                    <span>{st.stepLabel}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3d434c] animate-pulse" />
                    )}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#717b88] truncate">
                    {st.stepSub}
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
