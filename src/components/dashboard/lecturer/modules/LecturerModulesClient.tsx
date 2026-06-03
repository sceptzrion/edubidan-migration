"use client";

import { useMemo, useState } from "react";

import { ModuleFormModal } from "@/components/dashboard/lecturer/modules/ModuleFormModal";
import { LecturerModulesGrid } from "@/components/dashboard/lecturer/modules/list/LecturerModulesGrid";
import { LecturerModulesHeader } from "@/components/dashboard/lecturer/modules/list/LecturerModulesHeader";
import {
  filterLecturerModules,
  type LecturerModule,
  type LecturerModuleFormValue,
  type LecturerModuleStatus,
} from "@/data/learning/lecturer/lecturer-modules";

type ModuleApiData = {
  id: number;
  title: string;
  bannerUrl: string | null;
  accessCode: string;
  status: "DRAFT" | "PUBLIK";
  updatedAt: string;
  stats?: {
    totalMateri?: number;
  };
  contents?: Array<{
    kind: "MATERI" | "KUIS";
  }>;
};

type ModuleApiResponse = {
  success: boolean;
  message: string;
  data: ModuleApiData | null;
};

interface LecturerModulesClientProps {
  initialModules: LecturerModule[];
}

function formatUpdatedAt(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Hari ini";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function mapApiStatus(status: ModuleApiData["status"]): LecturerModuleStatus {
  if (status === "PUBLIK") {
    return "Publik";
  }

  return "Draft";
}

function getMaterialCount(module: ModuleApiData) {
  if (typeof module.stats?.totalMateri === "number") {
    return module.stats.totalMateri;
  }

  if (Array.isArray(module.contents)) {
    return module.contents.filter((content) => content.kind === "MATERI")
      .length;
  }

  return 0;
}

function mapApiModuleToLecturerModule(module: ModuleApiData): LecturerModule {
  return {
    id: module.id,
    title: module.title,
    materialCount: getMaterialCount(module),
    status: mapApiStatus(module.status),
    updated: formatUpdatedAt(module.updatedAt),
    code: module.accessCode,
    image: module.bannerUrl ?? undefined,
  };
}

function getFriendlyModuleError(message: string) {
  if (message === "Title is required" || message === "Title cannot be empty") {
    return "Judul modul tidak boleh kosong.";
  }

  if (message === "Invalid module status") {
    return "Status modul tidak valid.";
  }

  if (message === "Authentication required") {
    return "Sesi login sudah berakhir. Silakan login kembali.";
  }

  if (message === "Only lecturers can manage modules") {
    return "Hanya akun dosen yang dapat mengelola modul.";
  }

  if (message === "Dosen profile not found") {
    return "Profil dosen tidak ditemukan.";
  }

  if (message === "Module not found or not owned by lecturer") {
    return "Modul tidak ditemukan atau bukan milik akun dosen ini.";
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}

export function LecturerModulesClient({
  initialModules,
}: LecturerModulesClientProps) {
  const [modules, setModules] = useState<LecturerModule[]>(initialModules);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LecturerModule | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const filteredModules = useMemo(() => {
    return filterLecturerModules(modules, search);
  }, [modules, search]);

  const clearActionMessage = () => {
    setActionMessage("");
  };

  const handleOpenCreateModal = () => {
    setEditing(null);
    setOpen(true);
    clearActionMessage();
  };

  const handleCloseModal = () => {
    if (isSaving) return;

    setOpen(false);
    setEditing(null);
  };

  const handleSave = async (form: LecturerModuleFormValue) => {
    if (isSaving) return;

    setIsSaving(true);
    clearActionMessage();

    try {
      const response = await fetch(
        editing ? `/api/modules/${editing.id}` : "/api/modules",
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            title: form.title,
            status: form.status,
          }),
        }
      );

      const result = (await response.json()) as ModuleApiResponse;

      if (!response.ok || !result.success || !result.data) {
        setActionMessage(getFriendlyModuleError(result.message));
        return;
      }

      const savedModule = mapApiModuleToLecturerModule(result.data);

      if (editing) {
        setModules((currentModules) =>
          currentModules.map((module) =>
            module.id === editing.id ? savedModule : module
          )
        );
      } else {
        setModules((currentModules) => [savedModule, ...currentModules]);
      }

      setOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Save module error:", error);
      setActionMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (id: number) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus modul ini? Semua konten dan progres terkait modul ini juga akan terhapus."
    );

    if (!confirmed) return;

    clearActionMessage();

    try {
      const response = await fetch(`/api/modules/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      const result = (await response.json()) as {
        success: boolean;
        message: string;
        data: { id: number } | null;
      };

      if (!response.ok || !result.success) {
        setActionMessage(getFriendlyModuleError(result.message));
        return;
      }

      setModules((currentModules) =>
        currentModules.filter((module) => module.id !== id)
      );
    } catch (error) {
      console.error("Delete module error:", error);
      setActionMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      <LecturerModulesHeader
        search={search}
        totalModules={modules.length}
        onSearchChange={(value) => {
          setSearch(value);
          clearActionMessage();
        }}
        onAddClick={handleOpenCreateModal}
      />

      {actionMessage && (
        <div className="mb-5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs sm:text-sm font-bold text-destructive">
          {actionMessage}
        </div>
      )}

      <LecturerModulesGrid
        modules={filteredModules}
        search={search}
        onEdit={(module) => {
          setEditing(module);
          setOpen(true);
          clearActionMessage();
        }}
        onRemove={handleRemove}
      />

      {open && (
        <ModuleFormModal
          key={editing?.id ?? "create"}
          isOpen={open}
          editing={editing}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}