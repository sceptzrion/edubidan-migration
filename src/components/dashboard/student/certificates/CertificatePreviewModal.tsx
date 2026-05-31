"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Award, CheckCircle, AlertCircle, Share2, Download } from "lucide-react";
import { Certificate } from "./CertificateCard";

interface CertificatePreviewModalProps {
  preview: Certificate | null;
  onClose: () => void;
  userName: string;
}

export function CertificatePreviewModal({ preview, onClose, userName }: CertificatePreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (preview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [preview]);

  if (!preview || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border w-full max-w-4xl relative z-10 animate-in zoom-in-95 duration-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header Modal */}
        <div className="relative z-20 flex items-center justify-between p-4 sm:p-5 border-b border-border shrink-0 bg-card rounded-t-2xl sm:rounded-t-3xl">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-foreground">Pratinjau Dokumen</h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-mono mt-0.5">{preview.certNo}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Konten Modal */}
        <div className="relative z-10 flex-1 min-h-0 p-4 sm:p-6 lg:p-8 overflow-y-auto scrollbar-thin bg-muted/30">
          
          {/* REVISI: Menggunakan aspect-auto di mobile agar tidak memaksakan tinggi, dan font-size dikecilkan drastis untuk mobile */}
          <div className="w-full max-w-3xl mx-auto aspect-auto sm:aspect-[1.414/1] min-h-80 rounded-xl sm:rounded-2xl bg-linear-to-br from-primary via-teal-500 to-emerald-500 relative overflow-hidden flex items-center justify-center text-white text-center p-5 sm:p-12 shadow-inner">
            
            <div className="absolute inset-2 sm:inset-5 border-2 border-white/30 rounded-lg sm:rounded-xl" />
            <div className="absolute inset-3 sm:inset-6 border border-white/20 rounded-md sm:rounded-lg" />
            
            <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center py-4 sm:py-0">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center mb-3 sm:mb-6 border border-white/20 shadow-sm shrink-0">
                 <Award size={24} className="text-white sm:w-8 sm:h-8" />
              </div>
              
              <p className="text-[8px] sm:text-xs uppercase tracking-[0.2em] text-emerald-100 font-bold mb-1 sm:mb-2">Bukti Penyelesaian Modul</p>
              <p className="text-[8px] sm:text-xs text-white/80 mb-4 sm:mb-8 max-w-65 sm:max-w-sm mx-auto leading-relaxed border-b border-white/20 pb-3 sm:pb-4">
                Dokumen ini diberikan sebagai bentuk apresiasi atas partisipasi pada purwarupa aplikasi EduBidan.
              </p>
              
              <p className="text-[8px] sm:text-xs mb-1 sm:mb-1.5 text-white/90">Diberikan kepada</p>
              <p className="text-xl sm:text-4xl font-black text-white mb-4 sm:mb-8 tracking-tight">{userName}</p>
              
              <p className="text-[8px] sm:text-xs text-white/90 mb-1 sm:mb-1.5">Telah menyelesaikan pembelajaran</p>
              <p className="text-sm sm:text-2xl font-extrabold text-white mb-6 sm:mb-12 leading-tight px-4">{preview.title}</p>
              
              <div className="w-full flex justify-between items-end text-[8px] sm:text-xs text-white/90 font-medium px-2 sm:px-8 mt-auto">
                <div className="text-left">
                  <p className="mb-0.5 sm:mb-1 uppercase tracking-wider text-white/60 text-[7px] sm:text-[10px] font-bold">Tanggal Penyelesaian</p>
                  <span className="font-mono">{preview.date}</span>
                </div>
                <div className="text-right">
                   <p className="mb-0.5 sm:mb-1 uppercase tracking-wider text-white/60 text-[7px] sm:text-[10px] font-bold">Pencapaian</p>
                   <span className="flex items-center gap-1 sm:gap-1.5 justify-end font-bold text-emerald-100">
                     <CheckCircle size={12} className="text-emerald-300 sm:w-3.5 sm:h-3.5" /> Skor {preview.score}
                   </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 w-full max-w-3xl mx-auto flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600/90 shadow-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="text-[10px] sm:text-xs leading-relaxed font-medium">
              <strong>Catatan Akademis:</strong> Dokumen ini merupakan hasil simulasi dari proyek penelitian pengembangan *Learning Management System* (EduBidan). Dokumen ini tidak memiliki kekuatan hukum sebagai sertifikat kompetensi kebidanan resmi.
            </p>
          </div>
        </div>
        
        {/* Footer Modal */}
        <div className="relative z-20 p-4 sm:p-5 border-t border-border flex gap-3 shrink-0 bg-card rounded-b-2xl sm:rounded-3xl">
          <button onClick={onClose} className="flex-1 py-2.5 sm:py-3 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-colors">
            <Share2 size={16} className="w-4 h-4 sm:w-5 sm:h-5" /> Bagikan
          </button>
          <button className="flex-1 py-2.5 sm:py-3 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5">
            <Download size={16} className="w-4 h-4 sm:w-5 sm:h-5" /> Unduh PDF
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}