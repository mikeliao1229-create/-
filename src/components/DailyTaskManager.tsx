"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle, MessageSquare, Clock, Plus, Archive, RotateCcw, Send, User as UserIcon, ChevronDown, ChevronUp, AlertCircle, Users, Activity } from "lucide-react";

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
    inputBg: "rgba(255, 255, 255, 0.03)",
    inputBorder: "rgba(255, 255, 255, 0.08)",
    inputText: "#ffffff",
    metaText: "rgba(255, 255, 255, 0.35)",
    taskText: "#ffffff",
    taskTextAppr: "rgba(255, 255, 255, 0.35)",
    noteBg: "rgba(99, 102, 241, 0.05)",
    noteBorder: "rgba(99, 102, 241, 0.15)",
    noteText: "#818cf8",
    noteIcon: "#6366f1",
    filterBg: "rgba(255, 255, 255, 0.03)",
    filterBorder: "rgba(255, 255, 255, 0.06)",
    filterActive: "rgba(99, 102, 241, 0.15)",
    filterActBorder: "rgba(99, 102, 241, 0.3)",
    filterActColor: "#818cf8",
    filterColor: "rgba(255, 255, 255, 0.4)",
    statsCard: "rgba(255, 255, 255, 0.03)",
    badgePending:  { bg:"rgba(251,191,36,0.08)", border:"rgba(251,191,36,0.2)", text:"#fbbf24" },
    badgeAppr:     { bg:"rgba(16,185,129,0.08)",  border:"rgba(16,185,129,0.2)",  text:"#10b981" },
    badgeReturn:   { bg:"rgba(239,68,68,0.08)",  border:"rgba(239,68,68,0.2)",  text:"#f87171" },
  },
  light: {
    pageBg: "#f8fafc",
    cardBg: "rgba(255, 255, 255, 0.8)",
    cardBorder: "rgba(0, 0, 0, 0.05)",
    cardShadow: "0 10px 30px rgba(0,0,0,0.06)",
    title: "#1e293b",
    subtitle: "#64748b",
    accent: "#6366f1",
    divider: "rgba(0,0,0,0.05)",
    inputBg: "#f1f5f9",
    inputBorder: "#e2e8f0",
    inputText: "#1e293b",
    metaText: "#64748b",
    taskText: "#1e293b",
    taskTextAppr: "#94a3b8",
    noteBg: "rgba(99, 102, 241, 0.05)",
    noteBorder: "rgba(99, 102, 241, 0.15)",
    noteText: "#6366f1",
    noteIcon: "#6366f1",
    filterBg: "rgba(0, 0, 0, 0.03)",
    filterBorder: "rgba(0, 0, 0, 0.06)",
    filterActive: "rgba(99, 102, 241, 0.1)",
    filterActBorder: "rgba(99, 102, 241, 0.2)",
    filterActColor: "#6366f1",
    filterColor: "#64748b",
    statsCard: "#ffffff",
    badgePending:  { bg:"rgba(251,191,36,0.1)", border:"rgba(251,191,36,0.2)", text:"#d97706" },
    badgeAppr:     { bg:"rgba(34,197,94,0.1)",  border:"rgba(34,197,94,0.2)",  text:"#16a34a" },
    badgeReturn:   { bg:"rgba(239,68,68,0.08)",  border:"rgba(239,68,68,0.2)",  text:"#dc2626" },
  }
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
    <div style={{ minHeight: "100%", background: t.pageBg, padding: "2.5rem", fontFamily: "'Inter', sans-serif", color: t.title, transition: "all 0.4s ease", overflowY: "auto" }}>
      <style>{`
        .task-card { border-radius:12px; border:1px solid ${t.cardBorder}; backdrop-filter:blur(16px); background: ${t.cardBg}; box-shadow: ${t.cardShadow}; transition:all 0.3s; position:relative; overflow:hidden; }
        .task-card:hover { transform: translateY(-4px); }
        .approve-btn { background: linear-gradient(135deg, #6366f1, #a855f7); color:white; border:none; padding:8px 16px; border-radius:6px; font-size:0.8rem; font-weight:700; cursor:pointer; }
        .return-btn { background:transparent; color:#f87171; border:1px solid rgba(239, 68, 68, 0.2); padding:8px 16px; border-radius:6px; font-size:0.8rem; font-weight:700; cursor:pointer; }
        .filter-pill { border:1px solid ${t.filterBorder}; border-radius:30px; padding:6px 16px; font-size:0.85rem; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:8px; background: ${t.filterBg}; color: ${t.filterColor}; transition:all 0.2s; }
        .filter-pill.active { background: ${t.filterActive}; border-color: ${t.filterActBorder}; color: ${t.filterActColor}; }
        .stats-card { background:${t.statsCard || t.cardBg}; border:1px solid ${t.cardBorder}; border-radius:12px; padding:1.5rem; backdrop-filter:blur(16px); transition:all 0.3s; text-align:center; }
        .stats-card:hover { transform: translateY(-4px); }
      `}</style>
      
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ── Header ── */}
        <div style={{ marginBottom:"2.5rem", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px" }}>
              <div style={{ width:"40px", height:"40px", borderRadius:"10px", background: "rgba(99, 102, 241, 0.2)", color: "#6366f1", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <CheckCircle size={20} />
              </div>
              <h1 style={{ fontSize:"1.75rem", fontWeight: 800, margin:0, letterSpacing:"-0.02em" }}>工作進度管理</h1>
            </div>
            <p style={{ color:t.subtitle, margin:0, fontSize:"0.95rem" }}>{user.name} ({user.role}) &bull; 公司管理系統</p>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1.5rem", marginBottom:"2rem" }}>
          {[
            { label:"全部任務", count:counts.all,      color:"#8b5cf6" },
            { label:"待查核",   count:counts.pending,  color:"#fbbf24" },
            { label:"已結案",   count:counts.approved, color:"#10b981" },
            { label:"已退回",   count:counts.returned, color:"#f43f5e" },
          ].map((s,i)=>(
            <div key={i} className="stats-card">
              <div style={{ fontSize:"2rem", fontWeight:800, color:s.color, lineHeight:1 }}>{s.count}</div>
              <div style={{ fontSize:"0.8rem", color:t.subtitle, marginTop:"8px", fontWeight:700 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filter & Add ── */}
        <div style={{ display:"flex", gap:"10px", marginBottom:"2rem", alignItems:"center", flexWrap:"wrap" }}>
          {["all","pending","approved","returned"].map(f => (
            <button key={f} className={`filter-pill ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
              {f==="all"?"全部":f==="pending"?"待查核":f==="approved"?"已結案":"已退回"}
              <span style={{ fontSize:"0.75rem", opacity:0.6 }}>{counts[f]}</span>
            </button>
          ))}
          
          <button onClick={()=>setAddingTask(v=>!v)} style={{ marginLeft:"auto", background:"transparent", border:`1px dashed ${t.cardBorder}`, borderRadius:"10px", padding:"8px 16px", color:t.subtitle, fontSize:"0.85rem", fontWeight:700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <Plus size={16}/> {isManagement ? "指派新任務" : "新增工作回報"}
          </button>
        </div>

        {/* ── Add Inline ── */}
        {addingTask && (
          <div style={{ display:"flex", gap:"12px", marginBottom:"2rem" }}>
            <input
              style={{ flex:1, background:t.inputBg, border:`1px solid ${t.inputBorder}`, borderRadius:"10px", padding:"12px 18px", color:t.inputText, fontSize:"0.95rem", outline:"none" }}
              value={newTask}
              onChange={e=>setNewTask(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&addTask()}
              placeholder={isManagement ? "指派任務內容與目標..." : "輸入今日已完成工作或問題回報..."}
            />
            <button className="approve-btn" onClick={addTask} style={{ padding: "0 24px" }}>
              <Send size={16}/> 送出
            </button>
          </div>
        )}

        {/* ── Task List ── */}
        <div style={{ display:"grid", gap:"1.25rem" }}>
          {filtered.length === 0 && (
            <div className="glass-card" style={{ textAlign:"center", padding:"4rem", color:t.subtitle }}>
               <AlertCircle size={32} style={{ marginBottom: "1rem", opacity: 0.3 }} />
               <div>目前沒有相關工作項目</div>
            </div>
          )}
          {filtered.map((task) => {
            const isAppr = task.status === "approved";
            const badge = badgeFor(task.status);
            const noteOpen = expandedNote[task.id] !== false;

            return (
              <div key={task.id} className="task-card" style={{ padding:"1.5rem", opacity: isAppr ? 0.7 : 1 }}>
                <div style={{ display:"flex", gap:"1.5rem" }}>
                  <div style={{ width:"44px", height:"44px", borderRadius:"10px", background: isAppr ? "rgba(16,185,129,0.1)" : "rgba(99, 102, 241, 0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color: isAppr ? "#10b981" : "#6366f1", flexShrink:0 }}>
                    {task.user.charAt(0)}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px", flexWrap:"wrap" }}>
                      <span style={{ fontWeight:800, fontSize:"0.9rem" }}>{task.user} <span style={{ color:t.subtitle, fontWeight:500 }}>in</span> {task.project}</span>
                      <span style={{ fontSize:"0.72rem", fontWeight:800, padding:"3px 12px", borderRadius:"30px", background:badge.bg, border:`1px solid ${badge.border}`, color:badge.text }}>
                        {labelFor(task.status)}
                      </span>
                    </div>
                    
                    <p style={{ margin:"0 0 10px", fontSize:"1.05rem", fontWeight:600, color: isAppr ? t.taskTextAppr : t.taskText, textDecoration: isAppr ? "line-through" : "none", lineHeight:1.5 }}>
                      {task.content}
                    </p>

                    <div style={{ display:"flex", alignItems:"center", gap:"12px", fontSize:"0.8rem", color:t.metaText }}>
                       <span style={{ display:"flex", alignItems:"center", gap:"4px" }}><Clock size={12}/> {task.time} 提交</span>
                       {task.priority === "high" && <span style={{ color:"#f43f5e", fontWeight:800, display:"flex", alignItems:"center", gap:"3px" }}><AlertCircle size={12}/> 高優先</span>}
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:"8px", alignItems:"center", flexShrink:0 }}>
                    {task.status === "pending" && isManagement && (
                      <>
                        <button className="approve-btn" onClick={()=>approve(task.id)}>核准專案</button>
                        <button className="return-btn" onClick={()=>returnTask(task.id)}>退回修改</button>
                      </>
                    )}
                    {task.status === "returned" && task.user === user.name && (
                      <button className="approve-btn" style={{ background:"#6366f1" }} onClick={()=>resubmit(task.id)}>重新提交</button>
                    )}
                    <button onClick={()=>setExpandedNote(p=>({...p,[task.id]:!noteOpen}))} style={{ background:"transparent", border:"none", color:t.subtitle, cursor:"pointer" }}>
                      {noteOpen ? <ChevronDown size={18} style={{ transform: "rotate(180deg)" }}/> : <ChevronDown size={18}/>}
                    </button>
                  </div>
                </div>

                {noteOpen && (
                  <div style={{ marginTop:"1.25rem", paddingTop:"1.25rem", borderTop:`1px solid ${t.divider}` }}>
                    {task.supervisorNote ? (
                      <div style={{ background:t.noteBg, border:`1px solid ${t.noteBorder}`, borderRadius:"10px", padding:"12px 16px", display:"flex", gap:"10px" }}>
                         <MessageSquare size={16} color={t.noteIcon} style={{ flexShrink:0, marginTop: "2px" }} />
                         <div>
                           <div style={{ fontSize:"0.72rem", fontWeight:800, color:t.noteIcon, textTransform:"uppercase", letterSpacing: "0.05em", marginBottom:"4px" }}>主管意見 / 修正指示</div>
                           <div style={{ color:t.noteText, fontSize:"0.9rem", lineHeight:1.5 }}>{task.supervisorNote}</div>
                         </div>
                      </div>
                    ) : (
                      task.status === "pending" && isManagement && (
                        <input
                          style={{ width:"100%", background:t.inputBg, border:`1px solid ${t.inputBorder}`, borderRadius:"8px", padding:"12px 16px", color:t.inputText, fontSize:"0.9rem", outline:"none" }}
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
    </div>
  );
}
