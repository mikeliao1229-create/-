"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [companyCode, setCompanyCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  // 若已經登入，自動跳轉
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push("/");
    };
    checkUser();
  }, [router, supabase]);

  const handleGoogleLogin = async () => {
    if (!companyCode.trim()) {
      setErrorMsg("⚠️ 請填寫公司代號後進行安全性驗證");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setLoading(true);
    
    // 存儲代號到 Cookie
    document.cookie = `company_code=${companyCode}; path=/; max-age=3600; SameSite=Lax`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      setErrorMsg("🚫 驗證失敗: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10">
        {/* Error Message Toast */}
        {errorMsg && (
          <div className="absolute top-[-80px] left-0 right-0 animate-bounce">
            <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl text-red-400 px-6 py-4 rounded-2xl text-sm font-bold shadow-2xl text-center">
              {errorMsg}
            </div>
          </div>
        )}

        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-10 shadow-2xl text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-500/20">
            <Shield size={40} className="text-white" />
          </div>

          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">公司管理系統</h1>
          <p className="text-white/40 mb-10 text-lg font-medium">Enterprise Management System</p>

          <div className="space-y-6">
            <div className="text-left">
              <label className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] ml-1 mb-2 block">System Code / 公司代號</label>
              <input 
                type="text" 
                placeholder="請輸入公司代號"
                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-5 text-white font-bold placeholder:text-white/10 focus:border-indigo-500/50 focus:bg-white/10 transition-all outline-none"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
              />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-4 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
              {loading ? "正在同步安全數據..." : "驗證代號並使用 Google 登入"}
            </button>
            
            <div className="pt-6 border-t border-white/5">
              <p className="text-white/20 text-xs uppercase tracking-widest font-bold mb-4">雲端加密防護技術</p>
              <div className="flex justify-center gap-2">
                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-400">ADMIN-LEVEL</div>
                <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-400">AUTH BY GOOGLE</div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-white/20 text-sm">
          © 2026 企業核心管理系統. All rights reserved.
        </p>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background: #05070a; margin: 0; }
      `}</style>
    </div>
  );
}
