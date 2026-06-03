import { ContentType, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import {
  createMaterial,
  getModuleContents,
} from "@/services/material.service";
import { getCurrentSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

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

function getCreateMaterialErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof createMaterial>>["error"]>
) {
  const messages = {
    MODULE_NOT_FOUND: "Module not found",
    TITLE_REQUIRED: "Title is required",
    VIDEO_SOURCE_INVALID: "Video source is invalid",
    ESTIMATED_MINUTES_INVALID: "Estimated minutes must be a positive integer",
  };

  return messages[error];
}

async function getAuthenticatedDosenProfileId() {
  const currentUser = await getCurrentSessionUser();

  if (!currentUser) {
    return {
      success: false as const,
      status: 401,
      message: "Authentication required",
      dosenProfileId: null,
    };
  }

  if (currentUser.role !== Role.DOSEN) {
    return {
      success: false as const,
      status: 403,
      message: "Only lecturers can manage module contents",
      dosenProfileId: null,
    };
  }

  if (!currentUser.dosenProfile?.id) {
    return {
      success: false as const,
      status: 403,
      message: "Dosen profile not found",
      dosenProfileId: null,
    };
  }

  return {
    success: true as const,
    status: 200,
    message: "OK",
    dosenProfileId: currentUser.dosenProfile.id,
  };
}

async function getOwnedModule(moduleId: number, dosenProfileId: number) {
  return prisma.module.findFirst({
    where: {
      id: moduleId,
      dosenProfileId,
    },
    select: {
      id: true,
    },
  });
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

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const auth = await getAuthenticatedDosenProfileId();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
          data: null,
        },
        {
          status: auth.status,
        }
      );
    }

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

    const ownedModule = await getOwnedModule(moduleId, auth.dosenProfileId);

    if (!ownedModule) {
      return NextResponse.json(
        {
          success: false,
          message: "Module not found or not owned by lecturer",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();

    if (body.kind !== ContentType.MATERI && body.kind !== "materi") {
      return NextResponse.json(
        {
          success: false,
          message: "Only material content can be created from this endpoint",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const result = await createMaterial({
      moduleId,
      title: body.title,
      description: body.description,
      videoSource: body.videoSource,
      videoUrl: body.videoUrl,
      estimatedMinutes: body.estimatedMinutes,
      objectives: body.objectives,
      tools: body.tools,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getCreateMaterialErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "MODULE_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Material created successfully",
        data: result.material,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/modules/[id]/contents error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create material",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}