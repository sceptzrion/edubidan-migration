"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Edit3,
  Eye,
  GripVertical,
  HelpCircle,
  Plus,
  Trash2,
  Video,
} from "lucide-react";

import { MateriModal } from "@/components/dashboard/lecturer/modules/detail/lesson/MateriModal";
import { KuisModal } from "@/components/dashboard/lecturer/modules/detail/quiz/KuisModal";

interface PlaylistTabProps {
  moduleId: string;
  initialItems: LecturerPlaylistItem[];
}

export type LecturerMateriItem = {
  kind: "materi";
  id: number;
  contentId?: number;
  title: string;
  videoSource: "upload" | "embed";
  videoUrl?: string;
  duration: string;
  summary: string;
  objectives: string[];
  tools: string[];
};

export type LecturerQuizOption = {
  id: number;
  text: string;
};

export type LecturerQuizQuestion = {
  id: number;
  questionText: string;
  mediaUrl: string | null;
  options: LecturerQuizOption[];
  correctOptionId: number;
};

export type LecturerKuisItem = {
  kind: "kuis";
  id: number;
  contentId?: number;
  title: string;
  description?: string;
  hasTimeLimit: boolean;
  timeLimitMinutes: number;
  questions: LecturerQuizQuestion[];
  questionCount?: number;
};

export type LecturerPlaylistItem = LecturerMateriItem | LecturerKuisItem;

export function PlaylistTab({ moduleId, initialItems }: PlaylistTabProps) {
  const router = useRouter();

  const [items, setItems] = useState<LecturerPlaylistItem[]>(initialItems);
  const [addOpen, setAddOpen] = useState(false);
  const [materiOpen, setMateriOpen] = useState(false);
  const [kuisOpen, setKuisOpen] = useState(false);

  const [editingMateri, setEditingMateri] =
    useState<LecturerMateriItem | null>(null);
  const [editingKuis, setEditingKuis] = useState<LecturerKuisItem | null>(null);

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= items.length) return;

    const next = [...items];
    const [movedItem] = next.splice(from, 1);

    if (!movedItem) return;

    next.splice(to, 0, movedItem);
    setItems(next);
  };

  const handleSaveMateri = (materi: LecturerMateriItem) => {
    setItems((currentItems) => {
      if (editingMateri) {
        return currentItems.map((item) =>
          item.id === editingMateri.id
            ? {
                ...materi,
                id: editingMateri.id,
                contentId: editingMateri.contentId,
              }
            : item
        );
      }

      return [
        {
          ...materi,
          id: Date.now(),
        },
        ...currentItems,
      ];
    });

    setMateriOpen(false);
    setEditingMateri(null);
  };

  const handleSaveKuis = (kuis: LecturerKuisItem) => {
    setItems((currentItems) => {
      if (editingKuis) {
        return currentItems.map((item) =>
          item.id === editingKuis.id
            ? {
                ...kuis,
                id: editingKuis.id,
                contentId: editingKuis.contentId,
              }
            : item
        );
      }

      return [
        {
          ...kuis,
          id: Date.now(),
        },
        ...currentItems,
      ];
    });

    setKuisOpen(false);
    setEditingKuis(null);
  };

  const closeMateriModal = () => {
    setMateriOpen(false);
    setEditingMateri(null);
  };

  const closeKuisModal = () => {
    setKuisOpen(false);
    setEditingKuis(null);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
            Susunan Pembelajaran
          </h2>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
            {items.length} item • Tahan dan geser (drag) ikon titik untuk
            mengubah urutan.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setAddOpen((current) => !current)}
            className="w-full sm:w-auto bg-primary text-primary-foreground px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={16} /> Tambah Konten{" "}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                addOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {addOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAddOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMateri(null);
                    setAddOpen(false);
                    setMateriOpen(true);
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Video size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">
                      Materi Baru
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">
                      Video & ringkasan
                    </p>
                  </div>
                </button>

                <div className="border-t border-border/50 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setEditingKuis(null);
                    setAddOpen(false);
                    setKuisOpen(true);
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">
                      Kuis Evaluasi
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">
                      Soal pilihan ganda
                    </p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {items.map((item, index) => {
          const isMateri = item.kind === "materi";
          const questionCount =
            item.kind === "kuis" ? item.questionCount ?? item.questions.length : 0;

          return (
            <div
              key={`${item.kind}-${item.id}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) move(dragIndex, index);
                setDragIndex(null);
              }}
              className={`bg-card rounded-xl sm:rounded-2xl border p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all hover:shadow-md hover:border-primary/30 ${
                dragIndex === index
                  ? "opacity-50 border-primary border-dashed"
                  : "border-border shadow-sm"
              }`}
            >
              <GripVertical
                size={20}
                className="text-muted-foreground cursor-grab active:cursor-grabbing shrink-0 hover:text-primary transition-colors"
              />

              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                  isMateri
                    ? "bg-primary/10 text-primary"
                    : "bg-amber-500/10 text-amber-500"
                }`}
              >
                {isMateri ? (
                  <Video size={20} className="sm:w-6 sm:h-6" />
                ) : (
                  <HelpCircle size={20} className="sm:w-6 sm:h-6" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider font-extrabold shadow-sm ${
                      isMateri ? "bg-primary text-white" : "bg-amber-500 text-white"
                    }`}
                  >
                    {isMateri ? "Materi" : "Kuis"}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    Urutan #{index + 1}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-extrabold text-foreground truncate leading-snug">
                  {item.title}
                </p>

                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-1">
                  {isMateri
                    ? `${
                        item.videoSource === "upload"
                          ? "Upload Video"
                          : "Embed YouTube"
                      } • Durasi: ${item.duration || "--:--"}`
                    : `${questionCount} soal ${
                        item.hasTimeLimit
                          ? `• Waktu: ${item.timeLimitMinutes} menit`
                          : "• Tanpa batas waktu"
                      }`}
                </p>
              </div>

              <div className="flex gap-1.5 sm:gap-2 shrink-0 border-l border-border/50 pl-3 sm:pl-4 ml-2 sm:ml-4">
                <button
                  type="button"
                  onClick={() => {
                    if (isMateri) {
                      router.push(
                        `/dashboard/lecturer/modules/${moduleId}/lesson/${item.id}`
                      );
                    } else {
                      router.push(
                        `/dashboard/lecturer/modules/${moduleId}/quiz/${item.id}`
                      );
                    }
                  }}
                  className={`p-2 sm:p-2.5 rounded-xl transition-colors ${
                    isMateri
                      ? "hover:bg-primary/10 text-primary"
                      : "hover:bg-amber-500/10 text-amber-600"
                  }`}
                  title={
                    isMateri
                      ? "Lihat Pratinjau Materi"
                      : "Lihat Analisis & Pratinjau Kuis"
                  }
                >
                  <Eye size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isMateri) {
                      setEditingMateri(item);
                      setMateriOpen(true);
                    } else {
                      setEditingKuis(item);
                      setKuisOpen(true);
                    }
                  }}
                  className="p-2 sm:p-2.5 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit Konten"
                >
                  <Edit3 size={18} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setItems((currentItems) =>
                      currentItems.filter(
                        (currentItem) =>
                          !(
                            currentItem.id === item.id &&
                            currentItem.kind === item.kind
                          )
                      )
                    )
                  }
                  className="p-2 sm:p-2.5 hover:bg-red-500/10 rounded-xl text-red-500 transition-colors"
                  title="Hapus Konten"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-3xl bg-muted/20">
            <p className="text-muted-foreground font-bold">
              Belum ada materi atau kuis.
            </p>
          </div>
        )}
      </div>

      {materiOpen && (
        <MateriModal
          initial={editingMateri}
          onSave={handleSaveMateri}
          onClose={closeMateriModal}
        />
      )}

      {kuisOpen && (
        <KuisModal
          initial={editingKuis}
          onSave={handleSaveKuis}
          onClose={closeKuisModal}
        />
      )}
    </div>
  );
}