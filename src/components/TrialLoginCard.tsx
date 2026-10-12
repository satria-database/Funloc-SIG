import React, { useState } from 'react';
import { Check, Lock } from 'lucide-react';

interface TrialLoginCardProps {
  onTrialLogin?: (email: string) => void;
  isIdnMode?: boolean;
}

export const TrialLoginCard: React.FC<TrialLoginCardProps> = ({
  onTrialLogin,
  isIdnMode = false,
}) => {
  const [email, setEmail] = useState('mitra.industri@perusahaan.co.id');
  const [password, setPassword] = useState('••••••••');
  const [selectedOption, setSelectedOption] = useState<'remember' | 'register'>('remember');
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTrialLogin) onTrialLogin(email);
    setMsg(isIdnMode ? 'Akses Trial 30 Hari Standarisasi Diaktifkan!' : 'Trial session activated successfully!');
    setTimeout(() => setMsg(null), 3500);
  };

  const handleCancel = () => {
    setEmail('');
    setPassword('');
    setMsg(isIdnMode ? 'Formulir dibersihkan' : 'Cleared');
    setTimeout(() => setMsg(null), 2000);
  };

  return (
    <div className="skeuo-curved-shadow-sm w-full select-none">
      <div className="skeuo-panel-gloss rounded-lg p-5 sm:p-6 border border-[#b8bfc8] relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left Column: Shield + Title + Description */}
          <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
            {/* 3D Chrome Shield Icon */}
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <img
                src="/src/assets/images/chrome_shield_1790215609253.jpg"
                alt="Chrome security shield"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain drop-shadow-md"
              />
            </div>

            <h3 className="text-xl sm:text-2xl font-semibold text-[#444c59] tracking-tight">
              {isIdnMode ? 'Akses Uji Coba 30 Hari' : '30 day trial'}
            </h3>

            <p className="mt-2 text-xs text-[#717b88] leading-relaxed">
              {isIdnMode
                ? 'Dapatkan akses penuh ke pangkalan data standar SNI, ISO, IEC, dan pedoman teknis regulasi industri selama 30 hari tanpa biaya untuk riset dan standardisasi produk Anda.'
                : 'Lorem ipsum dolor sit amet, commodo et, tristique urna lorem sed pellentesque ac sollicitudin. Pede morbi leo curabitur laoreet ridiculus. Ante lacus. Vivamus quis penatibus, sed fusce ametin'}
            </p>
          </div>

          {/* Right Column: Form with Inset Inputs, Radios, and Buttons */}
          <div className="md:col-span-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              {/* Email Inset Input */}
              <div className="relative">
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

              {/* Password Inset Input */}
              <div className="relative">
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

              {/* Radios: Remember me & Register now */}
              <div className="flex flex-col gap-1 text-[11px] font-medium text-[#4f5661] my-0.5">
                <label
                  onClick={() => setSelectedOption('remember')}
                  className="flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <div className={`skeuo-radio-box ${selectedOption === 'remember' ? 'active' : ''}`}>
                    <div className="dot" />
                  </div>
                  <span>{isIdnMode ? 'Ingat sesi saya' : 'Remember me'}</span>
                </label>
                <label
                  onClick={() => setSelectedOption('register')}
                  className="flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <div className={`skeuo-radio-box ${selectedOption === 'register' ? 'active' : ''}`}>
                    <div className="dot" />
                  </div>
                  <span>{isIdnMode ? 'Daftar akun baru' : 'Register now'}</span>
                </label>
              </div>

              {/* Buttons: Login and Cancel */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="submit"
                  className="skeuo-btn-convex flex-1 py-1.5 text-xs font-bold"
                >
                  {isIdnMode ? 'Masuk' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="skeuo-btn-convex flex-1 py-1.5 text-xs font-semibold text-[#5a626f]"
                >
                  {isIdnMode ? 'Batal' : 'Cancel'}
                </button>
              </div>

              {/* Forgot password link */}
              <div className="text-center mt-1">
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setMsg(isIdnMode ? 'Tautan reset sandi dikirimkan ke email terdaftar.' : 'Password reset link sent to your email.');
                    setTimeout(() => setMsg(null), 3000);
                  }}
                  className="text-[10px] text-[#6d7582] hover:text-[#2f353e] hover:underline"
                >
                  {isIdnMode ? 'Lupa kata sandi Anda? klik di sini' : 'Forgot your password? click here'}
                </a>
              </div>
            </form>

            {msg && (
              <div className="mt-2 p-2 bg-[#2d333c] text-white text-[11px] rounded text-center border border-white/20">
                {msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
