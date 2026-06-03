"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  Clock,
  HelpCircle,
  ImageIcon,
  ListOrdered,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { useIsClient } from "@/hooks/useIsClient";
import type {
  LecturerKuisItem,
  LecturerQuizQuestion,
} from "@/components/dashboard/lecturer/modules/detail/PlaylistTab";

interface KuisModalProps {
  initial: LecturerKuisItem | null;
  onSave: (value: LecturerKuisItem) => void;
  onClose: () => void;
}

function createDefaultQuestion(id = 1): LecturerQuizQuestion {
  return {
    id,
    questionText: "",
    mediaUrl: null,
    options: [
      { id: 1, text: "" },
      { id: 2, text: "" },
    ],
    correctOptionId: 1,
  };
}

function getInitialQuestions(
  initial: LecturerKuisItem | null
): LecturerQuizQuestion[] {
  if (initial?.questions && initial.questions.length > 0) {
    return initial.questions;
  }

  return [createDefaultQuestion()];
}

export function KuisModal({ initial, onSave, onClose }: KuisModalProps) {
  const mounted = useIsClient();

  const [form, setForm] = useState<LecturerKuisItem>({
    kind: "kuis",
    id: initial?.id ?? 0,
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    hasTimeLimit: initial?.hasTimeLimit ?? false,
    timeLimitMinutes: initial?.timeLimitMinutes ?? 15,
    questions: getInitialQuestions(initial),
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleToggleTime = () => {
    setForm((current) => ({
      ...current,
      hasTimeLimit: !current.hasTimeLimit,
    }));
  };

  const addQuestion = () => {
    setForm((current) => ({
      ...current,
      questions: [...current.questions, createDefaultQuestion(Date.now())],
    }));
  };

  const removeQuestion = (questionId: number) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.filter(
        (question) => question.id !== questionId
      ),
    }));
  };

  const updateQuestionText = (questionId: number, text: string) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              questionText: text,
            }
          : question
      ),
    }));
  };

  const addOption = (questionId: number) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) return question;

        return {
          ...question,
          options: [...question.options, { id: Date.now(), text: "" }],
        };
      }),
    }));
  };

  const removeOption = (questionId: number, optionId: number) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) return question;

        const nextOptions = question.options.filter(
          (option) => option.id !== optionId
        );

        return {
          ...question,
          options: nextOptions,
          correctOptionId:
            question.correctOptionId === optionId
              ? nextOptions[0]?.id ?? 1
              : question.correctOptionId,
        };
      }),
    }));
  };

  const updateOptionText = (
    questionId: number,
    optionId: number,
    text: string
  ) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) return question;

        return {
          ...question,
          options: question.options.map((option) =>
            option.id === optionId
              ? {
                  ...option,
                  text,
                }
              : option
          ),
        };
      }),
    }));
  };

  const setCorrectOption = (questionId: number, optionId: number) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              correctOptionId: optionId,
            }
          : question
      ),
    }));
  };

  const handleSave = () => {
    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description?.trim() ?? "",
      questions: form.questions.map((question) => ({
        ...question,
        questionText: question.questionText.trim(),
        options: question.options.map((option) => ({
          ...option,
          text: option.text.trim(),
        })),
      })),
    });
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-label="Tutup modal kuis"
      />

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
              {initial ? "Edit Kuis Evaluasi" : "Buat Kuis Baru"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-8 overflow-y-auto scrollbar-thin bg-muted/10">
          <div className="space-y-4">
            <div>
              <label className="text-xs sm:text-sm mb-2 block font-bold text-foreground">
                Judul Kuis
              </label>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Contoh: Kuis Akhir Modul ANC Terpadu"
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-bold text-foreground outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm transition-all"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm mb-2 block font-bold text-foreground">
                Deskripsi Kuis
              </label>
              <textarea
                rows={2}
                value={form.description ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Tulis instruksi pengerjaan kuis di sini..."
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-medium text-foreground outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border bg-card shadow-sm gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    form.hasTimeLimit
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Clock size={20} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-foreground">
                    Beri Batas Waktu
                  </p>
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                    Batasi durasi mahasiswa mengerjakan kuis ini.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {form.hasTimeLimit && (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border animate-in slide-in-from-right-2">
                    <input
                      type="number"
                      min={1}
                      value={form.timeLimitMinutes}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          timeLimitMinutes: Number(event.target.value || "1"),
                        }))
                      }
                      className="w-12 bg-transparent text-sm font-extrabold text-center text-foreground outline-none"
                    />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Menit
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleToggleTime}
                  className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 border-2 ${
                    form.hasTimeLimit
                      ? "bg-amber-500 border-amber-500"
                      : "bg-muted border-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white transition-all shadow-sm ${
                      form.hasTimeLimit
                        ? "left-6 sm:left-7.5"
                        : "left-0.5 sm:left-0.75"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <ListOrdered size={18} className="text-amber-600" />
              <h3 className="text-sm sm:text-base font-extrabold text-foreground">
                Daftar Pertanyaan
              </h3>
              <span className="ml-auto text-[10px] font-bold bg-muted px-2 py-1 rounded-md text-muted-foreground uppercase tracking-widest">
                {form.questions.length} Soal
              </span>
            </div>

            {form.questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
                      {index + 1}
                    </div>
                    <span className="text-xs font-extrabold text-foreground tracking-tight">
                      PERTANYAAN #{index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-4 sm:p-5 space-y-5">
                  <div>
                    <label className="text-[10px] uppercase font-extrabold text-muted-foreground mb-1.5 block tracking-widest">
                      Teks Pertanyaan
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(event) =>
                        updateQuestionText(question.id, event.target.value)
                      }
                      placeholder="Tuliskan butir soal di sini..."
                      className="w-full px-4 py-3 rounded-xl bg-muted/20 border border-border text-sm font-medium text-foreground outline-none focus:border-amber-500 transition-all resize-none leading-relaxed"
                      rows={3}
                    />
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                  >
                    <ImageIcon size={16} /> Unggah Gambar Pendukung (Opsional)
                  </button>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-widest">
                        Pilihan Jawaban
                      </label>
                      <button
                        type="button"
                        onClick={() => addOption(question.id)}
                        className="text-[10px] font-extrabold text-amber-600 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Tambah Opsi
                      </button>
                    </div>

                    <div className="grid gap-2.5">
                      {question.options.map((option, optionIndex) => {
                        const letter = String.fromCharCode(65 + optionIndex);
                        const isCorrect =
                          question.correctOptionId === option.id;

                        return (
                          <div
                            key={option.id}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                              isCorrect
                                ? "bg-emerald-500/5 border-emerald-500/50"
                                : "bg-muted/30 border-border"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setCorrectOption(question.id, option.id)
                              }
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                isCorrect
                                  ? "bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                  : "bg-card border-muted-foreground/30 hover:border-amber-500"
                              }`}
                            >
                              {isCorrect && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              )}
                            </button>

                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                                isCorrect
                                  ? "bg-emerald-500 text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {letter}
                            </div>

                            <input
                              value={option.text}
                              onChange={(event) =>
                                updateOptionText(
                                  question.id,
                                  option.id,
                                  event.target.value
                                )
                              }
                              placeholder={`Opsi ${letter}...`}
                              className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none"
                            />

                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeOption(question.id, option.id)
                                }
                                className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-start gap-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 text-[10px] sm:text-xs text-emerald-600 font-bold">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      Pilih satu opsi sebagai kunci jawaban benar.
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-border text-xs sm:text-sm font-extrabold text-muted-foreground hover:text-amber-600 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Tambah Pertanyaan
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-border flex gap-3 sm:gap-4 shrink-0 bg-card rounded-b-2xl sm:rounded-3xl z-20">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 sm:py-3.5 rounded-xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 sm:py-3.5 rounded-xl bg-amber-500 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Save size={18} /> Simpan Kuis
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}