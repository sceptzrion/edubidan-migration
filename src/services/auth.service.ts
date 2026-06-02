import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/services/user.service";
import { sendRegisterSuccessEmail } from "@/services/email/email.service";

const authUserSelect = {
  id: true,
  name: true,
  email: true,
  password: true,
  role: true,
  avatarUrl: true,
  phoneNumber: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
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
  notifPreference: true,
} satisfies Prisma.UserSelect;

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  phoneNumber: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
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
  notifPreference: true,
} satisfies Prisma.UserSelect;

type AuthUserWithPassword = Prisma.UserGetPayload<{
  select: typeof authUserSelect;
}>;

function removePassword(user: AuthUserWithPassword) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function getRedirectPathByRole(role: Role) {
  if (role === Role.ADMIN) {
    return "/dashboard/admin";
  }

  if (role === Role.DOSEN) {
    return "/dashboard/lecturer";
  }

  return "/dashboard";
}

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

export type LoginResult =
  | {
      success: true;
      user: ReturnType<typeof removePassword>;
      redirectTo: string;
      error: null;
    }
  | {
      success: false;
      user: null;
      redirectTo: null;
      error:
        | "EMAIL_REQUIRED"
        | "PASSWORD_REQUIRED"
        | "INVALID_CREDENTIALS"
        | "USER_INACTIVE";
    };

export async function loginUser(params: {
  email: string | null;
  password: string | null;
}): Promise<LoginResult> {
  const email = params.email?.trim().toLowerCase();
  const password = params.password;

  if (!email) {
    return {
      success: false,
      user: null,
      redirectTo: null,
      error: "EMAIL_REQUIRED",
    };
  }

  if (!password) {
    return {
      success: false,
      user: null,
      redirectTo: null,
      error: "PASSWORD_REQUIRED",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: authUserSelect,
  });

  if (!user) {
    return {
      success: false,
      user: null,
      redirectTo: null,
      error: "INVALID_CREDENTIALS",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return {
      success: false,
      user: null,
      redirectTo: null,
      error: "INVALID_CREDENTIALS",
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      user: null,
      redirectTo: null,
      error: "USER_INACTIVE",
    };
  }

  return {
    success: true,
    user: removePassword(user),
    redirectTo: getRedirectPathByRole(user.role),
    error: null,
  };
}

export type RegisterMahasiswaResult =
  | {
      success: true;
      user: Prisma.UserGetPayload<{
        select: typeof safeUserSelect;
      }>;
      email:
        | {
            sent: true;
            skipped: false;
            error: null;
          }
        | {
            sent: false;
            skipped: true;
            error: null;
          }
        | {
            sent: false;
            skipped: false;
            error: string;
          };
      error: null;
    }
  | {
      success: false;
      user: null;
      error:
        | "NAME_REQUIRED"
        | "NPM_REQUIRED"
        | "EMAIL_REQUIRED"
        | "PASSWORD_REQUIRED"
        | "PASSWORD_CONFIRMATION_REQUIRED"
        | "PASSWORD_TOO_SHORT"
        | "PASSWORD_MISMATCH"
        | "INVALID_NPM_FORMAT"
        | "INVALID_STUDENT_EMAIL_FORMAT"
        | "EMAIL_NPM_MISMATCH"
        | "EMAIL_ALREADY_USED"
        | "NPM_ALREADY_USED";
    };

export async function registerMahasiswa(params: {
  name: string | null;
  npm: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
}): Promise<RegisterMahasiswaResult> {
  const name = params.name?.trim();
  const npm = params.npm?.trim();
  const email = params.email?.trim().toLowerCase();
  const password = params.password;
  const confirmPassword = params.confirmPassword;

  if (!name) {
    return {
      success: false,
      user: null,
      error: "NAME_REQUIRED",
    };
  }

  if (!npm) {
    return {
      success: false,
      user: null,
      error: "NPM_REQUIRED",
    };
  }

  if (!email) {
    return {
      success: false,
      user: null,
      error: "EMAIL_REQUIRED",
    };
  }

  if (!password) {
    return {
      success: false,
      user: null,
      error: "PASSWORD_REQUIRED",
    };
  }

  if (!confirmPassword) {
    return {
      success: false,
      user: null,
      error: "PASSWORD_CONFIRMATION_REQUIRED",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      user: null,
      error: "PASSWORD_TOO_SHORT",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      user: null,
      error: "PASSWORD_MISMATCH",
    };
  }

  if (!/^\d{10,20}$/.test(npm)) {
    return {
      success: false,
      user: null,
      error: "INVALID_NPM_FORMAT",
    };
  }

  const expectedEmail = `${npm}@student.unsika.ac.id`;

  if (!email.endsWith("@student.unsika.ac.id")) {
    return {
      success: false,
      user: null,
      error: "INVALID_STUDENT_EMAIL_FORMAT",
    };
  }

  if (email !== expectedEmail) {
    return {
      success: false,
      user: null,
      error: "EMAIL_NPM_MISMATCH",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      success: false,
      user: null,
      error: "EMAIL_ALREADY_USED",
    };
  }

  const existingProfile = await prisma.mahasiswaProfile.findUnique({
    where: {
      npm,
    },
    select: {
      id: true,
    },
  });

  if (existingProfile) {
    return {
      success: false,
      user: null,
      error: "NPM_ALREADY_USED",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.MAHASISWA,
      isActive: true,
      mahasiswaProfile: {
        create: {
          npm,
        },
      },
      notifPreference: {
        create: {
          moduleUpdate: true,
          newMaterial: true,
          newQuiz: true,
          quizResult: true,
          quizActivity: false,
          accountActivity: true,
          systemAlert: true,
        },
      },
      activityLogs: {
        create: {
          actionType: "REGISTER_MAHASISWA",
          description: `Mahasiswa ${name} melakukan registrasi akun.`,
        },
      },
    },
    select: safeUserSelect,
  });

  const emailResult = await sendRegisterSuccessEmail({
  to: email,
  name,
  email,
});

return {
  success: true,
  user,
  email: emailResult.success
    ? emailResult.skipped
      ? {
          sent: false,
          skipped: true,
          error: null,
        }
      : {
          sent: true,
          skipped: false,
          error: null,
        }
    : {
        sent: false,
        skipped: false,
        error: emailResult.error,
      },
  error: null,
 };
}