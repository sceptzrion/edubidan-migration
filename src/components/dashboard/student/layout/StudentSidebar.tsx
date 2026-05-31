"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { EduBidanLogo } from "@/components/ui/EduBidanLogo";
import type { MenuItem } from "@/components/dashboard/student/layout/menuItems";

interface StudentSidebarProps {
  sidebarOpen: boolean;
  menuItems: MenuItem[];
}

export function StudentSidebar({
  sidebarOpen,
  menuItems,
}: StudentSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out shrink-0 z-50 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="h-16 md:h-18 flex items-center justify-center border-b border-border px-4 shrink-0 overflow-hidden">
        <EduBidanLogo size="sm" showText={sidebarOpen} />
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {menuItems.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => router.push(item.path)}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all group relative overflow-hidden ${
              isActive(item.path)
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon size={20} className="shrink-0" />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border shrink-0">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all overflow-hidden"
        >
          <LogOut size={20} className="shrink-0" />
          <span
            className={`whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Keluar
          </span>
        </button>
      </div>
    </aside>
  );
}