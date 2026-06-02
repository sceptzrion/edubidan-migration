"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

import { DeleteUserConfirmModal } from "@/components/dashboard/admin/users/DeleteUserConfirmModal";
import { UserDetailModal } from "@/components/dashboard/admin/users/UserDetailModal";
import { UserFormModal } from "@/components/dashboard/admin/users/UserFormModal";
import { AdminUsersHeader } from "@/components/dashboard/admin/users/AdminUsersHeader";
import { AdminUsersTable } from "@/components/dashboard/admin/users/AdminUsersTable";
import { AdminUsersToolbar } from "@/components/dashboard/admin/users/AdminUsersToolbar";
import { AppToast, type AppToastState } from "@/components/ui/AppToast";
import {
  filterAdminUsers,
  type AdminUser,
  type AdminUserModalState,
  type AdminUserRole,
  type AdminUserStatus,
} from "@/data/learning/admin/admin-users";
import {
  buildCreateUserPayload,
  buildUpdateUserPayload,
  mapAdminStatusToIsActive,
  mapApiUserToAdminUser,
  sortAdminUsers,
  type AdminUserFormData,
  type AdminUserSortDirection,
  type AdminUserSortKey,
  type UserApiResponse,
  type UsersApiResponse,
} from "@/lib/admin/users-admin-adapter";

function getFriendlyUserError(message: string) {
  const messages: Record<string, string> = {
    "Name is required": "Nama pengguna wajib diisi.",
    "Email is required": "Email wajib diisi.",
    "Password is required": "Kata sandi wajib diisi.",
    "Password must be at least 8 characters":
      "Kata sandi minimal harus 8 karakter.",
    "Role must be MAHASISWA or DOSEN": "Peran harus Mahasiswa atau Dosen.",
    "NPM or NIDN/NIP is required": "NPM atau NIDN/NIP wajib diisi.",
    "NPM must contain 10 to 20 digits": "NPM harus berisi 10 sampai 20 digit.",
    "NIDN/NIP must contain 5 to 30 letters, numbers, dots, or dashes":
      "NIDN/NIP harus berisi 5 sampai 30 karakter.",
    "Mahasiswa email must match npm@student.unsika.ac.id":
      "Email mahasiswa harus sesuai format NPM, contoh: npm@student.unsika.ac.id.",
    "Dosen email must use @staff.unsika.ac.id domain":
      "Email dosen harus menggunakan domain @staff.unsika.ac.id.",
    "Email is already used": "Email sudah digunakan.",
    "NPM or NIDN/NIP is already used": "NPM atau NIDN/NIP sudah digunakan.",
    "User not found": "Pengguna tidak ditemukan.",
    "Name cannot be empty": "Nama pengguna tidak boleh kosong.",
    "Email cannot be empty": "Email tidak boleh kosong.",
    "NPM or NIDN/NIP cannot be empty": "NPM atau NIDN/NIP tidak boleh kosong.",
    "isActive boolean is required": "Status akun tidak valid.",
    "Admin account cannot be deleted": "Akun admin tidak dapat dihapus.",
    "User must be inactive before permanent deletion":
      "Akun harus dinonaktifkan sebelum dapat dihapus permanen.",
    "User cannot be deleted because related learning data already exists":
      "Pengguna tidak dapat dihapus karena sudah memiliki data pembelajaran terkait.",
    "User deleted permanently": "Pengguna berhasil dihapus permanen.",
  };

  return (
    messages[message] ?? "Aksi gagal. Silakan periksa kembali data pengguna."
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | AdminUserStatus>(
    "Semua"
  );
  const [roleFilter, setRoleFilter] = useState<"Semua" | AdminUserRole>(
    "Semua"
  );

  const [sortBy, setSortBy] = useState<AdminUserSortKey>("name");
  const [sortDirection, setSortDirection] =
    useState<AdminUserSortDirection>("asc");

  const [modal, setModal] = useState<AdminUserModalState>({ mode: null });
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toast, setToast] = useState<AppToastState>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const filteredUsers = useMemo(() => {
    const filtered = filterAdminUsers(users, search, roleFilter, statusFilter);

    return sortAdminUsers(filtered, sortBy, sortDirection);
  }, [users, search, roleFilter, statusFilter, sortBy, sortDirection]);

  const closeModal = () => setModal({ mode: null });

  const showToast = useCallback((nextToast: NonNullable<AppToastState>) => {
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToast(nextToast);

    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/users", {
        method: "GET",
        cache: "no-store",
      });

      const result = (await response.json()) as UsersApiResponse;

      if (!response.ok || !result.success || !result.data) {
        const message = result.message || "Gagal mengambil data pengguna.";

        setErrorMessage(message);
        showToast({
          type: "error",
          title: "Data pengguna gagal dimuat",
          message,
        });
        return;
      }

      const mappedUsers = result.data
        .filter((user) => user.role !== "ADMIN")
        .map(mapApiUserToAdminUser);

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Load users error:", error);

      const message =
        "Terjadi kesalahan koneksi saat mengambil data pengguna.";

      setErrorMessage(message);
      showToast({
        type: "error",
        title: "Koneksi bermasalah",
        message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const updateUserStatus = async (targetUser: AdminUser, isActive: boolean) => {
    const response = await fetch(`/api/users/${targetUser.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isActive,
      }),
    });

    const result = (await response.json()) as UserApiResponse;

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.message);
    }

    return result.data;
  };

  const handleToggleUserStatus = async (targetUser: AdminUser) => {
    if (isMutating) return;

    setIsMutating(true);
    setErrorMessage("");

    const nextIsActive = targetUser.status !== "Aktif";

    try {
      const updatedApiUser = await updateUserStatus(targetUser, nextIsActive);
      const updatedUser = mapApiUserToAdminUser(updatedApiUser);

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === targetUser.id ? updatedUser : user
        )
      );

      showToast({
        type: "success",
        title:
          updatedUser.status === "Aktif"
            ? "Akun berhasil diaktifkan"
            : "Akun berhasil dinonaktifkan",
        message: `${updatedUser.name} sekarang berstatus ${updatedUser.status}.`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? getFriendlyUserError(error.message)
          : "Terjadi kesalahan koneksi saat memperbarui status akun.";

      setErrorMessage(message);
      showToast({
        type: "error",
        title: "Status akun gagal diperbarui",
        message,
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const targetUser = users.find((user) => user.id === id);

    if (!targetUser) {
      setDeleteTarget(null);
      return;
    }

    if (targetUser.status !== "Nonaktif") {
      const message =
        "Akun aktif harus dinonaktifkan terlebih dahulu sebelum dapat dihapus permanen.";

      setErrorMessage(message);
      showToast({
        type: "warning",
        title: "Akun masih aktif",
        message,
      });
      setDeleteTarget(null);
      return;
    }

    if (isMutating) return;

    setIsMutating(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as {
        success: boolean;
        message: string;
        data: { id: number } | null;
      };

      if (!response.ok || !result.success || !result.data) {
        const message = getFriendlyUserError(result.message);

        setErrorMessage(message);
        showToast({
          type: "error",
          title: "Pengguna gagal dihapus",
          message,
        });
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== result.data?.id)
      );
      setDeleteTarget(null);

      showToast({
        type: "success",
        title: "Pengguna berhasil dihapus",
        message: `${targetUser.name} sudah dihapus permanen dari sistem.`,
      });
    } catch (error) {
      console.error("Delete user error:", error);

      const message = "Terjadi kesalahan koneksi saat menghapus pengguna.";

      setErrorMessage(message);
      showToast({
        type: "error",
        title: "Koneksi bermasalah",
        message,
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleSaveUser = async (data: AdminUserFormData) => {
    if (isMutating) return;

    setIsMutating(true);
    setErrorMessage("");

    try {
      if (modal.mode === "add") {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildCreateUserPayload(data)),
        });

        const result = (await response.json()) as UserApiResponse;

        if (!response.ok || !result.success || !result.data) {
          const message = getFriendlyUserError(result.message);

          setErrorMessage(message);
          showToast({
            type: "error",
            title: "Pengguna gagal ditambahkan",
            message,
          });
          return;
        }

        let createdApiUser = result.data;

        if (data.status === "Nonaktif") {
          createdApiUser = await updateUserStatus(
            mapApiUserToAdminUser(createdApiUser),
            false
          );
        }

        const createdUser = mapApiUserToAdminUser(createdApiUser);

        setUsers((currentUsers) => [createdUser, ...currentUsers]);
        closeModal();

        showToast({
          type: "success",
          title: "Pengguna berhasil ditambahkan",
          message: `${createdUser.name} berhasil ditambahkan ke sistem.`,
        });

        return;
      }

      if (modal.mode === "edit" && modal.user) {
        const response = await fetch(`/api/users/${modal.user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildUpdateUserPayload(data)),
        });

        const result = (await response.json()) as UserApiResponse;

        if (!response.ok || !result.success || !result.data) {
          const message = getFriendlyUserError(result.message);

          setErrorMessage(message);
          showToast({
            type: "error",
            title: "Pengguna gagal diperbarui",
            message,
          });
          return;
        }

        let updatedApiUser = result.data;

        if (data.status && data.status !== modal.user.status) {
          updatedApiUser = await updateUserStatus(
            mapApiUserToAdminUser(updatedApiUser),
            mapAdminStatusToIsActive(data.status)
          );
        }

        const updatedUser = mapApiUserToAdminUser(updatedApiUser);

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === modal.user?.id ? updatedUser : user
          )
        );
        closeModal();

        showToast({
          type: "success",
          title: "Pengguna berhasil diperbarui",
          message: `Data ${updatedUser.name} berhasil disimpan.`,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? getFriendlyUserError(error.message)
          : "Terjadi kesalahan koneksi saat menyimpan pengguna.";

      setErrorMessage(message);
      showToast({
        type: "error",
        title: "Data pengguna gagal disimpan",
        message,
      });
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <AdminUsersHeader onAddUser={() => setModal({ mode: "add" })} />

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-sm">
        <AdminUsersToolbar
          search={search}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSearchChange={setSearch}
          onRoleFilterChange={setRoleFilter}
          onStatusFilterChange={setStatusFilter}
          onSortByChange={setSortBy}
          onSortDirectionChange={setSortDirection}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mb-3 animate-spin" size={28} />
            <p className="text-sm font-semibold">Memuat data pengguna...</p>
          </div>
        ) : (
          <AdminUsersTable
            users={filteredUsers}
            onView={(user) => setModal({ mode: "detail", user })}
            onEdit={(user) => setModal({ mode: "edit", user })}
            onToggleStatus={handleToggleUserStatus}
            onDelete={(user) => setDeleteTarget(user)}
          />
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => void loadUsers()}
          disabled={isLoading || isMutating}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh Data
        </button>
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

      <AppToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}