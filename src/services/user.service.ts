import { prisma } from "@/lib/prisma";

const userSafeSelect = {
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
};

export async function getUsers() {
  return prisma.user.findMany({
    select: userSafeSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: userSafeSelect,
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: userSafeSelect,
  });
}