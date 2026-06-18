"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, LogOut, Menu, Settings } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const isVerifikator = session?.user?.role === "VERIFIKATOR";

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ...(isAdmin ? [
      { name: "Manajemen Akun", href: "/dashboard/users", icon: Users },
      { name: "Isi SPOP", href: "/dashboard/spop", icon: FileText },
      { name: "Isi LSPOP", href: "/dashboard/lspop", icon: FileText },
      { name: "Data SPOP", href: "/dashboard/admin/spop", icon: FileText },
      { name: "Data LSPOP", href: "/dashboard/admin/lspop", icon: FileText },
    ] : isVerifikator ? [
      { name: "Data SPOP", href: "/dashboard/admin/spop", icon: FileText },
      { name: "Data LSPOP", href: "/dashboard/admin/lspop", icon: FileText },
    ] : [
      { name: "Isi SPOP", href: "/dashboard/spop", icon: FileText },
      { name: "Isi LSPOP", href: "/dashboard/lspop", icon: FileText },
      { name: "Data SPOP Anda", href: "/dashboard/my-spop", icon: FileText },
      { name: "Data LSPOP Anda", href: "/dashboard/my-lspop", icon: FileText },
    ]),
    { name: "Pengaturan Akun", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-[var(--sidebar-bg)] border-r border-[var(--border)] w-64 transform transition-transform duration-300 ease-in-out z-20 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 backdrop-blur-xl`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-amber-500">PendanilApp</h1>
            <ThemeToggle />
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-[rgba(59,130,246,0.15)] text-[var(--primary-light)] font-semibold shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]" 
                      : "text-[var(--text-secondary)] hover:bg-[rgba(59,130,246,0.08)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-[var(--primary-light)]" : "text-[var(--text-muted)]"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[var(--border)]">
            <div className="flex items-center p-4 bg-[var(--section-bg)] rounded-xl mb-4 border border-[var(--border-light)]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold shadow-md">
                {session?.user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{session?.user?.username}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{session?.user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-[#f87171] bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.2)] border border-[rgba(239,68,68,0.2)] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-[var(--sidebar-bg)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-[var(--text-secondary)] hover:bg-[var(--section-bg)] rounded-lg md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-amber-500 md:hidden">PendanilApp</h2>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-medium hidden md:block text-[var(--text-primary)]">{session?.user?.username}</span>
            <ThemeToggle />
            <button
              onClick={() => signOut()}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
