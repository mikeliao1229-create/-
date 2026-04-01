"use client";

import { useState } from "react";
import { Users, BarChart3, Activity, AlertTriangle, Shield, TrendingUp, DollarSign, Plus } from "lucide-react";

const themes = {
  dark: {
    pageBg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    cardBg: "rgba(30, 41, 59, 0.7)",
    cardBorder: "rgba(255, 255, 255, 0.1)",
    cardShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    title: "#f8fafc",
    subtitle: "#94a3b8",
    divider: "rgba(255, 255, 255, 0.06)",
  },
  light: {
    pageBg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    cardBg: "rgba(255, 255, 255, 0.8)",
    cardBorder: "rgba(0, 0, 0, 0.05)",
    cardShadow: "0 8px 32px rgba(99, 102, 241, 0.05)",
    title: "#1e293b",
    subtitle: "#64748b",
    divider: "rgba(0, 0, 0, 0.05)",
  }
};

export default function SuperAdminDashboard({ isDark = true, user }: { isDark?: boolean; user: any }) {
  const t = isDark ? themes.dark : themes.light;

  if (user.role !== "SUPER_ADMIN" && user.role !== "OWNER") {
    return (
      <div style={{ height: "100%", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center", color: t.title, flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield size={40} color="#ef4444" />
        </div>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.5rem" }}>存取權限受限</h2>
          <p style={{ color: t.subtitle, fontSize: "1.1rem" }}>您目前的角色 ({user.role}) 無法存取管理後台。</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", background: t.pageBg, padding: "2rem", fontFamily: "'Inter', sans-serif", boxSizing: "border-box", transition: "all 0.4s ease", overflowY: "auto" }}>
      <style>{`
        .glass-card { background: ${t.cardBg}; border: 1px solid ${t.cardBorder}; backdrop-filter: blur(12px); border-radius: 24px; box-shadow: ${t.cardShadow}; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .vendor-item { padding: 1.25rem; border-bottom: 1px solid ${t.divider}; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; }
        .vendor-item:hover { background: rgba(255,255,255,0.02); }
        .vendor-item:last-child { border-bottom: none; }
        .stat-value { font-size: 2rem; font-weight: 800; color: ${t.title}; line-height: 1.2; }
      `}</style>
      
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <div>
             <h1 style={{ color: t.title, fontSize: "2.25rem", fontWeight: 800, margin: 0, letterSpacing: "-0.03em" }}>
               {user.role === "SUPER_ADMIN" ? "系統全域控制台" : "公司管理中心"}
             </h1>
             <p style={{ color: t.subtitle, margin: "0.5rem 0 0", fontSize: "1.1rem" }}>即時數據監測與結構化管理</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
             <div style={{ padding: "8px 16px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", fontSize: "0.85rem", fontWeight: 700, border: "1px solid rgba(16, 185, 129, 0.2)" }}>系統運行正常</div>
          </div>
        </header>

        {/* Global Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "2.5rem" }}>
          {[
            { label: "活躍使用者", value: "128", icon: <Users size={20} />, color: "#6366f1" },
            { label: "本月簽約額", value: "$42.5k", icon: <DollarSign size={20} />, color: "#10b981" },
            { label: "系統負載", value: "24%", icon: <Activity size={20} />, color: "#fbbf24" },
            { label: "待處理警報", value: "0", icon: <AlertTriangle size={20} />, color: "#f43f5e" },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{ padding: "1.75rem" }}>
               <div style={{ color: stat.color, marginBottom: "1rem" }}>{stat.icon}</div>
               <div className="stat-value">{stat.value}</div>
               <div style={{ fontSize: "0.85rem", color: t.subtitle, marginTop: "6px", fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Level 1: Vendor Management Section (Only for Super Admin) */}
        {user.role === "SUPER_ADMIN" && (
          <div className="glass-card" style={{ padding: "2rem", marginBottom: "2.5rem", background: isDark ? "rgba(99, 102, 241, 0.03)" : "rgba(99, 102, 241, 0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
               <h2 style={{ color: t.title, fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>旗下廠商管理 (Level 2)</h2>
               <button style={{ padding: "10px 20px", borderRadius: "14px", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", color: "white", fontSize: "0.9rem", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)" }}>+ 新增廠商帳號</button>
            </div>
            <div style={{ borderRadius: "16px", overflow: "hidden", border: `1px solid ${t.divider}` }}>
              {[
                { name: "浩宇國際物流", code: "H-LOGI", users: 12, status: "正常營運", date: "2024-12-31" },
                { name: "日本代購王", code: "J-KING", users: 8, status: "合約到期", date: "2023-11-15" },
                { name: "星空跨境電商", code: "S-SHOP", users: 54, status: "正常營運", date: "2025-06-30" },
              ].map(v => (
                <div key={v.code} className="vendor-item">
                  <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#6366f1" }}>{v.code.charAt(0)}</div>
                    <div>
                      <div style={{ color: t.title, fontWeight: 700, fontSize: "1rem" }}>{v.name}</div>
                      <div style={{ color: t.subtitle, fontSize: "0.8rem" }}>代號: {v.code} | 人員: {v.users} 名 | 期限: {v.date}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: v.status === "正常營運" ? "#10b981" : "#f43f5e", padding: "4px 12px", borderRadius: "10px", background: v.status === "正常營運" ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)" }}>{v.status}</span>
                    <button style={{ background: "transparent", border: `1px solid ${t.cardBorder}`, color: t.title, padding: "8px 16px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>數據管理</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts and Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "2rem" }}>
          <div className="glass-card" style={{ padding: "2.5rem" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h3 style={{ color: t.title, fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>全系統流量趨勢 (Traffic)</h3>
                <TrendingUp size={20} color="#10b981" />
             </div>
             <div style={{ height: "240px", display: "flex", alignItems: "flex-end", gap: "16px", padding: "0 10px", position: "relative" }}>
                {[45, 60, 45, 80, 95, 75, 40, 55, 70, 85].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: `linear-gradient(to top, ${i === 4 ? "#6366f1" : "rgba(99, 102, 241, 0.2)"}, rgba(99, 102, 241, 0.5))`, borderRadius: "8px 8px 0 0", transition: "height 1s ease" }} />
                ))}
             </div>
             <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", padding: "0 10px" }}>
                {["10/16", "10/18", "10/20", "10/22", "10/24"].map(d => <span key={d} style={{ fontSize: "0.8rem", color: t.subtitle, fontWeight: 500 }}>{d}</span>)}
             </div>
          </div>

          <div className="glass-card" style={{ padding: "2.5rem" }}>
             <h3 style={{ color: t.title, fontSize: "1.25rem", fontWeight: 700, marginBottom: "2rem" }}>資源佔比 (Resources)</h3>
             <div style={{ position: "relative", width: "160px", height: "160px", margin: "0 auto 2.5rem" }}>
                <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                   <circle cx="18" cy="18" r="16" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"} strokeWidth="4" />
                   <circle cx="18" cy="18" r="16" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="75, 100" strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                   <div style={{ fontSize: "1.75rem", fontWeight: 800, color: t.title }}>75%</div>
                   <div style={{ fontSize: "0.75rem", color: t.subtitle, fontWeight: 700 }}>系統效率</div>
                </div>
             </div>
             <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
               {[
                 { label: "數據處理", color: "#6366f1", p: "45%" },
                 { label: "檔案存儲", color: "#10b981", p: "20%" },
                 { label: "通訊頻寬", color: "#f59e0b", p: "10%" }
               ].map(l => (
                 <div key={l.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                     <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: l.color }} />
                     <span style={{ fontSize: "0.9rem", color: t.subtitle, fontWeight: 600 }}>{l.label}</span>
                   </div>
                   <span style={{ color: t.title, fontWeight: 800, fontSize: "0.9rem" }}>{l.p}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
