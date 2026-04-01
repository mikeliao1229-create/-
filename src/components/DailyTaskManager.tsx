"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle, MessageSquare, Clock, Plus, Sun, Moon, Archive, RotateCcw, Send, User as UserIcon, ChevronDown, ChevronUp, AlertCircle, Users } from "lucide-react";

// ─── Theme tokens ───────────────────────────────────────────────────────────
const themes = {
  dark: {
    pageBg:        "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    orb1:          "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
    orb2:          "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
    cardBg:        "rgba(30, 41, 59, 0.4)",
    cardBorder:    "rgba(255,255,255,0.08)",
    cardShadow:    "0 4px 24px rgba(0,0,0,0.3)",
    cardHoverBg:   "rgba(255,255,255,0.07)",
    cardApprBg:    "rgba(255,255,255,0.02)",
    cardApprBorder:"rgba(255,255,255,0.05)",
    divider:       "rgba(255,255,255,0.06)",
    inputBg:       "rgba(255,255,255,0.06)",
    inputBorder:   "rgba(255,255,255,0.12)",
    inputText:     "rgba(255,255,255,0.85)",
    inputPlaceholder:"rgba(255,255,255,0.3)",
    noteBg:        "rgba(59,130,246,0.1)",
    noteBorder:    "rgba(59,130,246,0.2)",
    noteText:      "#93c5fd",
    noteIcon:      "#60a5fa",
    toggleBg:      "rgba(255,255,255,0.08)",
    toggleBorder:  "rgba(255,255,255,0.14)",
    toggleColor:   "rgba(255,255,255,0.7)",
    addBtnBg:      "rgba(255,255,255,0.05)",
    addBtnBorder:  "rgba(255,255,255,0.12)",
    addBtnColor:   "rgba(255,255,255,0.4)",
    filterBg:      "rgba(255,255,255,0.05)",
    filterBorder:  "rgba(255,255,255,0.08)",
    filterActive:  "rgba(99,102,241,0.25)",
    filterActBorder:"rgba(99,102,241,0.4)",
    filterActColor: "#a5b4fc",
    filterColor:   "rgba(255,255,255,0.4)",
    title:         "#ffffff",
    subtitle:      "rgba(255,255,255,0.38)",
    taskText:      "rgba(255,255,255,0.88)",
    taskTextAppr:  "rgba(255,255,255,0.3)",
    metaText:      "rgba(255,255,255,0.35)",
    badgePending:  { bg:"rgba(251,191,36,0.12)", border:"rgba(251,191,36,0.25)", text:"#fbbf24" },
    badgeAppr:     { bg:"rgba(34,197,94,0.10)",  border:"rgba(34,197,94,0.22)",  text:"#4ade80" },
    badgeReturn:   { bg:"rgba(239,68,68,0.10)",  border:"rgba(239,68,68,0.22)",  text:"#f87171" },
    statsCard:     "rgba(255,255,255,0.04)",
    statsBorder:   "rgba(255,255,255,0.07)",
  },
  light: {
    pageBg:        "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    orb1:          "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)",
    orb2:          "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)",
    cardBg:        "rgba(255,255,255,0.80)",
    cardBorder:    "rgba(99,102,241,0.10)",
    cardShadow:    "0 4px 20px rgba(99,102,241,0.08)",
    cardHoverBg:   "rgba(255,255,255,0.96)",
    cardApprBg:    "rgba(248,250,255,0.70)",
    cardApprBorder:"rgba(0,0,0,0.06)",
    divider:       "rgba(0,0,0,0.06)",
    inputBg:       "rgba(248,249,255,0.90)",
    inputBorder:   "rgba(99,102,241,0.14)",
    inputText:     "#1e293b",
    inputPlaceholder:"#94a3b8",
    noteBg:        "rgba(219,234,254,0.60)",
    noteBorder:    "rgba(147,197,253,0.50)",
    noteText:      "#1d4ed8",
    noteIcon:      "#3b82f6",
    toggleBg:      "rgba(99,102,241,0.08)",
    toggleBorder:  "rgba(99,102,241,0.18)",
    toggleColor:   "#6366f1",
    addBtnBg:      "rgba(99,102,241,0.05)",
    addBtnBorder:  "rgba(99,102,241,0.15)",
    addBtnColor:   "#9ca3af",
    filterBg:      "rgba(255,255,255,0.70)",
    filterBorder:  "rgba(0,0,0,0.07)",
    filterActive:  "rgba(99,102,241,0.12)",
    filterActBorder:"rgba(99,102,241,0.30)",
    filterActColor: "#4338ca",
    filterColor:   "#64748b",
    title:         "#1e293b",
    subtitle:      "#64748b",
    taskText:      "#1e293b",
    taskTextAppr:  "#94a3b8",
    metaText:      "#94a3b8",
    badgePending:  { bg:"rgba(251,191,36,0.12)", border:"rgba(251,191,36,0.30)", text:"#d97706" },
    badgeAppr:     { bg:"rgba(34,197,94,0.10)",  border:"rgba(34,197,94,0.25)",  text:"#16a34a" },
    badgeReturn:   { bg:"rgba(239,68,68,0.08)",  border:"rgba(239,68,68,0.20)",  text:"#dc2626" },
    statsCard:     "rgba(255,255,255,0.75)",
    statsBorder:   "rgba(99,102,241,0.09)",
  },
};

const initTasks = [
  { id:1, user:"Tiffany", content:"更新 91APP 首頁雙11活動 Banner",       status:"pending",  supervisorNote:"",               time:"09:30", priority:"high",   project:"行銷活動" },
  { id:2, user:"Tiffany", content:"核對日本線 10 月份採購報關單據",         status:"approved", supervisorNote:"單據確認無誤，辛苦了！", time:"09:45", priority:"normal", project:"物流報關" },
  { id:3, user:"Kevin",   content:"Shopee 蝦皮倉庫出貨異常回報處理",       status:"returned", supervisorNote:"請補充倉別截圖後重送", time:"10:10", priority:"high",   project:"庫存管理" },
  { id:4, user:"Amy",     content:"Q4 財務報表初稿彙整送審",               status:"pending",  supervisorNote:"",               time:"10:30", priority:"normal", project:"財務結算" },
  { id:5, user:"adminhao", content:"Supabase 資料庫權限設定與同步",           status:"pending",  supervisorNote:"",               time:"15:00", priority:"high",   project:"系統開發" },
];

export default function DailyTaskManager({ isDark = true, user }: { isDark?: boolean; user: any }) {
  const t = isDark ? themes.dark : themes.light;

  const [tasks, setTasks]           = useState(initTasks);
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});
  const [filter, setFilter]         = useState("all");
  const [newTask, setNewTask]       = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [expandedNote, setExpandedNote] = useState<Record<number, boolean>>({});

  const isManagement = ["SUPER_ADMIN", "OWNER", "MANAGER"].includes(user.role);

  // Filter tasks based on role
  const userFilteredTasks = isManagement 
    ? tasks 
    : tasks.filter(tk => tk.user === user.name || tk.project === "共同專案");

  const filtered = userFilteredTasks.filter(tk =>
    filter === "all"      ? true :
    filter === "pending"  ? tk.status === "pending" :
    filter === "approved" ? tk.status === "approved" :
    filter === "returned" ? tk.status === "returned" : true
  );

  const counts: Record<string, number> = {
    all:      userFilteredTasks.length,
    pending:  userFilteredTasks.filter(t=>t.status==="pending").length,
    approved: userFilteredTasks.filter(t=>t.status==="approved").length,
    returned: userFilteredTasks.filter(t=>t.status==="returned").length,
  };

  const approve = (id: number) => {
    if (!isManagement) return alert("只有管理員或主管可以查核任務");
    setTasks(prev => prev.map(tk => tk.id===id ? { ...tk, status:"approved", supervisorNote: noteInputs[id] || tk.supervisorNote || "已核准結案。" } : tk));
  };

  const returnTask = (id: number) => {
    if (!isManagement) return alert("只有管理員或主管可以退回任務");
    if (!noteInputs[id]?.trim()) return;
    setTasks(prev => prev.map(tk => tk.id===id ? { ...tk, status:"returned", supervisorNote: noteInputs[id] } : tk));
    setNoteInputs(prev => ({ ...prev, [id]:"" }));
  };

  const resubmit = (id: number) =>
    setTasks(prev => prev.map(tk => tk.id===id ? { ...tk, status:"pending", supervisorNote:"" } : tk));

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), user: user.name, content:newTask.trim(), status:"pending", supervisorNote:"", time: new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"}), priority:"normal", project: "個人工作" }]);
    setNewTask(""); setAddingTask(false);
  };

  const badgeFor = (status: string) =>
    status==="approved" ? t.badgeAppr :
    status==="returned" ? t.badgeReturn : t.badgePending;

  const labelFor = (status: string) =>
    status==="approved" ? "已結案" :
    status==="returned" ? "已退回" : "待查核";

  return (
    <div style={{ height:"100%", background:t.pageBg, fontFamily:"'DM Sans','Noto Sans TC',sans-serif", padding:"2rem", position:"relative", overflowY:"auto", transition:"background 0.45s" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        .task-card { border-radius:20px; border:1px solid ${t.cardBorder}; backdrop-filter:blur(20px); background: ${t.cardBg}; box-shadow: ${t.cardShadow}; transition:all 0.3s ease; position:relative; overflow:hidden; }
        .task-card:hover { transform: translateY(-2px); }
        .approve-btn { background:linear-gradient(135deg,#22c55e,#16a34a); color:white; border:none; padding:8px 16px; border-radius:12px; font-size:0.8rem; font-weight:700; cursor:pointer; }
        .return-btn { background:transparent; color:#f87171; border:1px solid rgba(239,68,68,0.3); padding:8px 16px; border-radius:12px; font-size:0.8rem; font-weight:700; cursor:pointer; }
        .return-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .filter-pill { border:1px solid ${t.filterBorder}; border-radius:20px; padding:6px 14px; font-size:0.8rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; background: ${t.filterBg}; color: ${t.filterColor}; transition:all 0.2s; }
        .filter-pill.active { background: ${t.filterActive}; border-color: ${t.filterActBorder}; color: ${t.filterActColor}; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom:"2rem", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px" }}>
            <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:"linear-gradient(135deg,#8b5cf6,#d946ef)", display:"flex", alignItems:"center", justifySelf:"center", justifyContent:"center", boxShadow:"0 0 20px rgba(139,92,246,0.3)" }}>
              <CheckCircle size={20} color="white" />
            </div>
            <h1 style={{ fontSize:"1.75rem", fontWeight:800, color:t.title, margin:0, letterSpacing:"-0.03em" }}>工作進度管理</h1>
          </div>
          <p style={{ color:t.subtitle, margin:0, fontSize:"0.95rem" }}>{user.name} ({user.role}) - 目前檢視範圍：{isManagement ? "全體成員" : "個人專案"}</p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1.5rem" }}>
        {[
          { label:"全部任務", count:counts.all,      color:"#8b5cf6" },
          { label:"待查核",   count:counts.pending,  color:"#fbbf24" },
          { label:"已結案",   count:counts.approved, color:"#10b981" },
          { label:"已退回",   count:counts.returned, color:"#f43f5e" },
        ].map((s,i)=>(
          <div key={i} style={{ background:t.statsCard, border:`1px solid ${t.statsBorder}`, borderRadius:"18px", padding:"1rem", backdropFilter:"blur(12px)", transition:"all 0.4s", textAlign:"center" }}>
            <div style={{ fontSize:"1.75rem", fontWeight:800, color:s.color, lineHeight:1 }}>{s.count}</div>
            <div style={{ fontSize:"0.75rem", color:t.subtitle, marginTop:"6px", fontWeight:700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filter & Add ── */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"1.5rem", alignItems:"center", flexWrap:"wrap" }}>
        {["all","pending","approved","returned"].map(f => (
          <button key={f} className={`filter-pill ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
            {f==="all"?"全部":f==="pending"?"待查核":f==="approved"?"已結案":"已退回"}
            <span style={{ fontSize:"0.7rem", opacity:0.6 }}>{counts[f]}</span>
          </button>
        ))}
        
        <button onClick={()=>setAddingTask(v=>!v)} style={{ marginLeft:"auto", background:"transparent", border:`1px dashed ${t.cardBorder}`, borderRadius:"12px", padding:"6px 16px", color:t.subtitle, fontSize:"0.8rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>
          <Plus size={14}/> {isManagement ? "指派新任務" : "新增工作回報"}
        </button>
      </div>

      {/* ── Add Inline ── */}
      {addingTask && (
        <div style={{ display:"flex", gap:"12px", marginBottom:"1.5rem", animation: "slideDown 0.3s ease" }}>
          <input
            style={{ flex:1, background:t.inputBg, border:`1px solid ${t.inputBorder}`, borderRadius:"14px", padding:"12px 18px", color:t.inputText, fontSize:"0.9rem", outline:"none" }}
            value={newTask}
            onChange={e=>setNewTask(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&addTask()}
            placeholder={isManagement ? "指派任務內容與目標..." : "輸入今日已完成工作或問題回報..."}
          />
          <button onClick={addTask} style={{ background:"linear-gradient(135deg,#8b5cf6,#d946ef)", color:"white", border:"none", borderRadius:"14px", padding:"0 24px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"8px" }}>
            <Send size={16}/> 送出
          </button>
        </div>
      )}

      {/* ── Task List ── */}
      <div style={{ display:"grid", gap:"1.25rem" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"4rem", color:t.subtitle, border:`2px dashed ${t.cardBorder}`, borderRadius:"24px" }}>
             <AlertCircle size={32} style={{ marginBottom: "1rem", opacity: 0.3 }} />
             <div>目前沒有相關工作項目</div>
          </div>
        )}
        {filtered.map((task) => {
          const isAppr = task.status === "approved";
          const isReturn = task.status === "returned";
          const isPending = task.status === "pending";
          const badge = badgeFor(task.status);
          const noteOpen = expandedNote[task.id] !== false;

          return (
            <div key={task.id} className="task-card" style={{ padding:"1.5rem", opacity: isAppr ? 0.8 : 1 }}>
              <div style={{ display:"flex", gap:"1.5rem" }}>
                <div style={{ width:"44px", height:"44px", borderRadius:"14px", background: isAppr ? "rgba(16,185,129,0.1)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color: isAppr ? "#10b981" : "white", flexShrink:0 }}>
                  {task.user.charAt(0)}
                </div>

                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px", flexWrap:"wrap" }}>
                    <span style={{ fontWeight:800, fontSize:"0.85rem", color:t.title }}>{task.user} <span style={{ color:t.subtitle, fontWeight:500 }}>in</span> {task.project}</span>
                    <span style={{ fontSize:"0.7rem", fontWeight:700, padding:"3px 10px", borderRadius:"20px", background:badge.bg, border:`1px solid ${badge.border}`, color:badge.text }}>
                      {labelFor(task.status)}
                    </span>
                  </div>
                  
                  <p style={{ margin:"0 0 8px", fontSize:"1.05rem", fontWeight:600, color: isAppr ? t.taskTextAppr : t.taskText, textDecoration: isAppr ? "line-through" : "none", lineHeight:1.5 }}>
                    {task.content}
                  </p>

                  <div style={{ display:"flex", alignItems:"center", gap:"12px", fontSize:"0.75rem", color:t.metaText }}>
                     <span style={{ display:"flex", alignItems:"center", gap:"4px" }}><Clock size={12}/> {task.time} 提交</span>
                     {task.priority === "high" && <span style={{ color:"#ef4444", fontWeight:800, display:"flex", alignItems:"center", gap:"3px" }}><AlertCircle size={12}/> 高優先</span>}
                  </div>
                </div>

                <div style={{ display:"flex", gap:"8px", alignItems:"center", flexShrink:0 }}>
                  {isPending && isManagement && (
                    <>
                      <button className="approve-btn" onClick={()=>approve(task.id)}>核准專案</button>
                      <button className="return-btn" disabled={!noteInputs[task.id]?.trim()} onClick={()=>returnTask(task.id)}>退回修改</button>
                    </>
                  )}
                  {isReturn && task.user === user.name && (
                    <button className="approve-btn" style={{ background:"#8b5cf6" }} onClick={()=>resubmit(task.id)}>重新提交</button>
                  )}
                  <button onClick={()=>setExpandedNote(p=>({...p,[task.id]:!noteOpen}))} style={{ background:"transparent", border:"none", color:t.subtitle, cursor:"pointer" }}>
                    {noteOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                  </button>
                </div>
              </div>

              {noteOpen && (
                <div style={{ marginTop:"1.25rem", paddingTop:"1.25rem", borderTop:`1px solid ${t.divider}` }}>
                  {task.supervisorNote ? (
                    <div style={{ background:t.noteBg, border:`1px solid ${t.noteBorder}`, borderRadius:"14px", padding:"12px 16px", display:"flex", gap:"10px" }}>
                       <MessageSquare size={16} color={t.noteIcon} style={{ flexShrink:0, marginTop:"3px" }} />
                       <div>
                         <div style={{ fontSize:"0.72rem", fontWeight:700, color:t.noteIcon, textTransform:"uppercase", letterSpacing:"1px", marginBottom:"4px" }}>主管意見 / 修正指示</div>
                         <div style={{ color:t.noteText, fontSize:"0.9rem", lineHeight:1.5 }}>{task.supervisorNote}</div>
                       </div>
                    </div>
                  ) : (
                    isPending && isManagement && (
                      <input
                        style={{ width:"100%", background:t.inputBg, border:`1px solid ${t.inputBorder}`, borderRadius:"12px", padding:"10px 14px", color:t.inputText, fontSize:"0.85rem", outline:"none" }}
                        placeholder="輸入修正指示後即可退回，或留空直接核准..."
                        value={noteInputs[task.id] || ""}
                        onChange={e=>setNoteInputs(p=>({...p,[task.id]:e.target.value}))}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
