"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

import { AuthShell } from "@/components/auth/shared/AuthShell";
import { PasswordInput } from "@/components/auth/shared/PasswordInput";
import { getRedirectPathByEmail } from "@/lib/auth/auth-redirect";

export function LoginForm() {
  const router = useRouter();

  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) return;

    router.push(getRedirectPathByEmail(email));
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
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Masukkan email"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>
          </div>

          <PasswordInput
            id="password"
            label="Kata Sandi"
            value={password}
            onChange={setPassword}
            placeholder="Masukkan kata sandi"
            inputClassName="py-3.5 pl-11 pr-12"
            iconSize={18}
            iconClassName="left-4"
            buttonClassName="right-4"
            labelClassName="text-sm font-medium"
          />

          <div className="flex items-center justify-between mt-2 gap-4">
            <button
              type="button"
              onClick={() => setRemember((current) => !current)}
              className="flex items-center gap-2.5 select-none group"
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
            >
              Lupa kata sandi?
            </button>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-primary text-primary-foreground py-3.5 mt-4 rounded-xl hover:opacity-90 transition-all font-bold text-base shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Masuk
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-primary font-bold hover:underline"
          >
            Daftar Sekarang
          </button>
        </p>
      </form>
    </AuthShell>
  );
}