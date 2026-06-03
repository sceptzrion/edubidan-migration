import { ContentType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getDisplayNameParts } from "@/lib/text/name";

const fallbackModuleImage =
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";

export interface StudentModuleCardItem {
  id: number;
  title: string;
  desc: string;
  img: string;
  progress: number;
  lessons: number;
  quizzes: number;
  duration: string;
  instructor: string;
}

export interface StudentDashboardLearningProgressItem {
  id: number;
  title: string;
  progress: number;
  totalItems: number;
  completedItems: number;
}

export interface StudentDashboardPendingQuizItem {
  id: number;
  moduleId: number;
  title: string;
  status: string;
}

export interface StudentDashboardData {
  studentName: ReturnType<typeof getDisplayNameParts>;
  stats: {
    enrolledModules: number;
    completedMaterials: number;
    completedQuizzes: number;
    pendingQuizzes: number;
  };
  learningProgress: StudentDashboardLearningProgressItem[];
  pendingQuizzes: StudentDashboardPendingQuizItem[];
}

function formatDuration(minutes: number | null) {
  if (!minutes || minutes <= 0) {
    return "-";
  }

  if (minutes < 60) {
    return `${minutes} Menit`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} Jam`;
  }

  return `${hours} Jam ${remainingMinutes} Menit`;
}

function calculateModuleProgress(params: {
  totalMaterials: number;
  completedMaterials: number;
  totalQuizzes: number;
  completedQuizzes: number;
}) {
  const totalItems = params.totalMaterials + params.totalQuizzes;
  const completedItems = params.completedMaterials + params.completedQuizzes;

  if (totalItems === 0) {
    return {
      totalItems,
      completedItems,
      progress: 0,
    };
  }

  return {
    totalItems,
    completedItems,
    progress: Math.round((completedItems / totalItems) * 100),
  };
}

async function getStudentEnrollmentData(userId: number) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId,
      isKicked: false,
    },
    orderBy: {
      joinedAt: "desc",
    },
    select: {
      module: {
        select: {
          id: true,
          title: true,
          description: true,
          bannerUrl: true,
          estimatedMinutes: true,
          dosenProfile: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          contents: {
            orderBy: {
              order: "asc",
            },
            select: {
              id: true,
              kind: true,
              materi: {
                select: {
                  id: true,
                  title: true,
                },
              },
              kuis: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const moduleIds = enrollments.map((enrollment) => enrollment.module.id);
  const materialIds = enrollments.flatMap((enrollment) =>
    enrollment.module.contents
      .map((content) => content.materi?.id)
      .filter((id): id is number => typeof id === "number")
  );
  const quizIds = enrollments.flatMap((enrollment) =>
    enrollment.module.contents
      .map((content) => content.kuis?.id)
      .filter((id): id is number => typeof id === "number")
  );

  const [completedMaterials, completedQuizAttempts] = await Promise.all([
    materialIds.length > 0
      ? prisma.lessonProgress.findMany({
          where: {
            userId,
            materiId: {
              in: materialIds,
            },
            isCompleted: true,
          },
          select: {
            materiId: true,
          },
        })
      : [],
    quizIds.length > 0
      ? prisma.quizAttempt.findMany({
          where: {
            userId,
            kuisId: {
              in: quizIds,
            },
            isCompleted: true,
            submittedAt: {
              not: null,
            },
          },
          select: {
            kuisId: true,
          },
        })
      : [],
  ]);

  const completedMaterialIds = new Set(
    completedMaterials.map((progress) => progress.materiId)
  );
  const completedQuizIds = new Set(
    completedQuizAttempts.map((attempt) => attempt.kuisId)
  );

  return {
    enrollments,
    moduleIds,
    completedMaterialIds,
    completedQuizIds,
  };
}

export async function getStudentModuleCards(
  userId: number
): Promise<StudentModuleCardItem[]> {
  const { enrollments, completedMaterialIds, completedQuizIds } =
    await getStudentEnrollmentData(userId);

  return enrollments.map((enrollment) => {
    const module = enrollment.module;
    const materials = module.contents.filter(
      (content) => content.kind === ContentType.MATERI && content.materi
    );
    const quizzes = module.contents.filter(
      (content) => content.kind === ContentType.KUIS && content.kuis
    );

    const completedMaterials = materials.filter(
      (content) =>
        content.materi?.id !== undefined && completedMaterialIds.has(content.materi.id)
    ).length;
    const completedQuizzes = quizzes.filter(
      (content) =>
        content.kuis?.id !== undefined && completedQuizIds.has(content.kuis.id)
    ).length;

    const progress = calculateModuleProgress({
      totalMaterials: materials.length,
      completedMaterials,
      totalQuizzes: quizzes.length,
      completedQuizzes,
    });

    return {
      id: module.id,
      title: module.title,
      desc: module.description ?? "Belum ada deskripsi modul.",
      img: module.bannerUrl ?? fallbackModuleImage,
      progress: progress.progress,
      lessons: materials.length,
      quizzes: quizzes.length,
      duration: formatDuration(module.estimatedMinutes),
      instructor: module.dosenProfile.user.name,
    };
  });
}

export async function getStudentDashboardData(params: {
  userId: number;
  studentFullName: string;
}): Promise<StudentDashboardData> {
  const { enrollments, completedMaterialIds, completedQuizIds } =
    await getStudentEnrollmentData(params.userId);

  const learningProgress: StudentDashboardLearningProgressItem[] = [];
  const pendingQuizzes: StudentDashboardPendingQuizItem[] = [];

  let totalCompletedMaterials = 0;
  let totalCompletedQuizzes = 0;

  enrollments.forEach((enrollment) => {
    const module = enrollment.module;
    const materials = module.contents.filter(
      (content) => content.kind === ContentType.MATERI && content.materi
    );
    const quizzes = module.contents.filter(
      (content) => content.kind === ContentType.KUIS && content.kuis
    );

    const completedMaterials = materials.filter(
      (content) =>
        content.materi?.id !== undefined && completedMaterialIds.has(content.materi.id)
    ).length;
    const completedQuizzes = quizzes.filter(
      (content) =>
        content.kuis?.id !== undefined && completedQuizIds.has(content.kuis.id)
    ).length;

    totalCompletedMaterials += completedMaterials;
    totalCompletedQuizzes += completedQuizzes;

    const progress = calculateModuleProgress({
      totalMaterials: materials.length,
      completedMaterials,
      totalQuizzes: quizzes.length,
      completedQuizzes,
    });

    learningProgress.push({
      id: module.id,
      title: module.title,
      progress: progress.progress,
      totalItems: progress.totalItems,
      completedItems: progress.completedItems,
    });

    quizzes.forEach((content) => {
      if (!content.kuis) return;

      if (!completedQuizIds.has(content.kuis.id)) {
        pendingQuizzes.push({
          id: content.kuis.id,
          moduleId: module.id,
          title: content.kuis.title,
          status: "Belum Dikerjakan",
        });
      }
    });
  });

  return {
    studentName: getDisplayNameParts(params.studentFullName),
    stats: {
      enrolledModules: enrollments.length,
      completedMaterials: totalCompletedMaterials,
      completedQuizzes: totalCompletedQuizzes,
      pendingQuizzes: pendingQuizzes.length,
    },
    learningProgress,
    pendingQuizzes: pendingQuizzes.slice(0, 5),
  };
}