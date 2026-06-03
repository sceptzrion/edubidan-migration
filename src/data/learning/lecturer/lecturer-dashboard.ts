import { ContentType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { DashboardSessionUser } from "@/lib/auth/session-user";
import { getDisplayNameParts } from "@/lib/text/name";

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
  id: string;
  text: string;
  highlight: string;
  time: string;
}

export interface LecturerDashboardData {
  lecturerName: string;
  stats: LecturerDashboardStat[];
  quickActions: LecturerQuickAction[];
  recentActivities: LecturerRecentActivity[];
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getQuickActions(): LecturerQuickAction[] {
  return [
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
}

function getEmptyStats(): LecturerDashboardStat[] {
  return [
    {
      label: "Modul Saya",
      value: "0",
      iconKey: "module",
      color: "bg-primary/15 text-primary border-primary/20",
    },
    {
      label: "Total Kuis",
      value: "0",
      iconKey: "quiz",
      color: "bg-teal-500/15 text-teal-600 border-teal-500/20",
    },
    {
      label: "Mahasiswa Terdaftar",
      value: "0",
      iconKey: "students",
      color: "bg-blue-500/15 text-blue-600 border-blue-500/20",
    },
    {
      label: "Rata-rata Skor",
      value: "0",
      iconKey: "score",
      color: "bg-amber-500/15 text-amber-500 border-amber-500/20",
    },
  ];
}

export async function getLecturerDashboardData(
  currentUser: DashboardSessionUser
): Promise<LecturerDashboardData> {
  const dosenProfileId = currentUser.dosenProfile?.id;
  const lecturerName = getDisplayNameParts(currentUser.name);

  if (!dosenProfileId) {
    return {
      lecturerName,
      stats: getEmptyStats(),
      quickActions: getQuickActions(),
      recentActivities: [],
    };
  }

  const [
    moduleCount,
    quizCount,
    activeEnrollmentCount,
    averageScore,
    activityLogs,
  ] = await Promise.all([
    prisma.module.count({
      where: {
        dosenProfileId,
      },
    }),
    prisma.moduleContent.count({
      where: {
        kind: ContentType.KUIS,
        module: {
          dosenProfileId,
        },
      },
    }),
    prisma.enrollment.count({
      where: {
        isKicked: false,
        module: {
          dosenProfileId,
        },
      },
    }),
    prisma.quizAttempt.aggregate({
      where: {
        isCompleted: true,
        score: {
          not: null,
        },
        kuis: {
          content: {
            module: {
              dosenProfileId,
            },
          },
        },
      },
      _avg: {
        score: true,
      },
    }),
    prisma.activityLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
      select: {
        id: true,
        actionType: true,
        description: true,
        createdAt: true,
      },
    }),
  ]);

  const roundedAverageScore = Math.round(averageScore._avg.score ?? 0);

  return {
    lecturerName,
    stats: [
      {
        label: "Modul Saya",
        value: moduleCount.toLocaleString("id-ID"),
        iconKey: "module",
        color: "bg-primary/15 text-primary border-primary/20",
      },
      {
        label: "Total Kuis",
        value: quizCount.toLocaleString("id-ID"),
        iconKey: "quiz",
        color: "bg-teal-500/15 text-teal-600 border-teal-500/20",
      },
      {
        label: "Mahasiswa Terdaftar",
        value: activeEnrollmentCount.toLocaleString("id-ID"),
        iconKey: "students",
        color: "bg-blue-500/15 text-blue-600 border-blue-500/20",
      },
      {
        label: "Rata-rata Skor",
        value: roundedAverageScore.toLocaleString("id-ID"),
        iconKey: "score",
        color: "bg-amber-500/15 text-amber-500 border-amber-500/20",
      },
    ],
    quickActions: getQuickActions(),
    recentActivities: activityLogs.map((activity) => ({
      id: String(activity.id),
      text: activity.description,
      highlight: activity.actionType,
      time: formatRelativeTime(activity.createdAt),
    })),
  };
}