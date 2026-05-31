import React from "react";
import { BookOpen, User, Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface SummaryProps {
  title: string;
  duration: string;
  onPrev?: () => void;
  onNext: () => void;
  nextLabel: string;
}

export function Summary({ title, duration, onPrev, onNext, nextLabel }: SummaryProps) {
  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-8 shadow-sm flex flex-col h-full">
      <div className="shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-primary mb-2 sm:mb-3">
          <BookOpen size={14} className="sm:w-4 sm:h-4" /> Modul: ANC Terpadu Trimester 1
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-foreground mb-4 sm:mb-6 leading-tight">{title}</h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
          <span className="flex items-center gap-2"><User size={14} className="text-primary sm:w-4 sm:h-4" /> Instruktur: <strong className="text-foreground font-bold">Dr. Rina Hartati, M.Keb</strong></span>
          <span className="flex items-center gap-2"><Clock size={14} className="text-primary sm:w-4 sm:h-4" /> Estimasi Waktu: <strong className="text-foreground font-bold">{duration}</strong></span>
        </div>
        
        <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed mb-6 sm:mb-8">
          Pelajari teknik pemeriksaan fisik menyeluruh pada ibu hamil, mulai dari inspeksi kepala hingga ekstremitas bawah. 
          Video ini mencakup teknik palpasi, perkusi, dan auskultasi yang sesuai dengan standar praktik kebidanan terkini.
        </p>

        <h3 className="text-base sm:text-lg font-extrabold text-foreground mb-3 sm:mb-4">Ringkasan Materi</h3>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-2 sm:pr-3 mb-6">
        {/* REVISI MOBILE: Hapus class 'prose', ganti dengan text-xs sm:text-base dan space-y-2.5 */}
        <div className="text-xs sm:text-base text-muted-foreground space-y-2.5 sm:space-y-4 font-medium leading-relaxed pb-2">
          <p>1. <strong className="text-foreground font-bold">Inspeksi Umum</strong> - Mengamati kondisi umum ibu hamil: postur, ekspresi wajah, status gizi, dan tanda-tanda vital.</p>
          <p>2. <strong className="text-foreground font-bold">Pemeriksaan Kepala & Leher</strong> - Konjungtiva, sklera, pembesaran kelenjar tiroid, dan JVP.</p>
          <p>3. <strong className="text-foreground font-bold">Pemeriksaan Dada</strong> - Auskultasi jantung dan paru, inspeksi payudara untuk persiapan menyusui.</p>
          <p>4. <strong className="text-foreground font-bold">Pemeriksaan Abdomen</strong> - TFU, posisi janin, dan DJJ sesuai usia kehamilan.</p>
          <p>5. <strong className="text-foreground font-bold">Pemeriksaan Ekstremitas</strong> - Edema, refleks patella, dan varises.</p>
        </div>
      </div>

      <div className="shrink-0 mt-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-border">
        <button 
          onClick={onPrev} 
          disabled={!onPrev} 
          className="disabled:text-transparent disabled:hidden disabled:sm:block w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors py-2 sm:py-0"
        >
          <ChevronLeft size={16} className="sm:w-4.5 sm:h-4.5" /> Pelajaran Sebelumnya
        </button>
        <button 
          onClick={onNext} 
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm bg-primary text-primary-foreground px-5 sm:px-6 py-3 rounded-xl font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all hover:scale-[1.02]"
        >
          {nextLabel} <ChevronRight size={16} className="sm:w-4.5 sm:h-4.5" />
        </button>
      </div>
    </div>
  );
}