"use client";

import { useRef } from "react";
import { KeyRound } from "lucide-react";

interface ForgotPasswordOtpStepProps {
  email: string;
  otp: string[];
  onOtpChange: (otp: string[]) => void;
  onSubmit: () => void;
}

export function ForgotPasswordOtpStep({
  email,
  otp,
  onOtpChange,
  onSubmit,
}: ForgotPasswordOtpStepProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isOtpComplete = otp.every((digit) => digit.trim().length === 1);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    onOtpChange(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        <KeyRound size={32} className="text-primary" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
        Masukkan Kode
      </h1>

      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
        Kode 4 digit telah dikirim ke{" "}
        <span className="font-semibold text-foreground">
          {email || "email terdaftar"}
        </span>
        .
      </p>

      <div className="flex justify-between w-full mb-8 gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className="w-16 h-16 sm:w-20 sm:h-20 text-center text-2xl sm:text-3xl font-bold rounded-xl bg-card border-2 border-border focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!isOtpComplete}
        className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl hover:opacity-90 transition-all font-bold text-base shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Verifikasi Kode
      </button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Tidak menerima kode?{" "}
        <button
          type="button"
          className="text-primary font-bold hover:underline"
        >
          Kirim ulang
        </button>
      </p>
    </div>
  );
}