"use client";

import React, { useState } from "react";
import { Award, BookOpen, Lock } from "lucide-react";
import { CertificateCard, Certificate, CertStatus } from "@/components/dashboard/student/certificates/CertificateCard";
import { CertificatePreviewModal } from "@/components/dashboard/student/certificates/CertificatePreviewModal";

// --- DUMMY DATA ---
const certificates: Certificate[] = [
  { id: 1, title: "Pemeriksaan Kehamilan Trimester 1", topic: "Pemeriksaan Kehamilan", date: "10 April 2026", score: 92, status: "completed", certNo: "EDB-2026-0001" },
  { id: 2, title: "Anamnesis & Pemeriksaan Vital ANC", topic: "Pemeriksaan Kehamilan", date: "02 April 2026", score: 88, status: "completed", certNo: "EDB-2026-0007" },
  { id: 3, title: "Inisiasi Menyusu Dini (IMD)", topic: "Teknik Menyusui", date: "20 Maret 2026", score: 85, status: "completed", certNo: "EDB-2026-0011" },
  { id: 4, title: "Perawatan Bayi Baru Lahir", topic: "Perawatan Bayi Baru Lahir", date: null, score: null, status: "in-progress", progress: 65 },
  { id: 5, title: "Teknik Menyusui Efektif", topic: "Teknik Menyusui", date: null, score: null, status: "in-progress", progress: 30 },
  { id: 6, title: "APGAR Score & Resusitasi", topic: "Perawatan Bayi Baru Lahir", date: null, score: null, status: "locked" },
];

export default function StudentCertificatesPage() {
  const [filter, setFilter] = useState<"semua" | CertStatus>("semua");
  const [preview, setPreview] = useState<Certificate | null>(null);

  const filtered = certificates.filter(c => filter === "semua" ? true : c.status === filter);
  const completedCount = certificates.filter(c => c.status === "completed").length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* HEADER */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1.5 sm:mb-2">Sertifikat Saya</h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Kumpulan bukti penyelesaian modul pembelajaran yang Anda ikuti pada purwarupa aplikasi EduBidan.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Award size={24} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-foreground">{completedCount}</p>
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Telah Diraih</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-foreground">{certificates.filter(c => c.status === "in-progress").length}</p>
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Dalam Proses</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <Lock size={24} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-foreground">{certificates.filter(c => c.status === "locked").length}</p>
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Belum Tersedia</p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-2 mb-6 sm:mb-8 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
        {([
          { v: "semua", label: "Semua" },
          { v: "completed", label: "Telah Diraih" },
          { v: "in-progress", label: "Dalam Proses" },
          { v: "locked", label: "Terkunci" },
        ] as const).map(f => (
          <button 
            key={f.v} 
            onClick={() => setFilter(f.v as any)} 
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              filter === f.v 
              ? "bg-foreground text-background shadow-md" 
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* CERTIFICATE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filtered.map(cert => (
          <CertificateCard 
            key={cert.id} 
            cert={cert} 
            onPreview={setPreview} 
          />
        ))}
      </div>

      {/* PREVIEW MODAL */}
      <CertificatePreviewModal 
        preview={preview} 
        onClose={() => setPreview(null)} 
        userName="Ikhsan Rizqi" 
      />
      
    </div>
  );
}