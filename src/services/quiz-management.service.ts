import { ContentType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const managedQuizSelect = {
  id: true,
  title: true,
  description: true,
  hasTimeLimit: true,
  timeLimitMinutes: true,
  createdAt: true,
  updatedAt: true,
  content: {
    select: {
      id: true,
      moduleId: true,
      order: true,
      module: {
        select: {
          id: true,
          title: true,
          dosenProfileId: true,
        },
      },
    },
  },
  soals: {
    select: {
      id: true,
      questionText: true,
      mediaUrl: true,
      order: true,
      options: {
        select: {
          id: true,
          text: true,
          isCorrect: true,
          order: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  },
} satisfies Prisma.KuisSelect;

export type ManagedQuiz = Prisma.KuisGetPayload<{
  select: typeof managedQuizSelect;
}>;

type NormalizedOption = {
  text: string;
  isCorrect: boolean;
  order: number;
};

type NormalizedQuestion = {
  questionText: string;
  mediaUrl: string | null;
  order: number;
  options: NormalizedOption[];
};

function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;

  return fallback;
}

function normalizeTimeLimit(value: unknown, hasTimeLimit: boolean) {
  if (!hasTimeLimit) return null;

  const minutes = Number(value);

  if (!Number.isInteger(minutes) || minutes <= 0) {
    return null;
  }

  return minutes;
}

function normalizeQuestions(value: unknown): NormalizedQuestion[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, questionIndex) => {
      if (!item || typeof item !== "object") return null;

      const question = item as {
        questionText?: unknown;
        mediaUrl?: unknown;
        options?: unknown;
        correctOptionId?: unknown;
      };

      const questionText = normalizeRequiredString(question.questionText);
      const mediaUrl = normalizeOptionalString(question.mediaUrl) ?? null;

      if (!questionText || !Array.isArray(question.options)) {
        return null;
      }

      const correctOptionId = Number(question.correctOptionId);

      const options = question.options
        .map((optionItem, optionIndex) => {
          if (!optionItem || typeof optionItem !== "object") return null;

          const option = optionItem as {
            id?: unknown;
            text?: unknown;
          };

          const optionId = Number(option.id);
          const text = normalizeRequiredString(option.text);

          if (!text) return null;

          return {
            text,
            isCorrect:
              Number.isInteger(correctOptionId) &&
              Number.isInteger(optionId) &&
              optionId === correctOptionId,
            order: optionIndex + 1,
          };
        })
        .filter((option): option is NormalizedOption => option !== null);

      if (options.length < 2) return null;

      const hasCorrectOption = options.some((option) => option.isCorrect);

      return {
        questionText,
        mediaUrl,
        order: questionIndex + 1,
        options: hasCorrectOption
          ? options
          : options.map((option, index) => ({
              ...option,
              isCorrect: index === 0,
            })),
      };
    })
    .filter((question): question is NormalizedQuestion => question !== null);
}

async function getNextContentOrder(moduleId: number) {
  const aggregate = await prisma.moduleContent.aggregate({
    where: {
      moduleId,
    },
    _max: {
      order: true,
    },
  });

  return (aggregate._max.order ?? 0) + 1;
}

export async function getManagedQuizById(id: number) {
  return prisma.kuis.findUnique({
    where: {
      id,
    },
    select: managedQuizSelect,
  });
}

export type CreateQuizResult =
  | {
      success: true;
      quiz: ManagedQuiz | null;
      error: null;
    }
  | {
      success: false;
      quiz: null;
      error:
        | "MODULE_NOT_FOUND"
        | "TITLE_REQUIRED"
        | "TIME_LIMIT_INVALID"
        | "QUESTIONS_INVALID";
    };

export async function createQuiz(params: {
  moduleId: number;
  title: unknown;
  description?: unknown;
  hasTimeLimit?: unknown;
  timeLimitMinutes?: unknown;
  questions?: unknown;
}): Promise<CreateQuizResult> {
  const moduleData = await prisma.module.findUnique({
    where: {
      id: params.moduleId,
    },
    select: {
      id: true,
    },
  });

  if (!moduleData) {
    return {
      success: false,
      quiz: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  const title = normalizeRequiredString(params.title);
  const description = normalizeOptionalString(params.description);
  const hasTimeLimit = normalizeBoolean(params.hasTimeLimit);
  const timeLimitMinutes = normalizeTimeLimit(
    params.timeLimitMinutes,
    hasTimeLimit
  );
  const questions = normalizeQuestions(params.questions);

  if (!title) {
    return {
      success: false,
      quiz: null,
      error: "TITLE_REQUIRED",
    };
  }

  if (hasTimeLimit && timeLimitMinutes === null) {
    return {
      success: false,
      quiz: null,
      error: "TIME_LIMIT_INVALID",
    };
  }

  if (questions.length === 0) {
    return {
      success: false,
      quiz: null,
      error: "QUESTIONS_INVALID",
    };
  }

  const order = await getNextContentOrder(params.moduleId);

  const createdContent = await prisma.moduleContent.create({
    data: {
      moduleId: params.moduleId,
      kind: ContentType.KUIS,
      order,
      kuis: {
        create: {
          title,
          description,
          hasTimeLimit,
          timeLimitMinutes,
          soals: {
            create: questions.map((question) => ({
              questionText: question.questionText,
              mediaUrl: question.mediaUrl,
              order: question.order,
              options: {
                create: question.options.map((option) => ({
                  text: option.text,
                  isCorrect: option.isCorrect,
                  order: option.order,
                })),
              },
            })),
          },
        },
      },
    },
    select: {
      kuis: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!createdContent.kuis) {
    return {
      success: false,
      quiz: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  const quiz = await getManagedQuizById(createdContent.kuis.id);

  return {
    success: true,
    quiz,
    error: null,
  };
}

export type UpdateQuizResult =
  | {
      success: true;
      quiz: ManagedQuiz | null;
      error: null;
    }
  | {
      success: false;
      quiz: null;
      error:
        | "QUIZ_NOT_FOUND"
        | "TITLE_REQUIRED"
        | "TIME_LIMIT_INVALID"
        | "QUESTIONS_INVALID";
    };

export async function updateQuiz(params: {
  id: number;
  title?: unknown;
  description?: unknown;
  hasTimeLimit?: unknown;
  timeLimitMinutes?: unknown;
  questions?: unknown;
}): Promise<UpdateQuizResult> {
  const existingQuiz = await prisma.kuis.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingQuiz) {
    return {
      success: false,
      quiz: null,
      error: "QUIZ_NOT_FOUND",
    };
  }

  const data: Prisma.KuisUpdateInput = {};

  if (params.title !== undefined) {
    const title = normalizeRequiredString(params.title);

    if (!title) {
      return {
        success: false,
        quiz: null,
        error: "TITLE_REQUIRED",
      };
    }

    data.title = title;
  }

  if (params.description !== undefined) {
    data.description = normalizeOptionalString(params.description);
  }

  const nextHasTimeLimit =
    params.hasTimeLimit === undefined
      ? undefined
      : normalizeBoolean(params.hasTimeLimit);

  if (nextHasTimeLimit !== undefined) {
    data.hasTimeLimit = nextHasTimeLimit;
    data.timeLimitMinutes = normalizeTimeLimit(
      params.timeLimitMinutes,
      nextHasTimeLimit
    );

    if (nextHasTimeLimit && data.timeLimitMinutes === null) {
      return {
        success: false,
        quiz: null,
        error: "TIME_LIMIT_INVALID",
      };
    }
  } else if (params.timeLimitMinutes !== undefined) {
    const minutes = Number(params.timeLimitMinutes);

    if (!Number.isInteger(minutes) || minutes <= 0) {
      return {
        success: false,
        quiz: null,
        error: "TIME_LIMIT_INVALID",
      };
    }

    data.timeLimitMinutes = minutes;
  }

  if (params.questions !== undefined) {
    const questions = normalizeQuestions(params.questions);

    if (questions.length === 0) {
      return {
        success: false,
        quiz: null,
        error: "QUESTIONS_INVALID",
      };
    }

    data.soals = {
      deleteMany: {},
      create: questions.map((question) => ({
        questionText: question.questionText,
        mediaUrl: question.mediaUrl,
        order: question.order,
        options: {
          create: question.options.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect,
            order: option.order,
          })),
        },
      })),
    };
  }

  await prisma.kuis.update({
    where: {
      id: params.id,
    },
    data,
  });

  const quiz = await getManagedQuizById(params.id);

  return {
    success: true,
    quiz,
    error: null,
  };
}

export type DeleteQuizResult =
  | {
      success: true;
      deletedQuizId: number;
      deletedContentId: number;
      error: null;
    }
  | {
      success: false;
      deletedQuizId: null;
      deletedContentId: null;
      error: "QUIZ_NOT_FOUND";
    };

export async function deleteQuiz(id: number): Promise<DeleteQuizResult> {
  const quiz = await prisma.kuis.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      contentId: true,
    },
  });

  if (!quiz) {
    return {
      success: false,
      deletedQuizId: null,
      deletedContentId: null,
      error: "QUIZ_NOT_FOUND",
    };
  }

  await prisma.moduleContent.delete({
    where: {
      id: quiz.contentId,
    },
  });

  return {
    success: true,
    deletedQuizId: quiz.id,
    deletedContentId: quiz.contentId,
    error: null,
  };
}