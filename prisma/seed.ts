import "dotenv/config";

import {
  ContentType,
  ModuleStatus,
  PrismaClient,
  Role,
  VideoSource,
} from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaMariaDb(databaseUrl);

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

async function main() {
  console.log("Start seeding EduBidan database...");

  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@edubidan.test" },
    update: {
      name: "Admin EduBidan",
      password,
      role: Role.ADMIN,
      isActive: true,
    },
    create: {
      name: "Admin EduBidan",
      email: "admin@edubidan.test",
      password,
      role: Role.ADMIN,
      phoneNumber: "081200000001",
      notifPreference: {
        create: {},
      },
    },
  });

  const dosenUser = await prisma.user.upsert({
    where: { email: "dosen@edubidan.test" },
    update: {
      name: "Dosen Kebidanan",
      password,
      role: Role.DOSEN,
      isActive: true,
    },
    create: {
      name: "Dosen Kebidanan",
      email: "dosen@edubidan.test",
      password,
      role: Role.DOSEN,
      phoneNumber: "081200000002",
      dosenProfile: {
        create: {
          nidnNip: "1987654321",
        },
      },
      notifPreference: {
        create: {},
      },
    },
    include: {
      dosenProfile: true,
    },
  });

  const mahasiswaOne = await prisma.user.upsert({
    where: { email: "siti.aisyah@edubidan.test" },
    update: {
      name: "Siti Aisyah",
      password,
      role: Role.MAHASISWA,
      isActive: true,
    },
    create: {
      name: "Siti Aisyah",
      email: "siti.aisyah@edubidan.test",
      password,
      role: Role.MAHASISWA,
      phoneNumber: "081200000003",
      mahasiswaProfile: {
        create: {
          npm: "2310631170001",
        },
      },
      notifPreference: {
        create: {},
      },
    },
  });

  const mahasiswaTwo = await prisma.user.upsert({
    where: { email: "nadia.putri@edubidan.test" },
    update: {
      name: "Nadia Putri",
      password,
      role: Role.MAHASISWA,
      isActive: true,
    },
    create: {
      name: "Nadia Putri",
      email: "nadia.putri@edubidan.test",
      password,
      role: Role.MAHASISWA,
      phoneNumber: "081200000004",
      mahasiswaProfile: {
        create: {
          npm: "2310631170002",
        },
      },
      notifPreference: {
        create: {},
      },
    },
  });

  const dosenProfile =
    dosenUser.dosenProfile ??
    (await prisma.dosenProfile.create({
      data: {
        userId: dosenUser.id,
        nidnNip: "1987654321",
      },
    }));

  const module = await prisma.module.upsert({
    where: {
      accessCode: "ANC001",
    },
    update: {
      title: "Pemeriksaan Kehamilan Dasar",
      description:
        "Modul pengenalan pemeriksaan kehamilan dasar untuk membantu mahasiswa memahami alur pemeriksaan antenatal care.",
      status: ModuleStatus.PUBLIK,
      estimatedMinutes: 60,
    },
    create: {
      dosenProfileId: dosenProfile.id,
      title: "Pemeriksaan Kehamilan Dasar",
      description:
        "Modul pengenalan pemeriksaan kehamilan dasar untuk membantu mahasiswa memahami alur pemeriksaan antenatal care.",
      bannerUrl: "/images/modules/pemeriksaan-kehamilan.jpg",
      accessCode: "ANC001",
      status: ModuleStatus.PUBLIK,
      estimatedMinutes: 60,
      objectives: {
        create: [
          {
            text: "Mahasiswa memahami tujuan pemeriksaan kehamilan dasar.",
            order: 1,
          },
          {
            text: "Mahasiswa mampu mengidentifikasi alat yang digunakan dalam pemeriksaan antenatal.",
            order: 2,
          },
          {
            text: "Mahasiswa memahami tahapan pemeriksaan secara sistematis.",
            order: 3,
          },
        ],
      },
    },
  });

  let materi = await prisma.materi.findFirst({
    where: {
      content: {
        moduleId: module.id,
        kind: ContentType.MATERI,
        order: 1,
      },
    },
  });

  if (!materi) {
    const materiContent = await prisma.moduleContent.create({
      data: {
        moduleId: module.id,
        kind: ContentType.MATERI,
        order: 1,
      },
    });

    materi = await prisma.materi.create({
      data: {
        contentId: materiContent.id,
        title: "Pengenalan Pemeriksaan Antenatal Care",
        description:
          "Materi ini menjelaskan pengertian, tujuan, alat, dan alur dasar pemeriksaan kehamilan.",
        videoSource: VideoSource.EMBED,
        videoUrl: "https://www.youtube.com/embed/example-video",
        estimatedMinutes: 25,
        objectives: {
          create: [
            {
              text: "Menjelaskan pengertian pemeriksaan antenatal care.",
              order: 1,
            },
            {
              text: "Menyebutkan alat yang diperlukan dalam pemeriksaan.",
              order: 2,
            },
            {
              text: "Mengurutkan tahapan pemeriksaan dasar.",
              order: 3,
            },
          ],
        },
        tools: {
          create: [
            { name: "Tensimeter" },
            { name: "Stetoskop" },
            { name: "Pita ukur LILA" },
            { name: "Doppler" },
          ],
        },
      },
    });
  }

  const existingKuis = await prisma.kuis.findFirst({
    where: {
      content: {
        moduleId: module.id,
        kind: ContentType.KUIS,
        order: 2,
      },
    },
  });

  if (!existingKuis) {
    const kuisContent = await prisma.moduleContent.create({
      data: {
        moduleId: module.id,
        kind: ContentType.KUIS,
        order: 2,
      },
    });

    await prisma.kuis.create({
      data: {
        contentId: kuisContent.id,
        title: "Kuis Pemeriksaan Kehamilan Dasar",
        description:
          "Kuis singkat untuk mengukur pemahaman awal mahasiswa terhadap materi pemeriksaan kehamilan dasar.",
        hasTimeLimit: true,
        timeLimitMinutes: 10,
        soals: {
          create: [
            {
              questionText:
                "Apa tujuan utama pemeriksaan antenatal care pada ibu hamil?",
              order: 1,
              options: {
                create: [
                  {
                    text: "Memantau kondisi ibu dan janin selama kehamilan.",
                    isCorrect: true,
                    order: 1,
                  },
                  {
                    text: "Menggantikan seluruh proses persalinan.",
                    isCorrect: false,
                    order: 2,
                  },
                  {
                    text: "Menentukan jenis kelamin bayi secara pasti.",
                    isCorrect: false,
                    order: 3,
                  },
                  {
                    text: "Menghindari seluruh pemeriksaan laboratorium.",
                    isCorrect: false,
                    order: 4,
                  },
                ],
              },
            },
            {
              questionText:
                "Alat apa yang dapat digunakan untuk memantau denyut jantung janin?",
              order: 2,
              options: {
                create: [
                  {
                    text: "Doppler.",
                    isCorrect: true,
                    order: 1,
                  },
                  {
                    text: "Termometer ruangan.",
                    isCorrect: false,
                    order: 2,
                  },
                  {
                    text: "Timbangan bayi.",
                    isCorrect: false,
                    order: 3,
                  },
                  {
                    text: "Penggaris biasa.",
                    isCorrect: false,
                    order: 4,
                  },
                ],
              },
            },
          ],
        },
      },
    });
  }

  await prisma.enrollment.upsert({
    where: {
      userId_moduleId: {
        userId: mahasiswaOne.id,
        moduleId: module.id,
      },
    },
    update: {
      isKicked: false,
      kickReason: null,
    },
    create: {
      userId: mahasiswaOne.id,
      moduleId: module.id,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_moduleId: {
        userId: mahasiswaTwo.id,
        moduleId: module.id,
      },
    },
    update: {
      isKicked: false,
      kickReason: null,
    },
    create: {
      userId: mahasiswaTwo.id,
      moduleId: module.id,
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_materiId: {
        userId: mahasiswaOne.id,
        materiId: materi.id,
      },
    },
    update: {
      isCompleted: true,
      completedAt: new Date(),
    },
    create: {
      userId: mahasiswaOne.id,
      materiId: materi.id,
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      actionType: "SEED_DATABASE",
      description: "Seed data awal EduBidan berhasil dijalankan.",
    },
  });

  console.log("Seeding completed successfully.");
  console.table([
    { role: "ADMIN", email: admin.email, password: "password123" },
    { role: "DOSEN", email: dosenUser.email, password: "password123" },
    { role: "MAHASISWA", email: mahasiswaOne.email, password: "password123" },
    { role: "MAHASISWA", email: mahasiswaTwo.email, password: "password123" },
  ]);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });