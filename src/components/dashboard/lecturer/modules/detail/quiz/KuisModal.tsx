"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, Save, HelpCircle, Clock, Plus, Trash2, 
  ImageIcon, ListOrdered, AlertCircle 
} from "lucide-react";

export function KuisModal({ initial, onSave, onClose }: any) {
  const [mounted, setMounted] = useState(false);

  // Fallback data default yang aman jika 'initial' rusak
  const defaultQuestion = { 
    id: Date.now(), 
    questionText: "", 
    mediaUrl: null, 
    options: [
      { id: 1, text: "" }, 
      { id: 2, text: "" }
    ], 
    correctOptionId: 1 
  };

  // Cek apakah initial.questions valid (bukan sekadar angka [1])
  const validQuestions = (initial?.questions && typeof initial.questions[0] === 'object') 
    ? initial.questions 
    : [defaultQuestion];

  const [form, setForm] = useState({
    kind: "kuis",
    id: initial?.id || 0,
    title: initial?.title || "",
    description: initial?.description || "",
    hasTimeLimit: initial?.hasTimeLimit || false,
    timeLimitMinutes: initial?.timeLimitMinutes || 15,
    questions: validQuestions
  });

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleToggleTime = () => setForm({ ...form, hasTimeLimit: !form.hasTimeLimit });

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      questionText: "",
      mediaUrl: null,
      options: [{ id: 1, text: "" }, { id: 2, text: "" }],
      correctOptionId: 1
    };
    setForm({ ...form, questions: [...form.questions, newQuestion] });
  };

  const removeQuestion = (qId: number) => {
    setForm({ ...form, questions: form.questions.filter((q: any) => q.id !== qId) });
  };

  const updateQuestionText = (qId: number, text: string) => {
    const nextQuestions = form.questions.map((q: any) => 
      q.id === qId ? { ...q, questionText: text } : q
    );
    setForm({ ...form, questions: nextQuestions });
  };

  const addOption = (qId: number) => {
    const nextQuestions = form.questions.map((q: any) => {
      if (q.id === qId) {
        return { ...q, options: [...(q.options || []), { id: Date.now(), text: "" }] };
      }
      return q;
    });
    setForm({ ...form, questions: nextQuestions });
  };

  const removeOption = (qId: number, optId: number) => {
    const nextQuestions = form.questions.map((q: any) => {
      if (q.id === qId) {
        return { ...q, options: q.options?.filter((o: any) => o.id !== optId) };
      }
      return q;
    });
    setForm({ ...form, questions: nextQuestions });
  };

  const updateOptionText = (qId: number, optId: number, text: string) => {
    const nextQuestions = form.questions.map((q: any) => {
      if (q.id === qId) {
        const nextOpts = q.options?.map((o: any) => o.id === optId ? { ...o, text } : o);
        return { ...q, options: nextOpts };
      }
      return q;
    });
    setForm({ ...form, questions: nextQuestions });
  };

  const setCorrectOption = (qId: number, optId: number) => {
    const nextQuestions = form.questions.map((q: any) => 
      q.id === qId ? { ...q, correctOptionId: optId } : q
    );
    setForm({ ...form, questions: nextQuestions });
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
              {initial ? "Edit Kuis Evaluasi" : "Buat Kuis Baru"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 sm:p-6 space-y-8 overflow-y-auto scrollbar-thin bg-muted/10">
          
          <div className="space-y-4">
            <div>
              <label className="text-xs sm:text-sm mb-2 block font-bold text-foreground">Judul Kuis</label>
              <input 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                placeholder="Contoh: Kuis Akhir Modul ANC Terpadu" 
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm transition-all" 
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm mb-2 block font-bold text-foreground">Deskripsi Kuis</label>
              <textarea 
                rows={2} 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                placeholder="Tulis instruksi pengerjaan kuis di sini..." 
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-medium text-foreground outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm resize-none" 
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border bg-card shadow-sm gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${form.hasTimeLimit ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}`}>
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-foreground">Beri Batas Waktu</p>
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Batasi durasi mahasiswa mengerjakan kuis ini.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {form.hasTimeLimit && (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border animate-in slide-in-from-right-2">
                    <input 
                      type="number" 
                      value={form.timeLimitMinutes}
                      onChange={(e) => setForm({...form, timeLimitMinutes: parseInt(e.target.value || "1")})}
                      className="w-12 bg-transparent text-sm font-extrabold text-center text-foreground outline-none"
                    />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Menit</span>
                  </div>
                )}
                <button 
                  type="button" 
                  onClick={handleToggleTime}
                  className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 border-2 ${form.hasTimeLimit ? "bg-amber-500 border-amber-500" : "bg-muted border-border"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white transition-all shadow-sm ${form.hasTimeLimit ? "left-6 sm:left-7.5" : "left-0.5 sm:left-0.75"}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <ListOrdered size={18} className="text-amber-600" />
              <h3 className="text-sm sm:text-base font-extrabold text-foreground">Daftar Pertanyaan</h3>
              <span className="ml-auto text-[10px] font-bold bg-muted px-2 py-1 rounded-md text-muted-foreground uppercase tracking-widest">{form.questions?.length || 0} Soal</span>
            </div>

            {/* DENGAN OPTIONAL CHAINING AGAR AMAN */}
            {form.questions?.map((q: any, index: number) => (
              <div key={q.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
                      {index + 1}
                    </div>
                    <span className="text-xs font-extrabold text-foreground tracking-tight">PERTANYAAN #{index + 1}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(q.id)}
                    className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-4 sm:p-5 space-y-5">
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-muted-foreground mb-1.5 block tracking-widest">Teks Pertanyaan</label>
                    <textarea 
                      value={q.questionText}
                      onChange={(e) => updateQuestionText(q.id, e.target.value)}
                      placeholder="Tuliskan butir soal di sini..."
                      className="w-full px-4 py-3 rounded-xl bg-muted/20 border border-border text-sm font-medium text-foreground outline-none focus:border-amber-500 transition-all resize-none leading-relaxed"
                      rows={3}
                    />
                  </div>

                  <button type="button" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                    <ImageIcon size={16} /> Unggah Gambar Pendukung (Opsional)
                  </button>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-widest">Pilihan Jawaban</label>
                      <button 
                        type="button" 
                        onClick={() => addOption(q.id)}
                        className="text-[10px] font-extrabold text-amber-600 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Tambah Opsi
                      </button>
                    </div>

                    <div className="grid gap-2.5">
                      {/* AMAN: Menggunakan optional chaining q.options?.map */}
                      {q.options?.map((opt: any, oIndex: number) => {
                        const letter = String.fromCharCode(65 + oIndex);
                        const isCorrect = q.correctOptionId === opt.id;

                        return (
                          <div key={opt.id} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${isCorrect ? "bg-emerald-500/5 border-emerald-500/50" : "bg-muted/30 border-border"}`}>
                            <button 
                              type="button" 
                              onClick={() => setCorrectOption(q.id, opt.id)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isCorrect ? "bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-card border-muted-foreground/30 hover:border-amber-500"}`}
                            >
                              {isCorrect && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </button>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${isCorrect ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>
                              {letter}
                            </div>
                            <input 
                              value={opt.text}
                              onChange={(e) => updateOptionText(q.id, opt.id, e.target.value)}
                              placeholder={`Opsi ${letter}...`}
                              className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none"
                            />
                            {q.options.length > 2 && (
                              <button 
                                type="button" 
                                onClick={() => removeOption(q.id, opt.id)}
                                className="p-1 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-md transition-colors"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {q.options?.some((o:any) => o.text === "") && (
                       <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1"><AlertCircle size={10}/> Pastikan semua opsi jawaban terisi.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button 
              type="button" 
              onClick={addQuestion}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:border-amber-500 hover:text-amber-600 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-extrabold uppercase tracking-wider">Tambah Pertanyaan Baru</span>
            </button>
          </div>

        </div>
        
        <div className="p-4 sm:p-6 border-t border-border flex gap-3 sm:gap-4 shrink-0 bg-card rounded-b-2xl sm:rounded-3xl z-20">
          <button onClick={onClose} className="flex-1 py-3 sm:py-3.5 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors">
            Batal
          </button>
          <button 
            onClick={() => onSave(form)} 
            className="flex-1 py-3 sm:py-3.5 rounded-xl bg-amber-500 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5"
          >
            <Save size={18} className="w-4 h-4 sm:w-5 sm:h-5"/> {initial ? "Simpan Perubahan" : "Simpan Kuis"}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}