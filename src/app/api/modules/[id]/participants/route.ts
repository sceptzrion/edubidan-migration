import { NextResponse } from "next/server";

import { getModuleParticipants } from "@/services/enrollment.service";
import { getModuleById } from "@/services/module.service";

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

    const moduleData = await getModuleById(moduleId);

    if (!moduleData) {
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

    const participants = await getModuleParticipants(moduleId);

    return NextResponse.json({
      success: true,
      message: "Module participants retrieved successfully",
      data: participants,
    });
  } catch (error) {
    console.error("GET /api/modules/[id]/participants error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve module participants",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}