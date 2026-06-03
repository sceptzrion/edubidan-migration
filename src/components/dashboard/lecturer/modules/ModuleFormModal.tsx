"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Save, X } from "lucide-react";
import { createPortal } from "react-dom";

import type {
  LecturerModule,
  LecturerModuleFormValue,
  LecturerModuleStatus,
} from "@/data/learning/lecturer/lecturer-modules";
import { useIsClient } from "@/hooks/useIsClient";

interface ModuleFormModalProps {
  isOpen: boolean;
  editing: LecturerModule | null;
  onClose: () => void;
  onSave: (form: LecturerModuleFormValue) => void;
}

const statusOptions: LecturerModuleStatus[] = ["Draft", "Publik"];

function getInitialForm(editing: LecturerModule | null): LecturerModuleFormValue {
  if (editing) {
    return {
      title: editing.title,
      status: editing.status,
    };
  }

  return {
    title: "",
    status: "Draft",
  };
}

export function ModuleFormModal({
  isOpen,
  editing,
  onClose,
  onSave,
}: ModuleFormModalProps) {
  const mounted = useIsClient();

  const initialForm = useMemo(() => getInitialForm(editing), [editing]);

  const [error, setError] = useState("");
  const [form, setForm] = useState<LecturerModuleFormValue>(initialForm);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSave = () => {
    if (!form.title.trim()) {
      setError("Judul modul tidak boleh kosong.");
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
    });
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        aria-label="Tutup modal"
      />

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border shrink-0 bg-card z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <BookOpen size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-extrabold text-foreground truncate">
                {editing ? "Edit Modul" : "Tambah Modul Baru"}
              </h2>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Lengkapi informasi dasar modul pembelajaran.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto scrollbar-thin bg-muted/20">
          <div>
            <label
              htmlFor="moduleTitle"
              className="text-xs sm:text-sm mb-2.5 block font-bold text-foreground"
            >
              Judul Modul
            </label>

            <input
              id="moduleTitle"
              value={form.title}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }));
                setError("");
              }}
              placeholder="Contoh: ANC Terpadu Trimester 1"
              className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-card border border-border text-sm text-foreground font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />

            {error && (
              <p className="text-[11px] sm:text-xs font-bold text-red-500 mt-2">
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs sm:text-sm mb-2.5 block font-bold text-foreground">
              Status Akses
            </label>

            <div className="flex gap-3">
              {statusOptions.map((status) => {
                const isSelected = form.status === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        status,
                      }))
                    }
                    className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 text-sm font-extrabold transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 font-medium leading-relaxed">
              Draft hanya tersimpan untuk dosen. Publik dapat diakses mahasiswa
              yang terdaftar pada modul.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-border flex gap-3 sm:gap-4 shrink-0 bg-card rounded-b-2xl sm:rounded-3xl z-20">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            <Save size={18} className="sm:w-5 sm:h-5" />
            {editing ? "Simpan Perubahan" : "Simpan Modul"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}