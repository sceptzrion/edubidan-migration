import { NextResponse } from "next/server";

import { getUsers } from "@/services/user.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await getUsers();

    return NextResponse.json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("GET /api/users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve users",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}