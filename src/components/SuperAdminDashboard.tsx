"use client";

import { useState } from "react";
import { Users, BarChart3, Activity, AlertTriangle, Shield, TrendingUp, DollarSign, Plus, Building2, Smartphone, Calendar, Hexagon, Edit3, Power, ChevronRight } from "lucide-react";

// ─── Theme tokens matching the Dashboard Screenshot ──────────────────────────
const themes = {
  dark: {
    pageBg: "#05070a",
    cardBg: "rgba(15, 20, 35, 0.6)",
    cardBorder: "rgba(255, 255, 255, 0.05)",
    cardShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
    title: "#ffffff",
    subtitle: "rgba(255, 255, 255, 0.45)",
    accent: "#6366f1",
    divider: "rgba(255, 255, 255, 0.05)",
  },
  light: {
    pageBg: "#f8fafc",
    cardBg: "rgba(255, 255, 255, 0.8)",
    cardBorder: "rgba(99, 102, 241, 0.1)",
    cardShadow: "0 10px 30px rgba(99, 102, 241, 0.05)",
    title: "#1e293b",
    subtitle: "#64748b",
    accent: "#6366f1",
    divider: "rgba(0, 0, 0, 0.05)",
  }
};

export default function SuperAdminDashboard({ isDark = true, user }: { isDark?: boolean; user: any }) {
  const t = isDark ? themes.dark : themes.light;

  if (user.role !== "SUPER_ADMIN" && user.role !== "OWNER") {
    return (
      <div style={{ height: "100%", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center", color: t.title, flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(231, 76, 60, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield size={40} color="#e74c3c" />
        </div>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.5rem" }}>存取權限受限</h2>
          <p style={{ color: t.subtitle, fontSize: "1.1rem" }}>您目前的角色 ({user.role}) 無法存取管理後台。</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100%", background: t.pageBg, padding: "2.5rem", fontFamily: "'Inter', sans-serif", boxSizing: "border-box", transition: "all 0.4s ease", overflowY: "auto", position: "relative", color: t.title }}>
      <style>{`
        .glass-card { background: ${t.cardBg}; border: 1px solid ${t.cardBorder}; backdrop-filter: blur(16px); border-radius: 12px; box-shadow: ${t.cardShadow}; transition: transform 0.2s; position: relative; z-index: 10; overflow: hidden; }
        .vendor-item { padding: 1.25rem 1.5rem; border-bottom: 1px solid ${t.divider}; display: flex; justify-content: space-between; align-items: center; transition: background 0.3s; }
        .vendor-item:hover { background: rgba(255,255,255,0.02); }
        .vendor-item:last-child { border-bottom: none; }
        .stat-label { font-size: 0.8rem; color: ${t.subtitle}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .stat-value { font-size: 2rem; font-weight: 800; color: ${t.title}; line-height: 1.2; letter-spacing: -0.02em; }
        .module-tag { padding: 3px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 700; margin-right: 6px; }
        .action-icon-btn { padding: 8px; border-radius: 8px; border: 1px solid ${t.cardBorder}; background: ${t.divider}; color: ${t.subtitle}; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .action-icon-btn:hover { background: rgba(99, 102, 241, 0.1); color: ${t.accent}; border-color: ${t.accent}33; }
        .primary-btn { padding: 10px 24px; border-radius: 8px; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; font-size: 0.85rem; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); display: flex; alignItems: center; gap: 8px; }
      `}</style>
      
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <div>
             <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <div style={{ padding: "10px", borderRadius: "12px", background: "rgba(99, 102, 241, 0.2)", color: t.accent }}><Hexagon size={24} fill={t.accent} fillOpacity={0.3} /></div>
                <h1 style={{ fontSize: "2.25rem", fontWeight: 800, margin: 0, letterSpacing: "-0.03em" }}>公司管理控制台</h1>
             </div>
             <p style={{ color: t.subtitle, margin: 0, fontSize: "1rem" }}>企業核心管理與功能授權模組</p>
          </div>
          <button className="primary-btn"><Building2 size={16} /> 新增企業客戶</button>
        </header>

        {/* Global Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "2.5rem" }}>
          {[
            { label: "活躍機場", value: "3", icon: <Building2 size={20} />, color: "#a855f7" },
            { label: "授權裝置總數", value: "95台", icon: <Smartphone size={20} />, color: "#06b6d4" },
            { label: "即將來臨", value: "1家", icon: <Calendar size={20} />, color: "#fbbf24" },
            { label: "模組使用數", value: "7個", icon: <Activity size={20} />, color: "#10b981" },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{ padding: "1.75rem" }}>
               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                 <div style={{ color: stat.color }}>{stat.icon}</div>
               </div>
               <div className="stat-label">{stat.label}</div>
               <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Enterprise Table */}
        <div className="glass-card">
           <div style={{ padding: "1.5rem", borderBottom: `1px solid ${t.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>企業管理列表</h3>
              <div style={{ fontSize: "0.8rem", color: t.subtitle }}>共 3 家企業合約</div>
           </div>
           
           <div style={{ overflowX: "auto" }}>
             <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
               <thead>
                 <tr style={{ fontSize: "0.75rem", color: t.subtitle, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                   <th style={{ padding: "1.25rem 1.5rem" }}>公司代號 / 名稱</th>
                   <th>授權模組</th>
                   <th>裝置上限</th>
                   <th>契約日</th>
                   <th style={{ textAlign: "right", paddingRight: "1.5rem" }}>操作</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   { code: "C001", name: "星鏈跨境電商", modules: ["差勤", "採購", "通訊"], limit: "50台", date: "2026-12-31", color: "#6366f1", status: "success" },
                   { code: "C002", name: "日系生活選物", modules: ["差勤"], limit: "15台", date: "2026-05-15", color: "#ec4899", status: "warning" },
                   { code: "C003", name: "藍圖科技整合", modules: ["差勤", "通訊"], limit: "30台", date: "2027-03-01", color: "#2563eb", status: "success" },
                 ].map((c) => (
                   <tr key={c.code} style={{ borderBottom: `1px solid ${t.divider}` }}>
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: `${c.color}22`, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem", border: `1px solid ${c.color}44` }}>{c.name.charAt(0)}</div>
                            <div>
                               <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{c.name}</div>
                               <div style={{ fontSize: "0.75rem", color: t.subtitle }}>{c.code}</div>
                            </div>
                         </div>
                      </td>
                      <td>
                         <div style={{ display: "flex" }}>
                            {c.modules.map(m => (
                              <span key={m} className="module-tag" style={{ background: "rgba(99, 102, 241, 0.12)", color: "#818cf8", border: "1px solid rgba(99, 102, 241, 0.2)" }}>{m}</span>
                            ))}
                            <div style={{ padding: "3px 8px", borderRadius: "10px", border: "1px dashed rgba(255,255,255,0.2)", color: t.subtitle, fontSize: "0.65rem", display: "flex", alignItems: "center" }}><Plus size={10} /></div>
                         </div>
                      </td>
                      <td style={{ fontSize: "0.9rem", fontWeight: 500, fontFamily: "monospace" }}>{c.limit}</td>
                      <td>
                         <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "30px", background: c.status === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)", border: `1px solid ${c.status === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"}`, color: c.status === "success" ? "#10b981" : "#fbbf24", fontSize: "0.75rem", fontWeight: 700 }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor" }} />
                            {c.date}
                         </div>
                      </td>
                      <td style={{ textAlign: "right", paddingRight: "1.5rem" }}>
                         <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button className="action-icon-btn"><Edit3 size={14} /></button>
                            <button className="action-icon-btn" style={{ color: "#ef4444" }}><Power size={14} /></button>
                         </div>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           
           <div style={{ padding: "1.25rem 1.5rem", borderTop: `1px solid ${t.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.8rem", color: t.subtitle }}>共 3 家企業維護中</div>
              <button style={{ background: "transparent", border: "none", color: t.subtitle, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>查看完整記錄 <ChevronRight size={14} /></button>
           </div>
        </div>
      </div>
    </div>
  );
}
