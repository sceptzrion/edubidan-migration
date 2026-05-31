"use client";

import { useMemo, useState } from "react";

import { ModuleFormModal } from "@/components/dashboard/lecturer/modules/ModuleFormModal";
import { LecturerModulesGrid } from "@/components/dashboard/lecturer/modules/list/LecturerModulesGrid";
import { LecturerModulesHeader } from "@/components/dashboard/lecturer/modules/list/LecturerModulesHeader";
import {
  filterLecturerModules,
  generateLecturerModuleCode,
  lecturerModules,
  type LecturerModule,
  type LecturerModuleFormValue,
} from "@/data/learning/lecturer/lecturer-modules";

export default function LecturerModulesPage() {
  const [modules, setModules] = useState<LecturerModule[]>(lecturerModules);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LecturerModule | null>(null);

  const filteredModules = useMemo(() => {
    return filterLecturerModules(modules, search);
  }, [modules, search]);

  const handleOpenCreateModal = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSave = (form: LecturerModuleFormValue) => {
    if (editing) {
      setModules((currentModules) =>
        currentModules.map((module) =>
          module.id === editing.id ? { ...module, ...form } : module
        )
      );
    } else {
      const newModule: LecturerModule = {
        id: Date.now(),
        title: form.title || "Modul Baru",
        materialCount: 0,
        status: form.status,
        updated: "Hari ini",
        code: generateLecturerModuleCode(),
      };

      setModules((currentModules) => [newModule, ...currentModules]);
    }

    handleCloseModal();
  };

  const handleRemove = (id: number) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus modul ini?"
    );

    if (!confirmed) return;

    setModules((currentModules) =>
      currentModules.filter((module) => module.id !== id)
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      <LecturerModulesHeader
        search={search}
        totalModules={modules.length}
        onSearchChange={setSearch}
        onAddClick={handleOpenCreateModal}
      />

      <LecturerModulesGrid
        modules={filteredModules}
        search={search}
        onEdit={(module) => {
          setEditing(module);
          setOpen(true);
        }}
        onRemove={handleRemove}
      />

      <ModuleFormModal
        isOpen={open}
        editing={editing}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
}