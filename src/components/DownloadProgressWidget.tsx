import React, { useEffect, useState } from 'react';
import { ArrowDownToLine, CheckCircle2, RotateCcw } from 'lucide-react';

interface DownloadProgressWidgetProps {
  initialProgress?: number;
  activeFileName?: string;
  isIdnMode?: boolean;
}

export const DownloadProgressWidget: React.FC<DownloadProgressWidgetProps> = ({
  initialProgress = 50,
  activeFileName = 'SNI-ISO-27001-2022-Dataset.pdf',
  isIdnMode = false,
}) => {
  const [progress, setProgress] = useState(initialProgress);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isSimulating) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          return prev + 5;
        });
      }, 250);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  const toggleSimulate = () => {
    if (progress >= 100) {
      setProgress(0);
      setIsSimulating(true);
    } else {
      setIsSimulating(!isSimulating);
    }
  };

  const resetProgress = () => {
    setIsSimulating(false);
    setProgress(50);
  };

  // Circular gauge calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="skeuo-curved-shadow-sm w-full select-none">
      <div className="skeuo-panel-gloss rounded-lg px-6 py-4 flex flex-col justify-between border border-[#b8bfc8] relative overflow-hidden">
        {/* Main Content Row */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-[#424a56] tracking-tight">
              {isIdnMode ? 'Progres Unduhan' : 'Downloading progres'}
            </h4>
            <p className="text-xs text-[#717b88] mt-0.5">
              {isIdnMode ? activeFileName : 'lorem ipsum dolore'}
            </p>
            {isIdnMode && (
              <div className="mt-1 text-[11px] text-[#555d69] font-medium flex items-center gap-1.5">
                <span>Status:</span>
                {progress === 100 ? (
                  <span className="text-[#3c7840] font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 inline" /> Berkas Lengkap
                  </span>
                ) : (
                  <span>Mengunduh Spesifikasi Standar...</span>
                )}
              </div>
            )}
          </div>

          {/* Skeuomorphic Circular Dial Gauge */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center shrink-0">
            {/* Outer Beveled Rim */}
            <div className="absolute inset-0 rounded-full skeuo-dial-rim flex items-center justify-center p-1">
              <div className="w-full h-full rounded-full skeuo-dial-inner flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold text-[#3d4551] font-mono tabular-nums">
                  {progress}%
                </span>
              </div>
            </div>

            {/* SVG Circular Progress Ring Overlay */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 60 60"
            >
              {/* Background Track */}
              <circle
                cx="30"
                cy="30"
                r={radius}
                fill="none"
                stroke="#c5ccd6"
                strokeWidth="4"
              />
              {/* Active Progress Track */}
              <circle
                cx="30"
                cy="30"
                r={radius}
                fill="none"
                stroke="#4a5360"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-out"
              />
            </svg>
          </div>
        </div>

        {/* Action Controls for Interactive Verification */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#d8dce2] text-[11px] text-[#69727f]">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSimulate}
              className="skeuo-btn-convex px-2.5 py-1 text-[11px] font-medium flex items-center gap-1"
            >
              <ArrowDownToLine className="w-3 h-3 text-[#4b5360]" />
              <span>{isSimulating ? 'Jeda' : progress >= 100 ? 'Unduh Ulang' : 'Uji Unduh'}</span>
            </button>
            <button
              onClick={resetProgress}
              className="p-1 text-[#6b7380] hover:text-[#2d333b] hover:bg-black/5 rounded transition-colors"
              title="Reset ke 50%"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <span className="font-mono text-[10px] text-[#78828f] tabular-nums">
            {progress === 100 ? '4.1 MB / 4.1 MB' : `${((4.1 * progress) / 100).toFixed(1)} MB / 4.1 MB`}
          </span>
        </div>

        {/* Bottom Charcoal Accent Bar (as seen in mockup) */}
        <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#2c313a] via-[#48505e] to-[#2c313a]" />
      </div>
    </div>
  );
};
