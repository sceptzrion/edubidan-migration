import { NextRequest, NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function normalizeOptionalString(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

async function getAccountProfile(userId: number) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      phoneNumber: true,
      mahasiswaProfile: {
        select: {
          id: true,
          npm: true,
        },
      },
      dosenProfile: {
        select: {
          id: true,
          nidnNip: true,
        },
      },
    },
  });
}

export async function GET() {
  try {
    const currentUser = await getCurrentSessionUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          data: null,
        },
        {
          status: 401,
        }
      );
    }

    const profile = await getAccountProfile(currentUser.id);

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("GET /api/account/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve profile",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentSessionUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          data: null,
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();
    const name = normalizeRequiredString(body.name);
    const phoneNumber = normalizeOptionalString(body.phoneNumber);

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    if (phoneNumber === null && body.phoneNumber !== null && body.phoneNumber !== "") {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is invalid",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        phoneNumber,
      },
    });

    const profile = await getAccountProfile(currentUser.id);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    console.error("PATCH /api/account/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}