"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  inputClassName?: string;
  iconClassName?: string;
  buttonClassName?: string;
  labelClassName?: string;
  iconSize?: number;
}

export function PasswordInput({
  id,
  label,
  value,
  placeholder = "Masukkan kata sandi",
  onChange,
  inputClassName = "py-3 pl-10 pr-10",
  iconClassName = "left-3.5",
  buttonClassName = "right-2",
  labelClassName = "text-xs font-semibold",
  iconSize = 16,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className={`${labelClassName} mb-1.5 block text-foreground`}
      >
        {label}
      </label>

      <div className="relative group">
        <Lock
          size={iconSize}
          className={`absolute ${iconClassName} top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors`}
        />

        <input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full ${inputClassName} rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm`}
        />

        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className={`absolute ${buttonClassName} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10 p-2`}
          aria-label={
            isVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
          }
        >
          {isVisible ? <EyeOff size={iconSize} /> : <Eye size={iconSize} />}
        </button>
      </div>
    </div>
  );
}