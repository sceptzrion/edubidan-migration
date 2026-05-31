import { NextRequest, NextResponse } from "next/server";

import { createModule, getModules } from "@/services/module.service";

export const dynamic = "force-dynamic";

function getCreateModuleErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof createModule>>["error"]>
) {
  const messages = {
    DOSEN_PROFILE_ID_REQUIRED: "Dosen profile id is required",
    DOSEN_PROFILE_NOT_FOUND: "Dosen profile not found",
    TITLE_REQUIRED: "Title is required",
    ACCESS_CODE_REQUIRED: "Access code is required",
    ACCESS_CODE_ALREADY_USED: "Access code is already used",
    ESTIMATED_MINUTES_INVALID: "Estimated minutes must be a positive integer",
  };

  return messages[error];
}

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search");
    const status = request.nextUrl.searchParams.get("status");

    const modules = await getModules({
      search,
      status,
    });

    return NextResponse.json({
      success: true,
      message: "Modules retrieved successfully",
      data: modules,
    });
  } catch (error) {
    console.error("GET /api/modules error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve modules",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await createModule({
      dosenProfileId: body.dosenProfileId,
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
          message: getCreateModuleErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "DOSEN_PROFILE_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Module created successfully",
        data: result.module,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/modules error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create module",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}