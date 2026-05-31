import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown, Video, HelpCircle, GripVertical, Edit3, Trash2, Eye } from "lucide-react";
import { MateriModal } from "@/components/dashboard/lecturer/modules/detail/lesson/MateriModal";
import { KuisModal } from "@/components/dashboard/lecturer/modules/detail/quiz/KuisModal";

interface PlaylistTabProps {
  moduleId: string;
}

export function PlaylistTab({ moduleId }: PlaylistTabProps) {
  const router = useRouter();

  const [items, setItems] = useState<any[]>([
    { 
      kind: "materi", 
      id: 1, 
      title: "Pengantar ANC Terpadu", 
      videoSource: "embed", 
      duration: "12:30",
      summary: "Pelajari teknik pemeriksaan fisik menyeluruh pada ibu hamil...",
      objectives: ["Mampu melakukan pemeriksaan fisik", "Mengidentifikasi tanda abnormal"],
      tools: ["Stetoskop", "Tensimeter"]
    },
    { 
      kind: "kuis", 
      id: 2, 
      title: "Kuis Cek Pemahaman", 
      hasTimeLimit: true, 
      timeLimitMinutes: 10, 
      questions: [
        { id: 1, questionText: "Berapa kali minimal kunjungan ANC?", options: [{id: 1, text: "4 Kali"}, {id: 2, text: "6 Kali"}], correctOptionId: 2 }
      ] 
    }
  ]);
  
  const [addOpen, setAddOpen] = useState(false);
  const [materiOpen, setMateriOpen] = useState(false);
  const [kuisOpen, setKuisOpen] = useState(false);
  
  const [editingMateri, setEditingMateri] = useState<any>(null);
  const [editingKuis, setEditingKuis] = useState<any>(null);
  
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= items.length) return;
    const next = [...items];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setItems(next);
  };

  return (
    <div className="animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground">Susunan Pembelajaran</h2>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
            {items.length} item • Tahan dan geser (drag) ikon titik untuk mengubah urutan.
          </p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setAddOpen(!addOpen)} 
            className="w-full sm:w-auto bg-primary text-primary-foreground px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={16} /> Tambah Konten <ChevronDown size={14} className={`transition-transform duration-200 ${addOpen ? "rotate-180" : ""}`} />
          </button>
          
          {addOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setAddOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                <button onClick={() => { setEditingMateri(null); setAddOpen(false); setMateriOpen(true); }} className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted text-left transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Video size={16} /></div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">Materi Baru</p>
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">Video & ringkasan</p>
                  </div>
                </button>
                <div className="border-t border-border/50 my-1" />
                <button onClick={() => { setEditingKuis(null); setAddOpen(false); setKuisOpen(true); }} className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted text-left transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0"><HelpCircle size={16} /></div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">Kuis Evaluasi</p>
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">Soal pilihan ganda</p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {items.map((it, idx) => {
          const isMateri = it.kind === "materi";
          return (
            <div
              key={it.id}
              draggable
              onDragStart={() => setDragIndex(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragIndex !== null) move(dragIndex, idx); setDragIndex(null); }}
              className={`bg-card rounded-xl sm:rounded-2xl border p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all hover:shadow-md hover:border-primary/30 ${dragIndex === idx ? "opacity-50 border-primary border-dashed" : "border-border shadow-sm"}`}
            >
              <GripVertical size={20} className="text-muted-foreground cursor-grab active:cursor-grabbing shrink-0 hover:text-primary transition-colors" />
              
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${isMateri ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-500"}`}>
                {isMateri ? <Video size={20} className="sm:w-6 sm:h-6" /> : <HelpCircle size={20} className="sm:w-6 sm:h-6" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider font-extrabold shadow-sm ${isMateri ? "bg-primary text-white" : "bg-amber-500 text-white"}`}>
                    {isMateri ? "Materi" : "Kuis"}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">Urutan #{idx + 1}</span>
                </div>
                <p className="text-sm sm:text-base font-extrabold text-foreground truncate leading-snug">{it.title}</p>
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-1">
                  {isMateri 
                    ? `${it.videoSource === "upload" ? "Upload Video" : "Embed YouTube"} • Durasi: ${it.duration || "--:--"}` 
                    : `${it.questions?.length || 0} soal ${it.hasTimeLimit ? `• Waktu: ${it.timeLimitMinutes} menit` : "• Tanpa batas waktu"}`}
                </p>
              </div>
              
              <div className="flex gap-1.5 sm:gap-2 shrink-0 border-l border-border/50 pl-3 sm:pl-4 ml-2 sm:ml-4">
                {/* REVISI: Routing ke Preview Materi ATAU Preview Kuis */}
                <button
                  onClick={() => {
                    if (isMateri) {
                      router.push(`/dashboard/lecturer/modules/${moduleId}/lesson/${it.id}`);
                    } else {
                      router.push(`/dashboard/lecturer/modules/${moduleId}/quiz/${it.id}`);
                    }
                  }}
                  className={`p-2 sm:p-2.5 rounded-xl transition-colors ${isMateri ? "hover:bg-primary/10 text-primary" : "hover:bg-amber-500/10 text-amber-600"}`}
                  title={isMateri ? "Lihat Pratinjau Materi" : "Lihat Analisis & Pratinjau Kuis"}
                >
                  <Eye size={18} />
                </button>
                
                <button
                  onClick={() => { if (isMateri) { setEditingMateri(it); setMateriOpen(true); } else { setEditingKuis(it); setKuisOpen(true); } }}
                  className="p-2 sm:p-2.5 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit Konten"
                >
                  <Edit3 size={18} />
                </button>

                <button 
                  onClick={() => setItems(items.filter(i => i.id !== it.id))} 
                  className="p-2 sm:p-2.5 hover:bg-red-500/10 rounded-xl text-red-500 transition-colors"
                  title="Hapus Konten"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
           <div className="py-12 text-center border-2 border-dashed border-border rounded-3xl bg-muted/20">
              <p className="text-muted-foreground font-bold">Belum ada materi atau kuis.</p>
           </div>
        )}
      </div>

      {materiOpen && <MateriModal initial={editingMateri} onSave={(m:any) => setMateriOpen(false)} onClose={() => setMateriOpen(false)} />}
      {kuisOpen && <KuisModal initial={editingKuis} onSave={(k:any) => setKuisOpen(false)} onClose={() => setKuisOpen(false)} />}
      
    </div>
  );
}