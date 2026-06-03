import { ContentType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export interface StudentQuizOptionData {
  id: number;
  text: string;
}

export interface StudentQuizQuestionData {
  id: number;
  question: string;
  mediaUrl?: string;
  options: StudentQuizOptionData[];
  correctIndex: number;
}

export interface StudentLatestQuizAttemptData {
  id: number;
  score: number | null;
  totalCorrect: number;
  totalQuestions: number;
  durationSeconds: number | null;
  submittedAt: Date | null;
  answers: {
    soalId: number;
    optionId: number | null;
  }[];
}

export interface StudentQuizData {
  module: {
    id: number;
    title: string;
  };
  quiz: {
    id: number;
    title: string;
    description: string;
    timeLimitMinutes: number | null;
    hasTimeLimit: boolean;
    questions: StudentQuizQuestionData[];
  };
  latestAttempt: StudentLatestQuizAttemptData | null;
}

export async function getStudentQuizData(params: {
  userId: number;
  moduleId: number;
  quizId: number;
}): Promise<StudentQuizData | null> {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_moduleId: {
        userId: params.userId,
        moduleId: params.moduleId,
      },
    },
    select: {
      id: true,
      isKicked: true,
      module: {
        select: {
          id: true,
          title: true,
          contents: {
            where: {
              kind: ContentType.KUIS,
              kuis: {
                id: params.quizId,
              },
            },
            select: {
              kuis: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  hasTimeLimit: true,
                  timeLimitMinutes: true,
                  soals: {
                    orderBy: {
                      order: "asc",
                    },
                    select: {
                      id: true,
                      questionText: true,
                      mediaUrl: true,
                      options: {
                        orderBy: {
                          order: "asc",
                        },
                        select: {
                          id: true,
                          text: true,
                          isCorrect: true,
                        },
                      },
                    },
                  },
                  attempts: {
                    where: {
                      userId: params.userId,
                      isCompleted: true,
                      submittedAt: {
                        not: null,
                      },
                    },
                    orderBy: {
                      submittedAt: "desc",
                    },
                    take: 1,
                    select: {
                      id: true,
                      score: true,
                      totalCorrect: true,
                      totalQuestions: true,
                      durationSeconds: true,
                      submittedAt: true,
                      answers: {
                        select: {
                          soalId: true,
                          optionId: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!enrollment || enrollment.isKicked) {
    return null;
  }

  const quiz = enrollment.module.contents[0]?.kuis;

  if (!quiz) {
    return null;
  }

  const latestAttempt = quiz.attempts[0] ?? null;

  return {
    module: {
      id: enrollment.module.id,
      title: enrollment.module.title,
    },
    quiz: {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description ?? "",
      hasTimeLimit: quiz.hasTimeLimit,
      timeLimitMinutes: quiz.timeLimitMinutes,
      questions: quiz.soals.map((soal) => {
        const correctIndex = soal.options.findIndex((option) => option.isCorrect);

        return {
          id: soal.id,
          question: soal.questionText,
          mediaUrl: soal.mediaUrl ?? undefined,
          options: soal.options.map((option) => ({
            id: option.id,
            text: option.text,
          })),
          correctIndex: correctIndex >= 0 ? correctIndex : 0,
        };
      }),
    },
    latestAttempt: latestAttempt
    ? {
        id: latestAttempt.id,
        score: latestAttempt.score,
        totalCorrect: latestAttempt.totalCorrect ?? 0,
        totalQuestions: latestAttempt.totalQuestions ?? 0,
        durationSeconds: latestAttempt.durationSeconds,
        submittedAt: latestAttempt.submittedAt,
        answers: latestAttempt.answers,
        }
    : null,
  };
}