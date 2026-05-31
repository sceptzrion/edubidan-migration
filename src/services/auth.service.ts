import { getUserByEmail } from "@/services/user.service";

export type CurrentUserResult =
  | {
      success: true;
      user: Awaited<ReturnType<typeof getUserByEmail>>;
      error: null;
    }
  | {
      success: false;
      user: null;
      error: "EMAIL_REQUIRED" | "USER_NOT_FOUND" | "USER_INACTIVE";
    };

export async function getCurrentUserByEmail(
  email: string | null
): Promise<CurrentUserResult> {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      success: false,
      user: null,
      error: "EMAIL_REQUIRED",
    };
  }

  const user = await getUserByEmail(normalizedEmail);

  if (!user) {
    return {
      success: false,
      user: null,
      error: "USER_NOT_FOUND",
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      user: null,
      error: "USER_INACTIVE",
    };
  }

  return {
    success: true,
    user,
    error: null,
  };
}