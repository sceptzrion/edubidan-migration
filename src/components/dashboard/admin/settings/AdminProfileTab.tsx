"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, Image as ImageIcon, Trash2 } from "lucide-react";

import { AvatarCropModal } from "@/components/dashboard/shared/AvatarCropModal";

export function AdminProfileTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("Super Administrator");
  const [phone, setPhone] = useState("+62 21 1234 5678");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (selectedImageSrc) {
      URL.revokeObjectURL(selectedImageSrc);
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedImageSrc(imageUrl);

    event.target.value = "";
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setAvatarUrl(croppedImageUrl);

    if (selectedImageSrc) {
      URL.revokeObjectURL(selectedImageSrc);
    }

    setSelectedImageSrc(null);
    setStatus("idle");
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    setStatus("idle");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus("saved");

    window.setTimeout(() => {
      setStatus("idle");
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (selectedImageSrc) {
        URL.revokeObjectURL(selectedImageSrc);
      }
    };
  }, [selectedImageSrc]);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-extrabold text-foreground mb-1.5">
          Informasi Profil
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          Perbarui identitas administrator yang digunakan pada dashboard admin.
        </p>
      </div>

      {status === "saved" && (
        <div className="mb-6 flex items-center gap-2.5 p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs sm:text-sm font-bold animate-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="shrink-0" />
          Perubahan profil berhasil disimpan.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
          <div className="relative shrink-0 w-fit">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-sm overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Foto profil admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                "A"
              )}
            </div>

            <button
              type="button"
              onClick={handleUploadClick}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white border-2 border-card hover:bg-primary/90 transition-all hover:scale-110 shadow-md cursor-pointer"
              aria-label="Ubah foto profil admin"
            >
              <Camera size={15} />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="min-w-0">
            <p className="text-base text-center sm:text-left sm:text-lg font-extrabold text-foreground">
              Super Administrator
            </p>

            <p className="text-xs text-center sm:text-left sm:text-sm text-muted-foreground font-medium mt-0.5">
              Pengelola utama sistem EduBidan
            </p>

            <div className="flex flex-wrap place-content-center sm:place-content-start gap-2 mt-3">
              <button
                type="button"
                onClick={handleUploadClick}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/90 transition-colors"
              >
                <ImageIcon size={14} />
                Pilih Foto
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-red-500 text-xs font-extrabold hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                  Hapus Foto
                </button>
              )}
            </div>

            <p className="text-[11px] text-center sm:text-left text-muted-foreground font-medium mt-2 leading-relaxed">
              Pilih foto yang jelas agar profil administrator mudah dikenali.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div>
            <label
              htmlFor="adminFullName"
              className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground"
            >
              Nama Lengkap
            </label>

            <input
              id="adminFullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs sm:text-sm font-medium text-foreground transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="adminEmail"
              className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground"
            >
              Email Admin
            </label>

            <input
              id="adminEmail"
              type="email"
              defaultValue="admin@edubidan.id"
              disabled
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-muted/50 border border-border/50 outline-none text-xs sm:text-sm font-medium text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="adminRole"
              className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground"
            >
              Peran Sistem
            </label>

            <input
              id="adminRole"
              defaultValue="Super Admin"
              disabled
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-muted/50 border border-border/50 outline-none text-xs sm:text-sm font-medium text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="adminPhone"
              className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground"
            >
              Nomor Telepon
            </label>

            <input
              id="adminPhone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs sm:text-sm font-medium text-foreground transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-primary/90 transition-all font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 w-full sm:w-auto"
        >
          Simpan Perubahan
        </button>
      </form>

      <AvatarCropModal
        isOpen={Boolean(selectedImageSrc)}
        imageSrc={selectedImageSrc}
        onClose={() => {
          if (selectedImageSrc) {
            URL.revokeObjectURL(selectedImageSrc);
          }

          setSelectedImageSrc(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}