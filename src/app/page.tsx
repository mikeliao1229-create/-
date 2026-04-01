"use client";

import { useState, useEffect } from "react";
import CheckInPanel from "@/components/CheckInPanel";
import DailyTaskManager from "@/components/DailyTaskManager";
import InternalChatRoom from "@/components/InternalChatRoom";
import SuperAdminDashboard from "@/components/SuperAdminDashboard";
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck,
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Bell
} from "lucide-react";

interface AppConfig {
  id: string;
  name: string;
  icon: any;
  component: React.ComponentType<{ isDark: boolean; user: any }>;
  color: string;
}

const apps: AppConfig[] = [
  { id: "dashboard", name: "總覽面板", icon: LayoutDashboard, component: SuperAdminDashboard as any, color: "#6366f1" },
  { id: "checkin", name: "差勤打卡", icon: Clock, component: CheckInPanel as any, color: "#06b6d4" },
  { id: "tasks", name: "工作管理", icon: CheckCircle2, component: DailyTaskManager as any, color: "#8b5cf6" },
  { id: "chat", name: "內部訊息", icon: MessageSquare, component: InternalChatRoom as any, color: "#f43f5e" },
];

export default function Home() {
  const [activeApp, setActiveApp] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(true);
  
  // Mock User State
  const [user, setUser] = useState({
    email: "mikeliao1229@gmail.com",
    name: "adminhao",
    role: "SUPER_ADMIN", // 改成 OWNER, ACCOUNTANT, STAFF 測試權限
  });

  // Mock Notifications
  const [unreadCount, setUnreadCount] = useState(3);
  const [notification, setNotification] = useState<{msg: string, sender: string} | null>(null);

  // Simulate incoming message
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification({ msg: "老闆，新的報關單已經上傳了！", sender: "Kevin (採購)" });
      setUnreadCount(prev => prev + 1);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const ActiveComponent = apps.find(a => a.id === activeApp)?.component || SuperAdminDashboard;

  const handleLogout = () => {
    alert("正在登出...");
    // 這裡未來會接 Supabase signOut
  };

  return (
    <div className={`flex h-screen ${isDark ? "bg-[#0b0a1a] text-white" : "bg-[#f8fafc] text-slate-900"} font-sans overflow-hidden transition-colors duration-500`}>
      {/* Sidebar - Always Dark */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out bg-[#0f0e1a] text-white backdrop-blur-xl border-r border-white/10 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight">星鏈系統</span>
            </div>
          ) : (
            <ShieldCheck size={24} className="mx-auto text-indigo-500" />
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {apps.map((app) => {
            // Role Based Visibility
            if (app.id === "dashboard" && user.role !== "SUPER_ADMIN" && user.role !== "OWNER") return null;
            
            return (
              <button
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                  activeApp === app.id 
                    ? "bg-white/10 text-white shadow-lg" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <app.icon size={20} style={{ color: activeApp === app.id ? app.color : "inherit" }} />
                {isSidebarOpen && <span className="font-medium text-sm">{app.name}</span>}
                
                {/* Unread Badge */}
                {app.id === "chat" && unreadCount > 0 && (
                  <div className={`absolute ${isSidebarOpen ? "right-10" : "right-2 top-2"} min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 shadow-lg animate-pulse`}>
                    {unreadCount}
                  </div>
                )}

                {activeApp === app.id && isSidebarOpen && (
                  <div className="ml-auto w-1 h-5 rounded-full" style={{ backgroundColor: app.color }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action area */}
        <div className="p-4 border-t border-white/5 space-y-2">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-white/40 hover:text-white hover:bg-white/5"
            title={isDark ? "切換至淺色模式" : "切換至深色模式"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isSidebarOpen && <span className="font-medium text-sm">{isDark ? "淺色模式" : "深色模式"}</span>}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium text-sm">登出系統</span>}
          </button>

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-white/40 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {/* Background glow */}
        {isDark && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
          </div>
        )}
        
        <div className="relative z-10 flex-1 overflow-auto">
          <ActiveComponent isDark={isDark} user={user} />
        </div>

        {/* Notification Toast */}
        {notification && (
          <div 
            className="fixed top-6 right-6 z-[100] w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 flex gap-4 cursor-pointer transform transition-all duration-500 ease-out animate-notification-in"
            onClick={() => { setActiveApp("chat"); setNotification(null); }}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white flex-shrink-0">
              <Bell size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-indigo-500 mb-1">{notification.sender}</div>
              <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{notification.msg}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setNotification(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes notification-in {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-notification-in {
          animation: notification-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
