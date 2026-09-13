"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  BookOpen,
  LogOut, 
  Moon, 
  Sun, 
  User,
  Menu,
  X,
  Loader2,
  Terminal,
  ChevronRight
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] text-slate-900">
        <Loader2 className="w-9 h-9 animate-spin text-indigo-600 mb-3" />
        <p className="text-slate-500 text-sm font-medium">Verifying your learning session...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "My Documents (RAG)", href: "/dashboard/documents", icon: <FileText className="w-4 h-4" /> },
    { name: "Study Plans", href: "/dashboard/plans", icon: <Calendar className="w-4 h-4" /> },
    { name: "Coding Tutor", href: "/dashboard/coding", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#fafbfc] text-slate-900">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 z-20">
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">
              AI Learning Hub
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className={isActive ? "text-indigo-600" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-500" />}
              </Link>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT COLUMN */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* MOBILE TOP HEADER */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-slate-900">AI Learning Hub</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* MOBILE SIDEBAR OVERLAY */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}>
            <aside 
              className="w-64 h-full bg-white border-r border-slate-200 flex flex-col p-5 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-sm text-slate-900">AI Learning Hub</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* DESKTOP TOP HEADER */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Welcome back</p>
            <h2 className="text-base font-bold text-slate-900">Hey, {user.name} 👋</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </header>

        {/* MAIN BODY VIEWPORT */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#fafbfc]">
          {children}
        </main>
      </div>
    </div>
  );
}
