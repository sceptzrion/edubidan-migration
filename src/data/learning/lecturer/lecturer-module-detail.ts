export type LecturerModuleDetailStatus = "Publik" | "Draft";

export interface LecturerModuleDetailInfo {
  banner: string;
  title: string;
  description: string;
  objectives: string[];
  estimatedTime: string;
  instructor: string;
  status: LecturerModuleDetailStatus;
  code: string;
}

export const lecturerModuleDetailInfo: LecturerModuleDetailInfo = {
  banner:
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  title: "ANC Terpadu Trimester 1",
  description:
    "Modul komprehensif yang membahas pemeriksaan antenatal terpadu, mencakup anamnesis, pemeriksaan fisik, hingga edukasi tanda bahaya kehamilan.",
  objectives: [
    "Memahami konsep dan alur Antenatal Care (ANC) terpadu sesuai standar",
    "Mampu melakukan anamnesis dan pemeriksaan fisik ibu hamil",
    "Mengenali tanda bahaya kehamilan dan langkah rujukan",
  ],
  estimatedTime: "6 Jam",
  instructor: "Dr. Rina Hartati, M.Keb",
  status: "Publik",
  code: "BIDAN-X7A",
};