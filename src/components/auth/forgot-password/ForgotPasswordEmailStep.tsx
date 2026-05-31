"use client";

import { FormEvent } from "react";
import { ArrowRight, Mail } from "lucide-react";

interface ForgotPasswordEmailStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
}

export function ForgotPasswordEmailStep({
  email,
  onEmailChange,
  onSubmit,
}: ForgotPasswordEmailStepProps) {
  const isEmailFilled = email.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEmailFilled) return;

    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        <Mail size={32} className="text-primary" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
        Lupa Kata Sandi?
      </h1>

      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
        Masukkan email yang terdaftar. Jika email valid, sistem akan mengirimkan
        kode verifikasi untuk proses pemulihan akun.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium mb-1.5 block text-foreground"
          >
            Email Terdaftar
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
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="Masukkan email"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isEmailFilled}
          className="w-full bg-primary text-primary-foreground py-3.5 mt-2 rounded-xl hover:opacity-90 transition-all font-bold text-base shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Kirim Kode Verifikasi
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}