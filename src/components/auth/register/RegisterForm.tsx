"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Hash, Mail, User } from "lucide-react";

import { AuthShell } from "@/components/auth/shared/AuthShell";
import { PasswordInput } from "@/components/auth/shared/PasswordInput";
import { RegisterSuccess } from "@/components/auth/register/RegisterSuccess";
import { TermsModal } from "@/components/modals/TermsModal";

export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [npm, setNpm] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();
  const isEmailValid = normalizedEmail.endsWith("@student.unsika.ac.id");
  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  const isFormValid = useMemo(() => {
    return (
      fullName.trim().length >= 3 &&
      npm.trim().length >= 5 &&
      isEmailValid &&
      password.length >= 8 &&
      isPasswordMatch &&
      agree
    );
  }, [agree, fullName, npm, password, isEmailValid, isPasswordMatch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) return;

    setIsSuccess(true);
  };

  return (
    <AuthShell
      sideTitle="Mulai Belajar di EduBidan"
      sideDescription="Buat akun mahasiswa untuk mengakses modul video pembelajaran dan kuis evaluasi kebidanan."
      sideVariant="teal"
      hideBackButton={isSuccess}
    >
      {isSuccess ? (
        <RegisterSuccess />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
            Buat Akun Mahasiswa
          </h1>

          <p className="text-muted-foreground mb-8 text-sm">
            Pendaftaran mandiri hanya tersedia untuk mahasiswa kebidanan.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="text-xs font-semibold mb-1.5 block text-foreground"
                >
                  Nama Lengkap
                </label>

                <div className="relative group">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                  />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Nama lengkap"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="npm"
                  className="text-xs font-semibold mb-1.5 block text-foreground"
                >
                  NPM
                </label>

                <div className="relative group">
                  <Hash
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                  />
                  <input
                    id="npm"
                    type="text"
                    value={npm}
                    onChange={(event) => setNpm(event.target.value)}
                    placeholder="2210631170131"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-xs font-semibold mb-1.5 block text-foreground"
              >
                Email Mahasiswa
              </label>

              <div className="relative group">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="npm@student.unsika.ac.id"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              {email.length > 0 && !isEmailValid && (
                <p className="text-[11px] font-medium text-red-500 mt-1.5">
                  Email mahasiswa harus menggunakan domain @student.unsika.ac.id.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordInput
                id="password"
                label="Kata Sandi"
                value={password}
                onChange={setPassword}
                placeholder="Min. 8 karakter"
              />

              <div>
                <PasswordInput
                  id="confirmPassword"
                  label="Konfirmasi Sandi"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Ulangi sandi"
                />

                {confirmPassword.length > 0 && !isPasswordMatch && (
                  <p className="text-[11px] font-medium text-red-500 mt-1.5">
                    Konfirmasi kata sandi belum sesuai.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-3 select-none group w-fit">
                <button
                  type="button"
                  onClick={() =>
                    agree ? setAgree(false) : setShowTerms(true)
                  }
                  className={`cursor-pointer w-5 h-5 shrink-0 rounded-sm border-2 flex items-center justify-center transition-all ${
                    agree
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/40 bg-transparent group-hover:border-primary/60"
                  }`}
                  aria-label="Setujui syarat dan ketentuan"
                >
                  {agree && (
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
                </button>

                <div className="text-sm text-muted-foreground">
                  <span>Saya menyetujui </span>
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-primary font-semibold hover:underline"
                  >
                    Syarat & Ketentuan
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-primary text-primary-foreground py-3.5 mt-4 rounded-xl hover:opacity-90 transition-all font-bold text-base shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Daftar Sekarang
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-primary font-bold hover:underline"
            >
              Masuk
            </button>
          </p>
        </form>
      )}

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAgree={() => {
          setAgree(true);
          setShowTerms(false);
        }}
      />
    </AuthShell>
  );
}