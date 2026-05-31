"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Key, Shield, X } from "lucide-react";

import type { AdminUser } from "@/data/learning/admin/admin-users";

interface UserFormModalProps {
  mode: "add" | "edit";
  user?: AdminUser;
  onClose: () => void;
  onSave: (data: Partial<AdminUser>) => void;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground">
        {label} {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {children}
    </div>
  );
}

function getInitialForm(user?: AdminUser): Partial<AdminUser> {
  return (
    user ?? {
      name: "",
      email: "",
      phone: "",
      institution: "Universitas Singaperbangsa Karawang",
      gender: "Perempuan",
      status: "Aktif",
      modules: 0,
      avgScore: 0,
      role: "Mahasiswa",
      identityNo: "",
      joined: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }
  );
}

const inputClassName =
  "w-full px-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all";

const selectClassName =
  "w-full px-4 py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-bold text-foreground cursor-pointer transition-all";

export function UserFormModal({
  mode,
  user,
  onClose,
  onSave,
}: UserFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<Partial<AdminUser>>(() =>
    getInitialForm(user)
  );
  const [generatePassword, setGeneratePassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [resetStatus, setResetStatus] = useState<"idle" | "sent">("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const emailPlaceholder =
    form.role === "Dosen"
      ? "nama@staff.unsika.ac.id"
      : "nama@student.unsika.ac.id";

  const identityLabel =
    form.role === "Dosen"
      ? "Nomor Induk Dosen (NIDN/NIP)"
      : "Nomor Induk Mahasiswa (NIM)";

  const handleSendResetLink = () => {
    setResetStatus("sent");

    window.setTimeout(() => {
      setResetStatus("idle");
    }, 2500);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup modal pengguna"
      />

      <div className="relative z-10 bg-card rounded-3xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-card shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
              {mode === "add" ? "Tambah Pengguna Baru" : "Edit Data Pengguna"}
            </h2>

            <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 leading-relaxed">
              {mode === "add"
                ? "Daftarkan akun dosen atau mahasiswa ke sistem."
                : "Perbarui informasi identitas dan status akses pengguna."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Tutup modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto scrollbar-thin bg-muted/10">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Nama Lengkap" required>
              <input
                value={form.name ?? ""}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Contoh: Sari Dewi"
                className={inputClassName}
              />
            </Field>

            <Field label="Peran Akun" required>
              <div className="relative">
                <select
                  value={form.role ?? "Mahasiswa"}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      role: event.target.value as AdminUser["role"],
                    })
                  }
                  className={`${selectClassName} appearance-none pr-10`}
                >
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Dosen">Dosen</option>
                </select>

                <Shield
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>
            </Field>

            <Field label="Email" required>
              <input
                type="email"
                value={form.email ?? ""}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder={emailPlaceholder}
                className={inputClassName}
              />
            </Field>

            <Field label={identityLabel} required>
              <input
                value={form.identityNo ?? ""}
                onChange={(event) =>
                  setForm({ ...form, identityNo: event.target.value })
                }
                placeholder="Masukkan nomor identitas"
                className={`${inputClassName} font-mono`}
              />
            </Field>

            <Field label="Institusi / Kampus">
              <input
                value={form.institution ?? ""}
                onChange={(event) =>
                  setForm({ ...form, institution: event.target.value })
                }
                placeholder="Nama kampus asal"
                className={inputClassName}
              />
            </Field>

            <Field label="Status Akun">
              <select
                value={form.status ?? "Aktif"}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value as AdminUser["status"],
                  })
                }
                className={selectClassName}
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </Field>
          </div>

          {mode === "add" && (
            <div className="rounded-2xl border border-border p-5 bg-card shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />

              <div className="flex items-center gap-2 mb-4">
                <Key size={18} className="text-amber-500" />

                <span className="text-sm font-extrabold text-foreground">
                  Kredensial Login
                </span>
              </div>

              <label className="flex items-start gap-3 text-sm font-medium text-muted-foreground mb-4 cursor-pointer hover:text-foreground transition-colors">
                <input
                  type="checkbox"
                  checked={generatePassword}
                  onChange={(event) =>
                    setGeneratePassword(event.target.checked)
                  }
                  className="w-4 h-4 mt-0.5 rounded border-border text-amber-500 focus:ring-amber-500 bg-card"
                />

                <span>Buat kata sandi otomatis dan kirim melalui email</span>
              </label>

              {!generatePassword && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">
                    Kata Sandi Manual
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter..."
                      className="w-full px-4 py-3 pr-24 rounded-xl bg-card border border-border outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-amber-500 hover:text-amber-600 transition-colors"
                    >
                      {showPassword ? "SEMBUNYIKAN" : "TAMPILKAN"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === "edit" && (
            <div className="rounded-2xl border border-border p-5 bg-card shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Key size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-foreground">
                      Reset Kata Sandi
                    </p>

                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed mt-1">
                      Kirim tautan reset kata sandi ke email pengguna tanpa
                      mengubah data profil.
                    </p>

                    {resetStatus === "sent" && (
                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-600">
                        <CheckCircle2 size={15} />
                        Link reset kata sandi berhasil dikirim.
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendResetLink}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs sm:text-sm font-extrabold hover:bg-amber-500 hover:text-white transition-colors whitespace-nowrap"
                >
                  Kirim Link Reset
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 border-t border-border flex gap-3 sm:gap-4 bg-card shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={() => onSave(form)}
            className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-md shadow-primary/20"
          >
            {mode === "add" ? "Daftarkan Pengguna" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}