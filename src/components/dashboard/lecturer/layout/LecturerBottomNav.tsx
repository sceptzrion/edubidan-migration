"use client";

import { usePathname, useRouter } from "next/navigation";

import type { LecturerMenuItem } from "@/components/dashboard/lecturer/layout/menuItems";

interface LecturerBottomNavProps {
  menuItems: LecturerMenuItem[];
}

export function LecturerBottomNav({ menuItems }: LecturerBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard/lecturer") {
      return pathname === "/dashboard/lecturer";
    }

    return pathname.startsWith(path);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 sm:h-18 bg-card border-t border-border z-40 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {menuItems.map((item) => {
        const active = isActive(item.path);

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 sm:space-y-1.5 transition-colors ${
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <item.icon
                size={22}
                className={`sm:w-6 sm:h-6 ${active ? "fill-primary/20" : ""}`}
              />

              {active && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
              )}
            </div>

            <span
              className={`text-[10px] sm:text-[11px] font-extrabold ${
                active ? "text-primary" : ""
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}