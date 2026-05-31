export type LecturerQuizPreviewTab = "overview" | "analysis";

export interface LecturerQuizInfo {
  title: string;
  duration: string;
  totalQuestions: number;
}

export interface LecturerQuizGeneralStats {
  averageScore: number;
  passRate: number;
  totalParticipants: number;
}

export interface LecturerQuizLeaderboardItem {
  rank: number;
  name: string;
  nim: string;
  score: number;
  time: string;
}

export interface LecturerQuizQuestionOption {
  id: string;
  text: string;
  pickedCount: number;
  percentage: number;
}

export interface LecturerQuizQuestionStat {
  id: number;
  questionText: string;
  correctOptionId: string;
  options: LecturerQuizQuestionOption[];
}

export const lecturerQuizInfo: LecturerQuizInfo = {
  title: "Kuis Cek Pemahaman",
  duration: "10 Menit",
  totalQuestions: 5,
};

export const lecturerQuizGeneralStats: LecturerQuizGeneralStats = {
  averageScore: 82.5,
  passRate: 90,
  totalParticipants: 45,
};

export const lecturerQuizLeaderboard: LecturerQuizLeaderboardItem[] = [
  { rank: 1, name: "Ikhsan Rizqi", nim: "2010631170000", score: 100, time: "05:12" },
  { rank: 2, name: "Sari Dewi", nim: "2024010101", score: 100, time: "06:30" },
  { rank: 3, name: "Rina Lestari", nim: "2024010103", score: 90, time: "07:45" },
  { rank: 4, name: "Anisa Putri", nim: "2024010102", score: 80, time: "08:10" },
  { rank: 5, name: "Maya Sari", nim: "2024010105", score: 60, time: "09:55" },
];

export const lecturerQuizQuestionStats: LecturerQuizQuestionStat[] = [
  {
    id: 1,
    questionText:
      "Berapa kali minimal kunjungan Antenatal Care (ANC) selama kehamilan menurut standar terbaru?",
    correctOptionId: "c",
    options: [
      {
        id: "a",
        text: "4 kali kunjungan",
        pickedCount: 5,
        percentage: 11,
      },
      {
        id: "b",
        text: "5 kali kunjungan",
        pickedCount: 2,
        percentage: 4,
      },
      {
        id: "c",
        text: "6 kali kunjungan",
        pickedCount: 38,
        percentage: 85,
      },
      {
        id: "d",
        text: "8 kali kunjungan",
        pickedCount: 0,
        percentage: 0,
      },
    ],
  },
  {
    id: 2,
    questionText:
      "Manakah dari berikut ini yang bukan termasuk pemeriksaan dasar pada kunjungan kehamilan?",
    correctOptionId: "d",
    options: [
      {
        id: "a",
        text: "Timbang berat badan",
        pickedCount: 2,
        percentage: 4,
      },
      {
        id: "b",
        text: "Pemeriksaan tekanan darah",
        pickedCount: 3,
        percentage: 7,
      },
      {
        id: "c",
        text: "Pemeriksaan denyut jantung janin",
        pickedCount: 5,
        percentage: 11,
      },
      {
        id: "d",
        text: "Tindakan operasi sesar",
        pickedCount: 35,
        percentage: 78,
      },
    ],
  },
  {
    id: 3,
    questionText: "Kapan pemeriksaan USG umumnya disarankan pada ibu hamil?",
    correctOptionId: "a",
    options: [
      {
        id: "a",
        text: "Pada trimester awal dan akhir sesuai indikasi",
        pickedCount: 40,
        percentage: 89,
      },
      {
        id: "b",
        text: "Setiap minggu",
        pickedCount: 5,
        percentage: 11,
      },
    ],
  },
  {
    id: 4,
    questionText: "Pemberian tablet tambah darah minimal diberikan sebanyak?",
    correctOptionId: "b",
    options: [
      {
        id: "a",
        text: "30 tablet",
        pickedCount: 10,
        percentage: 22,
      },
      {
        id: "b",
        text: "90 tablet",
        pickedCount: 35,
        percentage: 78,
      },
    ],
  },
  {
    id: 5,
    questionText:
      "Imunisasi apa yang diberikan untuk membantu mencegah tetanus pada ibu dan bayi?",
    correctOptionId: "a",
    options: [
      {
        id: "a",
        text: "Tetanus Toxoid",
        pickedCount: 45,
        percentage: 100,
      },
      {
        id: "b",
        text: "BCG",
        pickedCount: 0,
        percentage: 0,
      },
    ],
  },
];

export function getLecturerQuizPreviewData() {
  return {
    quizInfo: lecturerQuizInfo,
    generalStats: lecturerQuizGeneralStats,
    leaderboard: lecturerQuizLeaderboard,
    questionStats: lecturerQuizQuestionStats,
  };
}

export function isCriticalQuestion(question: LecturerQuizQuestionStat) {
  const correctOption = question.options.find(
    (option) => option.id === question.correctOptionId
  );

  return Boolean(correctOption && correctOption.percentage < 50);
}