import React, { useState } from 'react';
import { StandardItem } from '../data/standardsData.ts';
import { X, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ValidationTesterModalProps {
  standard: StandardItem | null;
  onClose: () => void;
  isIdnMode?: boolean;
}

export const ValidationTesterModal: React.FC<ValidationTesterModalProps> = ({
  standard,
  onClose,
  isIdnMode = false,
}) => {
  if (!standard) return null;

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({
    [standard.parameters[0]?.name || 'param1']: standard.parameters[0]?.targetValue || '100',
    [standard.parameters[1]?.name || 'param2']: standard.parameters[1]?.targetValue || '50',
    [standard.parameters[2]?.name || 'param3']: standard.parameters[2]?.targetValue || '20',
  });

  const [testResult, setTestResult] = useState<{
    status: 'passed' | 'failed' | null;
    score: number;
    notes: string;
  } | null>(null);

  const handleInputChange = (paramName: string, val: string) => {
    setInputValues((prev) => ({ ...prev, [paramName]: val }));
    setTestResult(null);
  };

  const runVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // Verify parameters against standard tolerances
    let passedCount = 0;
    standard.parameters.forEach((param) => {
      const userVal = parseFloat(inputValues[param.name] || '0');
      const target = parseFloat(param.targetValue);
      if (!isNaN(userVal) && !isNaN(target)) {
        if (param.tolerance.includes('≤')) {
          const max = parseFloat(param.tolerance.replace('≤', ''));
          if (userVal <= max) passedCount++;
        } else if (param.tolerance.includes('≥')) {
          const min = parseFloat(param.tolerance.replace('≥', ''));
          if (userVal >= min) passedCount++;
        } else {
          const diff = Math.abs(userVal - target);
          if (diff <= target * 0.1) passedCount++;
        }
      } else {
        passedCount++;
      }
    });

    const total = standard.parameters.length || 1;
    const score = Math.round((passedCount / total) * 100);
    const isPass = score >= 75;

    setTestResult({
      status: isPass ? 'passed' : 'failed',
      score,
      notes: isPass
        ? 'Spesifikasi produk memenuhi toleransi ambang batas standar SNI.'
        : 'Nilai parameter menyimpang dari ambang batas toleransi yang diwajibkan.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px]">
      <div className="skeuo-curved-shadow max-w-xl w-full">
        <div className="skeuo-panel-gloss rounded-lg border border-[#a8b0ba] p-6 text-[#343b44] shadow-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#cbd1d8]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#3e4550]" />
              <div>
                <h3 className="text-base font-bold text-[#323942]">
                  {isIdnMode ? 'Uji Kepatuhan Parameter Standar' : 'Standard Parameter Compliance Test'}
                </h3>
                <span className="text-xs font-mono text-[#6c7480]">{standard.code}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#6b7380] hover:text-black hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={runVerification} className="mt-4 space-y-4">
            <div className="text-xs text-[#555d69] bg-white/70 p-3 rounded border border-[#ccd2da]">
              <strong>{standard.title}</strong>
              <div className="text-[11px] text-[#717a86] mt-1">{standard.summary}</div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-[#444c58] tracking-wide">
                {isIdnMode ? 'Parameter Teknis Pengujian' : 'Technical Test Parameters'}
              </div>

              {standard.parameters.map((param) => (
                <div
                  key={param.name}
                  className="grid grid-cols-12 gap-2 items-center text-xs bg-gradient-to-r from-[#eef1f5] to-[#f7f8fa] p-2.5 rounded border border-[#d2d7de]"
                >
                  <div className="col-span-5 font-semibold text-[#3b434f]">
                    {param.name}
                    <div className="text-[10px] text-[#757e8a] font-normal">
                      Acuan: {param.targetValue} {param.unit} (Tol: {param.tolerance})
                    </div>
                  </div>

                  <div className="col-span-7 flex items-center gap-2">
                    <input
                      type="text"
                      value={inputValues[param.name] ?? ''}
                      onChange={(e) => handleInputChange(param.name, e.target.value)}
                      className="skeuo-inset-input flex-1 px-2.5 py-1 text-xs font-mono"
                      placeholder={param.targetValue}
                    />
                    <span className="text-[11px] text-[#69727e] font-mono shrink-0 w-10">
                      {param.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Result Box */}
            {testResult && (
              <div
                className={`p-3 rounded border text-xs flex items-center gap-3 transition-all ${
                  testResult.status === 'passed'
                    ? 'bg-[#e7f4e9] border-[#9fd3a7] text-[#1c5c27]'
                    : 'bg-[#fdf0ed] border-[#eeb6ad] text-[#8c2415]'
                }`}
              >
                {testResult.status === 'passed' ? (
                  <CheckCircle className="w-5 h-5 shrink-0 text-[#297a38]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0 text-[#a93220]" />
                )}
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span>
                      {testResult.status === 'passed' ? 'LOLOS STANDAR SNI' : 'TIDAK LOLOS STANDAR'}
                    </span>
                    <span className="text-[11px] font-mono bg-white/80 px-1.5 py-0.5 rounded">
                      Kesesuaian: {testResult.score}%
                    </span>
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-90">{testResult.notes}</div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#cbd1d8]">
              <button
                type="button"
                onClick={onClose}
                className="skeuo-btn-convex px-4 py-1.5 text-xs text-[#555d69]"
              >
                {isIdnMode ? 'Tutup' : 'Close'}
              </button>
              <button
                type="submit"
                className="skeuo-btn-convex px-5 py-1.5 text-xs font-bold text-[#323944]"
              >
                {isIdnMode ? 'Jalankan Verifikasi' : 'Run Verification'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
