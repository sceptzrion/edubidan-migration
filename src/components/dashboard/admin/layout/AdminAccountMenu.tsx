"use client";

import { Home, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminAccountMenuProps {
  onClose: () => void;
}

export function AdminAccountMenu({ onClose }: AdminAccountMenuProps) {
  const router = useRouter();

  const navigateTo = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] w-48 sm:w-56 bg-card border border-border rounded-2xl shadow-xl py-1.5 sm:py-2 z-50 animate-in slide-in-from-top-2 duration-200 overflow-hidden">
      <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-border mb-1 bg-muted/30">
        <p className="text-xs sm:text-sm font-extrabold text-foreground">
          Administrator
        </p>

        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5 truncate">
          admin@edubidan.id
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigateTo("/dashboard/admin/settings")}
        className="w-full flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <User size={16} className="sm:w-4.5 sm:h-4.5" />
        Profil Admin
      </button>

      <button
        type="button"
        onClick={() => navigateTo("/")}
        className="w-full flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Home size={16} className="sm:w-4.5 sm:h-4.5" />
        Halaman Utama
      </button>

      <div className="border-t border-border mt-1 pt-1">
        <button
          type="button"
          onClick={() => navigateTo("/")}
          className="w-full flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-extrabold text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} className="sm:w-4.5 sm:h-4.5" />
          Keluar
        </button>
      </div>
    </div>
  );
}