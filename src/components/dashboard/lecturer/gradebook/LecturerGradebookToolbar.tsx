import { Download, Search } from "lucide-react";

interface LecturerGradebookToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function LecturerGradebookToolbar({
  search,
  onSearchChange,
}: LecturerGradebookToolbarProps) {
  return (
    <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-muted/10">
      <div className="flex-1 w-full relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama mahasiswa atau NIM..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
        />
      </div>

      <button
        type="button"
        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5"
      >
        <Download size={16} />
        <span className="hidden sm:inline">Ekspor Nilai</span>
        <span className="sm:hidden">Ekspor</span>
      </button>
    </div>
  );
}