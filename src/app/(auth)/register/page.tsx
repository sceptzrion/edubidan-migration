import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register/RegisterForm";

export const metadata: Metadata = {
  title: "Daftar Akun Mahasiswa | EduBidan",
  description:
    "Buat akun mahasiswa EduBidan untuk mengakses modul pembelajaran, materi video, dan kuis evaluasi.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}