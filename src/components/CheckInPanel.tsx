"use client";

import { useState, useEffect } from "react";
import {
  Clock, MapPin, Wifi, CheckCircle, AlertTriangle,
  CalendarDays, Sun, Moon, Shield, TrendingUp, ChevronRight,
  LogIn, LogOut, Radio
} from "lucide-react";

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const themes = {
  dark: {
    pageBg:         "linear-gradient(135deg, #0b0a1a 0%, #111827 45%, #0d1b2e 100%)",
    orb1:           "radial-gradient(circle, rgba(99,102,241,0.20) 0%, transparent 70%)",
    orb2:           "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
    orb3:           "radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)",
    glassBg:        "rgba(255,255,255,0.04)",
    glassBorder:    "rgba(255,255,255,0.08)",
    glassShadow:    "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
    theadColor:     "rgba(255,255,255,0.30)",
    rowBorder:      "rgba(255,255,255,0.05)",
    rowHover:       "rgba(255,255,255,0.04)",
    envRowBg:       "rgba(255,255,255,0.04)",
    envRowBorder:   "rgba(255,255,255,0.08)",
    title:          "#ffffff",
    subtitle:       "rgba(255,255,255,0.38)",
    clockColor:     "#e0e7ff",
    cellMain:       "rgba(255,255,255,0.88)",
    cellSub:        "rgba(255,255,255,0.45)",
    toggleBg:       "rgba(255,255,255,0.08)",
    toggleBorder:   "rgba(255,255,255,0.14)",
    toggleColor:    "rgba(255,255,255,0.7)",
    statBg:         "rgba(255,255,255,0.04)",
    statBorder:     "rgba(255,255,255,0.07)",
    statLabel:      "rgba(255,255,255,0.38)",
    statValue:      "#ffffff",
    sectionTitle:   "rgba(255,255,255,0.85)",
    linkColor:      "rgba(99,102,241,0.75)",
    linkHover:      "#818cf8",
    footerBorder:   "rgba(255,255,255,0.05)",
    footerText:     "rgba(255,255,255,0.22)",
  },
  light: {
    pageBg:         "linear-gradient(135deg, #eef2ff 0%, #f0f9ff 45%, #faf5ff 100%)",
    orb1:           "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
    orb2:           "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)",
    orb3:           "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
    glassBg:        "rgba(255,255,255,0.75)",
    glassBorder:    "rgba(99,102,241,0.10)",
    glassShadow:    "0 8px 32px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
    theadColor:     "#9ca3af",
    rowBorder:      "rgba(0,0,0,0.05)",
    rowHover:       "rgba(99,102,241,0.04)",
    envRowBg:       "rgba(248,250,255,0.80)",
    envRowBorder:   "rgba(99,102,241,0.10)",
    title:          "#1e1b4b",
    subtitle:       "#9ca3af",
    clockColor:     "#312e81",
    cellMain:       "#1e1b4b",
    cellSub:        "#6b7280",
    toggleBg:       "rgba(99,102,241,0.07)",
    toggleBorder:   "rgba(99,102,241,0.18)",
    toggleColor:    "#6366f1",
    statBg:         "rgba(255,255,255,0.80)",
    statBorder:     "rgba(99,102,241,0.09)",
    statLabel:      "#9ca3af",
    statValue:      "#1e1b4b",
    sectionTitle:   "#1e1b4b",
    linkColor:      "rgba(99,102,241,0.75)",
    linkHover:      "#4338ca",
    footerBorder:   "rgba(0,0,0,0.05)",
    footerText:     "#9ca3af",
  },
};

const attendance = [
  { date:"10/28 (二)", checkIn:"08:52", checkOut:"18:10", status:"normal",  hours:"9h 18m" },
  { date:"10/27 (一)", checkIn:"08:59", checkOut:"18:02", status:"normal",  hours:"9h 03m" },
  { date:"10/25 (五)", checkIn:"09:18", checkOut:"18:45", status:"late",    hours:"9h 27m" },
  { date:"10/24 (四)", checkIn:"08:55", checkOut:"18:05", status:"normal",  hours:"9h 10m" },
  { date:"10/23 (三)", checkIn:"08:58", checkOut:"--:--", status:"working", hours:"—" },
];

const statusBadge = {
  normal:  { label:"正常",   bg:"rgba(34,197,94,0.13)",  border:"rgba(34,197,94,0.25)",  text:"#22c55e" },
  late:    { label:"遲到",   bg:"rgba(239,68,68,0.11)",  border:"rgba(239,68,68,0.25)",  text:"#ef4444" },
  working: { label:"上班中", bg:"rgba(59,130,246,0.13)", border:"rgba(59,130,246,0.25)", text:"#3b82f6" },
  leave:   { label:"請假",   bg:"rgba(251,191,36,0.12)", border:"rgba(251,191,36,0.25)", text:"#f59e0b" },
};

export default function CheckInPanel({ isDark: propIsDark = true, user }: { isDark?: boolean; user?: any }) {
  const [isDark, setIsDark]       = useState(propIsDark);
  const [now, setNow]             = useState(new Date());
  const [checkedIn, setCheckedIn] = useState(false);
  const [pulse, setPulse]         = useState(false);
  const [lastAction, setLastAction] = useState<any>(null);

  useEffect(() => {
    setIsDark(propIsDark);
  }, [propIsDark]);

  const t = isDark ? themes.dark : themes.light;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
    const timeStr = now.toLocaleTimeString("zh-TW", { hour12:false, hour:"2-digit", minute:"2-digit" });
    setLastAction({ type: checkedIn ? "out" : "in", time: timeStr });
    setCheckedIn(v => !v);
  };

  const hh = now.toLocaleTimeString("zh-TW", { hour12:false, hour:"2-digit", minute:"2-digit" });
  const ss = now.getSeconds().toString().padStart(2,"0");
  const dateStr = now.toLocaleDateString("zh-TW", { year:"numeric", month:"long", day:"numeric", weekday:"short" });

  // weekly stats
  const totalHours = "36h 58m";
  const normalDays = 4;
  const lateDays   = 1;

  return (
    <div style={{ minHeight:"100%", background:t.pageBg, fontFamily:"'DM Sans','Noto Sans TC',sans-serif", padding:"2rem", position:"relative", overflow:"hidden", transition:"background 0.45s ease" }}>

      {/* Ambient orbs */}
      <div style={{ position:"absolute", top:"-140px", left:"-100px", width:"480px", height:"480px", borderRadius:"50%", background:t.orb1, pointerEvents:"none", transition:"background 0.45s" }}/>
      <div style={{ position:"absolute", bottom:"-100px", right:"-80px",  width:"380px", height:"380px", borderRadius:"50%", background:t.orb2, pointerEvents:"none", transition:"background 0.45s" }}/>
      <div style={{ position:"absolute", top:"50%", left:"55%", width:"300px", height:"300px", borderRadius:"50%", background:t.orb3, pointerEvents:"none", transition:"background 0.45s" }}/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing:border-box; }

        .glass-card {
          backdrop-filter:blur(22px); -webkit-backdrop-filter:blur(22px);
          border-radius:22px; border:1px solid;
          transition:background 0.45s, border 0.45s, box-shadow 0.45s;
        }

        /* ── Clock ring pulse ── */
        @keyframes ringPulse {
          0%   { transform:scale(1);    opacity:0.6; }
          50%  { transform:scale(1.08); opacity:0.2; }
          100% { transform:scale(1),    opacity:0.6; }
        }
        @keyframes btnPop {
          0%   { transform:scale(1); }
          40%  { transform:scale(0.92); }
          70%  { transform:scale(1.06); }
          100% { transform:scale(1); }
        }
        .btn-pop { animation:btnPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }

        @keyframes ripple {
          0%   { transform:scale(0.8); opacity:0.5; }
          100% { transform:scale(2.2); opacity:0; }
        }
        .ripple-ring {
          position:absolute; inset:0; border-radius:50%;
          border:2px solid currentColor; animation:ripple 0.7s ease-out forwards;
        }

        .checkin-btn {
          position:relative; border:none; cursor:pointer;
          width:176px; height:176px; border-radius:50%;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          transition:box-shadow 0.3s, transform 0.15s;
          outline:none;
        }
        .checkin-btn:hover { transform:scale(1.04); }
        .checkin-btn:active { transform:scale(0.95); }

        .theme-btn {
          border:none; border-radius:12px; width:38px; height:38px;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .theme-btn:hover { transform:rotate(18deg) scale(1.18); }

        .env-row {
          display:flex; align-items:center; justify-content:space-between;
          padding:10px 14px; border-radius:14px; border:1px solid;
          transition:background 0.4s, border 0.4s;
        }

        .stat-mini {
          border-radius:14px; padding:1rem 1.2rem;
          display:flex; align-items:center; gap:10px;
          backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
          border:1px solid; transition:all 0.45s;
        }
        .stat-mini:hover { transform:translateY(-2px); }

        .table-row {
          border-bottom:1px solid; transition:background 0.2s;
        }

        .report-link {
          font-size:0.8rem; font-weight:600; cursor:pointer;
          border:none; background:none; display:flex; align-items:center; gap:3px;
          padding:5px 10px; border-radius:8px; transition:all 0.2s;
          font-family:'DM Sans','Noto Sans TC',sans-serif;
        }
        .report-link:hover { background:rgba(99,102,241,0.10); }

        @keyframes fadeSlideIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-in { animation:fadeSlideIn 0.35s ease forwards; }

        .dot-blink {
          animation:blink 1.4s ease-in-out infinite;
        }
        @keyframes blink {
          0%,100% { opacity:1; }
          50%      { opacity:0.3; }
        }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.8rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"5px" }}>
            <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"linear-gradient(135deg,#6366f1,#06b6d4)", display:"flex", alignItems:"center", justifySelf: "center", boxShadow:"0 0 16px rgba(99,102,241,0.40)", flexShrink:0, justifyContent: "center" }}>
              <Shield size={17} color="white"/>
            </div>
            <h1 style={{ fontSize:"1.5rem", fontWeight:700, color:t.title, margin:0, letterSpacing:"-0.02em", transition:"color 0.4s" }}>差勤與打卡模組</h1>
          </div>
          <p style={{ color:t.subtitle, margin:0, fontSize:"0.82rem", transition:"color 0.4s" }}>Attendance & Check-in System — {dateStr}</p>
        </div>
        <button className="theme-btn" onClick={()=>setIsDark(v=>!v)} style={{ background:t.toggleBg, boxShadow:`0 0 0 1px ${t.toggleBorder}`, color:t.toggleColor, transition:"background 0.3s,box-shadow 0.3s,color 0.3s" }}>
          {isDark ? <Sun size={17}/> : <Moon size={17}/>}
        </button>
      </div>

      {/* ── Weekly stat mini cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:"0.8rem", marginBottom:"1.8rem" }}>
        {[
          { icon:<TrendingUp size={16}/>, label:"本週總時數",  value:totalHours,       color:"#818cf8" },
          { icon:<CheckCircle size={16}/>,label:"正常出勤",    value:`${normalDays} 天`, color:"#4ade80" },
          { icon:<AlertTriangle size={16}/>,label:"遲到紀錄", value:`${lateDays} 次`,  color:"#fb923c" },
          { icon:<CalendarDays size={16}/>,label:"本月剩餘假", value:"7 天",            color:"#38bdf8" },
        ].map((s,i)=>(
          <div key={i} className="stat-mini" style={{ background:t.statBg, borderColor:t.statBorder }}>
            <div style={{ color:s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:"0.68rem", color:t.statLabel, marginBottom:"1px", transition:"color 0.4s" }}>{s.label}</div>
              <div style={{ fontSize:"1rem", fontWeight:700, color:t.statValue, transition:"color 0.4s" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main 2-col grid ── */}
      <div style={{ display:"grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap:"1.4rem", alignItems:"start" }}>

        {/* ── LEFT column ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1.2rem" }}>

          {/* ① Clock + Check-in button */}
          <div className="glass-card" style={{ background:t.glassBg, borderColor:t.glassBorder, boxShadow:t.glassShadow, padding:"2rem 1.5rem", display:"flex", flexDirection:"column", alignItems:"center", position:"relative", overflow:"hidden" }}>
            {/* decorative glow blob */}
            <div style={{ position:"absolute", top:"-40px", right:"-40px", width:"140px", height:"140px", borderRadius:"50%", background: checkedIn ? "radial-gradient(circle,rgba(251,113,133,0.25),transparent 70%)" : "radial-gradient(circle,rgba(99,102,241,0.25),transparent 70%)", transition:"background 0.5s", pointerEvents:"none" }}/>

            <p style={{ fontSize:"0.72rem", color:t.subtitle, letterSpacing:"0.08em", textTransform:"uppercase", margin:"0 0 6px", transition:"color 0.4s" }}>現在時間</p>

            {/* Clock display */}
            <div style={{ display:"flex", alignItems:"baseline", gap:"2px", marginBottom:"1.8rem" }}>
              <span style={{ fontSize:"3.2rem", fontWeight:700, color:t.clockColor, fontFamily:"'DM Mono',monospace", letterSpacing:"-0.03em", lineHeight:1, transition:"color 0.4s" }}>{hh}</span>
              <span style={{ fontSize:"1.6rem", fontWeight:500, color: isDark ? "rgba(165,180,252,0.5)" : "rgba(99,102,241,0.4)", fontFamily:"'DM Mono',monospace", marginBottom:"4px", transition:"color 0.4s" }}>:{ss}</span>
            </div>

            {/* Big check-in button */}
            <button
              className={`checkin-btn ${pulse ? "btn-pop" : ""}`}
              onClick={handleCheckIn}
              style={{
                background: checkedIn
                  ? "linear-gradient(135deg,#f43f5e,#e11d48)"
                  : "linear-gradient(135deg,#6366f1,#06b6d4)",
                boxShadow: checkedIn
                  ? "0 0 40px rgba(244,63,94,0.5), 0 8px 24px rgba(0,0,0,0.3)"
                  : "0 0 40px rgba(99,102,241,0.45), 0 8px 24px rgba(0,0,0,0.3)",
                color:"white",
              }}
            >
              {pulse && <span className="ripple-ring" style={{ color: checkedIn ? "#f43f5e" : "#6366f1" }}/>}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", position:"relative", zIndex:1 }}>
                {checkedIn ? <LogOut size={28}/> : <LogIn size={28}/>}
                <span style={{ fontSize:"1.05rem", fontWeight:800, letterSpacing:"0.04em" }}>{checkedIn ? "下班打卡" : "上班打卡"}</span>
                <span style={{ fontSize:"0.7rem", opacity:0.75, display:"flex", alignItems:"center", gap:"3px" }}><Clock size={11}/>點擊紀錄時間</span>
              </div>
            </button>

            {/* Last action toast */}
            {lastAction && (
              <div className="fade-in" style={{ marginTop:"1.2rem", padding:"8px 16px", borderRadius:"10px", background: lastAction.type==="in" ? "rgba(34,197,94,0.12)" : "rgba(244,63,94,0.12)", border:`1px solid ${lastAction.type==="in" ? "rgba(34,197,94,0.25)" : "rgba(244,63,94,0.25)"}`, fontSize:"0.78rem", fontWeight:600, color: lastAction.type==="in" ? "#22c55e" : "#f43f5e", display:"flex", alignItems:"center", gap:"6px" }}>
                <CheckCircle size={13}/>
                {lastAction.type==="in" ? "上班打卡成功" : "下班打卡成功"} · {lastAction.time}
              </div>
            )}
          </div>

          {/* ② Environment detection */}
          <div className="glass-card" style={{ background:t.glassBg, borderColor:t.glassBorder, boxShadow:t.glassShadow, padding:"1.4rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"1rem" }}>
              <Radio size={15} color="#22c55e"/>
              <span style={{ fontSize:"0.82rem", fontWeight:700, color:t.sectionTitle, transition:"color 0.4s" }}>環境偵測</span>
              <span style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"5px", fontSize:"0.7rem", fontWeight:600, color:"#22c55e" }}>
                <span className="dot-blink" style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e", display:"inline-block" }}/>
                全部通過
              </span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {[
                { icon:<Wifi size={15} color="#6366f1"/>,  label:"公司網路 IP",     badge:"吻合",    sub:"203.69.xx.xx",   ok:true  },
                { icon:<MapPin size={15} color="#06b6d4"/>, label:"GPS 地理圍欄",   badge:"距離 12m", sub:"半徑 100m 內",   ok:true  },
                { icon:<Shield size={15} color="#a78bfa"/>, label:"裝置信任狀態",   badge:"已授權",   sub:"iPhone 14 Pro",  ok:true  },
              ].map((row,i)=>(
                <div key={i} className="env-row" style={{ background:t.envRowBg, borderColor:t.envRowBorder }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
                    {row.icon}
                    <div>
                      <div style={{ fontSize:"0.78rem", fontWeight:600, color:t.cellMain, transition:"color 0.4s" }}>{row.label}</div>
                      <div style={{ fontSize:"0.67rem", color:t.cellSub, transition:"color 0.4s" }}>{row.sub}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:"0.68rem", fontWeight:700, padding:"2px 8px", borderRadius:"20px", background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.22)", color:"#22c55e", whiteSpace:"nowrap" }}>
                    {row.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: attendance history ── */}
        <div className="glass-card" style={{ background:t.glassBg, borderColor:t.glassBorder, boxShadow:t.glassShadow, padding:"1.6rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.4rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <CalendarDays size={16} color="#6366f1"/>
              <span style={{ fontSize:"1rem", fontWeight:700, color:t.sectionTitle, transition:"color 0.4s" }}>本週出勤紀錄</span>
            </div>
            <button className="report-link" style={{ color:t.linkColor, transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color=t.linkHover}
              onMouseLeave={e=>e.currentTarget.style.color=t.linkColor}>
              查看完整月報表 <ChevronRight size={13}/>
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"500px" }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${t.rowBorder}` }}>
                  {["日期","上班","下班","狀態","時數","操作"].map((h,i)=>(
                    <th key={i} style={{ paddingBottom:"0.75rem", textAlign:"left", fontSize:"0.72rem", fontWeight:600, color:t.theadColor, letterSpacing:"0.05em", textTransform:"uppercase", transition:"color 0.4s" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendance.map((row, idx)=>{
                  const s = statusBadge[row.status as keyof typeof statusBadge];
                  const isLate = row.status === "late";
                  return (
                    <tr key={idx} className="table-row"
                      style={{ borderBottomColor:t.rowBorder }}
                      onMouseEnter={e=>e.currentTarget.style.background=t.rowHover}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"0.9rem 0.4rem 0.9rem 0", fontSize:"0.82rem", fontWeight:600, color:t.cellMain, transition:"color 0.4s", fontFamily:"'DM Mono',monospace" }}>{row.date}</td>
                      <td style={{ padding:"0.9rem 0.5rem", fontSize:"0.82rem", color: isLate ? "#f87171" : t.cellSub, fontWeight: isLate ? 700 : 400, fontFamily:"'DM Mono',monospace", transition:"color 0.4s" }}>{row.checkIn}</td>
                      <td style={{ padding:"0.9rem 0.5rem", fontSize:"0.82rem", color:t.cellSub, fontFamily:"'DM Mono',monospace", transition:"color 0.4s" }}>{row.checkOut}</td>
                      <td style={{ padding:"0.9rem 0.5rem" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"2px 9px", borderRadius:"20px", fontSize:"0.7rem", fontWeight:700, background:s.bg, border:`1px solid ${s.border}`, color:s.text, whiteSpace:"nowrap" }}>
                          <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:s.text, boxShadow:`0 0 4px ${s.text}`, ...(row.status==="working" ? {animation:"blink 1.2s ease-in-out infinite"} : {}) }}/>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding:"0.9rem 0.5rem", fontSize:"0.82rem", color:t.cellSub, fontFamily:"'DM Mono',monospace", transition:"color 0.4s" }}>{row.hours}</td>
                      <td style={{ padding:"0.9rem 0 0.9rem 0.5rem" }}>
                        {row.status==="late" && (
                          <button style={{ fontSize:"0.68rem", fontWeight:600, padding:"3px 9px", borderRadius:"7px", border:"1px solid rgba(251,146,60,0.3)", background:"rgba(251,146,60,0.09)", color:"#fb923c", cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif" }}
                            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(251,146,60,0.18)"; e.currentTarget.style.borderColor="rgba(251,146,60,0.5)"; }}
                            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(251,146,60,0.09)"; e.currentTarget.style.borderColor="rgba(251,146,60,0.3)"; }}>
                            申請說明
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div style={{ marginTop:"1.2rem", paddingTop:"1rem", borderTop:`1px solid ${t.footerBorder}`, display:"flex", justifyContent:"space-between", alignItems:"center", transition:"border 0.4s" }}>
            <span style={{ fontSize:"0.72rem", color:t.footerText, transition:"color 0.4s" }}>
              本週正常 {normalDays} 天 · 遲到 {lateDays} 次 · 累計 {totalHours}
            </span>
            <span style={{ fontSize:"0.72rem", color:t.footerText, display:"flex", alignItems:"center", gap:"5px", transition:"color 0.4s" }}>
              <span className="dot-blink" style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#22c55e", display:"inline-block" }}/>
              即時同步中
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
