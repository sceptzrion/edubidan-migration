import { CheckCircle2, Target, Users } from "lucide-react";

import type { LecturerQuizGeneralStats } from "@/data/learning/lecturer/lecturer-quiz-preview";

interface LecturerQuizStatsGridProps {
  stats: LecturerQuizGeneralStats;
}

export function LecturerQuizStatsGrid({ stats }: LecturerQuizStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
          <Target size={24} />
        </div>

        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Rata-rata Skor
          </p>
          <p className="text-2xl font-extrabold text-foreground">
            {stats.averageScore}{" "}
            <span className="text-sm font-medium text-muted-foreground">
              / 100
            </span>
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
          <CheckCircle2 size={24} />
        </div>

        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Tingkat Kelulusan
          </p>
          <p className="text-2xl font-extrabold text-foreground">
            {stats.passRate}%
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
          <Users size={24} />
        </div>

        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Total Mengerjakan
          </p>
          <p className="text-2xl font-extrabold text-foreground">
            {stats.totalParticipants}{" "}
            <span className="text-sm font-medium text-muted-foreground">
              Mahasiswa
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}