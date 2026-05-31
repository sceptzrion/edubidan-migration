import React from "react";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";

interface QuizStandbyProps {
  title: string;
  questionCount: string;
  timeLimit: string;
  onStartQuiz: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
}

export function QuizStandby({ 
  title, questionCount, timeLimit, onStartQuiz, onPrev, onNext, prevLabel, nextLabel 
}: QuizStandbyProps) {
  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 sm:mb-6 border-4 border-amber-500/20">
        <Award size={32} className="sm:w-10 sm:h-10" />
      </div>
      
      <h2 className="text-xl sm:text-3xl font-extrabold text-foreground mb-3">
        {title}
      </h2>
      
      {/* REVISI: Teks diperpendek, info batas lulus dihilangkan */}
      <p className="text-xs sm:text-base text-muted-foreground font-medium mb-8 max-w-md mx-auto leading-relaxed">
        Ini adalah evaluasi untuk mengukur pemahaman Anda sejauh ini. Jawab semua pertanyaan dengan memilih satu jawaban yang paling tepat.
      </p>
      
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 w-full">
        <div className="flex-1 sm:flex-none bg-muted/50 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-border/50">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Jumlah Soal</p>
          <p className="text-lg sm:text-xl font-extrabold text-foreground">{questionCount}</p>
        </div>
        <div className="flex-1 sm:flex-none bg-muted/50 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-border/50">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Batas Waktu</p>
          <p className="text-lg sm:text-xl font-extrabold text-foreground">{timeLimit}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full mt-2">
        <button 
          onClick={onPrev} 
          disabled={!onPrev} 
          className={`hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors ${!onPrev ? "invisible" : ""}`}
        >
          <ChevronLeft size={18} /> {prevLabel || "Sebelumnya"}
        </button>

        <button 
          onClick={onStartQuiz} 
          className="w-full sm:w-auto bg-amber-500 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-extrabold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-1 shrink-0"
        >
          Buka Halaman Kuis
        </button>

        <button 
          onClick={onNext} 
          disabled={!onNext} 
          className={`hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors ${!onNext ? "invisible" : ""}`}
        >
          {nextLabel || "Selanjutnya"} <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex sm:hidden items-center justify-between w-full mt-4 pt-4 border-t border-border/50">
        <button 
          onClick={onPrev} 
          disabled={!onPrev} 
          className={`flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors ${!onPrev ? "invisible" : ""}`}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button 
          onClick={onNext} 
          disabled={!onNext} 
          className={`flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors ${!onNext ? "invisible" : ""}`}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}