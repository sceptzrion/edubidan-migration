"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth/shared/AuthShell";
import { ForgotPasswordEmailStep } from "@/components/auth/forgot-password/ForgotPasswordEmailStep";
import { ForgotPasswordOtpStep } from "@/components/auth/forgot-password/ForgotPasswordOtpStep";
import { ForgotPasswordProgress } from "@/components/auth/forgot-password/ForgotPasswordProgress";
import { ForgotPasswordResetStep } from "@/components/auth/forgot-password/ForgotPasswordResetStep";
import { ForgotPasswordSuccess } from "@/components/auth/forgot-password/ForgotPasswordSuccess";

export type ForgotPasswordStep = "email" | "otp" | "reset" | "success";

export function ForgotPasswordFlow() {
  const router = useRouter();

  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBack = () => {
    if (step === "email") {
      router.push("/login");
      return;
    }

    if (step === "otp") {
      setStep("email");
      return;
    }

    if (step === "reset") {
      setStep("otp");
    }
  };

  return (
    <AuthShell
      sideTitle="Atur Ulang Kata Sandi"
      sideDescription="Jangan khawatir, kami akan membantu Anda memulihkan akses ke akun EduBidan dengan mudah dan aman."
      sideVariant="primary"
      hideBackButton={step === "success"}
      onBackClick={handleBack}
    >
      {step !== "success" && <ForgotPasswordProgress activeStep={step} />}

      {step === "email" && (
        <ForgotPasswordEmailStep
          email={email}
          onEmailChange={setEmail}
          onSubmit={() => setStep("otp")}
        />
      )}

      {step === "otp" && (
        <ForgotPasswordOtpStep
          email={email}
          otp={otp}
          onOtpChange={setOtp}
          onSubmit={() => setStep("reset")}
        />
      )}

      {step === "reset" && (
        <ForgotPasswordResetStep
          password={password}
          confirmPassword={confirmPassword}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={() => setStep("success")}
        />
      )}

      {step === "success" && <ForgotPasswordSuccess />}
    </AuthShell>
  );
}