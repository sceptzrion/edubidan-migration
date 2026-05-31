"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { StudentSidebar } from "@/components/dashboard/student/layout/StudentSidebar";
import { StudentTopbar } from "@/components/dashboard/student/layout/StudentTopbar";
import { StudentBottomNav } from "@/components/dashboard/student/layout/StudentBottomNav";
import { studentMenuItems } from "@/components/dashboard/student/layout/menuItems";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // LOGIKA TAMBAHAN: Deteksi halaman kuis untuk fullscreen
  const isQuizPage = pathname.includes("/quiz/");

  // =========================================================================
  // RENDER KHUSUS HALAMAN KUIS (FULLSCREEN)
  // =========================================================================
  if (isQuizPage) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  // =========================================================================
  // RENDER NORMAL DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen flex bg-background font-sans text-foreground transition-colors duration-300">
      
      <StudentSidebar sidebarOpen={sidebarOpen} menuItems={studentMenuItems} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <StudentTopbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* KONTEN DINAMIS HALAMAN */}
        <main className="flex-1 overflow-y-auto bg-background p-3 sm:p-4 md:p-8 pb-20 sm:pb-24 md:pb-8 scrollbar-thin">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
             {children}
          </div>
        </main>
      </div>

      <StudentBottomNav menuItems={studentMenuItems} />

    </div>
  );
}