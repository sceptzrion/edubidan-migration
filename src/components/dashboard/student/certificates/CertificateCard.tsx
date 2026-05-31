import React from "react";
import { Award, BookOpen, Lock, Calendar, Eye, Download } from "lucide-react";

export type CertStatus = "completed" | "in-progress" | "locked";

export type Certificate = {
  id: number;
  title: string;
  topic: string;
  date: string | null;
  score: number | null;
  status: CertStatus;
  progress?: number;
  certNo?: string;
};

interface CertificateCardProps {
  cert: Certificate;
  onPreview: (cert: Certificate) => void;
}

export function CertificateCard({ cert, onPreview }: CertificateCardProps) {
  return (
    <div className={`group bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col ${cert.status === "locked" ? "opacity-60" : ""}`}>
      
      {/* Visual Thumbnail */}
      <div className={`relative aspect-[1.4/1] shrink-0 border-b border-border/50 ${
        cert.status === "completed" ? "bg-linear-to-br from-primary via-teal-500 to-emerald-500" : 
        cert.status === "in-progress" ? "bg-linear-to-br from-primary/10 to-teal-500/10" : "bg-muted"
      }`}>
        {cert.status === "completed" ? (
          <>
            <div className="absolute inset-2 sm:inset-3 border border-white/30 rounded-xl" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 sm:p-6 text-center">
              <Award size={32} className="mb-2 text-white/90 sm:w-10 sm:h-10" />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/80 font-bold mb-1">Bukti Penyelesaian</p>
              <p className="text-xs sm:text-sm font-extrabold text-white line-clamp-2 px-2">{cert.title}</p>
              <p className="text-[9px] sm:text-[10px] text-white/70 mt-2 font-mono bg-black/20 px-2 py-0.5 rounded">{cert.certNo}</p>
            </div>
          </>
        ) : cert.status === "in-progress" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-primary p-6 text-center">
            <BookOpen size={32} className="mb-3 sm:w-10 sm:h-10 opacity-80" />
            <p className="text-xs sm:text-sm font-bold text-foreground/80 mb-4">Selesaikan modul untuk membuka sertifikat</p>
            <div className="w-3/4 sm:w-40 h-2 bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${cert.progress}%` }} />
            </div>
            <p className="text-[10px] sm:text-xs mt-2 font-bold text-primary">{cert.progress}% selesai</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
            <Lock size={32} className="mb-2 opacity-50 sm:w-10 sm:h-10" />
            <p className="text-xs sm:text-sm font-bold">Modul Terkunci</p>
          </div>
        )}
      </div>

      {/* Info & Actions */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <p className="text-[10px] sm:text-xs text-primary font-bold mb-1.5 uppercase tracking-wider">{cert.topic}</p>
        <h3 className="text-sm sm:text-base font-extrabold text-foreground mb-3 line-clamp-2 leading-snug">{cert.title}</h3>
        
        <div className="mt-auto">
          {cert.status === "completed" && (
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground mb-4 bg-muted/50 p-2 sm:p-2.5 rounded-lg border border-border/50">
              <span className="flex items-center gap-1.5 font-medium"><Calendar size={14} /> {cert.date}</span>
              <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">Skor: {cert.score}</span>
            </div>
          )}
          
          {cert.status === "completed" ? (
            <div className="flex gap-2">
              <button onClick={() => onPreview(cert)} className="flex-1 py-2 sm:py-2.5 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted flex items-center justify-center gap-1.5 transition-colors">
                <Eye size={16} className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> Pratinjau
              </button>
              <button className="py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5">
                <Download size={16} className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> <span className="hidden sm:inline">Unduh</span>
              </button>
            </div>
          ) : cert.status === "in-progress" ? (
            <button className="w-full py-2.5 rounded-xl border border-primary text-primary text-xs sm:text-sm font-bold hover:bg-primary/5 transition-colors">
              Lanjutkan Modul
            </button>
          ) : (
            <button disabled className="w-full py-2.5 rounded-xl bg-muted text-muted-foreground text-xs sm:text-sm font-bold cursor-not-allowed border border-border/50">
              Belum Tersedia
            </button>
          )}
        </div>
      </div>
    </div>
  );
}