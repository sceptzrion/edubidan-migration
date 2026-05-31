"use client";

import React, { useState, useEffect } from "react";
import { 
  Award, Search, Download, Eye, CheckCircle, 
  Upload, Image as ImageIcon, Type, Calendar, User, 
  BookMarked, Save, LayoutTemplate, MoveRight 
} from "lucide-react";

type Variable = {
  id: string;
  label: string;
  token: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  fontSize: number;
  color: string;
};

const certs = [
  { id: 1, student: "Sari Dewi", module: "Pemeriksaan Kehamilan T1", score: 92, date: "10 Apr 2026", certNo: "EDB-2026-0001" },
  { id: 2, student: "Anisa Putri", module: "Pemeriksaan Kehamilan T1", score: 88, date: "12 Apr 2026", certNo: "EDB-2026-0002" },
  { id: 3, student: "Lina Marlina", module: "Perawatan Bayi Baru Lahir", score: 85, date: "14 Apr 2026", certNo: "EDB-2026-0003" },
  { id: 4, student: "Rina Lestari", module: "Pemeriksaan Kehamilan T1", score: 78, date: "15 Apr 2026", certNo: "EDB-2026-0004" },
  { id: 5, student: "Sari Dewi", module: "Perawatan Bayi Baru Lahir", score: 90, date: "16 Apr 2026", certNo: "EDB-2026-0005" },
];

export default function AdminCertificatesPage() {
  const [tab, setTab] = useState<"daftar" | "template">("daftar");

  useEffect(() => {
    document.title = "Manajemen Sertifikat | Admin EduBidan";
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Manajemen Sertifikat</h1>
          <p className="text-sm font-medium text-muted-foreground">Kelola template desain dan daftar sertifikat yang diterbitkan untuk mahasiswa.</p>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex gap-2 p-1.5 bg-muted/50 border border-border/50 rounded-2xl w-fit mb-8 shadow-inner overflow-x-auto">
        <button 
          onClick={() => setTab("daftar")} 
          className={`px-5 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2.5 transition-all whitespace-nowrap ${
            tab === "daftar" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award size={18} /> Daftar Penerbitan
        </button>
        <button 
          onClick={() => setTab("template")} 
          className={`px-5 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2.5 transition-all whitespace-nowrap ${
            tab === "template" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutTemplate size={18} /> Editor Template
        </button>
      </div>

      {/* TAB CONTENT */}
      {tab === "daftar" ? <IssuanceList /> : <TemplateEditor />}
    </div>
  );
}

/* =========================================================================
   TAB: DAFTAR PENERBITAN SERTIFIKAT
   ========================================================================= */
function IssuanceList() {
  const [search, setSearch] = useState("");
  const filtered = certs.filter(c => c.student.toLowerCase().includes(search.toLowerCase()) || c.module.toLowerCase().includes(search.toLowerCase()) || c.certNo.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500">
      {/* STATISTIK RINGKAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 shadow-inner">
            <Award size={28} />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground mb-1">{certs.length}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sertifikat Diterbitkan</p>
          </div>
        </div>
        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground mb-1">{certs.length}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Riwayat Valid</p>
          </div>
        </div>
      </div>

      {/* TABEL SERTIFIKAT */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="p-5 sm:p-6 border-b border-border bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-foreground">Riwayat Terbit Otomatis</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Cari nama, modul, nomor..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
              />
            </div>
            <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2 shadow-sm">
              <Download size={16} /> Ekspor Data
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">Nomor Sertifikat</th>
                <th className="text-left p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">Mahasiswa</th>
                <th className="text-left p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">Modul</th>
                <th className="text-center p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">Skor Akhir</th>
                <th className="text-center p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">Tanggal Terbit</th>
                <th className="text-center p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 sm:px-6 font-mono text-xs font-medium text-muted-foreground">{c.certNo}</td>
                  <td className="p-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-teal-500 text-white flex items-center justify-center text-xs font-extrabold shadow-sm shrink-0">
                        {c.student[0]}
                      </div>
                      <span className="font-extrabold text-foreground">{c.student}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:px-6 text-muted-foreground font-medium">{c.module}</td>
                  <td className="p-4 sm:px-6 text-center">
                    <span className="font-extrabold text-primary">{c.score}%</span>
                  </td>
                  <td className="p-4 sm:px-6 text-center text-xs text-muted-foreground font-medium">{c.date}</td>
                  <td className="p-4 sm:px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors text-muted-foreground" title="Lihat Pratinjau Sertifikat">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors text-muted-foreground" title="Unduh PDF">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
                    <Award size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold text-foreground">Sertifikat tidak ditemukan</p>
                    <p className="text-xs">Ubah kata kunci pencarian Anda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TAB: TEMPLATE EDITOR VISUAL
   ========================================================================= */
function TemplateEditor() {
  const [bgUrl, setBgUrl] = useState<string>("");
  const [variables, setVariables] = useState<Variable[]>([
    { id: "v1", label: "Nama Mahasiswa", token: "{{student_name}}", icon: <User size={16} />, x: 50, y: 45, fontSize: 32, color: "#0D9488" },
    { id: "v2", label: "Modul Selesai", token: "{{module_title}}", icon: <BookMarked size={16} />, x: 50, y: 62, fontSize: 18, color: "#1A1D2B" },
    { id: "v3", label: "Tanggal Terbit", token: "{{issue_date}}", icon: <Calendar size={16} />, x: 50, y: 80, fontSize: 14, color: "#64748B" },
  ]);
  const [selected, setSelected] = useState<string>("v1");
  const [dragId, setDragId] = useState<string | null>(null);

  const selectedVar = variables.find(v => v.id === selected);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setVariables(variables.map(v => v.id === dragId ? { ...v, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : v));
    setDragId(null);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 animate-in fade-in duration-500 items-start">
      
      {/* WORKSPACE CANVAS */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm flex flex-col h-[calc(100vh-200px)] min-h-125">
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-muted/10 shrink-0">
          <div>
            <h3 className="text-sm font-extrabold text-foreground mb-0.5">Workspace Template</h3>
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Tarik dan letakkan variabel ke atas kanvas gambar.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted transition-colors flex items-center gap-2">
              <Eye size={16} /> Pratinjau
            </button>
            <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2 hover:-translate-y-0.5">
              <Save size={16} /> Simpan
            </button>
          </div>
        </div>

        <div className="flex-1 bg-muted/30 p-4 sm:p-8 flex items-center justify-center overflow-auto">
          {/* CANVAS AREA (A4 Landscape aspect ratio = 1.414) */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="relative w-full max-w-200 aspect-[1.414/1] bg-card rounded-lg shadow-xl overflow-hidden ring-1 ring-border"
            style={{
              backgroundImage: bgUrl ? `url(${bgUrl})` : "linear-gradient(135deg, #F0FDFA, #CCFBF1)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Placeholder Background */}
            {!bgUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <ImageIcon size={48} className="text-primary/30 mb-3" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-card/80 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm border border-border/50">
                  Unggah Background di Panel Kanan
                </p>
              </div>
            )}

            {/* Bingkai Dekoratif (Hanya muncul jika belum ada background) */}
            {!bgUrl && (
              <>
                <div className="absolute inset-8 border-2 border-primary/20 rounded pointer-events-none" />
                <div className="absolute top-12 left-0 right-0 text-center pointer-events-none drop-shadow-sm">
                  <p className="text-xs sm:text-sm font-extrabold tracking-[0.2em] text-primary/80 uppercase">Sertifikat Penyelesaian</p>
                  <p className="text-[10px] sm:text-xs font-medium text-primary/60 mt-1">Platform Edukasi Kebidanan Digital</p>
                </div>
              </>
            )}

            {/* Elemen Variabel (Bisa Di-Drag) */}
            {variables.map(v => (
              <div
                key={v.id}
                draggable
                onDragStart={() => setDragId(v.id)}
                onClick={() => setSelected(v.id)}
                className={`absolute cursor-grab active:cursor-grabbing px-3 py-1.5 rounded-lg whitespace-nowrap transition-shadow duration-200 backdrop-blur-sm ${
                  selected === v.id 
                  ? "bg-white/90 border-2 border-primary ring-4 ring-primary/20 shadow-lg z-20" 
                  : "bg-white/40 border border-dashed border-foreground/30 hover:bg-white/60 z-10"
                }`}
                style={{ 
                  left: `${v.x}%`, 
                  top: `${v.y}%`, 
                  transform: "translate(-50%, -50%)", 
                  color: v.color, 
                  fontSize: `${v.fontSize * 0.5}px`, 
                  fontWeight: v.id === "v1" ? 800 : 600 
                }}
              >
                <span className="inline-flex items-center gap-1.5 opacity-80 mix-blend-multiply">
                  {v.id === selected && <MoveRight size={14} className="text-primary opacity-50 absolute -left-5" />}
                  {v.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SIDE PANEL (Properti Editor) */}
      <div className="space-y-5 lg:sticky lg:top-8">
        
        {/* Panel 1: Unggah Background */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h4 className="text-sm font-extrabold mb-4 flex items-center gap-2 text-foreground">
            <Upload size={16} className="text-primary" /> Background Gambar
          </h4>
          <div className="border-2 border-dashed border-border rounded-xl p-5 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group">
            <ImageIcon size={28} className="mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-2" />
            <p className="text-xs font-bold text-foreground">Klik untuk mengunggah gambar</p>
            <p className="text-[10px] font-medium text-muted-foreground mt-1">Format: JPG/PNG, Rekomendasi: 2000×1414px</p>
          </div>
          <div className="relative mt-4">
            <input
              placeholder="Atau tempel URL gambar di sini"
              value={bgUrl}
              onChange={e => setBgUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-xs font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Panel 2: Daftar Variabel */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h4 className="text-sm font-extrabold mb-4 flex items-center gap-2 text-foreground">
            <Type size={16} className="text-primary" /> Layer Variabel
          </h4>
          <div className="space-y-2">
            {variables.map(v => (
              <button 
                key={v.id} 
                onClick={() => setSelected(v.id)} 
                className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border transition-all text-left ${
                  selected === v.id 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "border-transparent bg-muted/30 hover:border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selected === v.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
                    {v.icon}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs truncate ${selected === v.id ? "font-extrabold text-primary" : "font-bold text-foreground"}`}>{v.label}</p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">{v.token}</p>
                  </div>
                </div>
                {selected === v.id && <MoveRight size={14} className="text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Panel 3: Properti Variabel Aktif */}
        {selectedVar && (
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm border-l-4 border-l-primary animate-in fade-in slide-in-from-right-4 duration-300">
            <h4 className="text-sm font-extrabold mb-4 text-foreground truncate">
              Gaya: {selectedVar.label}
            </h4>
            <div className="space-y-4 text-xs font-bold">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground uppercase tracking-wider text-[10px]">Posisi Sumbu X</label>
                  <div className="relative">
                    <input type="number" value={Math.round(selectedVar.x)} onChange={e => setVariables(variables.map(v => v.id === selected ? { ...v, x: Number(e.target.value) } : v))} className="w-full px-3 py-2 pr-6 rounded-lg bg-muted/50 border border-border outline-none focus:border-primary text-foreground" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-muted-foreground uppercase tracking-wider text-[10px]">Posisi Sumbu Y</label>
                  <div className="relative">
                    <input type="number" value={Math.round(selectedVar.y)} onChange={e => setVariables(variables.map(v => v.id === selected ? { ...v, y: Number(e.target.value) } : v))} className="w-full px-3 py-2 pr-6 rounded-lg bg-muted/50 border border-border outline-none focus:border-primary text-foreground" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-muted-foreground uppercase tracking-wider text-[10px]">Ukuran Teks</label>
                  <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">{selectedVar.fontSize}px</span>
                </div>
                <input type="range" min={12} max={72} value={selectedVar.fontSize} onChange={e => setVariables(variables.map(v => v.id === selected ? { ...v, fontSize: Number(e.target.value) } : v))} className="w-full accent-primary h-1.5 bg-muted rounded-full outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground uppercase tracking-wider text-[10px]">Warna Teks</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={selectedVar.color} onChange={e => setVariables(variables.map(v => v.id === selected ? { ...v, color: e.target.value } : v))} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
                  <input type="text" value={selectedVar.color.toUpperCase()} readOnly className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border font-mono text-foreground outline-none" />
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}