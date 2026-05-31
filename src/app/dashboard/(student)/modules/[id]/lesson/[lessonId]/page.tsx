"use client";

import { useParams, useRouter } from "next/navigation";

import { LessonBackButton } from "@/components/dashboard/student/modules/lesson/LessonBackButton";
import { LessonMaterialContent } from "@/components/dashboard/student/modules/lesson/LessonMaterialContent";
import { LessonQuizContent } from "@/components/dashboard/student/modules/lesson/LessonQuizContent";
import { LessonSidebar } from "@/components/dashboard/student/modules/lesson/LessonSidebar";
import { QuizWarning } from "@/components/dashboard/student/modules/lesson/QuizWarning";
import {
  getLearningItem,
  toLessonPlaylistItem,
} from "@/data/learning/shared/learning-modules";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams<{ id: string; lessonId: string }>();

  const moduleId = Number(params.id);
  const lessonId = Number(params.lessonId);

  const learningData = getLearningItem(moduleId, lessonId);

  if (!learningData) {
    return (
      <div className="bg-card rounded-3xl border border-border p-8 text-center">
        <h1 className="text-xl font-extrabold text-foreground mb-2">
          Konten tidak ditemukan
        </h1>

        <p className="text-sm text-muted-foreground mb-6">
          Materi atau kuis yang Anda buka tidak tersedia.
        </p>

        <button
          type="button"
          onClick={() => router.push(`/dashboard/modules/${moduleId}`)}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold"
        >
          Kembali ke Detail Modul
        </button>
      </div>
    );
  }

  const { module, item, itemIndex, previousItem, nextItem } = learningData;
  const playlistItems = module.items.map(toLessonPlaylistItem);

  const handleNext = () => {
    if (nextItem) {
      router.push(`/dashboard/modules/${module.id}/lesson/${nextItem.id}`);
      return;
    }

    router.push(`/dashboard/modules/${module.id}`);
  };

  const handlePrev = () => {
    if (!previousItem) return;
    router.push(`/dashboard/modules/${module.id}/lesson/${previousItem.id}`);
  };

  const handleNavigate = (targetItemId: number) => {
    router.push(`/dashboard/modules/${module.id}/lesson/${targetItemId}`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-6 sm:pb-8">
      <LessonBackButton moduleId={module.id} />

      {item.kind === "kuis" && (
        <div className="mb-4 sm:mb-6">
          <QuizWarning />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
          {item.kind === "materi" ? (
            <LessonMaterialContent
              item={item}
              moduleThumbnail={module.thumbnail}
              previousItem={previousItem}
              nextItem={nextItem}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          ) : (
            <LessonQuizContent
              item={item}
              previousItem={previousItem}
              nextItem={nextItem}
              onStartQuiz={() =>
                router.push(`/dashboard/modules/${module.id}/quiz/${item.id}`)
              }
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
        </div>

        <LessonSidebar
          item={item}
          playlistItems={playlistItems}
          activeIndex={itemIndex}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}