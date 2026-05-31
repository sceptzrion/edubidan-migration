import { ContentType, ModuleStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const moduleListSelect = {
  id: true,
  title: true,
  description: true,
  bannerUrl: true,
  accessCode: true,
  status: true,
  estimatedMinutes: true,
  createdAt: true,
  updatedAt: true,
  dosenProfile: {
    select: {
      id: true,
      nidnNip: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          phoneNumber: true,
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
  contents: {
    select: {
      id: true,
      kind: true,
      order: true,
    },
    orderBy: {
      order: "asc",
    },
  },
  _count: {
    select: {
      contents: true,
      enrollments: true,
    },
  },
} satisfies Prisma.ModuleSelect;

const moduleDetailSelect = {
  id: true,
  title: true,
  description: true,
  bannerUrl: true,
  accessCode: true,
  status: true,
  estimatedMinutes: true,
  createdAt: true,
  updatedAt: true,
  dosenProfile: {
    select: {
      id: true,
      nidnNip: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          phoneNumber: true,
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
  contents: {
    select: {
      id: true,
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
          soals: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  },
  enrollments: {
    select: {
      id: true,
      joinedAt: true,
      isKicked: true,
      kickReason: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          mahasiswaProfile: {
            select: {
              npm: true,
            },
          },
        },
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
  },
  _count: {
    select: {
      contents: true,
      enrollments: true,
    },
  },
} satisfies Prisma.ModuleSelect;

type ModuleListItem = Prisma.ModuleGetPayload<{
  select: typeof moduleListSelect;
}>;

type ModuleDetail = Prisma.ModuleGetPayload<{
  select: typeof moduleDetailSelect;
}>;

function normalizeSearch(value: string | null) {
  const search = value?.trim();

  return search && search.length > 0 ? search : null;
}

function normalizeStatus(value: string | null) {
  if (value === ModuleStatus.PUBLIK) {
    return ModuleStatus.PUBLIK;
  }

  if (value === ModuleStatus.DRAFT) {
    return ModuleStatus.DRAFT;
  }

  return null;
}

function buildModuleStats(contents: Array<{ kind: ContentType }>) {
  const totalMateri = contents.filter(
    (content) => content.kind === ContentType.MATERI
  ).length;

  const totalKuis = contents.filter(
    (content) => content.kind === ContentType.KUIS
  ).length;

  return {
    totalMateri,
    totalKuis,
    totalContents: contents.length,
  };
}

function mapModuleListItem(module: ModuleListItem) {
  const stats = buildModuleStats(module.contents);

  return {
    ...module,
    stats: {
      ...stats,
      totalParticipants: module._count.enrollments,
    },
  };
}

function mapModuleDetail(module: ModuleDetail) {
  const stats = buildModuleStats(module.contents);

  return {
    ...module,
    stats: {
      ...stats,
      totalParticipants: module._count.enrollments,
    },
  };
}

export async function getModules(params?: {
  search?: string | null;
  status?: string | null;
}) {
  const search = normalizeSearch(params?.search ?? null);
  const status = normalizeStatus(params?.status ?? null);

  const where: Prisma.ModuleWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search,
              },
            },
            {
              description: {
                contains: search,
              },
            },
            {
              accessCode: {
                contains: search,
              },
            },
          ],
        }
      : {}),
  };

  const modules = await prisma.module.findMany({
    where,
    select: moduleListSelect,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return modules.map(mapModuleListItem);
}

export async function getModuleById(id: number) {
  const module = await prisma.module.findUnique({
    where: {
      id,
    },
    select: moduleDetailSelect,
  });

  if (!module) {
    return null;
  }

  return mapModuleDetail(module);
}