export type LecturerPreviewItemKind = "materi" | "kuis";

export interface LecturerPreviewPlaylistItem {
  id: number;
  kind: LecturerPreviewItemKind;
  title: string;
  duration: string;
}

export interface LecturerLessonPreviewDetail {
  id: number;
  title: string;
  videoSource: "upload" | "embed";
  duration: string;
  summary: string;
  objectives: string[];
  tools: string[];
  thumbnailUrl: string;
}

export const lecturerPreviewPlaylist: LecturerPreviewPlaylistItem[] = [
  {
    kind: "materi",
    id: 1,
    title: "Pengantar ANC Terpadu",
    duration: "12:30",
  },
  {
    kind: "kuis",
    id: 2,
    title: "Kuis Cek Pemahaman",
    duration: "10 Menit",
  },
];

export const lecturerLessonPreviewDetail: LecturerLessonPreviewDetail = {
  id: 1,
  title: "Pengantar ANC Terpadu",
  videoSource: "embed",
  duration: "12:30",
  summary:
    "Pelajari teknik pemeriksaan fisik menyeluruh pada ibu hamil, mulai dari inspeksi kepala hingga ekstremitas bawah. Materi ini mencakup teknik pemeriksaan dasar yang sesuai dengan standar praktik kebidanan.",
  objectives: [
    "Mampu melakukan pemeriksaan fisik head to toe secara sistematis",
    "Mengidentifikasi tanda-tanda abnormal pada ibu hamil",
    "Mendokumentasikan temuan pemeriksaan dengan benar",
  ],
  tools: [
    "Stetoskop",
    "Tensimeter",
    "Timbangan",
    "Pita pengukur",
    "Doppler/Fetoscope",
  ],
  thumbnailUrl:
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
};

export function getLecturerLessonPreviewDetail() {
  return lecturerLessonPreviewDetail;
}

export function getLecturerPreviewPlaylist() {
  return lecturerPreviewPlaylist;
}