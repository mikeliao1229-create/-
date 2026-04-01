"use client";

import { useState, useRef, useEffect } from "react";

import {
  Search, Paperclip, Send, CheckSquare, MoreVertical,
  Folder, Sun, Moon, ShieldCheck, Users, Circle,
  CheckCheck, Clock, ChevronRight, X, Plus, Smile, Image
} from "lucide-react";

// ─── Theme tokens ──────────────────────────────────────────────────────────────
const T = {
  dark: {
    pageBg:          "linear-gradient(135deg,#0b0a1a 0%,#111827 45%,#0d1b2e 100%)",
    orb1:            "radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)",
    orb2:            "radial-gradient(circle,rgba(6,182,212,0.10) 0%,transparent 70%)",
    sidebarBg:       "rgba(255,255,255,0.03)",
    sidebarBorder:   "rgba(255,255,255,0.06)",
    chatBg:          "rgba(255,255,255,0.02)",
    headerBg:        "rgba(255,255,255,0.04)",
    headerBorder:    "rgba(255,255,255,0.07)",
    inputAreaBg:     "rgba(255,255,255,0.04)",
    inputAreaBorder: "rgba(255,255,255,0.07)",
    inputBg:         "rgba(255,255,255,0.06)",
    inputBorder:     "rgba(255,255,255,0.10)",
    inputText:       "rgba(255,255,255,0.88)",
    inputPlaceholder:"rgba(255,255,255,0.28)",
    searchBg:        "rgba(255,255,255,0.06)",
    contactActive:   "rgba(99,102,241,0.18)",
    contactActiveBd: "#6366f1",
    contactHover:    "rgba(255,255,255,0.04)",
    contactBorder:   "rgba(255,255,255,0.05)",
    myBubble:        "linear-gradient(135deg,#6366f1,#4f46e5)",
    myBubbleShadow:  "0 4px 14px rgba(99,102,241,0.35)",
    theirBubble:     "rgba(255,255,255,0.07)",
    theirBubbleBd:   "rgba(255,255,255,0.09)",
    bubbleShadow:    "0 2px 8px rgba(0,0,0,0.25)",
    title:           "#ffffff",
    subtitle:        "rgba(255,255,255,0.36)",
    contactName:     "rgba(255,255,255,0.88)",
    contactMsg:      "rgba(255,255,255,0.40)",
    contactTime:     "rgba(255,255,255,0.28)",
    senderLabel:     "rgba(255,255,255,0.30)",
    msgText:         "rgba(255,255,255,0.88)",
    myMsgText:       "#ffffff",
    iconBtn:         "rgba(255,255,255,0.40)",
    iconBtnHover:    "#818cf8",
    dateDivider:     "rgba(255,255,255,0.12)",
    dateDividerTxt:  "rgba(255,255,255,0.28)",
    scrollTrack:     "rgba(255,255,255,0.04)",
    scrollThumb:     "rgba(255,255,255,0.12)",
    toggleBg:        "rgba(255,255,255,0.08)",
    toggleBd:        "rgba(255,255,255,0.14)",
    toggleColor:     "rgba(255,255,255,0.7)",
    taskToastBg:     "rgba(34,197,94,0.12)",
    taskToastBd:     "rgba(34,197,94,0.25)",
    taskToastTxt:    "#4ade80",
    onlineDot:       "#22c55e",
  },
  light: {
    pageBg:          "linear-gradient(135deg,#eef2ff 0%,#f0f9ff 45%,#faf5ff 100%)",
    orb1:            "radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 70%)",
    orb2:            "radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 70%)",
    sidebarBg:       "rgba(255,255,255,0.65)",
    sidebarBorder:   "rgba(99,102,241,0.10)",
    chatBg:          "rgba(248,250,255,0.50)",
    headerBg:        "rgba(255,255,255,0.80)",
    headerBorder:    "rgba(99,102,241,0.08)",
    inputAreaBg:     "rgba(255,255,255,0.85)",
    inputAreaBorder: "rgba(99,102,241,0.10)",
    inputBg:         "rgba(248,250,255,0.90)",
    inputBorder:     "rgba(99,102,241,0.14)",
    inputText:       "#1e1b4b",
    inputPlaceholder:"#9ca3af",
    searchBg:        "rgba(240,242,255,0.90)",
    contactActive:   "rgba(99,102,241,0.10)",
    contactActiveBd: "#6366f1",
    contactHover:    "rgba(99,102,241,0.04)",
    contactBorder:   "rgba(0,0,0,0.05)",
    myBubble:        "linear-gradient(135deg,#6366f1,#4f46e5)",
    myBubbleShadow:  "0 4px 14px rgba(99,102,241,0.28)",
    theirBubble:     "rgba(255,255,255,0.95)",
    theirBubbleBd:   "rgba(99,102,241,0.10)",
    bubbleShadow:    "0 2px 8px rgba(99,102,241,0.08)",
    title:           "#1e1b4b",
    subtitle:        "#9ca3af",
    contactName:     "#1e1b4b",
    contactMsg:      "#6b7280",
    contactTime:     "#9ca3af",
    senderLabel:     "#9ca3af",
    msgText:         "#1e1b4b",
    myMsgText:       "#ffffff",
    iconBtn:         "#9ca3af",
    iconBtnHover:    "#6366f1",
    dateDivider:     "rgba(0,0,0,0.08)",
    dateDividerTxt:  "#9ca3af",
    scrollTrack:     "rgba(0,0,0,0.03)",
    scrollThumb:     "rgba(99,102,241,0.15)",
    toggleBg:        "rgba(99,102,241,0.07)",
    toggleBd:        "rgba(99,102,241,0.18)",
    toggleColor:     "#6366f1",
    taskToastBg:     "rgba(34,197,94,0.10)",
    taskToastBd:     "rgba(34,197,94,0.22)",
    taskToastTxt:    "#16a34a",
    onlineDot:       "#22c55e",
  },
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const CONTACTS = [
  { id:"g1", name:"📦 採購與商品部",    preview:"日本線單據核對完畢",          time:"10:42", unread:0, members:4, online:true  },
  { id:"g2", name:"🎨 行銷與視覺設計",  preview:"雙11 Banner 尺寸調整好了",    time:"09:15", unread:2, members:5, online:true  },
  { id:"g3", name:"🚚 物流與出貨團隊",  preview:"蝦皮今日出貨單確認中",        time:"昨天",   unread:0, members:3, online:false },
  { id:"u1", name:"Tiffany (美編)",     preview:"老闆，這張圖要壓浮水印嗎？",  time:"昨天",   unread:0, members:1, online:true  },
  { id:"u2", name:"Kevin (採購)",       preview:"日本線廠商 ETA 更新",          time:"週一",   unread:1, members:1, online:false },
];

const MESSAGES_BY_CHAT = {
  g1: [
    { id:1,  sender:"Tiffany",  isMe:false, text:"廠商剛傳了下個月主打品型錄，檔案放在共用資料夾了。", time:"10:28", read:true  },
    { id:2,  sender:"我",       isMe:true,  text:"收到，我等一下看一下。",                           time:"10:31", read:true  },
    { id:3,  sender:"Kevin",    isMe:false, text:"另外，這週末前需要把蝦皮的違禁字詞重新掃描一次，以免被下架。", time:"10:38", read:true,  taskable:true },
    { id:4,  sender:"Tiffany",  isMe:false, text:"還有 91APP 的主頁 Banner 尺寸需要更新為 1920×600。",  time:"10:40", read:false, taskable:true },
    { id:5,  sender:"我",       isMe:true,  text:"好，這兩件我加進任務清單，Kevin 你先處理違禁字，Tiffany 你來 Banner 尺寸。", time:"10:42", read:true  },
  ],
  g2: [
    { id:1, sender:"Amy",    isMe:false, text:"雙11 Banner 尺寸全部調整好了，請老闆確認。", time:"09:10", read:true },
    { id:2, sender:"我",     isMe:true,  text:"我去看看。",                                time:"09:14", read:true },
    { id:3, sender:"Amy",    isMe:false, text:"另外 Shopee 封面圖也需要更新，截止今天下午五點。", time:"09:15", read:false, taskable:true },
  ],
  g3: [{ id:1, sender:"Wendy", isMe:false, text:"蝦皮今日出貨單確認中，預計下午兩點完成。", time:"昨天 15:00", read:true }],
  u1: [{ id:1, sender:"Tiffany", isMe:false, text:"老闆，請問這張圖要壓浮水印嗎？",          time:"昨天 14:20", read:true }],
  u2: [{ id:1, sender:"Kevin",   isMe:false, text:"日本線廠商更新 ETA：11/5 到貨。",        time:"週一 09:00", read:true }],
};

interface Message {
  id: number;
  sender: string;
  isMe: boolean;
  text: string;
  time: string;
  read: boolean;
  taskable?: boolean;
}

interface ChatMessages {
  [key: string]: Message[];
}

interface ChatRoomProps {
  isDark?: boolean;
}

// ─── Task toast ────────────────────────────────────────────────────────────────
function TaskToast({ text, onClose, t }: { text: string; onClose: () => void; t: any }) {
  useEffect(() => { const id = setTimeout(onClose, 3500); return () => clearTimeout(id); }, [onClose]);
  return (
    <div style={{
      position:"fixed", bottom:"2rem", left:"50%", transform:"translateX(-50%)",
      background:t.taskToastBg, border:`1px solid ${t.taskToastBd}`, color:t.taskToastTxt,
      borderRadius:"14px", padding:"10px 18px", fontSize:"0.82rem", fontWeight:600,
      display:"flex", alignItems:"center", gap:"8px",
      backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
      boxShadow:"0 8px 24px rgba(0,0,0,0.2)", zIndex:999,
    }}>
      <style>{`
        @keyframes toastIn {
          from { opacity:0; transform:translateX(-50%) translateY(12px) scale(0.95); }
          to   { opacity:1; transform:translateX(-50%) translateY(0)    scale(1); }
        }
      `}</style>
      <CheckSquare size={15}/> 已新增至任務清單：「{text.slice(0,22)}{text.length>22?"…":""}」
      <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"inherit", padding:0, marginLeft:"4px", display:"flex" }}><X size={13}/></button>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function InternalChatRoom({ isDark = true, user }: ChatRoomProps & { user: any }) {
  const [activeId, setActiveId]   = useState("g1");
  const [inputText, setInputText] = useState("");
  const [msgs, setMsgs]           = useState<ChatMessages>(MESSAGES_BY_CHAT);
  const [toast, setToast]         = useState<string | null>(null);
  const [search, setSearch]       = useState("");
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const t = isDark ? T.dark : T.light;

  const contact    = CONTACTS.find(c => c.id === activeId);
  const messages   = msgs[activeId] || [];
  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.preview.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"auto" });
  }, [activeId, messages.length]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    const newMsg: Message = { id: Date.now(), sender: user?.name || "我", isMe:true, text, time: new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit",hour12:false}), read:false };
    setMsgs(prev => ({ ...prev, [activeId]: [...(prev[activeId]||[]), newMsg] }));
    setInputText("");
  };

  const convertToTask = (msg: Message) => {
    if (user?.role === "STAFF") {
      alert("員工僅能將訊息標記為個人待辦事項");
    }
    setToast(msg.text);
  };

  return (
    <div style={{ height:"100%", background:t.pageBg, fontFamily:"'DM Sans','Noto Sans TC',sans-serif", display:"flex", flexDirection:"column", padding:"1.5rem", gap:"1rem", position:"relative", overflow:"hidden", transition:"background 0.45s" }}>

      {/* Orbs */}
      <div style={{ position:"fixed", top:"-120px", left:"-100px", width:"460px", height:"460px", borderRadius:"50%", background:t.orb1, pointerEvents:"none", transition:"background 0.45s" }}/>
      <div style={{ position:"fixed", bottom:"-80px", right:"-80px",  width:"360px", height:"360px", borderRadius:"50%", background:t.orb2, pointerEvents:"none", transition:"background 0.45s" }}/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; }

        .chat-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(99,102,241,0.2) transparent;
        }
        .chat-scroll::-webkit-scrollbar { width:4px; }
        .chat-scroll::-webkit-scrollbar-track { background:transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { border-radius:4px; background:rgba(99,102,241,0.2); }

        .contact-item {
          padding:12px 16px; cursor:pointer;
          border-left:3px solid transparent;
          transition:all 0.2s ease;
          border-bottom:1px solid;
        }

        .msg-bubble {
          border-radius:18px; padding:10px 14px;
          max-width:68%; line-height:1.55;
          transition:filter 0.2s;
          position:relative;
          word-break:break-word;
        }

        .task-btn {
          border:none; border-radius:10px; cursor:pointer;
          padding:5px 10px; display:flex; align-items:center; gap:5px;
          font-size:0.72rem; font-weight:700; white-space:nowrap;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          color:white; box-shadow:0 0 12px rgba(99,102,241,0.4);
          transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1);
          font-family:'DM Sans','Noto Sans TC',sans-serif;
          opacity:0; transform:translateY(4px) scale(0.92);
        }
        .task-btn.visible {
          opacity:1; transform:translateY(0) scale(1);
        }
        .task-btn:hover { transform:scale(1.07) translateY(-1px)!important; box-shadow:0 0 18px rgba(99,102,241,0.55); }
        .task-btn:active { transform:scale(0.95)!important; }

        .send-btn {
          background:linear-gradient(135deg,#6366f1,#4f46e5);
          color:white; border:none; border-radius:13px;
          width:40px; height:40px; display:flex; align-items:center; justify-content:center;
          cursor:pointer; box-shadow:0 0 14px rgba(99,102,241,0.35);
          transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1); flex-shrink:0;
        }
        .send-btn:hover { transform:scale(1.1); box-shadow:0 0 22px rgba(99,102,241,0.5); }
        .send-btn:active { transform:scale(0.92); }

        .icon-btn {
          background:none; border:none; cursor:pointer; padding:6px; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
          transition:all 0.2s;
        }
        .icon-btn:hover { background:rgba(99,102,241,0.12); }

        @keyframes msgIn {
          from { opacity:0; transform:translateY(8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .msg-in { animation:msgIn 0.25s ease forwards; }

        .dot-blink { animation:blink 1.8s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .unread-badge {
          background:#ef4444; color:white; font-size:0.65rem; font-weight:800;
          min-width:18px; height:18px; border-radius:9px; padding:0 5px;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 0 8px rgba(239,68,68,0.5);
        }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"linear-gradient(135deg,#6366f1,#06b6d4)", display:"flex", alignItems:"center", justifySelf:"center", justifyContent:"center", boxShadow:"0 0 16px rgba(99,102,241,0.40)", flexShrink:0 }}>
            <ShieldCheck size={17} color="white"/>
          </div>
          <div>
            <h1 style={{ fontSize:"1.4rem", fontWeight:700, color:t.title, margin:0, letterSpacing:"-0.02em", transition:"color 0.4s" }}>內部通訊中心</h1>
            <p style={{ color:t.subtitle, margin:0, fontSize:"0.75rem", transition:"color 0.4s" }}>Internal Messaging & File Hub</p>
          </div>
        </div>
      </div>

      {/* ── Chat shell ── */}
      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", flex:1, minHeight:0, borderRadius:"22px", overflow:"hidden", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", border:`1px solid ${t.sidebarBorder}`, boxShadow:"0 12px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)", transition:"border 0.45s, box-shadow 0.45s" }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ background:t.sidebarBg, borderRight:`1px solid ${t.sidebarBorder}`, display:"flex", flexDirection:"column", transition:"background 0.45s, border 0.45s" }}>

          {/* Search */}
          <div style={{ padding:"14px 14px 10px", borderBottom:`1px solid ${t.sidebarBorder}`, flexShrink:0 }}>
            <div style={{ position:"relative" }}>
              <Search size={15} style={{ position:"absolute", left:"11px", top:"50%", transform:"translateY(-50%)", color:t.iconBtn }}/>
              <input
                value={search}
                onChange={e=>setSearch(e.target.value)}
                placeholder="搜尋對話或聯絡人..."
                style={{ width:"100%", background:t.searchBg, border:`1px solid ${t.inputBorder}`, borderRadius:"11px", padding:"8px 12px 8px 32px", fontSize:"0.8rem", color:t.inputText, outline:"none", transition:"all 0.3s", fontFamily:"inherit" }}
              />
            </div>
          </div>

          {/* Contact list */}
          <div className="chat-scroll" style={{ flex:1, overflowY:"auto" }}>
            {filteredContacts.map(c => {
              const active = activeId === c.id;
              return (
                <div key={c.id} className="contact-item"
                  onClick={()=>setActiveId(c.id)}
                  style={{
                    background: active ? t.contactActive : "transparent",
                    borderLeftColor: active ? t.contactActiveBd : "transparent",
                    borderBottomColor: t.contactBorder,
                  }}
                  onMouseEnter={e=>{ if(!active) e.currentTarget.style.background=t.contactHover; }}
                  onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}
                >
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"6px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", minWidth:0 }}>
                      {/* Avatar */}
                      <div style={{ position:"relative", flexShrink:0 }}>
                        <div style={{ width:"38px", height:"38px", borderRadius:"12px", background: active ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", transition:"background 0.3s" }}>
                          {c.name.charAt(0)}
                        </div>
                        {c.online && <span className="dot-blink" style={{ position:"absolute", bottom:"1px", right:"1px", width:"8px", height:"8px", borderRadius:"50%", background:t.onlineDot, border:"2px solid transparent", boxSizing:"content-box" }}/>}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:"0.83rem", fontWeight:700, color:t.contactName, transition:"color 0.4s", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"140px" }}>{c.name}</div>
                        <div style={{ fontSize:"0.72rem", color:t.contactMsg, transition:"color 0.4s", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"140px" }}>{c.preview}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"4px", flexShrink:0 }}>
                      <span style={{ fontSize:"0.65rem", color:t.contactTime, whiteSpace:"nowrap", transition:"color 0.4s" }}>{c.time}</span>
                      {c.unread > 0 && <span className="unread-badge">{c.unread}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* New conversation */}
          <div style={{ padding:"10px 14px", borderTop:`1px solid ${t.sidebarBorder}`, flexShrink:0 }}>
            <button style={{ width:"100%", padding:"8px", borderRadius:"11px", border:`1px dashed ${t.inputBorder}`, background:"transparent", color:t.iconBtn, cursor:"pointer", fontSize:"0.78rem", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", transition:"all 0.2s", fontFamily:"inherit" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(99,102,241,0.4)"; e.currentTarget.style.color="#818cf8"; e.currentTarget.style.background="rgba(99,102,241,0.06)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=t.inputBorder; e.currentTarget.style.color=t.iconBtn; e.currentTarget.style.background="transparent"; }}>
              <Plus size={14}/> 發起新對話
            </button>
          </div>
        </div>

        {/* ── RIGHT CHAT WINDOW ── */}
        <div style={{ background:t.chatBg, display:"flex", flexDirection:"column", transition:"background 0.45s", minWidth:0 }}>

          {/* Chat header */}
          <div style={{ padding:"0 1.4rem", height:"62px", display:"flex", alignItems:"center", justifyContent:"space-between", background:t.headerBg, borderBottom:`1px solid ${t.headerBorder}`, flexShrink:0, transition:"background 0.45s, border 0.45s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem" }}>
                {contact?.name.charAt(0) || ""}
              </div>
              <div>
                <div style={{ fontSize:"0.95rem", fontWeight:700, color:t.title, lineHeight:1.2, transition:"color 0.4s" }}>{contact?.name || ""}</div>
                <div style={{ fontSize:"0.7rem", color:t.subtitle, display:"flex", alignItems:"center", gap:"5px", transition:"color 0.4s" }}>
                  <Users size={10}/>
                  {contact && contact.members > 1 ? `${contact.members} 名成員` : "直接訊息"}
                  {contact?.online && <><span style={{ width:"5px", height:"5px", borderRadius:"50%", background:t.onlineDot, display:"inline-block" }}/> 線上</>}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"4px" }}>
              {[<Folder size={17} key="folder"/>, <MoreVertical size={17} key="more"/>].map((icon,i)=>(
                <button key={i} className="icon-btn" style={{ color:t.iconBtn, transition:"color 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color=t.iconBtnHover}
                  onMouseLeave={e=>e.currentTarget.style.color=t.iconBtn}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Messages area */}
          <div className="chat-scroll" style={{ flex:1, overflowY:"auto", padding:"1.2rem 1.4rem", display:"flex", flexDirection:"column", gap:"6px" }}>

            {/* Date divider */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", margin:"4px 0 10px" }}>
              <div style={{ flex:1, height:"1px", background:t.dateDivider }}/>
              <span style={{ fontSize:"0.68rem", color:t.dateDividerTxt, fontWeight:600, letterSpacing:"0.04em", whiteSpace:"nowrap" }}>今天</span>
              <div style={{ flex:1, height:"1px", background:t.dateDivider }}/>
            </div>

            {messages.map((msg: Message, idx: number) => {
              const isHovered = hoveredMsg === msg.id;
              const showAvatar = !msg.isMe && (idx===0 || (messages[idx-1] && messages[idx-1].sender !== msg.sender));
              return (
                <div key={msg.id} className="msg-in"
                  style={{ display:"flex", flexDirection:"column", alignItems: msg.isMe ? "flex-end" : "flex-start" }}
                  onMouseEnter={()=>setHoveredMsg(msg.id)}
                  onMouseLeave={()=>setHoveredMsg(null)}
                >
                  {/* Sender label */}
                  {!msg.isMe && showAvatar && (
                    <span style={{ fontSize:"0.68rem", color:t.senderLabel, marginBottom:"3px", marginLeft:"4px", fontWeight:600, transition:"color 0.4s" }}>{msg.sender} · {msg.time}</span>
                  )}
                  {msg.isMe && (
                    <span style={{ fontSize:"0.68rem", color:t.senderLabel, marginBottom:"3px", marginRight:"4px", transition:"color 0.4s" }}>{msg.time} · {msg.read ? <CheckCheck size={11} style={{display:"inline",color:"#6366f1"}}/> : <Clock size={11} style={{display:"inline"}}/>}</span>
                  )}

                  {/* Bubble row */}
                  <div style={{ display:"flex", alignItems:"flex-end", gap:"8px", flexDirection: msg.isMe ? "row-reverse" : "row" }}>
                    {/* Avatar (their messages) */}
                    {!msg.isMe && (
                      <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"rgba(99,102,241,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:700, color:"#818cf8", flexShrink:0, visibility: showAvatar ? "visible" : "hidden" }}>
                        {msg.sender.charAt(0)}
                      </div>
                    )}

                    <div style={{ display:"flex", alignItems:"flex-end", gap:"8px", flexDirection: msg.isMe ? "row-reverse" : "row" }}>
                      <div className="msg-bubble" style={{
                        background: msg.isMe ? t.myBubble : t.theirBubble,
                        border: msg.isMe ? "none" : `1px solid ${t.theirBubbleBd}`,
                        borderBottomRightRadius: msg.isMe ? "4px" : "18px",
                        borderBottomLeftRadius:  msg.isMe ? "18px" : "4px",
                        boxShadow: msg.isMe ? t.myBubbleShadow : t.bubbleShadow,
                        color: msg.isMe ? t.myMsgText : t.msgText,
                        fontSize:"0.875rem",
                      }}>
                        {msg.text}
                      </div>

                      {/* Convert-to-task button */}
                      {!msg.isMe && msg.taskable && (
                        <button className={`task-btn ${isHovered ? "visible" : ""}`}
                          onClick={()=>convertToTask(msg)}
                          title="轉為任務">
                          <CheckSquare size={12}/> 轉為任務
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef}/>
          </div>

          {/* Input area */}
          <div style={{ padding:"12px 14px", background:t.inputAreaBg, borderTop:`1px solid ${t.inputAreaBorder}`, flexShrink:0, transition:"background 0.45s, border 0.45s" }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:"8px", background:t.inputBg, border:`1px solid ${t.inputBorder}`, borderRadius:"16px", padding:"8px 10px", transition:"all 0.3s" }}>
              {[<Paperclip size={16} key="clip"/>, <Image size={16} key="img"/>, <Smile size={16} key="smile"/>].map((icon,i)=>(
                <button key={i} className="icon-btn" style={{ color:t.iconBtn, flexShrink:0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color=t.iconBtnHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color=t.iconBtn; }}>
                  {icon}
                </button>
              ))}
              <textarea
                value={inputText}
                onChange={e=>setInputText(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendMessage(); } }}
                placeholder="輸入訊息，Enter 送出…"
                rows={1}
                style={{ flex:1, background:"transparent", border:"none", outline:"none", resize:"none", fontSize:"0.875rem", color:t.inputText, lineHeight:1.5, maxHeight:"100px", padding:"2px 4px", fontFamily:"inherit", transition:"color 0.4s" }}
              />
              <button className="send-btn" onClick={sendMessage}><Send size={16}/></button>
            </div>
            <div style={{ fontSize:"0.67rem", color:t.subtitle, marginTop:"5px", paddingLeft:"4px" }}>Enter 送出 · Shift+Enter 換行</div>
          </div>
        </div>
      </div>

      {/* Task toast */}
      {toast && <TaskToast text={toast} t={t} onClose={()=>setToast(null)}/>}
    </div>
  );
}
