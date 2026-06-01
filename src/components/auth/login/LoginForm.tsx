"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";

import { AuthShell } from "@/components/auth/shared/AuthShell";
import { PasswordInput } from "@/components/auth/shared/PasswordInput";

type LoginApiResponse = {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      role: "ADMIN" | "DOSEN" | "MAHASISWA";
      avatarUrl: string | null;
      phoneNumber: string | null;
      isActive: boolean;
      mahasiswaProfile?: {
        id: number;
        npm: string;
      } | null;
      dosenProfile?: {
        id: number;
        nidnNip: string;
      } | null;
    };
    redirectTo: string;
  } | null;
};

function getFriendlyLoginError(message: string) {
  if (message === "Email is required") {
    return "Email wajib diisi.";
  }

  if (message === "Password is required") {
    return "Kata sandi wajib diisi.";
  }

  if (message === "Invalid email or password") {
    return "Email atau kata sandi tidak sesuai.";
  }

  if (message === "User account is inactive") {
    return "Akun Anda sedang nonaktif. Silakan hubungi admin.";
  }

  return "Gagal masuk. Silakan coba lagi.";
}

export function LoginForm() {
  const router = useRouter();

  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = (await response.json()) as LoginApiResponse;

      if (!response.ok || !result.success || !result.data) {
        setErrorMessage(getFriendlyLoginError(result.message));
        return;
      }

      const storage = remember ? localStorage : sessionStorage;

      storage.setItem("edubidan-user", JSON.stringify(result.data.user));

      router.push(result.data.redirectTo);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      sideTitle="Selamat Datang Kembali"
      sideDescription="Masuk untuk melanjutkan pembelajaran, mengelola modul, atau memantau aktivitas EduBidan sesuai peran akun Anda."
      sideVariant="primary"
    >
      <form
        onSubmit={handleSubmit}
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
          Masuk ke Akun
        </h1>

        <p className="text-muted-foreground mb-8 text-sm">
          Masukkan email dan kata sandi untuk melanjutkan.
        </p>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium mb-1.5 block text-foreground"
            >
              Email
            </label>

            <div className="relative group">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="Masukkan email"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <PasswordInput
            id="password"
            label="Kata Sandi"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setErrorMessage("");
            }}
            placeholder="Masukkan kata sandi"
            inputClassName="py-3.5 pl-11 pr-12"
            iconSize={18}
            iconClassName="left-4"
            buttonClassName="right-4"
            labelClassName="text-sm font-medium"
            disabled={isSubmitting}
          />

          {errorMessage && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-between mt-2 gap-4">
            <button
              type="button"
              onClick={() => setRemember((current) => !current)}
              className="flex items-center gap-2.5 select-none group"
              disabled={isSubmitting}
            >
              <span
                className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all ${
                  remember
                    ? "bg-primary border-primary"
                    : "border-muted-foreground/40 bg-transparent group-hover:border-primary/60"
                }`}
              >
                {remember && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="white"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>

              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Ingat Saya
              </span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-primary font-semibold hover:underline whitespace-nowrap"
              disabled={isSubmitting}
            >
              Lupa kata sandi?
            </button>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-primary text-primary-foreground py-3.5 mt-4 rounded-xl hover:opacity-90 transition-all font-bold text-base shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-primary font-bold hover:underline"
            disabled={isSubmitting}
          >
            Daftar Sekarang
          </button>
        </p>
      </form>
    </AuthShell>
  );
}