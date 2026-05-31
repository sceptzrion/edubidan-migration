"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  X, Save, Upload, Link as LinkIcon, Bold, Italic, 
  List, AlignLeft, BookOpen, Target, Wrench, Plus, Trash2, FileVideo
} from "lucide-react";

export function MateriModal({ initial, onSave, onClose }: any) {
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // PERBAIKAN: Berikan fallback (nilai default) untuk setiap properti
  // agar jika data 'initial' tidak lengkap, aplikasi tidak akan crash.
  const [form, setForm] = useState({ 
    kind: "materi", 
    id: initial?.id || 0, 
    title: initial?.title || "", 
    videoUrl: initial?.videoUrl || "", 
    videoSource: initial?.videoSource || "embed", 
    summary: initial?.summary || "", 
    objectives: initial?.objectives || [""], // Fallback ke array isi string kosong
    tools: initial?.tools || [""],           // Fallback ke array isi string kosong
    duration: initial?.duration || ""
  });

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const updateList = (key: "objectives" | "tools", i: number, v: string) => {
    const next = [...form[key]];
    next[i] = v;
    setForm({ ...form, [key]: next });
  };
  const addItem = (key: "objectives" | "tools") => setForm({ ...form, [key]: [...form[key], ""] });
  const removeItem = (key: "objectives" | "tools", i: number) => {
    setForm({ ...form, [key]: form[key].filter((_: string, j: number) => j !== i) });
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileVideo size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
              {initial ? "Edit Materi Modul" : "Tambah Materi Baru"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto scrollbar-thin bg-muted/10">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs sm:text-sm mb-2.5 block font-bold text-foreground">Judul Materi</label>
              <input 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                placeholder="Contoh: Anamnesis Ibu Hamil" 
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all" 
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm mb-2.5 block font-bold text-foreground">Durasi Video</label>
              <input 
                value={form.duration} 
                onChange={(e) => setForm({ ...form, duration: e.target.value })} 
                placeholder="Cth: 15 Menit" 
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all" 
              />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm">
            <label className="text-xs sm:text-sm mb-3 block font-bold text-foreground">Sumber Video</label>
            
            <div className="flex p-1 rounded-xl bg-muted/50 border border-border/50 mb-4">
               <button 
                 type="button" 
                 onClick={() => setForm({...form, videoSource: "upload"})} 
                 className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-lg flex items-center justify-center gap-2 transition-all ${
                   form.videoSource === "upload" 
                   ? "bg-card shadow-sm text-primary border border-border/50" 
                   : "text-muted-foreground hover:text-foreground"
                 }`}
               >
                 <Upload size={16} /> Upload Video
               </button>
               <button 
                 type="button" 
                 onClick={() => setForm({...form, videoSource: "embed"})} 
                 className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-lg flex items-center justify-center gap-2 transition-all ${
                   form.videoSource === "embed" 
                   ? "bg-card shadow-sm text-primary border border-border/50" 
                   : "text-muted-foreground hover:text-foreground"
                 }`}
               >
                 <LinkIcon size={16} /> Embed Link Tautan
               </button>
            </div>

            {form.videoSource === "upload" ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border bg-muted/20 rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={24} className="text-primary" />
                </div>
                <p className="text-sm font-extrabold text-foreground mb-1">Klik atau seret file video ke sini</p>
                <p className="text-xs font-medium text-muted-foreground">Format MP4 / WebM, maksimal 500MB</p>
                <input ref={fileInputRef} type="file" accept="video/*" className="hidden" />
              </div>
            ) : (
              <input 
                value={form.videoUrl} 
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="Masukkan URL (Contoh: https://youtube.com/watch?v=...)" 
                className="w-full px-4 py-3.5 rounded-xl bg-muted/30 border border-border text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              />
            )}
          </div>

          <div>
            <label className="text-xs sm:text-sm mb-2.5 flex items-center gap-2 font-bold text-foreground">
              <BookOpen size={16} className="text-primary"/> Ringkasan Materi
            </label>
            <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/30">
                <button type="button" className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"><Bold size={16} /></button>
                <button type="button" className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"><Italic size={16} /></button>
                <button type="button" className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"><List size={16} /></button>
                <button type="button" className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"><AlignLeft size={16} /></button>
              </div>
              <textarea 
                rows={5} 
                value={form.summary} 
                onChange={(e) => setForm({ ...form, summary: e.target.value })} 
                placeholder="Tulis ringkasan dari materi video ini untuk dibaca mahasiswa..." 
                className="w-full px-4 py-3 bg-transparent text-sm font-medium text-foreground outline-none resize-none leading-relaxed" 
              />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
              <label className="text-xs sm:text-sm flex items-center gap-2 font-bold text-foreground">
                <Target size={16} className="text-primary" /> Tujuan Pembelajaran
              </label>
              <button type="button" onClick={() => addItem("objectives")} className="text-xs sm:text-sm text-primary flex items-center gap-1.5 hover:bg-primary/10 px-2 py-1 rounded-md font-extrabold transition-colors">
                <Plus size={14} /> Tambah Tujuan
              </button>
            </div>
            <div className="space-y-3">
              {form.objectives.map((o: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-extrabold">{i + 1}</span>
                  <input 
                    value={o} 
                    onChange={(e) => updateList("objectives", i, e.target.value)}
                    placeholder={`Tulis poin tujuan pembelajaran ${i + 1}`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm font-medium text-foreground outline-none focus:border-primary transition-all" 
                  />
                  <button type="button" onClick={() => removeItem("objectives", i)} className="p-2.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-xl transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
              <label className="text-xs sm:text-sm flex items-center gap-2 font-bold text-foreground">
                <Wrench size={16} className="text-primary" /> Alat Pendukung / Praktikum
              </label>
              <button type="button" onClick={() => addItem("tools")} className="text-xs sm:text-sm text-primary flex items-center gap-1.5 hover:bg-primary/10 px-2 py-1 rounded-md font-extrabold transition-colors">
                <Plus size={14} /> Tambah Alat
              </button>
            </div>
            <div className="space-y-3">
              {form.tools.map((t: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-extrabold">•</span>
                  <input 
                    value={t} 
                    onChange={(e) => updateList("tools", i, e.target.value)}
                    placeholder={`Cth: Buku KIA, Phantom Pelvis, dll.`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-sm font-medium text-foreground outline-none focus:border-primary transition-all" 
                  />
                  <button type="button" onClick={() => removeItem("tools", i)} className="p-2.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-xl transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
        
        <div className="p-4 sm:p-6 border-t border-border flex gap-3 sm:gap-4 shrink-0 bg-card rounded-b-2xl sm:rounded-3xl z-20">
          <button onClick={onClose} className="flex-1 py-3 sm:py-3.5 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors">
            Batal
          </button>
          <button 
            onClick={() => onSave(form)} 
            className="flex-1 py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            <Save size={18} className="w-4 h-4 sm:w-5 sm:h-5"/> {initial ? "Simpan Perubahan" : "Simpan Materi"}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}