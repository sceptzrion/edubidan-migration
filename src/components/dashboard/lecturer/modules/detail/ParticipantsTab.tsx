import React, { useState } from "react";
import { UserMinus, AlertTriangle, Download, Mail } from "lucide-react";

type Peserta = { id: number; name: string; nim: string; progress: number };
const initialPeserta: Peserta[] = [
  { id: 1, name: "Ikhsan Rizqi", nim: "2010631170000", progress: 92 },
  { id: 2, name: "Sari Dewi", nim: "2024010101", progress: 78 },
  { id: 3, name: "Rina Lestari", nim: "2024010103", progress: 64 },
  { id: 4, name: "Lina Marlina", nim: "2024010104", progress: 100 },
  { id: 5, name: "Maya Sari", nim: "2024010105", progress: 45 },
];

export function ParticipantsTab() {
  const [peserta, setPeserta] = useState(initialPeserta);
  const [kickTarget, setKickTarget] = useState<Peserta | null>(null);
  const [reason, setReason] = useState("");

  const confirmKick = () => {
    if (!kickTarget || !reason.trim()) return;
    setPeserta(peserta.filter(p => p.id !== kickTarget.id));
    setKickTarget(null);
    setReason("");
  };

  const handleEmail = (nim: string) => {
    // Simulasi membuka email client default
    window.location.href = `mailto:student_${nim}@edubidan.id?subject=Informasi%20Modul%20Pembelajaran`;
  };

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* Header Tab Peserta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground">Daftar Peserta Modul</h2>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
            {peserta.length} mahasiswa telah bergabung menggunakan kode modul.
          </p>
        </div>
        <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
          <Download size={16} /> Ekspor CSV
        </button>
      </div>

      {/* Tabel Peserta */}
      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">Nama Peserta</th>
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">NPM / NIM</th>
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">Progres Belajar</th>
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {peserta.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-primary to-teal-500 flex items-center justify-center text-white text-xs sm:text-sm font-extrabold shrink-0 shadow-sm">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-extrabold text-foreground text-xs sm:text-sm">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:px-6 text-muted-foreground font-mono text-xs sm:text-sm font-medium">{p.nim}</td>
                  <td className="p-4 sm:px-6">
                    <div className="flex items-center gap-3 w-40 sm:w-48">
                      <div className="flex-1 h-2 sm:h-2.5 rounded-full bg-muted overflow-hidden shadow-inner">
                        <div className="h-full rounded-full bg-linear-to-r from-primary to-teal-400" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground w-9 text-right">{p.progress}%</span>
                    </div>
                  </td>
                  
                  {/* KOLOM AKSI (EMAIL & KELUARKAN) */}
                  <td className="p-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      <button 
                        onClick={() => handleEmail(p.nim)}
                        className="p-2 sm:p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                        title="Kirim Email ke Mahasiswa"
                      >
                        <Mail size={18} />
                      </button>
                      <button 
                        onClick={() => setKickTarget(p)} 
                        className="p-2 sm:p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                        title="Keluarkan Peserta"
                      >
                        <UserMinus size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {peserta.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground font-medium">Belum ada peserta yang bergabung.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Keluarkan Peserta */}
      {kickTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-200 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl sm:rounded-3xl border border-border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-5 border border-red-500/20">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-foreground mb-2">Keluarkan Peserta?</h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                Anda akan mengeluarkan <strong className="text-foreground">{kickTarget.name}</strong> (NPM {kickTarget.nim}) dari modul ini. Mahasiswa akan kehilangan akses ke materi dan progresnya akan dihapus permanen.
              </p>
              
              <div>
                <label className="text-xs sm:text-sm mb-2 block font-bold text-foreground">
                  Alasan Mengeluarkan <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={3} 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Tulis alasan (wajib diisi)..."
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-xs sm:text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none font-medium transition-all" 
                />
              </div>
            </div>
            
            <div className="p-5 sm:p-6 border-t border-border flex gap-3 bg-muted/20 rounded-b-2xl sm:rounded-3xl">
              <button onClick={() => { setKickTarget(null); setReason(""); }} className="flex-1 py-3 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors">
                Batal
              </button>
              <button 
                onClick={confirmKick} 
                disabled={!reason.trim()}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs sm:text-sm flex items-center justify-center gap-2 font-bold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-red-500/20"
              >
                <UserMinus size={16} /> Keluarkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}