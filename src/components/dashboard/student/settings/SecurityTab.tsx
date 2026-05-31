import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function SecurityTab() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Status: "idle" | "loading" | "success" | "error"
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validasi Kosong
    if (!oldPassword || !newPassword || !confirmPassword) {
      setStatus("error");
      setMessage("Harap isi semua kolom kata sandi.");
      return;
    }

    // 2. Validasi Panjang Minimum
    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("Kata sandi baru minimal harus 8 karakter.");
      return;
    }

    // 3. Validasi Cocok
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    // 4. Proses Loading (Simulasi API Request)
    setStatus("loading");
    setMessage("");

    setTimeout(() => {
      // 5. Sukses
      setStatus("success");
      setMessage("Kata sandi berhasil diperbarui!");
      // Bersihkan input
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Kembalikan ke idle setelah 3 detik agar pesan hilang
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-base sm:text-lg font-extrabold text-foreground mb-6">Keamanan Akun</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 max-w-lg">
        
        {/* Banner Notifikasi (Muncul saat Error atau Success) */}
        {status === "error" && (
          <div className="flex items-center gap-2.5 p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm font-bold animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0" /> {message}
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-2.5 p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs sm:text-sm font-bold animate-in slide-in-from-top-2">
            <CheckCircle2 size={18} className="shrink-0" /> {message}
          </div>
        )}

        {/* INPUT FIELDS */}
        <div>
          <label className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground">Kata Sandi Lama</label>
          <input 
            type="password" 
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Masukkan kata sandi saat ini" 
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs sm:text-sm font-medium text-foreground transition-all" 
          />
        </div>
        <div>
          <label className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground">Kata Sandi Baru</label>
          <input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 8 karakter" 
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs sm:text-sm font-medium text-foreground transition-all" 
          />
        </div>
        <div>
          <label className="text-xs sm:text-sm mb-2 block font-bold text-muted-foreground">Konfirmasi Kata Sandi Baru</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi baru" 
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs sm:text-sm font-medium text-foreground transition-all" 
          />
        </div>
        
        {/* SUBMIT BUTTON WITH LOADING STATE */}
        <button 
          type="submit"
          disabled={status === "loading"}
          className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all w-full sm:w-auto shadow-lg hover:-translate-y-0.5 ${
            status === "loading" 
              ? "bg-primary/70 text-white cursor-not-allowed shadow-none hover:translate-y-0" 
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
          }`}
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Memproses...
            </>
          ) : (
            "Perbarui Kata Sandi"
          )}
        </button>

      </form>
    </div>
  );
}