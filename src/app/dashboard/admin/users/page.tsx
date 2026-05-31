"use client";

import { useMemo, useState } from "react";

import { DeleteUserConfirmModal } from "@/components/dashboard/admin/users/DeleteUserConfirmModal";
import { UserDetailModal } from "@/components/dashboard/admin/users/UserDetailModal";
import { UserFormModal } from "@/components/dashboard/admin/users/UserFormModal";
import { AdminUsersHeader } from "@/components/dashboard/admin/users/AdminUsersHeader";
import { AdminUsersTable } from "@/components/dashboard/admin/users/AdminUsersTable";
import { AdminUsersToolbar } from "@/components/dashboard/admin/users/AdminUsersToolbar";
import {
  adminUsers,
  filterAdminUsers,
  type AdminUser,
  type AdminUserModalState,
  type AdminUserRole,
  type AdminUserStatus,
} from "@/data/learning/admin/admin-users";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | AdminUserStatus>(
    "Semua"
  );
  const [roleFilter, setRoleFilter] = useState<"Semua" | AdminUserRole>(
    "Semua"
  );
  const [modal, setModal] = useState<AdminUserModalState>({ mode: null });
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    return filterAdminUsers(users, search, roleFilter, statusFilter);
  }, [users, search, roleFilter, statusFilter]);

  const closeModal = () => setModal({ mode: null });

  const handleDeleteUser = (id: number) => {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
    setDeleteTarget(null);
  };

  const handleSaveUser = (data: Partial<AdminUser>) => {
    if (modal.mode === "add") {
      setUsers((currentUsers) => [
        ...currentUsers,
        {
          ...data,
          id: Date.now(),
        } as AdminUser,
      ]);
    }

    if (modal.mode === "edit" && modal.user) {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === modal.user?.id ? { ...user, ...data } : user
        )
      );
    }

    closeModal();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <AdminUsersHeader onAddUser={() => setModal({ mode: "add" })} />

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-sm">
        <AdminUsersToolbar
          search={search}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onRoleFilterChange={setRoleFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <AdminUsersTable
          users={filteredUsers}
          onView={(user) => setModal({ mode: "detail", user })}
          onEdit={(user) => setModal({ mode: "edit", user })}
          onDelete={(user) => setDeleteTarget(user)}
        />
      </div>

      {(modal.mode === "add" || modal.mode === "edit") && (
        <UserFormModal
          mode={modal.mode}
          user={modal.user}
          onClose={closeModal}
          onSave={handleSaveUser}
        />
      )}

      {modal.mode === "detail" && modal.user && (
        <UserDetailModal user={modal.user} onClose={closeModal} />
      )}

      {deleteTarget && (
        <DeleteUserConfirmModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteUser}
        />
      )}
    </div>
  );
}