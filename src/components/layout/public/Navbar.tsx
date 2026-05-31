"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { EduBidanLogo } from "@/components/ui/EduBidanLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowLeft } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Mengecek apakah kita sedang berada di halaman utama ("/")
  const isHomePage = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* KIRI: Tombol Back (Hanya di luar Home) & Logo */}
        <div className="flex items-center gap-3">
          {!isHomePage && (
            <button 
              onClick={() => router.push("/")} 
              className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          {/* Logo dengan logika pintar: Scroll ke atas di Home & bersihkan URL */}
          <Link 
            href="/"
            onClick={(e) => {
              if (isHomePage) {
                e.preventDefault(); // Mencegah reload halaman
                window.scrollTo({ top: 0, behavior: "smooth" }); // Meluncur mulus ke atas
                
                // Menghapus tulisan #faq/#about dari URL tanpa me-reload halaman
                window.history.replaceState(null, "", "/");
              }
            }}
          >
            {/* Sinyal hideTextOnMobile dikirim ke komponen Logo  */}
            <EduBidanLogo size="sm" hideTextOnMobile={!isHomePage} />
          </Link>
        </div>

        {/* TENGAH: Menu Navigasi Desktop (Hanya muncul jika di Home) */}
        {isHomePage && (
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Tentang
            </a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Fokus Materi
            </a>
            <a href="#alur-belajar" className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
              Alur Belajar
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              FAQ
            </a>
          </div>
        )}

        {/* KANAN: Action Buttons (Selalu Muncul) */}
        <div className="flex items-center gap-3">
          
          <ThemeToggle />
          
          <button 
            onClick={() => router.push("/login")} 
            className="text-sm text-primary hover:underline font-semibold"
          >
            Masuk
          </button>
          
          <button 
            onClick={() => router.push("/register")} 
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            Daftar
          </button>
        </div>
      </div>
    </nav>
  );
}