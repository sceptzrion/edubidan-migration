import { NextRequest, NextResponse } from "next/server";

import { markNotificationAsRead } from "@/services/notification.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseNotificationId(id: string) {
  const notificationId = Number(id);

  if (!Number.isInteger(notificationId) || notificationId <= 0) {
    return null;
  }

  return notificationId;
}

function getMarkReadErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof markNotificationAsRead>>["error"]>
) {
  const messages = {
    USER_ID_REQUIRED: "User id is required",
    NOTIFICATION_ID_REQUIRED: "Notification id is required",
    NOTIFICATION_NOT_FOUND: "Notification not found",
  };

  return messages[error];
}

function getMarkReadStatusCode(
  error: NonNullable<Awaited<ReturnType<typeof markNotificationAsRead>>["error"]>
) {
  if (error === "USER_ID_REQUIRED" || error === "NOTIFICATION_ID_REQUIRED") {
    return 400;
  }

  return 404;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const notificationId = parseNotificationId(id);

    if (!notificationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid notification id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const result = await markNotificationAsRead({
      notificationId,
      userId: body.userId,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getMarkReadErrorMessage(result.error),
          data: null,
        },
        {
          status: getMarkReadStatusCode(result.error),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
      data: result.notification,
    });
  } catch (error) {
    console.error("PATCH /api/notifications/[id]/read error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark notification as read",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}