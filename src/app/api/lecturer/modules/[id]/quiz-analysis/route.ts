import { NextResponse } from "next/server";

import { getModuleQuizAnalysis } from "@/services/lecturer-analytics.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseModuleId(id: string) {
  const moduleId = Number(id);

  if (!Number.isInteger(moduleId) || moduleId <= 0) {
    return null;
  }

  return moduleId;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const moduleId = parseModuleId(id);

    if (!moduleId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid module id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const result = await getModuleQuizAnalysis(moduleId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Module not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Module quiz analysis retrieved successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("GET /api/lecturer/modules/[id]/quiz-analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve module quiz analysis",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}