export type AdminStatIconKey = "users" | "students" | "lecturers" | "modules";

export interface AdminDashboardStat {
  label: string;
  value: string;
  iconKey: AdminStatIconKey;
  color: string;
  bg: string;
}

export interface AdminRecentActivity {
  text: string;
  time: string;
}

export interface AdminDashboardData {
  stats: AdminDashboardStat[];
  recentActivities: AdminRecentActivity[];
}

export function getAdminDashboardData(): AdminDashboardData {
  return {
    stats: [
      {
        label: "Total Pengguna",
        value: "126",
        iconKey: "users",
        color: "text-blue-600",
        bg: "bg-blue-500/10",
      },
      {
        label: "Mahasiswa Aktif",
        value: "108",
        iconKey: "students",
        color: "text-teal-600",
        bg: "bg-teal-500/10",
      },
      {
        label: "Dosen Aktif",
        value: "12",
        iconKey: "lecturers",
        color: "text-indigo-600",
        bg: "bg-indigo-500/10",
      },
      {
        label: "Modul Publik",
        value: "9",
        iconKey: "modules",
        color: "text-amber-600",
        bg: "bg-amber-500/10",
      },
    ],
    recentActivities: [
      {
        text: "Maya Sari mendaftar akun baru sebagai mahasiswa",
        time: "30 menit lalu",
      },
      {
        text: "Admin mengaktifkan akun dosen Dr. Rina Hartati",
        time: "2 jam lalu",
      },
      {
        text: "Salah satu modul pembelajaran dipublikasikan",
        time: "1 hari lalu",
      },
      {
        text: "Data pengguna Nita Suryani diperbarui",
        time: "2 hari lalu",
      },
    ],
  };
}