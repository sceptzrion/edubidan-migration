import { useState } from "react";
import { BookOpen, CheckCircle2, KeyRound, X } from "lucide-react";

interface JoinModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinModuleModal({ isOpen, onClose }: JoinModuleModalProps) {
  const [joinCode, setJoinCode] = useState("");
  const [joinState, setJoinState] = useState<"idle" | "loading" | "success" | "error">("idle");

  if (!isOpen) return null;

  // Fungsi untuk menutup modal dan mereset form
  const handleClose = () => {
    setJoinCode("");
    setJoinState("idle");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* max-h-[95vh] dan flex-col agar modal tidak melebihi tinggi layar HP */}
      <div className="bg-card rounded-3xl border border-border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
        
        {/* HEADER MODAL */}
        <div className="relative bg-linear-to-br from-primary via-teal-500 to-emerald-500 p-6 sm:p-8 text-white overflow-hidden shrink-0 rounded-t-3xl">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 sm:-mr-10 sm:-mt-10" />
          <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm transition-colors">
            <X size={18} />
          </button>
          
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 sm:mb-4 shadow-inner border border-white/20">
            <KeyRound size={24} className="text-white sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Gabung Kelas Baru</h2>
          <p className="text-xs sm:text-sm font-medium text-white/90 mt-1">Masukkan kode token yang diberikan oleh dosen Anda.</p>
        </div>
        
        {/* BODY MODAL */}
        <div className="p-6 sm:p-8 overflow-y-auto scrollbar-thin">
          {joinState === "success" ? (
            <div className="text-center py-2 sm:py-4 animate-in zoom-in">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-teal-500/20">
                <CheckCircle2 size={28} className="sm:w-8 sm:h-8" />
              </div>
              <p className="text-lg sm:text-xl font-extrabold mb-1.5 text-foreground">Berhasil Bergabung!</p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Modul <span className="text-foreground font-bold">"{joinCode}"</span> telah ditambahkan ke daftar belajar Anda.</p>
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <label className="text-xs sm:text-sm font-bold mb-2 block text-foreground">Kode Akses Modul</label>
                <input
                  autoFocus
                  value={joinCode}
                  onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinState("idle"); }}
                  placeholder="Contoh: BDNA-2026"
                  className={`w-full px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl bg-background border-2 outline-none transition-colors font-mono tracking-[0.15em] sm:tracking-[0.2em] text-center text-base sm:text-lg font-bold text-foreground placeholder:text-muted-foreground/50 placeholder:font-sans placeholder:tracking-normal placeholder:font-medium
                    ${joinState === "error" ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"}
                  `}
                />
                {joinState === "error" && (
                  <p className="text-[10px] sm:text-xs font-bold text-red-500 mt-2 text-center animate-in slide-in-from-top-1">
                    Kode tidak valid. Periksa kembali ejaan Anda.
                  </p>
                )}
              </div>
              <div className="rounded-xl bg-muted/50 border border-border p-3 sm:p-4 text-[10px] sm:text-xs font-medium text-muted-foreground flex items-start gap-2 sm:gap-3">
                <BookOpen size={14} className="text-primary mt-0.5 shrink-0 sm:w-4 sm:h-4" />
                <span className="leading-relaxed">Setelah bergabung, modul akan muncul di dasbor dan progres Anda akan disinkronisasi.</span>
              </div>
            </div>
          )}
        </div>
        
        {/* FOOTER MODAL */}
        <div className="p-6 sm:p-8 pt-0 flex gap-2 sm:gap-3 shrink-0">
          {joinState === "success" ? (
            <button 
              onClick={handleClose} 
              className="w-full py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
            >
              Tutup & Mulai Belajar
            </button>
          ) : (
            <>
              <button onClick={handleClose} className="flex-1 py-3 sm:py-3.5 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors">
                Batal
              </button>
              <button
                disabled={joinCode.trim().length < 4 || joinState === "loading"}
                onClick={() => {
                  setJoinState("loading");
                  setTimeout(() => setJoinState(joinCode.startsWith("BDNA") ? "success" : "error"), 800);
                }}
                className="flex-1 py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md shadow-primary/20"
              >
                {joinState === "loading" ? "Memeriksa..." : "Gabung Sekarang"}
              </button>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}