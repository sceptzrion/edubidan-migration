import { NextResponse } from "next/server";

import { getQuizById } from "@/services/quiz.service";

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

export async function GET(_request: Request, context: RouteContext) {
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

    const quiz = await getQuizById(quizId);

    if (!quiz) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quiz retrieved successfully",
      data: quiz,
    });
  } catch (error) {
    console.error("GET /api/quizzes/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve quiz",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}