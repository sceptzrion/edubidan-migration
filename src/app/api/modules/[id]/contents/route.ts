import { NextResponse } from "next/server";

import { getModuleContents } from "@/services/material.service";

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

    const result = await getModuleContents(moduleId);

    if (!result) {
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
      message: "Module contents retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("GET /api/modules/[id]/contents error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve module contents",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}