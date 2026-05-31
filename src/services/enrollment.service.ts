import { ModuleStatus, Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const enrollmentSelect = {
  id: true,
  userId: true,
  moduleId: true,
  isKicked: true,
  kickReason: true,
  joinedAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      phoneNumber: true,
      isActive: true,
      mahasiswaProfile: {
        select: {
          id: true,
          npm: true,
        },
      },
    },
  },
  module: {
    select: {
      id: true,
      title: true,
      description: true,
      bannerUrl: true,
      accessCode: true,
      status: true,
      estimatedMinutes: true,
    },
  },
};

function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export type JoinModuleResult =
  | {
      success: true;
      enrollment: Awaited<ReturnType<typeof getEnrollmentById>>;
      error: null;
    }
  | {
      success: false;
      enrollment: null;
      error:
        | "USER_ID_REQUIRED"
        | "ACCESS_CODE_REQUIRED"
        | "USER_NOT_FOUND"
        | "USER_INACTIVE"
        | "USER_NOT_MAHASISWA"
        | "MODULE_NOT_FOUND"
        | "MODULE_NOT_PUBLISHED"
        | "ALREADY_JOINED";
    };

async function getEnrollmentById(id: number) {
  return prisma.enrollment.findUnique({
    where: {
      id,
    },
    select: enrollmentSelect,
  });
}

export async function joinModuleByAccessCode(params: {
  userId: unknown;
  accessCode: unknown;
}): Promise<JoinModuleResult> {
  const userId = Number(params.userId);
  const accessCode = normalizeRequiredString(params.accessCode)?.toUpperCase();

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      enrollment: null,
      error: "USER_ID_REQUIRED",
    };
  }

  if (!accessCode) {
    return {
      success: false,
      enrollment: null,
      error: "ACCESS_CODE_REQUIRED",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    return {
      success: false,
      enrollment: null,
      error: "USER_NOT_FOUND",
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      enrollment: null,
      error: "USER_INACTIVE",
    };
  }

  if (user.role !== Role.MAHASISWA) {
    return {
      success: false,
      enrollment: null,
      error: "USER_NOT_MAHASISWA",
    };
  }

  const module = await prisma.module.findUnique({
    where: {
      accessCode,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!module) {
    return {
      success: false,
      enrollment: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  if (module.status !== ModuleStatus.PUBLIK) {
    return {
      success: false,
      enrollment: null,
      error: "MODULE_NOT_PUBLISHED",
    };
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_moduleId: {
        userId,
        moduleId: module.id,
      },
    },
    select: {
      id: true,
      isKicked: true,
    },
  });

  if (existingEnrollment && !existingEnrollment.isKicked) {
    return {
      success: false,
      enrollment: null,
      error: "ALREADY_JOINED",
    };
  }

  if (existingEnrollment?.isKicked) {
    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        id: existingEnrollment.id,
      },
      data: {
        isKicked: false,
        kickReason: null,
        joinedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    const enrollment = await getEnrollmentById(updatedEnrollment.id);

    return {
      success: true,
      enrollment,
      error: null,
    };
  }

  const createdEnrollment = await prisma.enrollment.create({
    data: {
      userId,
      moduleId: module.id,
    },
    select: {
      id: true,
    },
  });

  const enrollment = await getEnrollmentById(createdEnrollment.id);

  return {
    success: true,
    enrollment,
    error: null,
  };
}

export async function getModuleParticipants(moduleId: number) {
  return prisma.enrollment.findMany({
    where: {
      moduleId,
    },
    select: enrollmentSelect,
    orderBy: {
      joinedAt: "desc",
    },
  });
}

export type UpdateParticipantKickStatusResult =
  | {
      success: true;
      enrollment: Awaited<ReturnType<typeof getEnrollmentById>>;
      error: null;
    }
  | {
      success: false;
      enrollment: null;
      error:
        | "MODULE_NOT_FOUND"
        | "USER_NOT_FOUND"
        | "ENROLLMENT_NOT_FOUND"
        | "KICK_STATUS_REQUIRED";
    };

export async function updateParticipantKickStatus(params: {
  moduleId: number;
  userId: number;
  isKicked: unknown;
  kickReason?: unknown;
}): Promise<UpdateParticipantKickStatusResult> {
  if (typeof params.isKicked !== "boolean") {
    return {
      success: false,
      enrollment: null,
      error: "KICK_STATUS_REQUIRED",
    };
  }

  const module = await prisma.module.findUnique({
    where: {
      id: params.moduleId,
    },
    select: {
      id: true,
    },
  });

  if (!module) {
    return {
      success: false,
      enrollment: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return {
      success: false,
      enrollment: null,
      error: "USER_NOT_FOUND",
    };
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_moduleId: {
        userId: params.userId,
        moduleId: params.moduleId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!existingEnrollment) {
    return {
      success: false,
      enrollment: null,
      error: "ENROLLMENT_NOT_FOUND",
    };
  }

  const kickReason = normalizeRequiredString(params.kickReason);

  const updatedEnrollment = await prisma.enrollment.update({
    where: {
      id: existingEnrollment.id,
    },
    data: {
      isKicked: params.isKicked,
      kickReason: params.isKicked ? kickReason : null,
    },
    select: {
      id: true,
    },
  });

  const enrollment = await getEnrollmentById(updatedEnrollment.id);

  return {
    success: true,
    enrollment,
    error: null,
  };
}