import { NextRequest, NextResponse } from "next/server";

import {
  getMaterialById,
  updateMaterialProgress,
} from "@/services/material.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseMaterialId(id: string) {
  const materialId = Number(id);

  if (!Number.isInteger(materialId) || materialId <= 0) {
    return null;
  }

  return materialId;
}

function getUpdateProgressErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof updateMaterialProgress>>["error"]>
) {
  const messages = {
    USER_ID_REQUIRED: "User id is required",
    COMPLETED_STATUS_REQUIRED: "isCompleted boolean is required",
    USER_NOT_FOUND: "User not found",
    USER_INACTIVE: "User account is inactive",
    MATERIAL_NOT_FOUND: "Material not found",
    USER_NOT_ENROLLED: "User has not joined this module",
    USER_KICKED: "User has been kicked from this module",
  };

  return messages[error];
}

function getUpdateProgressStatusCode(
  error: NonNullable<Awaited<ReturnType<typeof updateMaterialProgress>>["error"]>
) {
  if (error === "USER_ID_REQUIRED" || error === "COMPLETED_STATUS_REQUIRED") {
    return 400;
  }

  if (error === "USER_NOT_FOUND" || error === "MATERIAL_NOT_FOUND") {
    return 404;
  }

  if (
    error === "USER_INACTIVE" ||
    error === "USER_NOT_ENROLLED" ||
    error === "USER_KICKED"
  ) {
    return 403;
  }

  return 400;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const materialId = parseMaterialId(id);

    if (!materialId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid material id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const material = await getMaterialById(materialId);

    if (!material) {
      return NextResponse.json(
        {
          success: false,
          message: "Material not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Material retrieved successfully",
      data: material,
    });
  } catch (error) {
    console.error("GET /api/materials/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve material",
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
    const materialId = parseMaterialId(id);

    if (!materialId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid material id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const result = await updateMaterialProgress({
      materiId: materialId,
      userId: body.userId,
      isCompleted: body.isCompleted,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getUpdateProgressErrorMessage(result.error),
          data: null,
        },
        {
          status: getUpdateProgressStatusCode(result.error),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.progress.isCompleted
        ? "Material marked as completed"
        : "Material marked as incomplete",
      data: result.progress,
    });
  } catch (error) {
    console.error("PATCH /api/materials/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update material progress",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}