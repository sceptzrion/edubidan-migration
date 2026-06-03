import { ContentType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { LecturerGradebookModule } from "@/data/learning/lecturer/lecturer-gradebook";

export async function getLecturerGradebookModules(
  dosenProfileId: number | null | undefined
): Promise<LecturerGradebookModule[]> {
  if (!dosenProfileId) return [];

  const modules = await prisma.module.findMany({
    where: {
      dosenProfileId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      contents: {
        where: {
          kind: ContentType.KUIS,
        },
        select: {
          id: true,
        },
      },
      enrollments: {
        where: {
          isKicked: false,
        },
        select: {
          id: true,
        },
      },
    },
  });

  return modules.map((module) => ({
    id: module.id,
    title: module.title,
    studentCount: module.enrollments.length,
    quizCount: module.contents.length,
  }));
}