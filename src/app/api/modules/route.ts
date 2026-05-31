import { NextRequest, NextResponse } from "next/server";

import { getModules } from "@/services/module.service";

export const dynamic = "force-dynamic";

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