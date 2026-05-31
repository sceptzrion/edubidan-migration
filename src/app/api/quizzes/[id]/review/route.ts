import { NextRequest, NextResponse } from "next/server";

import { getLatestQuizReview } from "@/services/quiz.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseQuizId(id: string) {
  const quizId = Number(id);

  if (!Number.isInteger(quizId) || quizId <= 0) {
    return null;
  }

  return quizId;
}

function getReviewErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof getLatestQuizReview>>["error"]>
) {
  const messages = {
    USER_ID_REQUIRED: "User id is required",
    QUIZ_NOT_FOUND: "Quiz not found",
    ATTEMPT_NOT_FOUND: "Quiz attempt not found",
  };

  return messages[error];
}

function getReviewStatusCode(
  error: NonNullable<Awaited<ReturnType<typeof getLatestQuizReview>>["error"]>
) {
  if (error === "USER_ID_REQUIRED") {
    return 400;
  }

  return 404;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const quizId = parseQuizId(id);

    if (!quizId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid quiz id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const userId = request.nextUrl.searchParams.get("userId");

    const result = await getLatestQuizReview({
      kuisId: quizId,
      userId,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getReviewErrorMessage(result.error),
          data: null,
        },
        {
          status: getReviewStatusCode(result.error),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quiz review retrieved successfully",
      data: result.attempt,
    });
  } catch (error) {
    console.error("GET /api/quizzes/[id]/review error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve quiz review",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}