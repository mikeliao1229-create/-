"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Shield, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      console.error("Login error:", error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-10 shadow-2xl text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-500/20">
            <Shield size={40} className="text-white" />
          </div>

          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">星鏈系統</h1>
          <p className="text-white/40 mb-10 text-lg font-medium">Starlink Enterprise OS</p>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-4 hover:bg-white/90 active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              {loading ? "正在跳轉..." : "使用 Google 帳號登入"}
            </button>
            
            <div className="pt-6 border-t border-white/5">
              <p className="text-white/20 text-xs uppercase tracking-widest font-bold mb-4">企業級安全防護</p>
              <div className="flex justify-center gap-2">
                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-400">SOC2 COMPLIANT</div>
                <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-400">256-BIT AES</div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-white/20 text-sm">
          © 2026 Starlink Integration. All rights reserved.
        </p>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
