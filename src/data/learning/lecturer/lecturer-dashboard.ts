export type LecturerStatIconKey = "module" | "quiz" | "students" | "score";

export type LecturerActionIconKey = "add" | "gradebook";

export type LecturerActionBgIconKey = "module" | "graduation";

export interface LecturerDashboardStat {
  label: string;
  value: string;
  iconKey: LecturerStatIconKey;
  color: string;
}

export interface LecturerQuickAction {
  title: string;
  description: string;
  href: string;
  iconKey: LecturerActionIconKey;
  bgIconKey: LecturerActionBgIconKey;
  colorTheme: "primary" | "teal";
}

export interface LecturerRecentActivity {
  text: string;
  highlight: string;
  time: string;
}

export function getLecturerDashboardData() {
  const stats: LecturerDashboardStat[] = [
    {
      label: "Modul Saya",
      value: "3",
      iconKey: "module",
      color: "bg-primary/15 text-primary border-primary/20",
    },
    {
      label: "Total Kuis",
      value: "6",
      iconKey: "quiz",
      color: "bg-teal-500/15 text-teal-600 border-teal-500/20",
    },
    {
      label: "Mahasiswa Terdaftar",
      value: "84",
      iconKey: "students",
      color: "bg-blue-500/15 text-blue-600 border-blue-500/20",
    },
    {
      label: "Rata-rata Skor",
      value: "82",
      iconKey: "score",
      color: "bg-amber-500/15 text-amber-500 border-amber-500/20",
    },
  ];

  const quickActions: LecturerQuickAction[] = [
    {
      iconKey: "add",
      bgIconKey: "module",
      title: "Kelola Modul",
      description: "Buat, ubah, dan publikasikan modul pembelajaran.",
      href: "/dashboard/lecturer/modules",
      colorTheme: "primary",
    },
    {
      iconKey: "gradebook",
      bgIconKey: "graduation",
      title: "Tinjau Rekap Nilai",
      description: "Pantau hasil kuis mahasiswa berdasarkan modul.",
      href: "/dashboard/lecturer/gradebook",
      colorTheme: "teal",
    },
  ];

  const recentActivities: LecturerRecentActivity[] = [
    {
      text: "Sari Dewi menyelesaikan salah satu kuis evaluasi modul",
      highlight: "Skor: 90",
      time: "10 menit lalu",
    },
    {
      text: "Salah satu modul pembelajaran berhasil dipublikasi",
      highlight: "Publik",
      time: "2 jam lalu",
    },
    {
      text: "5 mahasiswa baru bergabung pada modul pembelajaran",
      highlight: "Info",
      time: "1 hari lalu",
    },
  ];

  return {
    lecturerName: "Dr. Rina",
    stats,
    quickActions,
    recentActivities,
  };
}