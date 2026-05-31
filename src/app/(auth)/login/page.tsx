import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login/LoginForm";

export const metadata: Metadata = {
  title: "Masuk | EduBidan",
  description:
    "Masuk ke EduBidan untuk mengakses modul pembelajaran, materi video, kuis evaluasi, dan dashboard sesuai peran akun.",
};

export default function LoginPage() {
  return <LoginForm />;
}