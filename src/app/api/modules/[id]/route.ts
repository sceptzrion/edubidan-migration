import { NextRequest, NextResponse } from "next/server";

import { getModuleById, updateModule } from "@/services/module.service";

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

function getUpdateModuleErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof updateModule>>["error"]>
) {
  const messages = {
    MODULE_NOT_FOUND: "Module not found",
    TITLE_EMPTY: "Title cannot be empty",
    ACCESS_CODE_EMPTY: "Access code cannot be empty",
    ACCESS_CODE_ALREADY_USED: "Access code is already used",
    ESTIMATED_MINUTES_INVALID: "Estimated minutes must be a positive integer",
  };

  return messages[error];
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

    return NextResponse.json({
      success: true,
      message: "Module retrieved successfully",
      data: moduleData,
    });
  } catch (error) {
    console.error("GET /api/modules/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve module",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
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

    const body = await request.json();

    const result = await updateModule({
      id: moduleId,
      title: body.title,
      description: body.description,
      bannerUrl: body.bannerUrl,
      accessCode: body.accessCode,
      estimatedMinutes: body.estimatedMinutes,
      objectives: body.objectives,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getUpdateModuleErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "MODULE_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Module updated successfully",
      data: result.module,
    });
  } catch (error) {
    console.error("PATCH /api/modules/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update module",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}