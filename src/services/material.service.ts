import { ContentType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const moduleContentSelect = {
  id: true,
  moduleId: true,
  kind: true,
  order: true,
  materi: {
    select: {
      id: true,
      title: true,
      description: true,
      videoSource: true,
      videoUrl: true,
      estimatedMinutes: true,
      createdAt: true,
      updatedAt: true,
      objectives: {
        select: {
          id: true,
          text: true,
          order: true,
        },
        orderBy: {
          order: "asc",
        },
      },
      tools: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  kuis: {
    select: {
      id: true,
      title: true,
      description: true,
      hasTimeLimit: true,
      timeLimitMinutes: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          soals: true,
        },
      },
    },
  },
} satisfies Prisma.ModuleContentSelect;

const materialDetailSelect = {
  id: true,
  title: true,
  description: true,
  videoSource: true,
  videoUrl: true,
  estimatedMinutes: true,
  createdAt: true,
  updatedAt: true,
  content: {
    select: {
      id: true,
      moduleId: true,
      kind: true,
      order: true,
      module: {
        select: {
          id: true,
          title: true,
          accessCode: true,
          status: true,
        },
      },
    },
  },
  objectives: {
    select: {
      id: true,
      text: true,
      order: true,
    },
    orderBy: {
      order: "asc",
    },
  },
  tools: {
    select: {
      id: true,
      name: true,
    },
  },
  progress: {
    select: {
      id: true,
      userId: true,
      isCompleted: true,
      completedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.MateriSelect;

const materialProgressSelect = {
  id: true,
  userId: true,
  materiId: true,
  isCompleted: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
  materi: {
    select: {
      id: true,
      title: true,
      content: {
        select: {
          moduleId: true,
        },
      },
    },
  },
} satisfies Prisma.LessonProgressSelect;

type ModuleContentItem = Prisma.ModuleContentGetPayload<{
  select: typeof moduleContentSelect;
}>;

function mapModuleContent(content: ModuleContentItem) {
  if (content.kind === ContentType.MATERI) {
    return {
      id: content.id,
      moduleId: content.moduleId,
      kind: content.kind,
      order: content.order,
      materi: content.materi,
      kuis: null,
      title: content.materi?.title ?? null,
      estimatedMinutes: content.materi?.estimatedMinutes ?? null,
    };
  }

  return {
    id: content.id,
    moduleId: content.moduleId,
    kind: content.kind,
    order: content.order,
    materi: null,
    kuis: content.kuis,
    title: content.kuis?.title ?? null,
    estimatedMinutes: content.kuis?.timeLimitMinutes ?? null,
  };
}

export async function getModuleContents(moduleId: number) {
  const module = await prisma.module.findUnique({
    where: {
      id: moduleId,
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (!module) {
    return null;
  }

  const contents = await prisma.moduleContent.findMany({
    where: {
      moduleId,
    },
    select: moduleContentSelect,
    orderBy: {
      order: "asc",
    },
  });

  return {
    module,
    contents: contents.map(mapModuleContent),
  };
}

export async function getMaterialById(id: number) {
  return prisma.materi.findUnique({
    where: {
      id,
    },
    select: materialDetailSelect,
  });
}

export type UpdateMaterialProgressResult =
  | {
      success: true;
      progress: Prisma.LessonProgressGetPayload<{
        select: typeof materialProgressSelect;
      }>;
      error: null;
    }
  | {
      success: false;
      progress: null;
      error:
        | "USER_ID_REQUIRED"
        | "COMPLETED_STATUS_REQUIRED"
        | "USER_NOT_FOUND"
        | "USER_INACTIVE"
        | "MATERIAL_NOT_FOUND"
        | "USER_NOT_ENROLLED"
        | "USER_KICKED";
    };

export async function updateMaterialProgress(params: {
  userId: unknown;
  materiId: number;
  isCompleted: unknown;
}): Promise<UpdateMaterialProgressResult> {
  const userId = Number(params.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      progress: null,
      error: "USER_ID_REQUIRED",
    };
  }

  if (typeof params.isCompleted !== "boolean") {
    return {
      success: false,
      progress: null,
      error: "COMPLETED_STATUS_REQUIRED",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!user) {
    return {
      success: false,
      progress: null,
      error: "USER_NOT_FOUND",
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      progress: null,
      error: "USER_INACTIVE",
    };
  }

  const materi = await prisma.materi.findUnique({
    where: {
      id: params.materiId,
    },
    select: {
      id: true,
      content: {
        select: {
          moduleId: true,
        },
      },
    },
  });

  if (!materi) {
    return {
      success: false,
      progress: null,
      error: "MATERIAL_NOT_FOUND",
    };
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_moduleId: {
        userId,
        moduleId: materi.content.moduleId,
      },
    },
    select: {
      id: true,
      isKicked: true,
    },
  });

  if (!enrollment) {
    return {
      success: false,
      progress: null,
      error: "USER_NOT_ENROLLED",
    };
  }

  if (enrollment.isKicked) {
    return {
      success: false,
      progress: null,
      error: "USER_KICKED",
    };
  }

  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_materiId: {
        userId,
        materiId: params.materiId,
      },
    },
    update: {
      isCompleted: params.isCompleted,
      completedAt: params.isCompleted ? new Date() : null,
    },
    create: {
      userId,
      materiId: params.materiId,
      isCompleted: params.isCompleted,
      completedAt: params.isCompleted ? new Date() : null,
    },
    select: materialProgressSelect,
  });

  return {
    success: true,
    progress,
    error: null,
  };
}