"use client";

import { useState, useEffect } from "react";
import { Clock, MapPin, CheckCircle, ChevronRight, Calendar, AlertCircle } from "lucide-react";

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

export default function CheckInPanel({ isDark = true, user }: { isDark?: boolean; user: any }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, date: "2023-10-25", time: "09:05", type: "上班", status: "正常", location: "台北總部", user: "adminhao" },
    { id: 2, date: "2023-10-24", time: "09:12", type: "上班", status: "遲到", location: "台北總部", user: "adminhao" },
    { id: 3, date: "2023-10-24", time: "18:05", type: "下班", status: "正常", location: "遠端辦公", user: "adminhao" },
    { id: 4, date: "2023-10-25", time: "09:00", type: "上班", status: "正常", location: "台北總部", user: "Tiffany" },
  ]);

  const [loading, setLoading] = useState(false);
  const t = isDark ? themes.dark : themes.light;

  // Filter history based on role
  const displayHistory = user.role === "STAFF" 
    ? history.filter(h => h.user === user.name)
    : history;

  const isManagement = ["SUPER_ADMIN", "OWNER", "ACCOUNTANT"].includes(user.role);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setLoading(true);
    setTimeout(() => {
      const type = isCheckedIn ? "下班" : "上班";
      const newEntry = {
        id: history.length + 1,
        date: currentTime.toISOString().split('T')[0],
        time: currentTime.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        type: type,
        status: currentTime.getHours() >= 9 && type === "上班" ? "遲到" : "正常",
        location: "台北總部",
        user: user.name
      };
      setHistory([newEntry, ...history]);
      setIsCheckedIn(!isCheckedIn);
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ height: "100%", background: t.pageBg, padding: "2rem", fontFamily: "'Inter', sans-serif", transition: "all 0.4s ease", overflowY: "auto" }}>
      <style>{`
        .glass-card { background: ${t.cardBg}; border: 1px solid ${t.cardBorder}; backdrop-filter: blur(12px); border-radius: 24px; box-shadow: ${t.cardShadow}; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-primary { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; border: none; border-radius: 16px; padding: 12px 24px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <div>
            <h1 style={{ color: t.title, fontSize: "2.25rem", fontWeight: 800, margin: 0, letterSpacing: "-0.03em" }}>差勤打卡系統</h1>
            <p style={{ color: t.subtitle, margin: "0.5rem 0 0", fontSize: "1.1rem" }}>{user.name} ({user.role}) - 歡迎回來</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: t.title, fontSize: "1.75rem", fontWeight: 700, fontFamily: "monospace" }}>{currentTime.toLocaleTimeString('zh-TW', { hour12: false })}</div>
            <div style={{ color: t.subtitle, fontSize: "0.9rem" }}>{currentTime.toLocaleDateString('zh-TW', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isManagement ? "1fr 1.2fr" : "1fr", gap: "2rem", marginBottom: "2rem" }}>
          {/* Main Check-in Card */}
          <div className="glass-card" style={{ padding: "3.5rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "220px", height: "220px", borderRadius: "50%", border: `6px solid ${isCheckedIn ? "#f43f5e" : "#6366f1"}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2.5rem", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", background: "rgba(99, 102, 241, 0.05)", position: "relative" }}>
                   <div style={{ textAlign: "center" }}>
                      <Clock size={56} color={isCheckedIn ? "#f43f5e" : "#6366f1"} style={{ marginBottom: "0.75rem" }} />
                      <div style={{ color: t.title, fontWeight: 700, fontSize: "1.1rem" }}>{isCheckedIn ? "上班中..." : "尚未打卡"}</div>
                      <div style={{ color: t.subtitle, fontSize: "0.8rem", marginTop: "4px" }}>{isCheckedIn ? "正在計時" : "請點擊按鈕"}</div>
                   </div>
                </div>

                <button 
                  className="btn-primary" 
                  onClick={handleCheckIn}
                  disabled={loading}
                  style={{ background: isCheckedIn ? "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)" : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", width: "260px", height: "64px", fontSize: "1.25rem", letterSpacing: "0.05em" }}
                >
                  {loading ? "處理中..." : (isCheckedIn ? "下班打卡" : "上班打卡")}
                </button>

                <div style={{ marginTop: "2.5rem", display: "flex", gap: "3rem" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ color: t.subtitle, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "4px" }}>GPS 定位</div>
                    <div style={{ color: t.title, fontSize: "0.9rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={16} color="#10b981" /> 台北總部
                    </div>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ color: t.subtitle, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "4px" }}>連線 IP</div>
                    <div style={{ color: t.title, fontSize: "0.9rem", fontWeight: 600 }}>192.168.1.105</div>
                  </div>
                </div>
          </div>

          {/* Management / Accountant View */}
          {isManagement && (
            <div className="glass-card" style={{ padding: "2.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ color: t.title, fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>團隊差勤監測</h2>
                <div style={{ padding: "4px 12px", borderRadius: "20px", background: "rgba(99, 102, 241, 0.1)", color: "#818cf8", fontSize: "0.75rem", fontWeight: 700 }}>管理模式</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                <div style={{ padding: "1.5rem", borderRadius: "20px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                  <div style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>已上班人數</div>
                  <div style={{ color: t.title, fontSize: "2.5rem", fontWeight: 800 }}>12 <span style={{ fontSize: "1rem", color: t.subtitle }}>/ 15</span></div>
                </div>
                <div style={{ padding: "1.5rem", borderRadius: "20px", background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                  <div style={{ color: "#fbbf24", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>異常/遲到</div>
                  <div style={{ color: t.title, fontSize: "2.5rem", fontWeight: 800 }}>2</div>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ color: t.subtitle, fontSize: "0.9rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Calendar size={16} /> 最新動態 (Team Feed)
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {history.slice(0, 4).map(h => (
                    <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", borderRadius: "14px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                         <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: h.status === "遲到" ? "#fbbf24" : "#10b981" }} />
                         <span style={{ fontSize: "0.9rem", color: t.title, fontWeight: 600 }}>{h.user}</span>
                       </div>
                       <div style={{ textAlign: "right" }}>
                         <div style={{ fontSize: "0.85rem", color: t.title }}>{h.time} <span style={{ fontSize: "0.75rem", color: t.subtitle }}>{h.type}</span></div>
                         <div style={{ fontSize: "0.7rem", color: h.status === "遲到" ? "#fbbf24" : "#10b981", fontWeight: 700 }}>{h.status}</div>
                       </div>
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", marginTop: "1.5rem", background: "transparent", border: `1px solid ${t.cardBorder}`, color: t.subtitle, padding: "0.85rem", borderRadius: "14px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                  導出全體報告 (CSV)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* List View */}
        <div className="glass-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ color: t.title, fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>{user.role === "STAFF" ? "我的打卡記錄" : "全體打卡記錄"}</h2>
            <div style={{ color: t.subtitle, fontSize: "0.85rem" }}>顯示最近 {displayHistory.length} 筆資料</div>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", textAlign: "left" }}>
              <thead>
                <tr>
                  <th style={{ padding: "1rem", color: t.subtitle, fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase" }}>日期</th>
                  {user.role !== "STAFF" && <th style={{ padding: "1rem", color: t.subtitle, fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase" }}>人員</th>}
                  <th style={{ padding: "1rem", color: t.subtitle, fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase" }}>時間</th>
                  <th style={{ padding: "1rem", color: t.subtitle, fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase" }}>類型</th>
                  <th style={{ padding: "1rem", color: t.subtitle, fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase" }}>狀態</th>
                  <th style={{ padding: "1rem", color: t.subtitle, fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase" }}>位置</th>
                </tr>
              </thead>
              <tbody>
                {displayHistory.map((item) => (
                  <tr key={item.id} style={{ background: "rgba(255, 255, 255, 0.02)", borderRadius: "12px" }}>
                    <td style={{ padding: "1.25rem 1rem", color: t.title, fontSize: "0.9rem", borderTopLeftRadius: "12px", borderBottomLeftRadius: "12px" }}>{item.date}</td>
                    {user.role !== "STAFF" && <td style={{ padding: "1.25rem 1rem", color: t.title, fontSize: "0.9rem", fontWeight: 700 }}>{item.user}</td>}
                    <td style={{ padding: "1.25rem 1rem", color: t.title, fontSize: "0.9rem" }}>{item.time}</td>
                    <td style={{ padding: "1.25rem 1rem" }}>
                      <span style={{ padding: "6px 14px", borderRadius: "10px", background: item.type === "上班" ? "rgba(16, 185, 129, 0.12)" : "rgba(244, 63, 94, 0.12)", color: item.type === "上班" ? "#10b981" : "#f43f5e", fontWeight: 700, fontSize: "0.75rem" }}>{item.type}</span>
                    </td>
                    <td style={{ padding: "1.25rem 1rem", color: item.status === "正常" ? "#10b981" : "#fbbf24", fontSize: "0.9rem", fontWeight: 700 }}>{item.status}</td>
                    <td style={{ padding: "1.25rem 1rem", color: t.subtitle, fontSize: "0.9rem", borderTopRightRadius: "12px", borderBottomRightRadius: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14}/> {item.location}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
