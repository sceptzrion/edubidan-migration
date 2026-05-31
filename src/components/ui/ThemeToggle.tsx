"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false); // Mencegah error hydration di Next.js

  useEffect(() => {
    setMounted(true);
    // Cek penyimpanan browser saat web pertama kali dimuat
    const storedTheme = localStorage.getItem("edubidan-theme");
    
    // Terapkan tema berdasarkan memori browser
    if (storedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("edubidan-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("edubidan-theme", "dark");
      setIsDark(true);
    }
  };

  // Selama komponen belum siap, tampilkan div kosong seukuran tombol
  // agar tombol di sebelahnya tidak bergeser (layout shift)
  if (!mounted) {
    return <div className="w-9 h-9" />; 
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
      title={isDark ? "Mode Terang" : "Mode Gelap"}
    >
      {isDark ? (
        <Sun size={20} className="text-amber-500" /> 
      ) : (
        <Moon size={20} className="text-muted-foreground" />
      )}
    </button>
  );
}