import { NextRequest, NextResponse } from "next/server";

import { updateParticipantKickStatus } from "@/services/enrollment.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
    userId: string;
  }>;
};

function parsePositiveId(value: string) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function getKickStatusErrorMessage(
  error: NonNullable<
    Awaited<ReturnType<typeof updateParticipantKickStatus>>["error"]
  >
) {
  const messages = {
    MODULE_NOT_FOUND: "Module not found",
    USER_NOT_FOUND: "User not found",
    ENROLLMENT_NOT_FOUND: "Enrollment not found",
    KICK_STATUS_REQUIRED: "isKicked boolean is required",
  };

  return messages[error];
}

function getKickStatusCode(
  error: NonNullable<
    Awaited<ReturnType<typeof updateParticipantKickStatus>>["error"]
  >
) {
  if (error === "KICK_STATUS_REQUIRED") {
    return 400;
  }

  return 404;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id, userId } = await context.params;
    const moduleId = parsePositiveId(id);
    const parsedUserId = parsePositiveId(userId);

    if (!moduleId || !parsedUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid module id or user id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const result = await updateParticipantKickStatus({
      moduleId,
      userId: parsedUserId,
      isKicked: body.isKicked,
      kickReason: body.kickReason,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getKickStatusErrorMessage(result.error),
          data: null,
        },
        {
          status: getKickStatusCode(result.error),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.enrollment?.isKicked
        ? "Participant kicked successfully"
        : "Participant restored successfully",
      data: result.enrollment,
    });
  } catch (error) {
    console.error(
      "PATCH /api/modules/[id]/participants/[userId]/kick error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update participant kick status",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}