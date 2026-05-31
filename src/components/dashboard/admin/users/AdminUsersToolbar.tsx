"use client";

import { Search, Shield } from "lucide-react";

import type {
  AdminUserRole,
  AdminUserStatus,
} from "@/data/learning/admin/admin-users";

interface AdminUsersToolbarProps {
  search: string;
  roleFilter: "Semua" | AdminUserRole;
  statusFilter: "Semua" | AdminUserStatus;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: "Semua" | AdminUserRole) => void;
  onStatusFilterChange: (value: "Semua" | AdminUserStatus) => void;
}

const statusOptions: ("Semua" | AdminUserStatus)[] = [
  "Semua",
  "Aktif",
  "Nonaktif",
];

export function AdminUsersToolbar({
  search,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
}: AdminUsersToolbarProps) {
  return (
    <div className="p-4 sm:p-5 border-b border-border bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-80">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari nama, email, NIM, atau NIDN..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(event) =>
              onRoleFilterChange(event.target.value as "Semua" | AdminUserRole)
            }
            className="w-full sm:w-auto pl-4 pr-10 py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm font-bold outline-none appearance-none cursor-pointer shadow-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="Semua">Semua Peran</option>
            <option value="Mahasiswa">Mahasiswa</option>
            <option value="Dosen">Dosen</option>
          </select>

          <Shield
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-xl border border-border/50 overflow-x-auto scrollbar-none">
        {statusOptions.map((status) => {
          const isActive = statusFilter === status;

          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusFilterChange(status)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-card text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
}